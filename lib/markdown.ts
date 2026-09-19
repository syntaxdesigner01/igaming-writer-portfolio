import { marked } from "marked";

export function escapeHtml(value: string = ""): string {
  return String(value).replace(
    /[&<>'"]/g,
    (ch) =>
      (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        } as Record<string, string>
      )[ch]
  );
}

marked.use({
  renderer: {
    link({ href, title, tokens }) {
      const body = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener">${body}</a>`;
    },
    table(token) {
      const headerHtml = token.header
        .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
        .join("");
      const bodyHtml = token.rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`)
              .join("")}</tr>`
        )
        .join("");
      return `<div class="table-scroll"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
    },
  },
});

export function markdownToHtml(md: string = ""): string {
  return marked.parse(md, { async: false }) as string;
}

export function formatDate(date: string | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
