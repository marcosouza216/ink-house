-- Ink House database schema for Supabase/PostgreSQL
create extension if not exists pgcrypto;
create extension if not exists pg_net;

create type public.course_audience as enum ('kids', 'adult');
create type public.course_category as enum ('painting', 'traditional', 'foundation', 'craft', 'workshop');
create type public.registration_status as enum ('new', 'contacted', 'confirmed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  english_name text,
  audience public.course_audience not null,
  category text not null,
  age_range text,
  level text,
  duration_minutes integer check (duration_minutes > 0),
  price_mop numeric(10,2) check (price_mop >= 0),
  teacher text,
  course_start_date date,
  course_end_date date,
  weekdays smallint[] not null default '{}',
  class_start_time time,
  class_end_time time,
  description text not null default '',
  learning_points text[] not null default '{}',
  image_url text,
  color text default '#c5dcae',
  icon text default '藝',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (course_end_date is null or course_start_date is null or course_end_date >= course_start_date),
  check (class_end_time is null or class_start_time is null or class_end_time > class_start_time)
);

create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  teacher text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 8 check (capacity >= 0),
  available_spots integer not null default 8 check (available_spots >= 0),
  status text not null default 'open' check (status in ('draft', 'open', 'full', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (available_spots <= capacity)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  course_ids uuid[] not null default '{}',
  class_session_id uuid references public.class_sessions(id) on delete set null,
  student_name text not null,
  student_age text,
  guardian_name text,
  phone text not null,
  wechat text,
  email text,
  preferred_time text,
  message text,
  status public.registration_status not null default 'new',
  source text not null default 'website',
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_photos (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('slideshow', 'about-large', 'about-small')),
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index courses_public_list_idx on public.courses (published, audience, category, sort_order);
create index class_sessions_starts_at_idx on public.class_sessions (starts_at);
create index class_sessions_course_idx on public.class_sessions (course_id);
create index registrations_created_at_idx on public.registrations (created_at desc);
create index site_photos_placement_idx on public.site_photos (placement, sort_order);
create unique index site_photos_about_slot_idx on public.site_photos (placement)
  where placement in ('about-large', 'about-small');

create table public.site_settings (
  key text primary key,
  value text not null
);

insert into public.site_settings (key, value) values
  ('notify_email', 'inkhouse.macao@gmail.com'),
  ('notify_from', 'Ink House <noreply@inkhouse-macao.com>');

create table public.email_log (
  id uuid primary key default gen_random_uuid(),
  status text not null,
  detail text,
  request_id bigint,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.send_registration_email(
  student_name text,
  student_age text,
  phone text,
  wechat text,
  preferred_time text,
  course_ids uuid[],
  course_id uuid,
  created_at timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = public, net, pg_temp
as $$
declare
  api_key text;
  notify_email text;
  from_address text;
  course_names text;
  preferred text;
  ids uuid[];
  request_id bigint;
  html text;
begin
  select value into api_key from public.site_settings where key = 'resend_api_key';
  select value into notify_email from public.site_settings where key = 'notify_email';
  select value into from_address from public.site_settings where key = 'notify_from';
  notify_email := coalesce(nullif(notify_email, ''), 'inkhouse.macao@gmail.com');
  from_address := coalesce(nullif(from_address, ''), 'Ink House <noreply@inkhouse-macao.com>');

  if api_key is null or api_key = '' or api_key like 're_xxxxxxxx%' then
    insert into public.email_log(status, detail)
    values ('skipped', '尚未設定有效的 Resend API key');
    return jsonb_build_object('ok', false, 'error', '尚未設定有效的 Resend API key。請在 site_settings 填入 resend_api_key。');
  end if;

  if course_ids is not null and array_length(course_ids, 1) > 0 then
    ids := course_ids;
  elsif course_id is not null then
    ids := array[course_id];
  else
    ids := array[]::uuid[];
  end if;

  select coalesce(string_agg(name, '、' order by name), '（未指定課程）')
  into course_names
  from public.courses
  where id = any(ids);

  preferred := coalesce(nullif(preferred_time, ''), '現有課堂時間可以');
  html := concat(
    '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.7;color:#333;max-width:560px">',
    '<h2 style="color:#542a22;font-weight:600">賞心學堂收到新報名</h2>',
    '<table style="border-collapse:collapse;font-size:15px">',
    '<tr><td style="padding:6px 20px 6px 0;color:#888;white-space:nowrap">學員</td><td>',
    replace(replace(replace(coalesce(student_name, '—'), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    '</td></tr>',
    '<tr><td style="padding:6px 20px 6px 0;color:#888">年齡</td><td>',
    replace(replace(replace(coalesce(student_age, '—'), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    '</td></tr>',
    '<tr><td style="padding:6px 20px 6px 0;color:#888">電話</td><td>',
    replace(replace(replace(coalesce(phone, '—'), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    '</td></tr>',
    '<tr><td style="padding:6px 20px 6px 0;color:#888">微信</td><td>',
    replace(replace(replace(coalesce(wechat, '—'), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    '</td></tr>',
    '<tr><td style="padding:6px 20px 6px 0;color:#888">課程</td><td>',
    replace(replace(replace(coalesce(course_names, '—'), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    '</td></tr>',
    '<tr><td style="padding:6px 20px 6px 0;color:#888">偏好時間</td><td>',
    replace(replace(replace(preferred, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    '</td></tr>',
    '<tr><td style="padding:6px 20px 6px 0;color:#888">報名時間</td><td>',
    to_char(coalesce(created_at, now()) at time zone 'Asia/Macau', 'YYYY-MM-DD HH24:MI'),
    '（澳門）</td></tr>',
    '</table>',
    '<p style="margin-top:24px;font-size:13px;color:#888">此信由網站報名表自動發送。</p>',
    '</div>'
  );

  request_id := net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || api_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', from_address,
      'to', jsonb_build_array(notify_email),
      'subject', '【賞心學堂】新報名 — ' || coalesce(student_name, '學員'),
      'html', html
    ),
    timeout_milliseconds := 10000
  );

  insert into public.email_log(status, detail, request_id)
  values ('queued', '寄往 ' || notify_email, request_id);

  return jsonb_build_object(
    'ok', true,
    'request_id', request_id,
    'notify_email', notify_email,
    'from_address', from_address
  );
exception when others then
  insert into public.email_log(status, detail)
  values ('error', SQLERRM);
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end;
$$;

create or replace function public.notify_registration()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.send_registration_email(
    new.student_name,
    new.student_age,
    new.phone,
    new.wechat,
    new.preferred_time,
    new.course_ids,
    new.course_id,
    new.created_at
  );
  return new;
end;
$$;

create or replace function public.test_registration_email()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return public.send_registration_email(
    '測試學員',
    '8',
    '+853 0000 0000',
    'test_wechat',
    '平日下午',
    array[]::uuid[],
    null,
    now()
  );
end;
$$;

create trigger courses_updated_at before update on public.courses
for each row execute function public.set_updated_at();
create trigger class_sessions_updated_at before update on public.class_sessions
for each row execute function public.set_updated_at();
create trigger registrations_updated_at before update on public.registrations
for each row execute function public.set_updated_at();
create trigger site_photos_updated_at before update on public.site_photos
for each row execute function public.set_updated_at();
create trigger registrations_notify_email
after insert on public.registrations
for each row execute function public.notify_registration();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email), 'staff');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.class_sessions enable row level security;
alter table public.registrations enable row level security;
alter table public.site_photos enable row level security;
alter table public.site_settings enable row level security;
alter table public.email_log enable row level security;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Public can read published courses" on public.courses
for select using (published = true or public.is_staff());
create policy "Staff can manage courses" on public.courses
for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read open sessions" on public.class_sessions
for select using (status in ('open', 'full') or public.is_staff());
create policy "Staff can manage sessions" on public.class_sessions
for all using (public.is_staff()) with check (public.is_staff());

create policy "Anyone can submit registration" on public.registrations
for insert to anon, authenticated with check (status = 'new');
create policy "Staff can read registrations" on public.registrations
for select using (public.is_staff());
create policy "Staff can update registrations" on public.registrations
for update using (public.is_staff()) with check (public.is_staff());
create policy "Staff can delete registrations" on public.registrations
for delete using (public.is_staff());

create policy "Public can read site photos" on public.site_photos
for select using (true);
create policy "Staff can manage site photos" on public.site_photos
for all using (public.is_staff()) with check (public.is_staff());

create policy "Staff can manage site settings" on public.site_settings
for all using (public.is_staff()) with check (public.is_staff());

create policy "Staff can read email log" on public.email_log
for select using (public.is_staff());

create policy "Users can view own profile" on public.profiles
for select using (id = auth.uid() or public.is_staff());
create policy "Admins can manage profiles" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

-- Limit anonymous form abuse to required fields at database level.
revoke all on public.profiles from anon;
grant select on public.courses, public.class_sessions, public.site_photos to anon, authenticated;
grant insert on public.registrations to anon, authenticated;
grant all on public.courses, public.class_sessions, public.registrations, public.site_photos, public.site_settings to authenticated;
grant select on public.email_log to authenticated;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
