"use client";

import { useState } from "react";
import Link from "next/link";
import type { PublicArticle } from "@/lib/types";
import { formatDate } from "@/lib/markdown";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "casino", label: "Casino" },
  { key: "sportsbook", label: "Sportsbook" },
  { key: "seo", label: "SEO" },
  { key: "fintech", label: "Fintech" },
];

export default function BlogGrid({ articles }: { articles: PublicArticle[] }) {
  const [filter, setFilter] = useState("all");
  const list = articles.filter((a) => filter === "all" || a.category === filter);

  return (
    <>
      <section className="blog-toolbar container reveal">
        <div className="filter-tabs" role="tablist" aria-label="Filter articles">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="article-grid container" id="articleGrid">
        {list.length === 0 ? (
          <div className="empty-blog">No articles in this category yet.</div>
        ) : (
          list.map((a) => (
            <Link
              className="article-card reveal visible"
              href={`/article/${encodeURIComponent(a.slug)}`}
              key={a.id}
            >
              <div className="article-top">
                <small>{a.label || a.category || "iGAMING"}</small>
                <span>{formatDate(a.date)}</span>
              </div>
              {a.coverImage && (
                <div
                  className="article-card-image"
                  style={{ backgroundImage: `url(${JSON.stringify(a.coverImage)})` }}
                ></div>
              )}
              <h3>{a.title}</h3>
              <p>{a.excerpt || ""}</p>
              <div className="article-bottom">
                <span>{a.read || "5 min read"}</span>
                <span className="read">Read article ↗</span>
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
