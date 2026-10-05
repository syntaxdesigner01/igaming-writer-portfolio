import { adminApi } from "@/lib/adminApi";

export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

export async function uploadImageFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
  const result = await adminApi<{ url: string }>("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  return result.url;
}
