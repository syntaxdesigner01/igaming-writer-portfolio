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

-- ---------------------------------------------------------------
-- Portfolio items (external work samples: YouTube, client sites,
-- other publications). Run this block on its own if "Article"
-- already exists.
-- ---------------------------------------------------------------
create table "PortfolioItem" (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  category text not null,
  subtype text not null default '',
  description text not null default '',
  thumbnail text not null default '',
  url text not null,
  platform text not null default '',
  published boolean not null default false,
  "sortOrder" integer not null default 0,
  date text not null default '',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint portfolio_item_category_check
    check (category in ('igaming','product','finance','ugc')),
  constraint portfolio_item_subtype_check
    check (subtype in ('','videos','scripts','product-ugc','talking-head')),
  constraint portfolio_item_subtype_only_ugc
    check (subtype = '' or category = 'ugc')
);

create trigger portfolio_item_set_updated_at
before update on "PortfolioItem"
for each row execute function set_updated_at();

alter table "PortfolioItem" enable row level security;

-- Same model as "Article": the anon key can read/write; admin writes are
-- gated at the application layer (lib/auth.ts cookie auth), not RLS.
create policy "PortfolioItem public read/write" on "PortfolioItem"
  for all
  using (true)
  with check (true);

create index portfolio_item_published_category_idx
  on "PortfolioItem" (published, category);
