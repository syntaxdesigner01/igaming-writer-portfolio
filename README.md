# Michael. iGaming Writer Portfolio + Publishing Dashboard

A Next.js (App Router, TypeScript) rebuild of the original static portfolio. Same design, same public pages and the same admin publishing workflow — now backed by Supabase (Postgres) and Cloudinary for cover images, with the admin's server logic implemented as Next.js Route Handlers.

## What is included

- Public homepage, About page, Blog and individual article pages (`/`, `/about`, `/blog`, `/article/[slug]`)
- `/admin` private dashboard
- Password-protected admin login (signed cookie session)
- Create, edit, publish/unpublish and delete articles
- Drafts and featured articles
- Article categories, tags, read time and excerpts
- Markdown article editor with live preview
- Import an `.md`/`.txt` article file directly into the editor
- Cover image upload (JPG, PNG or WEBP, up to 6MB) via Cloudinary
- Homepage and blog update automatically after publishing
- Articles are stored in Postgres via Supabase

## Run locally

1. Install Node.js 18.18+.
2. Open a terminal in this folder and run `npm install`.
3. Copy `.env.example` to `.env` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — from your Supabase project's **Settings > API**
   - `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
4. Create the database schema: run `supabase/schema.sql` in your Supabase project's SQL editor
5. Seed the sample articles: `npm run seed`
6. Run `npm run dev`.
7. Open `http://localhost:3000` for the site.
8. Open `http://localhost:3000/admin` for the dashboard.

The development fallback password is `change-me-now`. Change it before publishing the site.

## Publishing online

This is a Next.js app, deploy it to any host that runs a persistent Node.js server (it uses server-side Route Handlers with a Postgres connection, not static export). Set the same environment variables listed above on the host.

## Writing workflow

Open `/admin`, log in, click **New article**, paste or type the article in Markdown, upload a cover image when needed, choose a category, and click **Publish article**. The article becomes available automatically in the public Blog and can be featured on the homepage.
