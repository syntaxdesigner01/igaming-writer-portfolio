"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/lib/types";
import { adminApi } from "@/lib/adminApi";
import { uploadImageFile, MAX_UPLOAD_BYTES } from "@/lib/adminUpload";
import {
  PORTFOLIO_CATEGORIES,
  UGC_SUBTYPES,
  isValidExternalUrl,
  portfolioCategoryLabel,
  portfolioSubtypeLabel,
  sortPortfolioItems,
} from "@/lib/portfolio";

const emptyForm = {
  id: "",
  title: "",
  category: "igaming",
  subtype: "",
  description: "",
  thumbnail: "",
  url: "",
  platform: "",
  sortOrder: 0,
  date: new Date().toISOString().slice(0, 10),
  published: false,
};

type FormState = typeof emptyForm;

export default function PortfolioPanel() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState("");

  const thumbFileRef = useRef<HTMLInputElement>(null);

  function clearThumbFile() {
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbFile(null);
    setThumbPreview("");
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await adminApi<PortfolioItem[]>("/api/portfolio?admin=1");
      setItems(sortPortfolioItems(data));
    } catch (err) {
      console.error(err);
    }
  }

  function newItem() {
    setCurrentId(null);
    setShowEditor(true);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setSaveStatus("");
    setSaveError(false);
    clearThumbFile();
  }

  function editItem(id: string) {
    const p = items.find((x) => x.id === id);
    if (!p) return;
    setCurrentId(id);
    setShowEditor(true);
    setForm({
      id: p.id,
      title: p.title || "",
      category: p.category || "igaming",
      subtype: p.subtype || "",
      description: p.description || "",
      thumbnail: p.thumbnail || "",
      url: p.url || "",
      platform: p.platform || "",
      sortOrder: p.sortOrder || 0,
      date: (p.date || "").slice(0, 10),
      published: !!p.published,
    });
    setSaveStatus("");
    setSaveError(false);
    clearThumbFile();
  }

  function onCategoryChange(value: string) {
    setForm((f) => ({
      ...f,
      category: value,
      subtype: value === "ugc" ? f.subtype || "videos" : "",
    }));
  }

  async function submitItem(publish: boolean) {
    if (!form.title.trim()) {
      alert("Please add a title.");
      return;
    }
    if (!isValidExternalUrl(form.url.trim())) {
      alert("Please add a valid link (https://…).");
      return;
    }
    setSaveError(false);
    try {
      let thumbnail = form.thumbnail;
      if (thumbFile) {
        setSaveStatus("Uploading image…");
        setUploading(true);
        try {
          thumbnail = await uploadImageFile(thumbFile);
        } finally {
          setUploading(false);
        }
      }

      setSaveStatus("Saving…");
      const payload = {
        id: currentId || undefined,
        title: form.title,
        category: form.category,
        subtype: form.subtype,
        description: form.description,
        thumbnail,
        url: form.url,
        platform: form.platform,
        sortOrder: form.sortOrder,
        date: form.date,
        published: publish || form.published,
      };
      const result = await adminApi<{ ok: true; item: PortfolioItem }>(
        "/api/admin/portfolio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      setItems((prev) =>
        sortPortfolioItems(
          prev.filter((p) => p.id !== result.item.id).concat(result.item)
        )
      );
      setCurrentId(result.item.id);
      setForm((f) => ({
        ...f,
        id: result.item.id,
        thumbnail: result.item.thumbnail,
        published: result.item.published,
      }));
      clearThumbFile();
      setSaveStatus(publish ? "Published successfully." : "Draft saved.");
      setSaveError(false);
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Save failed.");
      setSaveError(true);
    }
  }

  async function deleteItem() {
    if (!currentId) return;
    const p = items.find((x) => x.id === currentId);
    if (!p) return;
    if (!confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    try {
      await adminApi(`/api/admin/portfolio/${encodeURIComponent(currentId)}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((x) => x.id !== currentId));
      setShowEditor(false);
      setCurrentId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  function selectThumbFile() {
    const file = thumbFileRef.current?.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      alert("Please choose an image smaller than 6MB.");
      if (thumbFileRef.current) thumbFileRef.current.value = "";
      return;
    }
    clearThumbFile();
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  }

  const total = items.length;
  const publishedCount = items.filter((p) => p.published).length;
  const draftCount = items.filter((p) => !p.published).length;
  const ugcCount = items.filter((p) => p.category === "ugc").length;

  const q = search.toLowerCase().trim();
  const filteredItems = items.filter((p) =>
    `${p.title} ${p.category} ${p.subtype} ${p.platform}`
      .toLowerCase()
      .includes(q)
  );

  return (
    <>
      <section className="dash-intro">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>
            Your work, <span>in one place.</span>
          </h1>
          <p className="muted">
            Links to work published elsewhere — YouTube, client sites and
            other publications.
          </p>
        </div>
        <button className="button button-primary" onClick={newItem}>
          + New item
        </button>
      </section>

      <section className="stat-grid">
        <div className="stat-card">
          <span>Total items</span>
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
          <span>UGC items</span>
          <strong>{ugcCount}</strong>
        </div>
      </section>

      <section className="workspace">
        <aside className="article-list-panel">
          <div className="panel-head">
            <div>
              <h2>Portfolio items</h2>
              <p className="muted">Click an item to edit.</p>
            </div>
            <input
              className="search"
              type="search"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="article-list">
            {filteredItems.length === 0 ? (
              <div className="muted" style={{ padding: 18 }}>
                No matching items.
              </div>
            ) : (
              filteredItems.map((p) => (
                <div
                  key={p.id}
                  className={`article-item${p.id === currentId ? " active" : ""}`}
                  onClick={() => editItem(p.id)}
                >
                  <small>{p.platform || portfolioCategoryLabel(p.category)}</small>
                  <h3>{p.title}</h3>
                  <div className="meta">
                    <span>{p.published ? "Published" : "Draft"}</span>
                    <span>{portfolioCategoryLabel(p.category)}</span>
                    {p.subtype && <span>{portfolioSubtypeLabel(p.subtype)}</span>}
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
              <h2>Add your next work sample.</h2>
              <p>Start a new item or choose an existing one from the left.</p>
              <button className="button button-primary" onClick={newItem}>
                Add an item
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="editor-head">
                <div>
                  <p className="eyebrow">Portfolio editor</p>
                  <h2>{currentId ? "Edit item" : "New item"}</h2>
                </div>
                <div className="editor-head-actions">
                  {currentId && (
                    <button
                      type="button"
                      className="danger-btn"
                      onClick={deleteItem}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div className="editor-grid single">
                <div className="form-column">
                  <div className="field-row">
                    <label>
                      Title
                      <input
                        type="text"
                        placeholder="What this piece of work is"
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Platform
                      <input
                        type="text"
                        placeholder="YouTube"
                        value={form.platform}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, platform: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <div className="field-row three">
                    <label>
                      Category
                      <select
                        value={form.category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                      >
                        {PORTFOLIO_CATEGORIES.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.tabLabel}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Subtype
                      <select
                        value={form.subtype}
                        disabled={form.category !== "ugc"}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, subtype: e.target.value }))
                        }
                      >
                        <option value="">— None —</option>
                        {UGC_SUBTYPES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Sort order
                      <input
                        type="number"
                        value={form.sortOrder}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            sortOrder: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="field-row">
                    <label>
                      Link
                      <input
                        type="url"
                        required
                        placeholder="https://youtube.com/@channel/video"
                        value={form.url}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, url: e.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Date
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, date: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <label>
                    Description
                    <textarea
                      rows={3}
                      placeholder="Short description shown on the portfolio card."
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </label>
                  <div className="cover-upload">
                    <div>
                      <span className="field-label">Thumbnail</span>
                      <small>JPG, PNG or WEBP · max 6MB</small>
                    </div>
                    <div className="cover-actions">
                      <input
                        ref={thumbFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        onChange={selectThumbFile}
                      />
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => thumbFileRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading
                          ? "Uploading…"
                          : thumbFile
                            ? "Change image"
                            : "Choose image"}
                      </button>
                      <input
                        type="text"
                        placeholder="https://res.cloudinary.com/..."
                        value={form.thumbnail}
                        onChange={(e) => {
                          clearThumbFile();
                          setForm((f) => ({ ...f, thumbnail: e.target.value }));
                        }}
                      />
                    </div>
                    {thumbFile && (
                      <small className="muted">
                        Uploads when you save or publish.
                      </small>
                    )}
                    {(thumbPreview || form.thumbnail) && (
                      <div
                        className="cover-preview"
                        style={{
                          backgroundImage: `url(${JSON.stringify(thumbPreview || form.thumbnail)})`,
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="form-foot">
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
                      onClick={() => submitItem(false)}
                      disabled={uploading}
                    >
                      Save draft
                    </button>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => submitItem(true)}
                      disabled={uploading}
                    >
                      Publish item
                    </button>
                    <span
                      className="save-status"
                      style={saveError ? { color: "#ff9797" } : undefined}
                    >
                      {saveStatus}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>
      </section>
    </>
  );
}
