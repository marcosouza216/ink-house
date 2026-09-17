-- Run once in Supabase SQL Editor for an existing project.
-- Lets the admin upload homepage slideshow and about-section photos.

create table if not exists public.site_photos (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('slideshow', 'about-large', 'about-small')),
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_photos_placement_idx
  on public.site_photos (placement, sort_order);

create unique index if not exists site_photos_about_slot_idx
  on public.site_photos (placement)
  where placement in ('about-large', 'about-small');

drop trigger if exists site_photos_updated_at on public.site_photos;
create trigger site_photos_updated_at before update on public.site_photos
for each row execute function public.set_updated_at();

alter table public.site_photos enable row level security;

drop policy if exists "Public can read site photos" on public.site_photos;
drop policy if exists "Staff can manage site photos" on public.site_photos;

create policy "Public can read site photos" on public.site_photos
for select using (true);
create policy "Staff can manage site photos" on public.site_photos
for all using (public.is_staff()) with check (public.is_staff());

grant select on public.site_photos to anon, authenticated;
grant all on public.site_photos to authenticated;
