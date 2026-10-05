export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  label: string;
  excerpt: string;
  date: string;
  read: string;
  featured: boolean;
  published: boolean;
  coverImage: string;
  tags: string[];
  content: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicArticle = Pick<
  Article,
  | "id"
  | "slug"
  | "title"
  | "category"
  | "label"
  | "excerpt"
  | "date"
  | "read"
  | "featured"
  | "published"
  | "coverImage"
  | "tags"
>;

export function toPublicArticle(a: Article): PublicArticle {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    label: a.label,
    excerpt: a.excerpt,
    date: a.date,
    read: a.read,
    featured: !!a.featured,
    published: !!a.published,
    coverImage: a.coverImage || "",
    tags: Array.isArray(a.tags) ? a.tags : [],
  };
}

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  subtype: string;
  description: string;
  thumbnail: string;
  url: string;
  platform: string;
  published: boolean;
  sortOrder: number;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicPortfolioItem = Pick<
  PortfolioItem,
  | "id"
  | "title"
  | "category"
  | "subtype"
  | "description"
  | "thumbnail"
  | "url"
  | "platform"
  | "date"
>;

export function toPublicPortfolioItem(p: PortfolioItem): PublicPortfolioItem {
  return {
    id: p.id,
    title: p.title,
    category: p.category || "igaming",
    subtype: p.subtype || "",
    description: p.description || "",
    thumbnail: p.thumbnail || "",
    url: p.url || "",
    platform: p.platform || "",
    date: p.date || "",
  };
}
