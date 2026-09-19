-- Run this once in the Supabase SQL editor for project rfhvpnvdbbgcdvwjpopp
-- (Project Settings > SQL Editor, or supabase.com/dashboard/project/rfhvpnvdbbgcdvwjpopp/sql/new)

create table "Article" (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  title text not null,
  category text not null,
  label text not null,
  excerpt text not null default '',
  date text not null,
  read text not null,
  featured boolean not null default false,
  published boolean not null default false,
  "coverImage" text not null default '',
  tags text[],
  content text not null,
  "isSample" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

create trigger article_set_updated_at
before update on "Article"
for each row execute function set_updated_at();

alter table "Article" enable row level security;

-- Permissive policy: anon key can read/write everything. Admin writes are
-- gated at the application layer (lib/auth.ts custom cookie auth), not RLS.
create policy "Article public read/write" on "Article"
  for all
  using (true)
  with check (true);

create index article_published_idx on "Article" (published);

-- Contact form submissions (from the site's "Let's talk" modal).
create table "ContactMessage" (
  id text primary key default gen_random_uuid()::text,
  "fullName" text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  "createdAt" timestamptz not null default now()
);

alter table "ContactMessage" enable row level security;

-- Visitors can submit; there is no select/update/delete policy, so the
-- anon key can never read submissions back — only the Supabase dashboard
-- (as the project owner) can view them.
create policy "ContactMessage public insert" on "ContactMessage"
  for insert
  to anon
  with check (true);
