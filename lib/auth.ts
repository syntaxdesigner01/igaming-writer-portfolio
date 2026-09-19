import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "d1_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me-now";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  crypto
    .createHash("sha256")
    .update(`${ADMIN_PASSWORD}|d1-session`)
    .digest("hex");

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function checkPassword(password: string): boolean {
  return String(password || "") === ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const payload = base64url(
    JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })
  );
  return `${payload}.${sign(payload)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}
