import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAuthenticated } from "@/lib/auth";
import { isValidExternalUrl, normalizePortfolioCategory, normalizePortfolioSubtype } from "@/lib/portfolio";

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
    const currentId = (body.id as string) || null;
    const { data: existing } = currentId
      ? await supabase.from("PortfolioItem").select("*").eq("id", currentId).maybeSingle()
      : { data: null };

    const url = String(body.url || "").trim();
    if (!isValidExternalUrl(url)) {
      return NextResponse.json(
        { error: "Please add a valid link starting with http:// or https://" },
        { status: 400 }
      );
    }

    const category = normalizePortfolioCategory(body.category);
    const sortOrderNum = Number(body.sortOrder);

    const data = {
      title: String(body.title || "Untitled item").trim(),
      category,
      subtype: normalizePortfolioSubtype(body.subtype, category),
      description: String(body.description || "").trim(),
      thumbnail: String(body.thumbnail || "").trim(),
      url,
      platform: String(body.platform || "").trim(),
      published: !!body.published,
      sortOrder: Number.isFinite(sortOrderNum) ? Math.trunc(sortOrderNum) : 0,
      date: String(body.date || "").slice(0, 10),
    };

    const { data: item, error } = existing
      ? await supabase.from("PortfolioItem").update(data).eq("id", existing.id).select().single()
      : await supabase.from("PortfolioItem").insert(data).select().single();

    if (error || !item) {
      throw new Error(error?.message || "Failed to save portfolio item");
    }

    return NextResponse.json({ ok: true, item });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Request failed" },
      { status: 400 }
    );
  }
}
