"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAbout = pathname === "/about";
  const isBlog = pathname === "/blog" || pathname.startsWith("/article/");

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span>D1</span>
        <b>.</b>
      </Link>
      <nav className={`desktop-nav${open ? " open" : ""}`} aria-label="Primary navigation">
        <Link className={isAbout ? "active" : undefined} href="/about">
          About
        </Link>
        <Link className={isBlog ? "active" : undefined} href="/blog">
          Blog
        </Link>
        <a className="nav-cta" href="mailto:hello@example.com">
          Work with me
        </a>
      </nav>
      <button
        className="menu-toggle"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
    </header>
  );
}
