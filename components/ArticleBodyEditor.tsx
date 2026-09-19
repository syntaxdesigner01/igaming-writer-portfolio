"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Markdown } from "tiptap-markdown";

declare module "@tiptap/core" {
  interface Storage {
    markdown: {
      getMarkdown(): string;
    };
  }
}

export type ArticleBodyEditorHandle = {
  setMarkdown: (markdown: string) => void;
};

type Props = {
  content: string;
  onChange: (markdown: string) => void;
};

const ArticleBodyEditor = forwardRef<ArticleBodyEditorHandle, Props>(
  function ArticleBodyEditor({ content, onChange }, ref) {
    const lastEmitted = useRef(content);
    const [, forceRender] = useState(0);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          link: {
            openOnClick: false,
            HTMLAttributes: { rel: "noopener", target: "_blank" },
          },
        }),
        Table.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell,
        Markdown.configure({
          html: false,
          tightLists: true,
          bulletListMarker: "-",
          linkify: false,
        }),
      ],
      content,
      editorProps: {
        attributes: { class: "content-editor content-editor-tiptap" },
      },
      onUpdate: ({ editor }) => {
        const markdown = editor.storage.markdown.getMarkdown();
        lastEmitted.current = markdown;
        onChange(markdown);
      },
      onTransaction: () => forceRender((n) => n + 1),
    });

    useImperativeHandle(ref, () => ({
      setMarkdown(markdown: string) {
        editor?.commands.setContent(markdown);
      },
    }));

    useEffect(() => {
      if (!editor) return;
      if (content !== lastEmitted.current) {
        lastEmitted.current = content;
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    if (!editor) return null;

    const setLink = () => {
      const previous = editor.getAttributes("link").href as string | undefined;
      const url = window.prompt("Link URL", previous || "https://");
      if (url === null) return;
      if (!url.trim()) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    };

    const btn = (
      label: string,
      isActive: boolean,
      onClick: () => void,
      title: string
    ) => (
      <button
        type="button"
        title={title}
        className={`ghost-btn small editor-toolbar-btn${isActive ? " active" : ""}`}
        onClick={onClick}
      >
        {label}
      </button>
    );

    return (
      <div className="tiptap-editor">
        <div className="editor-toolbar">
          {btn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "Bold")}
          {btn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "Italic")}
          {btn("H1", editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), "Heading 1")}
          {btn("H2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "Heading 2")}
          {btn("H3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "Heading 3")}
          {btn("•", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "Bullet list")}
          {btn("1.", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "Numbered list")}
          {btn("❝", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), "Blockquote")}
          {btn("</>", editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), "Code block")}
          {btn("🔗", editor.isActive("link"), setLink, "Link")}
          {btn(
            "Table",
            editor.isActive("table"),
            () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            "Insert table"
          )}
        </div>
        <EditorContent editor={editor} />
      </div>
    );
  }
);

export default ArticleBodyEditor;
