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

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readNumberOrNull(formData: FormData, key: string) {
  const value = readOptionalString(formData, key);
  if (!value) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function slugField(rawSlug: string, title: string) {
  const current = slugify(rawSlug || title);
  return current ? { _type: "slug", current } : null;
}

function referenceField(id: string) {
  return id ? { _type: "reference", _ref: id } : null;
}

function isoDateTime(raw: string) {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function readYoutubeUrl(formData: FormData, key: string) {
  const value = readOptionalString(formData, key);
  if (!value) return { value: "", error: null };

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const allowed =
      (host === "youtube.com" && url.pathname === "/watch" && url.searchParams.has("v")) ||
      (host === "youtube.com" && url.pathname.startsWith("/embed/")) ||
      host === "youtu.be";

    if (!allowed) {
      return {
        value: "",
        error: "Use a YouTube watch, embed, or youtu.be link.",
      };
    }

    return { value, error: null };
  } catch {
    return { value: "", error: "Use a valid YouTube link." };
  }
}

function portableTextFromPlainText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: "block",
      _key: `body-${Date.now()}-${index}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `span-${Date.now()}-${index}`,
          text: paragraph,
          marks: [],
        },
      ],
    }));
}

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/videos");
  revalidatePath("/journal");
  revalidatePath("/destinations");
  revalidatePath("/gallery");
}

async function requireWriteClient() {
  if (!(await isAdminAuthenticated())) {
    return {
      error: "Your admin session expired. Please sign in again.",
      client: null,
    };
  }

  try {
    return { error: null, client: getWriteClient() };
  } catch {
    return {
      error: "Sanity write access is not configured yet.",
      client: null,
    };
  }
}

async function upsertDocument(
  type: string,
  formData: FormData,
  body: Record<string, unknown>,
) {
  const { error, client } = await requireWriteClient();

  if (error || !client) {
    return { error, message: null };
  }

  const documentId = readOptionalString(formData, "_id");

  if (documentId) {
    await client.patch(documentId).set(body).commit({ autoGenerateArrayKeys: true });
  } else {
    await client.create({
      _type: type,
      ...body,
    });
  }

  revalidatePublicPages();

  return {
    ...SUCCESS,
    message: "Saved. The public site will update after revalidation or refresh.",
  };
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

  const settingsDocumentId = current?._id || "siteSettings";

  if (!current?._id) {
    await client.createIfNotExists({
      _id: "siteSettings",
      _type: "siteSettings",
      ...set,
    });
  }

  const patch = client.patch(settingsDocumentId).set(set);

  if (unset.length > 0) {
    patch.unset(unset);
  }

  await patch.commit({ autoGenerateArrayKeys: true });

  revalidatePublicPages();

  return {
    ...SUCCESS,
    message: "Site settings saved. The public site will update after revalidation or refresh.",
  };
}

export async function saveCategoryAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const title = readOptionalString(formData, "title");
  if (!title) return { error: "Category title is required.", message: null };

  const slug = slugField(readOptionalString(formData, "slug"), title);
  if (!slug) return { error: "Category slug is required.", message: null };

  const order = readNumberOrNull(formData, "order");

  return upsertDocument("category", formData, {
    title,
    slug,
    description: readOptionalString(formData, "description"),
    regionLabel: readOptionalString(formData, "regionLabel"),
    featured: readBoolean(formData, "featured"),
    ...(order === null ? {} : { order }),
  });
}

export async function saveDestinationAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const title = readOptionalString(formData, "title");
  if (!title) return { error: "Destination title is required.", message: null };

  const slug = slugField(readOptionalString(formData, "slug"), title);
  if (!slug) return { error: "Destination slug is required.", message: null };

  const category = referenceField(readOptionalString(formData, "categoryId"));
  const order = readNumberOrNull(formData, "order");

  return upsertDocument("destination", formData, {
    title,
    slug,
    country: readOptionalString(formData, "country"),
    shortIntro: readOptionalString(formData, "shortIntro"),
    description: readOptionalString(formData, "description"),
    featured: readBoolean(formData, "featured"),
    ...(category ? { category } : {}),
    ...(order === null ? {} : { order }),
  });
}

export async function saveEssayAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const title = readOptionalString(formData, "title");
  if (!title) return { error: "Journal story title is required.", message: null };

  const destination = referenceField(readOptionalString(formData, "destinationId"));
  if (!destination) {
    return { error: "Choose a destination before saving this story.", message: null };
  }

  const slug = slugField(readOptionalString(formData, "slug"), title);
  if (!slug) return { error: "Journal story slug is required.", message: null };

  const publishedAt = isoDateTime(readOptionalString(formData, "publishedAt"));
  const category = referenceField(readOptionalString(formData, "categoryId"));
  const bodyText = readOptionalString(formData, "bodyText");

  return upsertDocument("essay", formData, {
    title,
    slug,
    excerpt: readOptionalString(formData, "excerpt"),
    destination,
    ...(category ? { category } : {}),
    publishedAt,
    date: publishedAt || new Date().toISOString(),
    featured: readBoolean(formData, "featured"),
    estimatedReadTime: readOptionalString(formData, "estimatedReadTime"),
    body: portableTextFromPlainText(bodyText),
  });
}

export async function savePhotoJournalAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const title = readOptionalString(formData, "title");
  if (!title) return { error: "Photo journal title is required.", message: null };

  const destination = referenceField(readOptionalString(formData, "destinationId"));
  if (!destination) {
    return { error: "Choose a destination before saving this photo journal.", message: null };
  }

  const slug = slugField(readOptionalString(formData, "slug"), title);
  const category = referenceField(readOptionalString(formData, "categoryId"));

  return upsertDocument("photoJournal", formData, {
    title,
    ...(slug ? { slug } : {}),
    excerpt: readOptionalString(formData, "excerpt"),
    destination,
    ...(category ? { category } : {}),
    publishedAt: isoDateTime(readOptionalString(formData, "publishedAt")),
    featured: readBoolean(formData, "featured"),
  });
}

export async function saveVideoAction(
  _prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const title = readOptionalString(formData, "title");
  if (!title) return { error: "Video title is required.", message: null };

  const youtube = readYoutubeUrl(formData, "youtubeUrl");
  if (youtube.error) return { error: youtube.error, message: null };

  const slug = slugField(readOptionalString(formData, "slug"), title);
  if (!slug) return { error: "Video slug is required.", message: null };

  const destination = referenceField(readOptionalString(formData, "destinationId"));
  const category = referenceField(readOptionalString(formData, "categoryId"));

  return upsertDocument("video", formData, {
    title,
    slug,
    description: readOptionalString(formData, "description"),
    youtubeUrl: youtube.value,
    publishedAt: isoDateTime(readOptionalString(formData, "publishedAt")),
    featured: readBoolean(formData, "featured"),
    ...(destination ? { destination } : {}),
    ...(category ? { category } : {}),
  });
}
