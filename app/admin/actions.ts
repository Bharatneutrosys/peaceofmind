"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getSiteSettingsQuery } from "@/sanity/lib/queries";
import { adminReadClient } from "@/sanity/lib/adminReadClient";
import { getWriteClient } from "@/sanity/lib/writeClient";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  getAdminSessionToken,
  isAdminAuthenticated,
} from "@/lib/admin";

export type AdminState = {
  error?: string | null;
  message?: string | null;
};

const SUCCESS: AdminState = { error: null, message: null };

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") return "";

  return value.trim();
}

export async function loginAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const passcode = readOptionalString(formData, "passcode");
  const expected = process.env.ADMIN_PASSCODE?.trim();

  if (!expected) {
    return {
      error: "Admin passcode is not configured yet.",
      message: null,
    };
  }

  if (!passcode || passcode !== expected) {
    return { error: "That passcode is not correct.", message: null };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, getAdminSessionToken(expected), getAdminCookieOptions());

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}

export async function saveSiteSettingsAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Your admin session expired. Please sign in again.", message: null };
  }

  const brandName = readOptionalString(formData, "brandName") || "Traveller's Diary";

  const editableFields = [
    "tagline",
    "shortDescription",
    "heroHeadline",
    "heroSubheading",
    "facebookUrl",
    "instagramUrl",
    "youtubeUrl",
    "authorDisplayName",
    "authorBio",
    "youtubeFeatureTitle",
    "youtubeFeatureDescription",
    "youtubeFeatureUrl",
  ] as const;

  const set: Record<string, string> = {
    brandName,
  };
  const unset: string[] = [];

  for (const field of editableFields) {
    const value = readOptionalString(formData, field);

    if (value) {
      set[field] = value;
    } else {
      unset.push(field);
    }
  }

  let client: ReturnType<typeof getWriteClient>;

  try {
    client = getWriteClient();
  } catch {
    return {
      error: "Sanity write access is not configured yet.",
      message: null,
    };
  }

  const current = await adminReadClient
    .fetch<{ _id?: string } | null>(getSiteSettingsQuery)
    .catch(() => null);

  if (!current?._id) {
    await client.createIfNotExists({
      _id: "siteSettings",
      _type: "siteSettings",
      ...set,
    });
  }

  const patch = client.patch("siteSettings").set(set);

  if (unset.length > 0) {
    patch.unset(unset);
  }

  await patch.commit({ autoGenerateArrayKeys: true });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/videos");
  revalidatePath("/journal");
  revalidatePath("/destinations");
  revalidatePath("/gallery");

  return {
    ...SUCCESS,
    message: "Site settings saved. The public site will update after revalidation or refresh.",
  };
}
