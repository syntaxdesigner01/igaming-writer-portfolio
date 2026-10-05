import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("PortfolioItem")
    .select("id")
    .eq("id", decodeURIComponent(id))
    .maybeSingle();
  if (!item) {
    return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
  }

  await supabase.from("PortfolioItem").delete().eq("id", item.id);
  return NextResponse.json({ ok: true });
}
