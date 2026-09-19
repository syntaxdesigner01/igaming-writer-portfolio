import type { Metadata } from "next";
import Link from "next/link";
import ContactCta from "@/components/ContactCta";

export const metadata: Metadata = {
  title: "About | Michael. iGaming Writer",
  description:
    "About D1, a professional iGaming writer specializing in casino, sportsbook, SEO and affiliate content.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero container">
        <div className="page-hero-copy reveal">
          <p className="eyebrow">About me</p>
          <h1>
            Words are the product. <span>Clarity is the edge.</span>
          </h1>
          <p>
            I&apos;m an iGaming writer and content manager focused on
            casino, sportsbook, affiliate and SEO content that sounds human
            and supports a business goal.
          </p>
        </div>
        <div className="mini-art reveal delay-1">
          <div className="mini-glow"></div>
          <div className="mini-character floaty">✍️</div>
        </div>
      </section>

      <section className="split-section container">
        <div className="reveal">
          <p className="eyebrow">The work</p>
          <h2>
            From brief to <span>publish.</span>
          </h2>
        </div>
        <div className="reveal delay-1">
          <p className="large-copy">
            My work spans the full content process: research, outlining,
            writing, on-page SEO, editing, proofreading, CMS integration
            and quality assurance.
          </p>
          <p className="muted">
            I’m comfortable writing for international audiences while
            keeping the language clear, useful and commercially aware. The
            goal is never to stuff a page with words. The goal is to give
            readers a reason to stay, trust the information and take the
            next step.
          </p>
        </div>
      </section>

      <section className="numbers container">
        <div className="stat reveal">
          <b>4+</b>
          <span>years in iGaming content</span>
        </div>
        <div className="stat reveal delay-1">
          <b>SEO</b>
          <span>search-first content workflow</span>
        </div>
        <div className="stat reveal delay-2">
          <b>CMS</b>
          <span>WordPress, HTML & content integration</span>
        </div>
        <div className="stat reveal">
          <b>Remote</b>
          <span>available for international teams</span>
        </div>
      </section>

      <section className="skills container">
        <div className="section-heading reveal">
          <p className="eyebrow">What I cover</p>
          <h2>
            Writing, editing and <span>content operations.</span>
          </h2>
        </div>
        <div className="chip-grid reveal">
          <span>Casino reviews</span>
          <span>Casino guides</span>
          <span>Sportsbook guides</span>
          <span>Betting explainers</span>
          <span>Affiliate landing pages</span>
          <span>Bonuses & promotions</span>
          <span>Payment methods</span>
          <span>SEO content</span>
          <span>Metadata & internal linking</span>
          <span>Content QA</span>
          <span>WordPress CMS</span>
          <span>HTML tables & toggles</span>
        </div>
      </section>

      <section className="quote container reveal">
        <div className="quote-mark">“</div>
        <p>
          Good content does not need to shout. It needs to be clear enough
          that the right reader keeps going.
        </p>
      </section>

      <section className="contact-cta container reveal">
        <ContactCta
          eyebrow="Start a project"
          heading={
            <>
              Need an iGaming writer who can <span>own the brief?</span>
            </>
          }
          body="Send the scope and timeline. Let’s talk about the audience, the SERP and the job the content needs to do."
          buttonText="Send a brief"
        />
      </section>
    </>
  );
}
