import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const now = new Date();
    const currentId = (body.id as string) || null;
    const { data: existing } = currentId
      ? await supabase.from("Article").select("*").eq("id", currentId).maybeSingle()
      : { data: null };

    let slug = slugify((body.slug as string) || (body.title as string));
    const { data: slugOwner } = await supabase
      .from("Article")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (slugOwner && slugOwner.id !== currentId) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const data = {
      slug,
      title: String(body.title || "Untitled article").trim(),
      category: String(body.category || "casino").trim().toLowerCase(),
      label: String(body.label || body.category || "IGAMING")
        .trim()
        .toUpperCase(),
      excerpt: String(body.excerpt || "").trim(),
      date: String(body.date || now.toISOString().slice(0, 10)),
      read: String(body.read || "5 min read").trim(),
      featured: !!body.featured,
      published: !!body.published,
      coverImage: String(body.coverImage || "").trim(),
      tags: String(body.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      content: String(body.content || "").trim(),
      isSample: existing?.isSample || false,
    };

    const { data: article, error } = existing
      ? await supabase.from("Article").update(data).eq("id", existing.id).select().single()
      : await supabase.from("Article").insert(data).select().single();

    if (error || !article) {
      throw new Error(error?.message || "Failed to save article");
    }

    return NextResponse.json({ ok: true, article });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Request failed" },
      { status: 400 }
    );
  }
}
