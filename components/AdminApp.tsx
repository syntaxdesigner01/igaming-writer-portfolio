"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import ArticlesPanel from "@/components/admin/ArticlesPanel";
import PortfolioPanel from "@/components/admin/PortfolioPanel";

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"articles" | "portfolio">("articles");

  useEffect(() => {
    adminApi<{ authenticated: boolean }>("/api/admin/me").then((me) =>
      setAuthenticated(me.authenticated)
    );
  }, []);

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
            Manage your <span>content.</span>
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
            <small>{tab === "articles" ? "Articles" : "Portfolio"}</small>
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
        <nav className="dash-tabs" role="tablist" aria-label="Content type">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "articles"}
            className={`dash-tab${tab === "articles" ? " active" : ""}`}
            onClick={() => setTab("articles")}
          >
            Articles
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "portfolio"}
            className={`dash-tab${tab === "portfolio" ? " active" : ""}`}
            onClick={() => setTab("portfolio")}
          >
            Portfolio
          </button>
        </nav>

        <div hidden={tab !== "articles"}>
          <ArticlesPanel />
        </div>
        <div hidden={tab !== "portfolio"}>
          <PortfolioPanel />
        </div>
      </main>
    </div>
  );
}
