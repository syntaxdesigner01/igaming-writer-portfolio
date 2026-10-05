import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { toPublicPortfolioItem } from "@/lib/types";
import { sortPortfolioItems } from "@/lib/portfolio";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactCta from "@/components/ContactCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio | Michael. iGaming Writer",
  description:
    "Selected work by Michael across iGaming, product, finance and UGC content — articles, product pieces, scripts and short-form video.",
};

async function getPortfolioItems() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("PortfolioItem")
    .select("*")
    .eq("published", true);
  return sortPortfolioItems(rows ?? []).map(toPublicPortfolioItem);
}

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <>
      <section className="page-hero container">
        <div className="page-hero-copy reveal">
          <p className="eyebrow">Portfolio</p>
          <h1>
            My <span>Work.</span>
          </h1>
          <p>
            A collection of things I&apos;ve written, created and worked on
            across iGaming, product, finance, and UGC.
          </p>
          <p>
            I&apos;ve spent the last 4+ years creating content for different
            audiences, brands and industries. Here&apos;s a look at some of
            it.
          </p>
        </div>
        <div className="mini-art reveal delay-1">
          <div className="mini-glow"></div>
          <div className="mini-character floaty">🗂️</div>
        </div>
      </section>

      <PortfolioGrid items={items} />

      <section className="split-section container">
        <div className="reveal">
          <p className="eyebrow">Beyond the blog</p>
          <h2>
            More than <span>articles.</span>
          </h2>
        </div>
        <div className="reveal delay-1">
          <p className="large-copy">
            Writing is where I started, but it isn&apos;t the only format I
            work in. Depending on what a brand needs, the same research can
            become a long-form guide, a product explainer, a short script or
            a 30-second video.
          </p>
          <p className="muted">
            That means I can cover a content plan end to end — the SEO
            article that brings people in, the product or research piece
            that explains the thing properly, and the short-form UGC video
            or script that makes it travel. Same voice, different formats.
          </p>
        </div>
      </section>

      <section className="skills container">
        <div className="section-heading reveal">
          <p className="eyebrow">Skills</p>
          <h2>
            What I bring to <span>the work.</span>
          </h2>
        </div>
        <div className="chip-grid reveal">
          <span>Writing</span>
          <span>SEO</span>
          <span>Content Management</span>
          <span>UGC</span>
        </div>
      </section>

      <section className="contact-cta container reveal">
        <ContactCta
          eyebrow="Let’s work together"
          heading={
            <>
              Have something in mind? <span>Let’s talk.</span>
            </>
          }
          body="Tell me the format, the audience and the deadline. I’ll tell you how I’d approach it."
          buttonText="Start a conversation"
        />
      </section>
    </>
  );
}
