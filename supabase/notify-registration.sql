-- Registration email notifications via Resend + pg_net.
-- Run this whole file in the Supabase SQL Editor.

create extension if not exists pg_net;

grant usage on schema net to postgres, anon, authenticated, service_role;
grant execute on all functions in schema net to postgres, anon, authenticated, service_role;
grant all on all tables in schema net to postgres, anon, authenticated, service_role;

create table if not exists public.site_settings (
  key text primary key,
  value text not null
);

insert into public.site_settings (key, value) values
  ('notify_email', 'inkhouse.macao@gmail.com'),
  ('notify_from', 'Ink House <noreply@inkhouse-macao.com>')
on conflict (key) do update set value = excluded.value;

-- ★ 把 re_xxxxxxxx 換成你在 resend.com 建立的 API key，再執行這份檔案。
insert into public.site_settings (key, value) values
  ('resend_api_key', 're_xxxxxxxx')
on conflict (key) do update set value = excluded.value;

create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  status text not null,
  detail text,
  request_id bigint,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.email_log enable row level security;

drop policy if exists "Staff can manage site settings" on public.site_settings;
create policy "Staff can manage site settings" on public.site_settings
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Staff can read email log" on public.email_log;
create policy "Staff can read email log" on public.email_log
for select using (public.is_staff());

grant all on public.site_settings to authenticated;
grant select on public.email_log to authenticated;

drop function if exists public.send_registration_email(text, text, text, text, text, uuid[], uuid, timestamptz);
drop function if exists public.send_registration_email(text, text, text, text, text, uuid[], uuid, timestamptz, boolean);

create or replace function public.send_registration_email(
  student_name text,
  student_age text,
  phone text,
  wechat text,
  preferred_time text,
  course_ids uuid[],
  course_id uuid,
  created_at timestamptz,
  wait_for_response boolean default false
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
  resp_code integer;
  resp_body text;
  resp_error text;
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

  if not wait_for_response then
    insert into public.email_log(status, detail, request_id)
    values ('queued', '寄往 ' || notify_email, request_id);
    return jsonb_build_object(
      'ok', true,
      'queued', true,
      'request_id', request_id,
      'notify_email', notify_email,
      'from_address', from_address
    );
  end if;

  perform pg_sleep(2);
  select status_code, coalesce(content, ''), coalesce(error_msg, '')
  into resp_code, resp_body, resp_error
  from net._http_response
  where id = request_id;

  if resp_code is null then
    insert into public.email_log(status, detail, request_id)
    values ('queued', 'Resend 尚未回應', request_id);
    return jsonb_build_object('ok', false, 'request_id', request_id, 'error', 'Resend 尚未回應，請稍後查 net._http_response');
  end if;

  if resp_code >= 200 and resp_code < 300 then
    insert into public.email_log(status, detail, request_id)
    values ('sent', '寄往 ' || notify_email, request_id);
    return jsonb_build_object(
      'ok', true,
      'status_code', resp_code,
      'request_id', request_id,
      'notify_email', notify_email,
      'from_address', from_address,
      'resend', resp_body
    );
  end if;

  insert into public.email_log(status, detail, request_id)
  values ('error', coalesce(nullif(resp_error, ''), resp_body), request_id);
  return jsonb_build_object(
    'ok', false,
    'status_code', resp_code,
    'request_id', request_id,
    'error', coalesce(nullif(resp_error, ''), resp_body)
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
    now(),
    true
  );
end;
$$;

drop trigger if exists registrations_notify_email on public.registrations;
create trigger registrations_notify_email
after insert on public.registrations
for each row execute function public.notify_registration();

-- 執行完這份檔案後，立刻跑：
-- select public.test_registration_email();
-- 然後等 3 秒再跑：
-- select id, status_code, content, error_msg from net._http_response order by created desc limit 5;
-- select * from public.email_log order by created_at desc limit 5;
