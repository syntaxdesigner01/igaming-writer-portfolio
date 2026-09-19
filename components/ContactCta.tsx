"use client";

import { useState, type ReactNode } from "react";
import ContactModal from "./ContactModal";

type ContactCtaProps = {
  eyebrow?: string;
  heading?: ReactNode;
  body?: ReactNode;
  buttonText?: string;
};

export default function ContactCta({
  eyebrow = "Have a brief?",
  heading = (
    <>
      Let’s make the next piece <span>worth publishing.</span>
    </>
  ),
  body = "Tell me what you need, the market, the format and the deadline. We can take it from there.",
  buttonText = "Let’s talk",
}: ContactCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="cta-card" id="contact">
        <div className="cta-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{heading}</h2>
          <p>{body}</p>
        </div>
        <button
          type="button"
          className="button button-light"
          onClick={() => setOpen(true)}
        >
          {buttonText}
        </button>
      </div>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
