"use client";

import { useEffect, useRef, useState } from "react";
import type { Article } from "@/lib/types";
import { markdownToHtml, escapeHtml } from "@/lib/markdown";
import { adminApi } from "@/lib/adminApi";

function slugify(v: string): string {
  return String(v || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  category: "casino",
  label: "CASINO",
  read: "6 min read",
  date: new Date().toISOString().slice(0, 10),
  tags: "",
  excerpt: "",
  coverImage: "",
  content:
    "# Your article title\n\nStart writing your article here.\n\n## A useful heading\n\nKeep the copy clear, helpful and easy to scan.",
  featured: false,
  published: false,
};

type FormState = typeof emptyForm;

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [articles, setArticles] = useState<Article[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const coverFileRef = useRef<HTMLInputElement>(null);
  const mdFileRef = useRef<HTMLInputElement>(null);

  function clearCoverFile() {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview("");
  }

  useEffect(() => {
    adminApi<{ authenticated: boolean }>("/api/admin/me").then((me) =>
      setAuthenticated(me.authenticated)
    );
  }, []);

  useEffect(() => {
    if (authenticated) loadArticles();
  }, [authenticated]);

  async function loadArticles() {
    try {
      const data = await adminApi<Article[]>("/api/articles?admin=1");
      setArticles(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      await adminApi("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });
      setAuthenticated(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function handleLogout() {
    await adminApi("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  function newArticle() {
    setCurrentId(null);
    setShowEditor(true);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setSaveStatus("");
    setSaveError(false);
    clearCoverFile();
  }

  function editArticle(id: string) {
    const a = articles.find((x) => x.id === id);
    if (!a) return;
    setCurrentId(id);
    setShowEditor(true);
    setForm({
      id: a.id,
      title: a.title || "",
      slug: a.slug || "",
      category: a.category || "casino",
      label: a.label || "",
      read: a.read || "5 min read",
      date: (a.date || "").slice(0, 10),
      tags: (a.tags || []).join(", "),
      excerpt: a.excerpt || "",
      coverImage: a.coverImage || "",
      content: a.content || "",
      featured: !!a.featured,
      published: !!a.published,
    });
    setSaveStatus("");
    setSaveError(false);
    clearCoverFile();
  }

  function onTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: currentId ? f.slug : slugify(value),
    }));
  }

  async function submitArticle(publish: boolean) {
    if (!form.title.trim()) {
      alert("Please add an article title.");
      return;
    }
    setSaveError(false);
    try {
      let coverImage = form.coverImage;
      if (coverFile) {
        setSaveStatus("Uploading image…");
        setUploading(true);
        try {
          coverImage = await uploadCoverImage(coverFile);
        } finally {
          setUploading(false);
        }
      }

      setSaveStatus("Saving…");
      const payload = {
        id: currentId || undefined,
        title: form.title,
        slug: form.slug || undefined,
        category: form.category,
        label: form.label,
        read: form.read,
        date: form.date,
        tags: form.tags,
        excerpt: form.excerpt,
        coverImage,
        content: form.content,
        featured: form.featured,
        published: publish || form.published,
      };
      const result = await adminApi<{ ok: true; article: Article }>(
        "/api/admin/articles",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      setArticles((prev) => {
        const next = prev
          .filter((a) => a.id !== result.article.id)
          .concat(result.article);
        next.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return next;
      });
      setCurrentId(result.article.id);
      setForm((f) => ({
        ...f,
        id: result.article.id,
        slug: result.article.slug,
        coverImage: result.article.coverImage,
        published: result.article.published,
      }));
      clearCoverFile();
      setSaveStatus(publish ? "Published successfully." : "Draft saved.");
      setSaveError(false);
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Save failed.");
      setSaveError(true);
    }
  }

  async function deleteArticle() {
    if (!currentId) return;
    const a = articles.find((x) => x.id === currentId);
    if (!a) return;
    if (!confirm(`Delete “${a.title}”? This cannot be undone.`)) return;
    try {
      await adminApi(`/api/admin/articles/${encodeURIComponent(currentId)}`, {
        method: "DELETE",
      });
      setArticles((prev) => prev.filter((x) => x.id !== currentId));
      setShowEditor(false);
      setCurrentId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  function selectCoverFile() {
    const file = coverFileRef.current?.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      alert("Please choose an image smaller than 6MB.");
      if (coverFileRef.current) coverFileRef.current.value = "";
      return;
    }
    clearCoverFile();
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function uploadCoverImage(file: File): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read the image."));
      reader.readAsDataURL(file);
    });
    const result = await adminApi<{ url: string }>("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
    });
    return result.url;
  }

  async function importMarkdown() {
    const file = mdFileRef.current?.files?.[0];
    if (!file) return;
    const text = await file.text();
    setForm((f) => {
      let next = { ...f, content: text };
      if (!f.title.trim()) {
        const heading = text.match(/^#\s+(.+)$/m);
        if (heading) {
          next = { ...next, title: heading[1], slug: slugify(heading[1]) };
        }
      }
      return next;
    });
    if (mdFileRef.current) mdFileRef.current.value = "";
  }

  if (authenticated === null) return null;

  if (!authenticated) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="brand brand-admin">
            <span>Michael</span>
            <b>.</b>
          </div>
          <p className="eyebrow">Private dashboard</p>
          <h1>
            Manage your <span>articles.</span>
          </h1>
          <p className="muted">
            Publish new work, edit existing pieces and control what appears
            on the public site.
          </p>
          <form onSubmit={handleLogin}>
            <label>
              Password
              <input
                type="password"
                placeholder="Enter admin password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </label>
            <button className="button button-primary" type="submit">
              Open dashboard
            </button>
            {loginError && <p className="error">{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  const total = articles.length;
  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;
  const featuredCount = articles.filter((a) => a.featured).length;

  const q = search.toLowerCase().trim();
  const filteredArticles = articles.filter((a) =>
    `${a.title} ${a.category} ${(a.tags || []).join(" ")}`
      .toLowerCase()
      .includes(q)
  );

  return (
    <div>
      <header className="dash-header">
        <div className="dash-header-inner">
          <a className="brand" href="/">
            <span>Michael</span>
            <b>.</b>
          </a>
          <div className="dash-title">
            <span>Writer dashboard</span>
            <small>Content publishing</small>
          </div>
          <div className="dash-actions">
            <a href="/blog" target="_blank" rel="noreferrer">
              View site ↗
            </a>
            <button className="ghost-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-wrap">
        <section className="dash-intro">
          <div>
            <p className="eyebrow">Content desk</p>
            <h1>
              Your publishing <span>command centre.</span>
            </h1>
            <p className="muted">
              Everything you publish here flows into the homepage, blog and
              individual article pages automatically.
            </p>
          </div>
          <button className="button button-primary" onClick={newArticle}>
            + New article
          </button>
        </section>

        <section className="stat-grid">
          <div className="stat-card">
            <span>Total articles</span>
            <strong>{total}</strong>
          </div>
          <div className="stat-card">
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
          <div className="stat-card">
            <span>Drafts</span>
            <strong>{draftCount}</strong>
          </div>
          <div className="stat-card">
            <span>Featured</span>
            <strong>{featuredCount}</strong>
          </div>
        </section>

        <section className="workspace">
          <aside className="article-list-panel">
            <div className="panel-head">
              <div>
                <h2>Articles</h2>
                <p className="muted">Click an article to edit.</p>
              </div>
              <input
                className="search"
                type="search"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="article-list">
              {filteredArticles.length === 0 ? (
                <div className="muted" style={{ padding: 18 }}>
                  No matching articles.
                </div>
              ) : (
                filteredArticles.map((a) => (
                  <div
                    key={a.id}
                    className={`article-item${a.id === currentId ? " active" : ""}`}
                    onClick={() => editArticle(a.id)}
                  >
                    <small>{a.label || a.category}</small>
                    <h3>{a.title}</h3>
                    <div className="meta">
                      <span>{a.published ? "Published" : "Draft"}</span>
                      <span>{a.date || ""}</span>
                      {a.featured && <span>Featured</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="editor-panel">
            {!showEditor ? (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <h2>Create your next piece.</h2>
                <p>Start a new article or choose an existing one from the left.</p>
                <button className="button button-primary" onClick={newArticle}>
                  Write an article
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="editor-head">
                  <div>
                    <p className="eyebrow">Article editor</p>
                    <h2>{currentId ? "Edit article" : "New article"}</h2>
                  </div>
                  <div className="editor-head-actions">
                    {currentId && (
                      <button
                        type="button"
                        className="danger-btn"
                        onClick={deleteArticle}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => setPreview((v) => !v)}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                <div className="editor-grid">
                  <div className="form-column">
                    <div className="field-row">
                      <label>
                        Title
                        <input
                          type="text"
                          placeholder="Your article headline"
                          required
                          value={form.title}
                          onChange={(e) => onTitleChange(e.target.value)}
                        />
                      </label>
                      <label>
                        Slug
                        <input
                          type="text"
                          placeholder="your-article-slug"
                          value={form.slug}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, slug: e.target.value }))
                          }
                        />
                      </label>
                    </div>
                    <div className="field-row three">
                      <label>
                        Category
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, category: e.target.value }))
                          }
                        >
                          <option value="casino">Casino</option>
                          <option value="sportsbook">Sportsbook</option>
                          <option value="seo">SEO</option>
                          <option value="fintech">Fintech</option>
                          <option value="industry">Industry</option>
                        </select>
                      </label>
                      <label>
                        Label
                        <input
                          type="text"
                          placeholder="CASINO · SEO"
                          value={form.label}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, label: e.target.value }))
                          }
                        />
                      </label>
                      <label>
                        Read time
                        <input
                          type="text"
                          placeholder="6 min read"
                          value={form.read}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, read: e.target.value }))
                          }
                        />
                      </label>
                    </div>
                    <div className="field-row">
                      <label>
                        Publish date
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, date: e.target.value }))
                          }
                        />
                      </label>
                      <label>
                        Tags
                        <input
                          type="text"
                          placeholder="Casino, SEO, Affiliate"
                          value={form.tags}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, tags: e.target.value }))
                          }
                        />
                      </label>
                    </div>
                    <label>
                      Excerpt
                      <textarea
                        rows={3}
                        placeholder="Short description shown on the homepage and blog cards."
                        value={form.excerpt}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, excerpt: e.target.value }))
                        }
                      />
                    </label>
                    <div className="cover-upload">
                      <div>
                        <span className="field-label">Cover image</span>
                        <small>JPG, PNG or WEBP · max 6MB</small>
                      </div>
                      <div className="cover-actions">
                        <input
                          ref={coverFileRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          hidden
                          onChange={selectCoverFile}
                        />
                        <button
                          type="button"
                          className="ghost-btn"
                          onClick={() => coverFileRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading
                            ? "Uploading…"
                            : coverFile
                              ? "Change image"
                              : "Choose image"}
                        </button>
                        <input
                          type="text"
                          placeholder="https://res.cloudinary.com/..."
                          value={form.coverImage}
                          onChange={(e) => {
                            clearCoverFile();
                            setForm((f) => ({ ...f, coverImage: e.target.value }));
                          }}
                        />
                      </div>
                      {coverFile && (
                        <small className="muted">
                          Uploads when you save or publish.
                        </small>
                      )}
                      {(coverPreview || form.coverImage) && (
                        <div
                          className="cover-preview"
                          style={{
                            backgroundImage: `url(${JSON.stringify(coverPreview || form.coverImage)})`,
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="content-tools">
                      <span className="field-label">Article body</span>
                      <button
                        type="button"
                        className="ghost-btn small"
                        onClick={() => mdFileRef.current?.click()}
                      >
                        Import .md
                      </button>
                      <input
                        ref={mdFileRef}
                        type="file"
                        accept=".md,.markdown,.txt"
                        hidden
                        onChange={importMarkdown}
                      />
                    </div>
                    <textarea
                      className="content-editor"
                      placeholder={
                        "# Article title\n\nStart writing here…\n\n## Heading\n\nWrite your paragraphs in Markdown.\n\n- Bullet point\n- Another point"
                      }
                      value={form.content}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, content: e.target.value }))
                      }
                    />
                    <div className="form-foot">
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={form.featured}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, featured: e.target.checked }))
                          }
                        />{" "}
                        Feature this article on the homepage
                      </label>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={form.published}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, published: e.target.checked }))
                          }
                        />{" "}
                        Publish immediately
                      </label>
                    </div>
                    <div className="save-row">
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => submitArticle(false)}
                        disabled={uploading}
                      >
                        Save draft
                      </button>
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => submitArticle(true)}
                        disabled={uploading}
                      >
                        Publish article
                      </button>
                      <span
                        className="save-status"
                        style={saveError ? { color: "#ff9797" } : undefined}
                      >
                        {saveStatus}
                      </span>
                    </div>
                  </div>

                  <div className="preview-column">
                    <div className="preview-label">Live preview</div>
                    <div
                      className="article-preview"
                      dangerouslySetInnerHTML={{
                        __html: `${
                          form.label
                            ? `<div style="color:var(--accent);font-size:11px;letter-spacing:.14em;font-weight:800;margin-bottom:12px">${escapeHtml(form.label)}</div>`
                            : ""
                        }<h1>${escapeHtml(form.title || "Untitled article")}</h1>${
                          form.excerpt
                            ? `<p style="font-size:16px;color:#d4d7dc">${escapeHtml(form.excerpt)}</p>`
                            : ""
                        }<div>${markdownToHtml(form.content)}</div>`,
                      }}
                    />
                  </div>
                </div>
              </form>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
