import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "prism_admin";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sign(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not set");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionCookieValue() {
  const expires = String(Date.now() + SESSION_TTL_MS);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const [expires, sig] = value.split(".");
  if (!expires || !sig) return false;
  if (Date.now() > Number(expires)) return false;
  const expected = sign(expires);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(submitted: string): boolean {
  const actual = process.env.ADMIN_PASSWORD;
  if (!actual) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(actual);
  return a.length === b.length && timingSafeEqual(a, b);
}
