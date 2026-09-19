import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { dataUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const dataUrl = String(body.dataUrl || "");
  const match = dataUrl.match(
    /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/
  );
  if (!match) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG or WEBP image." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than 6MB." },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "igaming_blog",
    });
    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}
