import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAuthenticated } from "@/lib/auth";
import { toPublicArticle } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const wantsAdmin = req.nextUrl.searchParams.get("admin") === "1";
  const admin = wantsAdmin && (await isAuthenticated());

  const supabase = await createClient();
  let query = supabase.from("Article").select("*");
  if (!admin) query = query.eq("published", true);
  const { data: rows } = await query;
  const articles = rows ?? [];

  articles.sort(
    (a, b) =>
      new Date(b.date || b.updatedAt).getTime() -
      new Date(a.date || a.updatedAt).getTime()
  );

  const body = admin ? articles : articles.map((a) => toPublicArticle(a));

  return NextResponse.json(body);
}
