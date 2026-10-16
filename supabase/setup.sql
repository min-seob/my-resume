-- Run this once in the Supabase SQL Editor for the portfolio project.

create table if not exists public.dev_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  summary text not null default '' check (char_length(summary) <= 360),
  content text not null default '',
  category text not null default '개발 기록' check (char_length(category) <= 40),
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.dev_blog_posts enable row level security;
revoke all on table public.dev_blog_posts from anon, authenticated;
grant select on table public.dev_blog_posts to anon, authenticated;
drop policy if exists "Public can read published blog posts" on public.dev_blog_posts;
create policy "Public can read published blog posts"
  on public.dev_blog_posts
  for select
  to anon, authenticated
  using (status = 'published' and published_at is not null and published_at <= now());

create table if not exists public.guestbook_admins (
  email text primary key check (email = lower(btrim(email))),
  created_at timestamptz not null default now()
);

alter table public.guestbook_admins enable row level security;
revoke all on table public.guestbook_admins from anon, authenticated;
grant select on table public.guestbook_admins to authenticated;
drop policy if exists "Guestbook admins can read their own registration" on public.guestbook_admins;
create policy "Guestbook admins can read their own registration"
  on public.guestbook_admins
  for select
  to authenticated
  using (email = lower((select auth.jwt() ->> 'email')));

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 32),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.guestbook_entries
  alter column status set default 'approved';

alter table public.guestbook_entries enable row level security;
revoke all on table public.guestbook_entries from anon, authenticated;
grant select, insert on table public.guestbook_entries to anon, authenticated;
grant delete on table public.guestbook_entries to authenticated;
drop policy if exists "Public can read approved guestbook entries" on public.guestbook_entries;
drop policy if exists "Public can read guestbook entries" on public.guestbook_entries;
create policy "Public can read guestbook entries"
  on public.guestbook_entries
  for select
  to anon, authenticated
  using (true);
drop policy if exists "Public can submit pending guestbook entries" on public.guestbook_entries;
drop policy if exists "Public can submit guestbook entries" on public.guestbook_entries;
create policy "Public can submit guestbook entries"
  on public.guestbook_entries
  for insert
  to anon, authenticated
  with check (status = 'approved');
drop policy if exists "Guestbook admins can delete entries" on public.guestbook_entries;
create policy "Guestbook admins can delete entries"
  on public.guestbook_entries
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.guestbook_admins as admin
      where admin.email = lower((select auth.jwt() ->> 'email'))
    )
  );
