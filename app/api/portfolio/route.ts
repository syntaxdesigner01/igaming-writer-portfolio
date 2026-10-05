import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAuthenticated } from "@/lib/auth";
import { toPublicPortfolioItem } from "@/lib/types";
import { sortPortfolioItems } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const wantsAdmin = req.nextUrl.searchParams.get("admin") === "1";
  const admin = wantsAdmin && (await isAuthenticated());

  const supabase = await createClient();
  let query = supabase.from("PortfolioItem").select("*");
  if (!admin) query = query.eq("published", true);
  const { data: rows } = await query;
  const items = sortPortfolioItems(rows ?? []);

  const body = admin ? items : items.map(toPublicPortfolioItem);

  return NextResponse.json(body);
}
