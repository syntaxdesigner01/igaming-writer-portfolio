"use client";

import { useMemo, useState } from "react";
import type { PublicPortfolioItem } from "@/lib/types";
import { formatDate } from "@/lib/markdown";
import {
  PORTFOLIO_CATEGORIES,
  UGC_SUBTYPES,
  portfolioCategoryLabel,
  portfolioSubtypeLabel,
  type PortfolioCategory,
} from "@/lib/portfolio";

const FILTERS: { key: "all" | PortfolioCategory; tabLabel: string }[] = [
  { key: "all", tabLabel: "All" },
  ...PORTFOLIO_CATEGORIES.map((c) => ({ key: c.key, tabLabel: c.tabLabel })),
];

function PortfolioCard({ item }: { item: PublicPortfolioItem }) {
  return (
    <a
      className="article-card reveal visible"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="article-top">
        <small>{item.platform || portfolioCategoryLabel(item.category)}</small>
        {item.date && <span>{formatDate(item.date)}</span>}
      </div>
      {item.thumbnail && (
        <div
          className="article-card-image"
          style={{ backgroundImage: `url(${JSON.stringify(item.thumbnail)})` }}
        ></div>
      )}
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="article-bottom">
        <span>{portfolioSubtypeLabel(item.subtype) || portfolioCategoryLabel(item.category)}</span>
        <span className="read">View work ↗</span>
      </div>
    </a>
  );
}

function CardGrid({ items }: { items: PublicPortfolioItem[] }) {
  if (items.length === 0) {
    return (
      <div className="article-grid portfolio-grid">
        <div className="empty-blog">No work in this category yet.</div>
      </div>
    );
  }
  return (
    <div className="article-grid portfolio-grid">
      {items.map((item) => (
        <PortfolioCard item={item} key={item.id} />
      ))}
    </div>
  );
}

function UgcGroups({ items }: { items: PublicPortfolioItem[] }) {
  const grouped = UGC_SUBTYPES.map((s) => ({
    ...s,
    items: items.filter((i) => i.subtype === s.key),
  })).filter((g) => g.items.length > 0);
  const other = items.filter(
    (i) => !UGC_SUBTYPES.some((s) => s.key === i.subtype)
  );

  if (grouped.length === 0 && other.length === 0) {
    return <CardGrid items={[]} />;
  }

  return (
    <>
      {grouped.map((g) => (
        <div className="portfolio-subsection" key={g.key}>
          <h3 className="portfolio-subheading">{g.label}</h3>
          <CardGrid items={g.items} />
        </div>
      ))}
      {other.length > 0 && (
        <div className="portfolio-subsection">
          <h3 className="portfolio-subheading">More UGC</h3>
          <CardGrid items={other} />
        </div>
      )}
    </>
  );
}

export default function PortfolioGrid({ items }: { items: PublicPortfolioItem[] }) {
  const [filter, setFilter] = useState<"all" | PortfolioCategory>("all");

  const byCategory = useMemo(() => {
    const map: Record<PortfolioCategory, PublicPortfolioItem[]> = {
      igaming: [],
      product: [],
      finance: [],
      ugc: [],
    };
    for (const item of items) {
      const key = (item.category as PortfolioCategory) || "igaming";
      if (map[key]) map[key].push(item);
    }
    return map;
  }, [items]);

  return (
    <>
      <section className="blog-toolbar container reveal">
        <div className="filter-tabs" role="tablist" aria-label="Filter work">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.tabLabel}
            </button>
          ))}
        </div>
      </section>

      <div className="portfolio-sections container">
        {filter === "all" && items.length === 0 && <CardGrid items={[]} />}

        {filter === "all" &&
          PORTFOLIO_CATEGORIES.map((c) => {
            const categoryItems = byCategory[c.key];
            if (categoryItems.length === 0) return null;
            return (
              <section className="portfolio-section" key={c.key}>
                <h2 className="portfolio-section-heading">{c.sectionTitle}</h2>
                {c.key === "ugc" ? (
                  <UgcGroups items={categoryItems} />
                ) : (
                  <CardGrid items={categoryItems} />
                )}
              </section>
            );
          })}

        {filter === "ugc" && (
          <section className="portfolio-section">
            <h2 className="portfolio-section-heading">UGC Content</h2>
            <UgcGroups items={byCategory.ugc} />
          </section>
        )}

        {filter !== "all" && filter !== "ugc" && (
          <CardGrid items={byCategory[filter]} />
        )}
      </div>
    </>
  );
}
