-- Extra course photos shown under course details, above student works.
alter table public.courses
  add column if not exists other_works jsonb not null default '[]';
