export const PORTFOLIO_CATEGORY_KEYS = ["igaming", "product", "finance", "ugc"] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORY_KEYS)[number];

export const PORTFOLIO_CATEGORIES: {
  key: PortfolioCategory;
  tabLabel: string;
  sectionTitle: string;
  cardLabel: string;
}[] = [
  { key: "igaming", tabLabel: "iGaming", sectionTitle: "iGaming", cardLabel: "IGAMING" },
  {
    key: "product",
    tabLabel: "Product",
    sectionTitle: "Product & Technology",
    cardLabel: "PRODUCT",
  },
  {
    key: "finance",
    tabLabel: "Finance",
    sectionTitle: "Finance, Fintech & Web3",
    cardLabel: "FINANCE",
  },
  { key: "ugc", tabLabel: "UGC", sectionTitle: "UGC Content", cardLabel: "UGC" },
];

export const UGC_SUBTYPES = [
  { key: "videos", label: "Videos" },
  { key: "scripts", label: "Scripts" },
  { key: "product-ugc", label: "Product UGC" },
  { key: "talking-head", label: "Talking-head content" },
] as const;
export type PortfolioSubtype = (typeof UGC_SUBTYPES)[number]["key"];

export function normalizePortfolioCategory(v: unknown): PortfolioCategory {
  const value = String(v || "")
    .trim()
    .toLowerCase();
  return (PORTFOLIO_CATEGORY_KEYS as readonly string[]).includes(value)
    ? (value as PortfolioCategory)
    : "igaming";
}

export function normalizePortfolioSubtype(v: unknown, category: string): string {
  if (category !== "ugc") return "";
  const value = String(v || "")
    .trim()
    .toLowerCase();
  return UGC_SUBTYPES.some((s) => s.key === value) ? value : "";
}

export function portfolioCategoryLabel(key: string): string {
  return PORTFOLIO_CATEGORIES.find((c) => c.key === key)?.cardLabel || "";
}

export function portfolioSubtypeLabel(key: string): string {
  return UGC_SUBTYPES.find((s) => s.key === key)?.label || "";
}

export function isValidExternalUrl(v: string): boolean {
  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sortPortfolioItems<
  T extends { sortOrder?: number; date?: string; createdAt?: string },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const order = (b.sortOrder || 0) - (a.sortOrder || 0);
    if (order !== 0) return order;
    const dateDiff =
      new Date(b.date || b.createdAt || 0).getTime() -
      new Date(a.date || a.createdAt || 0).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}
