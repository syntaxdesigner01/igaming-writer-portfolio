import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { toPublicArticle } from "@/lib/types";
import BlogGrid from "@/components/BlogGrid";
import ContactCta from "@/components/ContactCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | D1. iGaming Writer",
  description:
    "Selected iGaming writing by D1: casino, sportsbook, affiliate and SEO articles.",
};

async function getArticles() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("Article").select("*").eq("published", true);
  const articles = (rows ?? []).map((a) => toPublicArticle(a));
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return articles;
}

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <>
      <section className="page-hero container">
        <div className="page-hero-copy reveal">
          <p className="eyebrow">The blog</p>
          <h1>
            Useful words about <span>iGaming.</span>
          </h1>
          <p>
            Selected pieces across casino, sportsbook, SEO, affiliate
            content and the wider digital publishing space.
          </p>
        </div>
        <div className="mini-art reveal delay-1">
          <div className="mini-glow"></div>
          <div className="mini-character floaty">⌕</div>
        </div>
      </section>

      <BlogGrid articles={articles} />

      <section className="contact-cta container reveal">
        <ContactCta
          eyebrow="Want similar content?"
          heading={
            <>
              Let’s turn the next <span>brief into a byline.</span>
            </>
          }
          body="Available for freelance, contract and remote content work."
          buttonText="Get in touch"
        />
      </section>
    </>
  );
}
