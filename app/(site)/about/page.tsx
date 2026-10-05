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
            I&apos;m a writer and content strategist working across iGaming,
            product, finance, and the tech ecosystem. For the past 4+ years,
            I&apos;ve worked on content that sits somewhere between research,
            storytelling and business goals, from casino and sportsbook
            content to fintech, product and technology pieces. I care about
            making complicated subjects easier to understand without
            watering them down.
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
            My work goes beyond putting words on a page. I can take a
            project from research and outlining through writing, SEO,
            editing, proofreading, CMS integration and final quality
            checks.
          </p>
          <p className="muted">
            I&apos;m comfortable working with international audiences,
            different industries and different content goals. Sometimes the
            goal is to rank. Sometimes it is to explain a product. Sometimes
            it is to help a reader make sense of a complicated subject.
            Whatever the brief is, I start by understanding what the
            content needs to do.
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
