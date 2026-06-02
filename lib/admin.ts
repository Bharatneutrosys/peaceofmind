import "server-only";

import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "travellers_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

function getAdminSecret() {
  return process.env.ADMIN_PASSCODE?.trim() || "";
}

export function getAdminSessionToken(passcode = getAdminSecret()) {
  if (!passcode) return "";

  return createHash("sha256")
    .update(`${passcode}:Traveller's Diary Admin`)
    .digest("hex");
}

function safeCompare(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;

  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const expected = getAdminSessionToken();

  if (!session || !expected) return false;

  return safeCompare(session, expected);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}
