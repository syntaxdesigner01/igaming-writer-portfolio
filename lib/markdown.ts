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

export function inlineMarkdown(value: string = ""): string {
  let s = escapeHtml(value);
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  );
  s = s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

export function markdownToHtml(md: string = ""): string {
  const lines = md.replace(/\r/g, "").split("\n");
  let html = "";
  let inUl = false;
  let inOl = false;
  const closeLists = () => {
    if (inUl) {
      html += "</ul>";
      inUl = false;
    }
    if (inOl) {
      html += "</ol>";
      inOl = false;
    }
  };
  for (const line of lines) {
    if (/^###\s+/.test(line)) {
      closeLists();
      html += `<h3>${inlineMarkdown(line.replace(/^###\s+/, ""))}</h3>`;
      continue;
    }
    if (/^##\s+/.test(line)) {
      closeLists();
      html += `<h2>${inlineMarkdown(line.replace(/^##\s+/, ""))}</h2>`;
      continue;
    }
    if (/^#\s+/.test(line)) {
      closeLists();
      html += `<h1>${inlineMarkdown(line.replace(/^#\s+/, ""))}</h1>`;
      continue;
    }
    if (/^>\s?/.test(line)) {
      closeLists();
      html += `<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ""))}</blockquote>`;
      continue;
    }
    if (/^-\s+/.test(line)) {
      if (!inUl) {
        closeLists();
        html += "<ul>";
        inUl = true;
      }
      html += `<li>${inlineMarkdown(line.replace(/^-\s+/, ""))}</li>`;
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (!inOl) {
        closeLists();
        html += "<ol>";
        inOl = true;
      }
      html += `<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`;
      continue;
    }
    if (!line.trim()) {
      closeLists();
      continue;
    }
    closeLists();
    html += `<p>${inlineMarkdown(line)}</p>`;
  }
  closeLists();
  return html;
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
