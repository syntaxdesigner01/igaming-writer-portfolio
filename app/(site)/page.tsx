import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { toPublicArticle } from "@/lib/types";
import ContactCta from "@/components/ContactCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "D1. | Professional iGaming Writer",
  description:
    "Professional iGaming writer portfolio covering casino, sportsbook, SEO, fintech and affiliate content.",
};

async function getFeatured() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("Article").select("*").eq("published", true);
  return (rows ?? [])
    .map((a) => toPublicArticle(a))
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 3);
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <section className="hero container">
        <div className="hero-copy reveal">
          <p className="eyebrow">iGaming writer · SEO · content strategy</p>
          <h1>
            I write stories that help <span>iGaming brands grow.</span>
          </h1>
          <p className="hero-sub">
            Casino, sportsbook and affiliate content written for people first,
            search engines second.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/blog">
              Read my work
            </Link>
            <Link className="button button-ghost" href="/about">
              About me
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <i></i> 4+ years in iGaming content
            </span>
            <span>
              <i></i> Remote · Nigeria
            </span>
          </div>
        </div>

        <div
          className="hero-art hero-portrait-art reveal delay-1"
          aria-label="Portrait of D1, professional iGaming writer"
        >
          <div className="glow glow-a"></div>
          <div className="glow glow-b"></div>
          <div className="portrait-aura"></div>
          <div className="hero-portrait-wrap floaty">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-portrait"
              src="/assets/d1-portrait.png"
              alt="Portrait of D1, professional iGaming writer"
              width={1024}
              height={1536}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="floating-tag tag-one">CASINO</div>
          <div className="floating-tag tag-two">SPORTSBOOK</div>
          <div className="floating-tag tag-three">SEO</div>
        </div>
      </section>

      <section className="intro container reveal">
        <p>
          From casino reviews and sportsbook guides to affiliate landing
          pages and SEO briefs, the focus is simple: make complex iGaming
          topics easy to understand and worth reading.
        </p>
      </section>

      <section className="proof container">
        <div className="section-heading reveal">
          <p className="eyebrow">See what I write</p>
          <h2>
            Content built to <span>do a job.</span>
          </h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card reveal">
            <div className="icon">✦</div>
            <div>
              <h3>Casino content</h3>
              <p>Reviews, bonuses, payment methods, games and player guides.</p>
            </div>
          </article>
          <article className="feature-card reveal delay-1">
            <div className="icon">↗</div>
            <div>
              <h3>Sportsbook content</h3>
              <p>
                Betting guides, markets, previews and explainers that keep
                readers moving.
              </p>
            </div>
          </article>
          <article className="feature-card reveal delay-2">
            <div className="icon">⌕</div>
            <div>
              <h3>SEO & affiliate</h3>
              <p>
                Search-friendly copy with internal linking, metadata and
                conversion intent.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="works container">
        <div className="works-copy reveal">
          <p className="eyebrow">Selected work</p>
          <h2>
            Recent pieces worth <span>reading.</span>
          </h2>
          <p className="muted">
            A snapshot of the kind of work available across casino,
            sportsbook, affiliate and fintech-focused publishing.
          </p>
          <div className="work-list">
            {featured.map((a, i) => (
              <Link
                className="work-item"
                href={`/article/${encodeURIComponent(a.slug)}`}
                key={a.id}
              >
                <div>
                  <small>{a.label || a.category || "iGAMING"}</small>
                  <h3>{a.title}</h3>
                  <span>Read article ↗</span>
                </div>
                <b>{String(i + 1).padStart(2, "0")}</b>
              </Link>
            ))}
          </div>
          <Link className="button button-primary" href="/blog">
            Take me to the blog
          </Link>
        </div>
        <div className="writing-art reveal delay-1">
          <div className="paper-glow"></div>
          <svg viewBox="0 0 360 430" className="paper-svg" aria-hidden="true">
            <defs>
              <filter id="paperShadow">
                <feDropShadow dx="0" dy="20" stdDeviation="14" floodOpacity=".5" />
              </filter>
            </defs>
            <g filter="url(#paperShadow)">
              <g className="notebook-float">
                <path d="M74 90h208l-18 250H55z" fill="#24272c" />
                <path d="M85 104h189l-14 220H70z" fill="#121417" />
                <path
                  d="M104 146h138M100 178h143M96 210h130M92 242h118"
                  stroke="#b8bcc3"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity=".8"
                />
                <path d="M252 101l18 211" stroke="#ff6a00" strokeWidth="7" />
                <path
                  d="M82 105l-6 207"
                  stroke="#ff6a00"
                  strokeWidth="7"
                  opacity=".8"
                />
              </g>
              <g className="pencil-float">
                <path d="M32 91l33-38 150 183-33 27z" fill="#ff6a00" />
                <path d="M39 85l14-17 150 183-14 17z" fill="#f4f4f5" />
                <path d="M32 91l-9 30 29-10z" fill="#d0d2d6" />
                <path
                  d="M64 57l11-14 150 183-11 14z"
                  fill="#15171b"
                  opacity=".65"
                />
              </g>
            </g>
          </svg>
        </div>
      </section>

      <section className="about-strip container reveal">
        <div>
          <p className="eyebrow">A little about me</p>
          <h2>
            Good iGaming content should feel <span>human.</span>
          </h2>
        </div>
        <p className="muted">
          I work across editorial writing, affiliate content, SEO and
          content management, combining research with a natural voice that
          helps readers understand what they are looking at and what to do
          next.
        </p>
        <Link className="text-link" href="/about">
          More about me ↗
        </Link>
      </section>

      <section className="contact-cta container reveal">
        <ContactCta />
      </section>
    </>
  );
}
