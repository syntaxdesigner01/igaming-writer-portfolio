"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const backToTop = pathname === "/";

  return (
    <footer className="footer container">
      <div className="footer-brand">
        <Link className="brand" href="/">
          <span>D1</span>
          <b>.</b>
        </Link>
        <p>Professional iGaming writer.</p>
      </div>
      <div className="footer-links">
        <Link href="/about">About</Link>
        <Link href="/blog">Blog</Link>
        <a href="mailto:hello@example.com">Contact</a>
        {backToTop && <a href="#top">Back to top ↑</a>}
      </div>
      <small>© 2026 D1. All rights reserved.</small>
    </footer>
  );
}
