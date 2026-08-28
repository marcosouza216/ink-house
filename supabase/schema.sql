-- Ink House database schema for Supabase/PostgreSQL
create extension if not exists pgcrypto;

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

create index courses_public_list_idx on public.courses (published, audience, category, sort_order);
create index class_sessions_starts_at_idx on public.class_sessions (starts_at);
create index class_sessions_course_idx on public.class_sessions (course_id);
create index registrations_created_at_idx on public.registrations (created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger courses_updated_at before update on public.courses
for each row execute function public.set_updated_at();
create trigger class_sessions_updated_at before update on public.class_sessions
for each row execute function public.set_updated_at();
create trigger registrations_updated_at before update on public.registrations
for each row execute function public.set_updated_at();

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

create policy "Users can view own profile" on public.profiles
for select using (id = auth.uid() or public.is_staff());
create policy "Admins can manage profiles" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

-- Limit anonymous form abuse to required fields at database level.
revoke all on public.profiles from anon;
grant select on public.courses, public.class_sessions to anon, authenticated;
grant insert on public.registrations to anon, authenticated;
grant all on public.courses, public.class_sessions, public.registrations to authenticated;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
