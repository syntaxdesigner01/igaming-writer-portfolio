import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { isAuthenticated } from "@/lib/auth";
import { markdownToHtml, formatDate } from "@/lib/markdown";
import ContactCta from "@/components/ContactCta";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("Article")
    .select("*")
    .eq("slug", decodeURIComponent(slug))
    .maybeSingle();
  if (!article) return null;
  if (!article.published && !(await isAuthenticated())) return null;
  return article;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return { title: "Article | Michael. iGaming Writer" };
  }
  return {
    title: `${article.title} | Michael. iGaming Writer`,
    description: article.excerpt || undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <section className="article-shell container">
        <div className="article-header reveal visible">
          <Link className="back-link" href="/blog">
            ← Back to all articles
          </Link>
          <p className="eyebrow">404</p>
          <h1>This article is not available.</h1>
          <p className="lead">
            The piece may have been unpublished or the link may be
            incorrect.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="article-shell container">
      <div className="article-header reveal visible">
        <Link className="back-link" href="/blog">
          ← Back to all articles
        </Link>
        <p className="eyebrow">{article.label || article.category || "iGAMING"}</p>
        <h1>{article.title}</h1>
        <p className="lead">{article.excerpt || ""}</p>
        <div className="article-meta">
          <span>{formatDate(article.date)}</span>
          <span>{article.read || "5 min read"}</span>
          <span>iGaming writing · SEO · editorial</span>
        </div>
        {article.coverImage && (
          <div
            className="article-hero-image"
            style={{ backgroundImage: `url(${JSON.stringify(article.coverImage)})` }}
          ></div>
        )}
      </div>
      <article className="article-body reveal visible">
        <div
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(article.content || ""),
          }}
        />
        <div className="article-cta">
          <ContactCta
            eyebrow="Need content like this?"
            heading={
              <>
                Let’s write something <span>useful.</span>
              </>
            }
            body="Available for iGaming articles, landing pages, sportsbook guides, SEO copy and content management."
            buttonText="Start a brief"
          />
        </div>
      </article>
    </section>
  );
}
