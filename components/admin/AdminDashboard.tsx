"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Home,
  ImagePlus,
  LogOut,
  PencilLine,
  Plus,
} from "lucide-react";

import {
  archiveDocumentAction,
  logoutAction,
  removeGalleryImageAction,
  saveCategoryAction,
  saveDestinationAction,
  saveEssayAction,
  savePhotoJournalAction,
  saveSiteSettingsAction,
  saveVideoAction,
  type AdminState,
} from "@/app/admin/actions";

type SiteSettings = {
  brandName?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  heroHeadline?: string | null;
  heroSubheading?: string | null;
  heroQuote?: string | null;
  heroIntroShort?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  authorDisplayName?: string | null;
  authorBio?: string | null;
  authorImageZoom?: number | null;
  authorImagePositionX?: number | null;
  authorImagePositionY?: number | null;
  youtubeFeatureTitle?: string | null;
  youtubeFeatureDescription?: string | null;
  youtubeFeatureUrl?: string | null;
  heroImageUrl?: string | null;
  heroAuthorImageUrl?: string | null;
  authorImageUrl?: string | null;
};

type CategoryRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  regionLabel?: string | null;
  featured?: boolean | null;
  order?: number | null;
  coverImageUrl?: string | null;
  isArchived?: boolean | null;
};

type DestinationRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  country?: string | null;
  shortIntro?: string | null;
  description?: string | null;
  featured?: boolean | null;
  order?: number | null;
  categoryId?: string | null;
  parentDestinationId?: string | null;
  coverImageUrl?: string | null;
  isArchived?: boolean | null;
};

type EssayRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  destinationId?: string | null;
  categoryId?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  estimatedReadTime?: string | null;
  bodyText?: string | null;
  coverImageUrl?: string | null;
  isArchived?: boolean | null;
};

type GalleryImageRecord = {
  _key?: string;
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
};

type PhotoJournalRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  destinationId?: string | null;
  categoryId?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  coverImageUrl?: string | null;
  gallery?: GalleryImageRecord[] | null;
  isArchived?: boolean | null;
};

type VideoRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  youtubeUrl?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  destinationId?: string | null;
  categoryId?: string | null;
  thumbnailUrl?: string | null;
  isArchived?: boolean | null;
};

type Action = (state: AdminState, formData: FormData) => Promise<AdminState>;

const initialState: AdminState = { error: null, message: null };

const tabs = [
  "Website Settings",
  "Hero",
  "Social Links",
  "About the Traveler",
  "Categories",
  "Destinations",
  "Journal Stories",
  "Photo Journals",
  "Videos",
];

const adminCards = [
  {
    title: "Website Settings",
    href: "/admin/settings",
    description: "Website name, tagline, and short homepage description.",
  },
  {
    title: "Hero Section",
    href: "/admin/hero",
    description: "Homepage headline, hero image, quote, and hero author card.",
  },
  {
    title: "Author Profile",
    href: "/admin/author",
    description: "Traveler bio and profile image crop.",
  },
  {
    title: "Social Links",
    href: "/admin/social",
    description: "Facebook, Instagram, and YouTube links.",
  },
  {
    title: "Categories",
    href: "/admin/categories",
    description: "Travel regions such as Nepal, South Asia, and Europe.",
  },
  {
    title: "Destinations",
    href: "/admin/destinations",
    description: "Places, parent places, child locations, and cover images.",
  },
  {
    title: "Journal Stories",
    href: "/admin/journal",
    description: "Create, edit, preview, or remove travel stories.",
  },
  {
    title: "Photo Journals",
    href: "/admin/photo-journals",
    description: "Photo journals, gallery uploads, and image removal.",
  },
  {
    title: "Videos",
    href: "/admin/videos",
    description: "YouTube videos, thumbnails, and featured video entries.",
  },
];

type AdminView =
  | "settings"
  | "hero"
  | "author"
  | "social"
  | "categories"
  | "destinations"
  | "journal"
  | "photo-journals"
  | "videos";

function sectionForView(view?: AdminView) {
  return {
    settings: "website-settings",
    hero: "hero",
    author: "about-the-traveler",
    social: "social-links",
    categories: "categories",
    destinations: "destinations",
    journal: "journal-stories",
    "photo-journals": "photo-journals",
    videos: "videos",
  }[view || "settings"];
}

function routeForSection(tab: string) {
  return (
    {
      "Website Settings": "settings",
      Hero: "hero",
      "Social Links": "social",
      "About the Traveler": "author",
      Categories: "categories",
      Destinations: "destinations",
      "Journal Stories": "journal",
      "Photo Journals": "photo-journals",
      Videos: "videos",
    }[tab] || "settings"
  );
}

export default function AdminDashboard({
  initialSettings,
  brandName,
  categories,
  destinations,
  essays,
  photoJournals,
  videos,
  view,
}: {
  initialSettings?: SiteSettings | null;
  brandName: string;
  categories: CategoryRecord[];
  destinations: DestinationRecord[];
  essays: EssayRecord[];
  photoJournals: PhotoJournalRecord[];
  videos: VideoRecord[];
  view?: AdminView;
}) {
  const settings = initialSettings || {};
  const activeSection = view ? sectionForView(view) : null;
  const showSection = (id: string) => !activeSection || activeSection === id;

  return (
    <main className="admin-panel min-h-screen bg-[#f7f2ea] px-4 pb-12 pt-6 text-stone-900 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
              Traveller&apos;s Diary Admin
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-stone-950 sm:mt-4 sm:text-4xl md:text-6xl">
              Simple website editing.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Update the website text, links, destinations, stories, photo journals,
              and videos from one owner-friendly panel.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 lg:w-auto">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 shadow-sm transition-colors duration-300 hover:bg-stone-50 sm:flex-none"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 shadow-sm transition-colors duration-300 hover:bg-stone-50 sm:flex-none"
            >
              <ExternalLink className="h-4 w-4" />
              Preview Website
            </Link>
            <form action={logoutAction} className="flex-1 sm:flex-none">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-stone-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>

        {!view ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {adminCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-[1.35rem] border border-stone-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-stone-300 sm:rounded-[1.5rem] sm:p-6"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                  Edit
                </p>
                <h2 className="mt-4 font-serif text-2xl text-stone-950 sm:text-3xl">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {card.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-stone-950">
                  Open section
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
            <Link
              href="/admin"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-600 shadow-sm transition-colors hover:bg-stone-50"
            >
              Admin Dashboard
            </Link>
            {tabs.map((tab) => (
              <Link
                key={tab}
                href={`/admin/${routeForSection(tab)}`}
                className="shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-600 shadow-sm transition-colors hover:bg-stone-50"
              >
                {tab}
              </Link>
            ))}
          </nav>
        )}

        {view ? <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
          {showSection("website-settings") ? (
          <AdminSection
            title="Website Settings"
            description="Editing: Homepage Settings. Current website values are pre-filled below."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save Changes">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Website Name" name="brandName" defaultValue={settings.brandName || brandName} required />
                <Field label="Tagline" name="tagline" defaultValue={settings.tagline || ""} />
                <TextAreaField
                  label="Short Description"
                  name="shortDescription"
                  defaultValue={settings.shortDescription || ""}
                  className="md:col-span-2"
                  helpText="Keep this to one or two simple sentences."
                />
                <Field
                  label="Hero Headline"
                  name="heroHeadline"
                  defaultValue={settings.heroHeadline || ""}
                  helpText="This is also available in the Hero section."
                />
                <TextAreaField
                  label="Hero Description"
                  name="heroSubheading"
                  defaultValue={settings.heroSubheading || ""}
                  className="md:col-span-2"
                />
                <TextAreaField
                  label="Hero Quote"
                  name="heroQuote"
                  defaultValue={settings.heroQuote || ""}
                  className="md:col-span-2"
                  helpText="A short personal line for the hero author card."
                />
                <TextAreaField
                  label="Hero Short Intro"
                  name="heroIntroShort"
                  defaultValue={settings.heroIntroShort || ""}
                  className="md:col-span-2"
                  helpText="A simple one-sentence intro for the hero author card."
                />
                <Field label="Facebook URL" name="facebookUrl" defaultValue={settings.facebookUrl || ""} />
                <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl || ""} />
                <Field label="YouTube URL" name="youtubeUrl" defaultValue={settings.youtubeUrl || ""} />
                <Field label="Author Display Name" name="authorDisplayName" defaultValue={settings.authorDisplayName || ""} />
                <TextAreaField
                  label="Author Bio"
                  name="authorBio"
                  defaultValue={settings.authorBio || ""}
                  className="md:col-span-2"
                />
                <Field label="YouTube Feature Title" name="youtubeFeatureTitle" defaultValue={settings.youtubeFeatureTitle || ""} />
                <Field label="YouTube Feature URL" name="youtubeFeatureUrl" defaultValue={settings.youtubeFeatureUrl || ""} />
                <TextAreaField
                  label="YouTube Feature Description"
                  name="youtubeFeatureDescription"
                  defaultValue={settings.youtubeFeatureDescription || ""}
                  className="md:col-span-2"
                />
              </div>
            </ActionForm>
          </AdminSection>
          ) : null}

          {showSection("hero") ? (
          <AdminSection
            title="Hero"
            description="The first headline and description visitors see on the homepage."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save Changes">
              <div className="grid gap-5">
                <HiddenSettings settings={settings} brandName={brandName} except={["heroHeadline", "heroSubheading", "heroQuote", "heroIntroShort"]} />
                <Field
                  label="Hero Heading"
                  name="heroHeadline"
                  defaultValue={settings.heroHeadline || ""}
                  required
                  helpText="Keep hero text short so the mountain image stays visible."
                />
                <TextAreaField
                  label="Hero Description"
                  name="heroSubheading"
                  defaultValue={settings.heroSubheading || ""}
                  helpText="One short sentence works best."
                />
                <ImageUploadField
                  label="Hero Image"
                  name="heroImage"
                  currentUrl={settings.heroImageUrl}
                  helpText="Edit only the fields you want to change. Existing values and image will remain if left unchanged. Recommended hero image: wide panorama, 2400px+ width."
                />
                <TextAreaField
                  label="Hero Quote"
                  name="heroQuote"
                  defaultValue={settings.heroQuote || ""}
                  helpText="Keep it warm and short. Example: We travel far to look for joy, and often return home to find it waiting."
                />
                <TextAreaField
                  label="Hero Author Intro"
                  name="heroIntroShort"
                  defaultValue={settings.heroIntroShort || ""}
                  helpText="One short sentence about the traveler."
                />
                <ImageUploadField
                  label="Hero Author Image"
                  name="heroAuthorImage"
                  currentUrl={settings.heroAuthorImageUrl}
                  helpText="Use a clear portrait or travel profile image for the hero card."
                />
              </div>
            </ActionForm>
          </AdminSection>
          ) : null}

          {showSection("social-links") ? (
          <AdminSection
            title="Social Links"
            description="Leave a link empty to hide it gracefully on the public site."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save Changes">
              <div className="grid gap-5 md:grid-cols-3">
                <HiddenSettings settings={settings} brandName={brandName} except={["facebookUrl", "instagramUrl", "youtubeUrl"]} />
                <Field label="Facebook URL" name="facebookUrl" defaultValue={settings.facebookUrl || ""} />
                <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl || ""} />
                <Field label="YouTube URL" name="youtubeUrl" defaultValue={settings.youtubeUrl || ""} />
              </div>
            </ActionForm>
          </AdminSection>
          ) : null}

          {showSection("about-the-traveler") ? (
          <AdminSection
            title="About the Traveler"
            description="The traveler name and short profile used on the About page and homepage profile section."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save Changes">
              <div className="grid gap-5 md:grid-cols-2">
                <HiddenSettings settings={settings} brandName={brandName} except={["authorDisplayName", "authorBio"]} />
                <Field label="Display Name" name="authorDisplayName" defaultValue={settings.authorDisplayName || ""} />
                <TextAreaField
                  label="About/Bio Text"
                  name="authorBio"
                  defaultValue={settings.authorBio || ""}
                  className="md:col-span-2"
                  helpText="Write simply and naturally, like a short introduction."
                />
                <div className="md:col-span-2">
                  <ProfileImageCropper
                    currentUrl={settings.authorImageUrl}
                    zoom={settings.authorImageZoom}
                    positionX={settings.authorImagePositionX}
                    positionY={settings.authorImagePositionY}
                  />
                </div>
              </div>
            </ActionForm>
          </AdminSection>
          ) : null}

          {showSection("categories") ? (
          <AdminSection
            title="Categories"
            description="Create and update the travel groupings shown across the site. Delete is skipped for now to avoid removing content that may be in use."
          >
            <CategoryForm title="Add New Category" />
            <RecordList emptyText="No categories yet.">
              {categories.map((category) => (
                <CategoryForm key={category._id} title={`Editing: ${category.title || "Untitled Category"}`} category={category} />
              ))}
            </RecordList>
          </AdminSection>
          ) : null}

          {showSection("destinations") ? (
          <AdminSection
            title="Destinations"
            description="Create and update the places connected to stories, photos, and videos."
          >
            <DestinationForm title="Add New Destination" categories={categories} destinations={destinations} />
            <RecordList emptyText="No destinations yet.">
              {destinations.map((destination) => (
                <DestinationForm
                  key={destination._id}
                  title={`Editing: ${destination.title || "Untitled Destination"}`}
                  destination={destination}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>
          ) : null}

          {showSection("journal-stories") ? (
          <AdminSection
            title="Journal Stories"
            description="Write basic story text without raw JSON. Body text is saved as simple readable paragraphs."
          >
            <EssayForm title="Add New Journal Story" categories={categories} destinations={destinations} />
            <RecordList emptyText="No journal stories yet.">
              {essays.map((essay) => (
                <EssayForm
                  key={essay._id}
                  title={`Editing: ${essay.title || "Untitled Journal Story"}`}
                  essay={essay}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>
          ) : null}

          {showSection("photo-journals") ? (
          <AdminSection
            title="Photo Journals"
            description="Create photo journal records and upload gallery images for the public gallery."
          >
            <PhotoJournalForm title="Add New Photo Journal" categories={categories} destinations={destinations} />
            <RecordList emptyText="No photo journals yet.">
              {photoJournals.map((journal) => (
                <PhotoJournalForm
                  key={journal._id}
                  title={`Editing: ${journal.title || "Untitled Photo Journal"}`}
                  journal={journal}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>
          ) : null}

          {showSection("videos") ? (
          <AdminSection
            title="Videos"
            description="Add YouTube watch, embed, or youtu.be links. No YouTube API connection is needed."
          >
            <VideoForm title="Add New Video" categories={categories} destinations={destinations} />
            <RecordList emptyText="No videos yet.">
              {videos.map((video) => (
                <VideoForm
                  key={video._id}
                  title={`Editing: ${video.title || "Untitled Video"}`}
                  video={video}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>
          ) : null}

        </div> : null}
      </div>
    </main>
  );
}

function CategoryForm({ title, category }: { title: string; category?: CategoryRecord }) {
  return (
    <>
    <ContentForm title={title} action={saveCategoryAction}>
      <HiddenId id={category?._id} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={category?.title || ""} required />
        <Field label="Slug" name="slug" defaultValue={category?.slug || ""} />
        <TextAreaField label="Description" name="description" defaultValue={category?.description || ""} className="md:col-span-2" />
        <Field label="Region Label" name="regionLabel" defaultValue={category?.regionLabel || ""} />
        <Field label="Display Order" name="order" type="number" defaultValue={numberValue(category?.order)} />
        <CheckboxField label="Featured" name="featured" defaultChecked={Boolean(category?.featured)} />
        <div className="md:col-span-2">
          <ImageUploadField
            label="Cover Image"
            name="coverImage"
            currentUrl={category?.coverImageUrl}
            helpText="Recommended cover image: 1600px+ width. Use a real travel photo owned by the creator."
          />
        </div>
      </div>
    </ContentForm>
    {category?._id ? (
      <ItemActions
        id={category._id}
        type="category"
        label={category.title || "this category"}
        previewHref={`/destinations${category.slug ? `?category=${category.slug}` : ""}`}
      />
    ) : null}
    </>
  );
}

function DestinationForm({
  title,
  destination,
  categories,
  destinations,
}: {
  title: string;
  destination?: DestinationRecord;
  categories: CategoryRecord[];
  destinations: DestinationRecord[];
}) {
  const parentOptions = destinations.filter((item) => item._id !== destination?._id);

  return (
    <>
    <ContentForm title={title} action={saveDestinationAction}>
      <HiddenId id={destination?._id} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Place Name" name="title" defaultValue={destination?.title || ""} required />
        <Field label="Slug" name="slug" defaultValue={destination?.slug || ""} />
        <Field label="Country" name="country" defaultValue={destination?.country || ""} />
        <SelectField label="Travel Region" name="categoryId" value={destination?.categoryId || ""} options={categories} />
        <SelectField label="Parent Place" name="parentDestinationId" value={destination?.parentDestinationId || ""} options={parentOptions} />
        <TextAreaField label="Short Introduction" name="shortIntro" defaultValue={destination?.shortIntro || ""} />
        <TextAreaField label="Description" name="description" defaultValue={destination?.description || ""} />
        <Field label="Display Order" name="order" type="number" defaultValue={numberValue(destination?.order)} />
        <CheckboxField label="Featured" name="featured" defaultChecked={Boolean(destination?.featured)} />
        <div className="md:col-span-2">
          <ImageUploadField
            label="Cover Image"
            name="coverImage"
            currentUrl={destination?.coverImageUrl}
            helpText="Recommended cover image: 1600px+ width. Use clear destination photos."
          />
        </div>
      </div>
    </ContentForm>
    {destination?._id ? (
      <ItemActions
        id={destination._id}
        type="destination"
        label={destination.title || "this destination"}
        previewHref={destination.slug ? `/destinations/${destination.slug}` : "/destinations"}
      />
    ) : null}
    </>
  );
}

function EssayForm({
  title,
  essay,
  categories,
  destinations,
}: {
  title: string;
  essay?: EssayRecord;
  categories: CategoryRecord[];
  destinations: DestinationRecord[];
}) {
  return (
    <>
    <ContentForm title={title} action={saveEssayAction}>
      <HiddenId id={essay?._id} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={essay?.title || ""} required />
        <Field label="Slug" name="slug" defaultValue={essay?.slug || ""} />
        <SelectField label="Destination" name="destinationId" value={essay?.destinationId || ""} options={destinations} required />
        <SelectField label="Category" name="categoryId" value={essay?.categoryId || ""} options={categories} />
        <Field label="Publish Date" name="publishedAt" type="datetime-local" defaultValue={dateValue(essay?.publishedAt)} />
        <Field label="Estimated Read Time" name="estimatedReadTime" defaultValue={essay?.estimatedReadTime || ""} />
        <TextAreaField label="Short Introduction" name="excerpt" defaultValue={essay?.excerpt || ""} className="md:col-span-2" />
        <TextAreaField
          label="Story Body"
          name="bodyText"
          defaultValue={essay?.bodyText || ""}
          className="md:col-span-2"
          rows={8}
          helpText="Write naturally. Short paragraphs are easier to read."
        />
        <CheckboxField label="Featured" name="featured" defaultChecked={Boolean(essay?.featured)} />
        <div className="md:col-span-2">
          <ImageUploadField
            label="Cover Image"
            name="coverImage"
            currentUrl={essay?.coverImageUrl}
            helpText="Recommended story cover: 1600px+ width. The story title is used as fallback alt text."
          />
        </div>
      </div>
    </ContentForm>
    {essay?._id ? (
      <ItemActions
        id={essay._id}
        type="essay"
        label={essay.title || "this story"}
        previewHref={essay.slug ? `/journal/${essay.slug}` : "/journal"}
      />
    ) : null}
    </>
  );
}

function PhotoJournalForm({
  title,
  journal,
  categories,
  destinations,
}: {
  title: string;
  journal?: PhotoJournalRecord;
  categories: CategoryRecord[];
  destinations: DestinationRecord[];
}) {
  return (
    <>
    <ContentForm title={title} action={savePhotoJournalAction}>
      <HiddenId id={journal?._id} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={journal?.title || ""} required />
        <Field label="Slug" name="slug" defaultValue={journal?.slug || ""} />
        <SelectField label="Destination" name="destinationId" value={journal?.destinationId || ""} options={destinations} required />
        <SelectField label="Category" name="categoryId" value={journal?.categoryId || ""} options={categories} />
        <Field label="Publish Date" name="publishedAt" type="datetime-local" defaultValue={dateValue(journal?.publishedAt)} />
        <TextAreaField label="Short Introduction" name="excerpt" defaultValue={journal?.excerpt || ""} className="md:col-span-2" />
        <CheckboxField label="Featured" name="featured" defaultChecked={Boolean(journal?.featured)} />
        <div className="md:col-span-2">
          <ImageUploadField
            label="Cover Image"
            name="coverImage"
            currentUrl={journal?.coverImageUrl}
            helpText="Recommended cover image: 1600px+ width."
          />
        </div>
        <div className="md:col-span-2">
          <GalleryUploadField gallery={journal?.gallery || []} />
        </div>
      </div>
    </ContentForm>
    {journal?._id && journal.gallery?.length ? (
      <GalleryRemovalGrid journalId={journal._id} gallery={journal.gallery} />
    ) : null}
    {journal?._id ? (
      <ItemActions
        id={journal._id}
        type="photoJournal"
        label={journal.title || "this photo journal"}
        previewHref="/gallery"
      />
    ) : null}
    </>
  );
}

function VideoForm({
  title,
  video,
  categories,
  destinations,
}: {
  title: string;
  video?: VideoRecord;
  categories: CategoryRecord[];
  destinations: DestinationRecord[];
}) {
  return (
    <>
    <ContentForm title={title} action={saveVideoAction}>
      <HiddenId id={video?._id} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={video?.title || ""} required />
        <Field label="Slug" name="slug" defaultValue={video?.slug || ""} />
        <Field
          label="YouTube URL"
          name="youtubeUrl"
          defaultValue={video?.youtubeUrl || ""}
          className="md:col-span-2"
          helpText="Use youtube.com/watch?v=, youtu.be/, or youtube.com/embed/ links."
        />
        <SelectField label="Destination" name="destinationId" value={video?.destinationId || ""} options={destinations} />
        <SelectField label="Category" name="categoryId" value={video?.categoryId || ""} options={categories} />
        <Field label="Publish Date" name="publishedAt" type="datetime-local" defaultValue={dateValue(video?.publishedAt)} />
        <TextAreaField label="Description" name="description" defaultValue={video?.description || ""} className="md:col-span-2" />
        <CheckboxField label="Featured" name="featured" defaultChecked={Boolean(video?.featured)} />
        <div className="md:col-span-2">
          <ImageUploadField
            label="Video Thumbnail"
            name="thumbnail"
            currentUrl={video?.thumbnailUrl}
            helpText="Recommended thumbnail: 1600px+ width. If empty, the public site shows a polished fallback."
          />
        </div>
      </div>
    </ContentForm>
    {video?._id ? (
      <ItemActions
        id={video._id}
        type="video"
        label={video.title || "this video"}
        previewHref="/videos"
      />
    ) : null}
    </>
  );
}

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={sectionId(title)} className="scroll-mt-24 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:rounded-[2rem] sm:p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">{title}</p>
          <h2 className="mt-3 font-serif text-2xl text-stone-50 sm:text-3xl">{title}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-stone-200/68">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ActionForm({
  action,
  submitLabel,
  children,
}: {
  action: Action;
  submitLabel: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6">
      {children}
      <FormStatus state={state} />
      <SubmitButton pending={pending} label={submitLabel} />
    </form>
  );
}

function ContentForm({
  title,
  action,
  children,
}: {
  title: string;
  action: Action;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <details className="rounded-[1.25rem] border border-white/10 bg-stone-950/25 p-4 sm:rounded-[1.5rem] sm:p-5" open={title.startsWith("Add New")}>
      <summary className="flex cursor-pointer list-none flex-col gap-3 text-stone-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="inline-flex items-start gap-2 font-serif text-xl leading-tight sm:items-center sm:text-2xl">
          {title.startsWith("Add") ? <Plus className="h-5 w-5" /> : <PencilLine className="h-5 w-5" />}
          {title}
        </span>
        <span className="text-xs uppercase tracking-[0.22em] text-stone-300/55">
          {title.startsWith("Add") ? "Creating new content" : "Edit existing content"}
        </span>
      </summary>
      <form action={formAction} encType="multipart/form-data" className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
        {children}
        <FormStatus state={state} />
        <SubmitButton pending={pending} label="Save Changes" />
      </form>
    </details>
  );
}

function HiddenSettings({
  settings,
  brandName,
  except,
}: {
  settings: SiteSettings;
  brandName: string;
  except: string[];
}) {
  const fields: Array<[string, string]> = [
    ["brandName", settings.brandName || brandName],
    ["tagline", settings.tagline || ""],
    ["shortDescription", settings.shortDescription || ""],
    ["heroHeadline", settings.heroHeadline || ""],
    ["heroSubheading", settings.heroSubheading || ""],
    ["heroQuote", settings.heroQuote || ""],
    ["heroIntroShort", settings.heroIntroShort || ""],
    ["facebookUrl", settings.facebookUrl || ""],
    ["instagramUrl", settings.instagramUrl || ""],
    ["youtubeUrl", settings.youtubeUrl || ""],
    ["authorDisplayName", settings.authorDisplayName || ""],
    ["authorBio", settings.authorBio || ""],
    ["youtubeFeatureTitle", settings.youtubeFeatureTitle || ""],
    ["youtubeFeatureDescription", settings.youtubeFeatureDescription || ""],
    ["youtubeFeatureUrl", settings.youtubeFeatureUrl || ""],
  ];

  return (
    <>
      {fields
        .filter(([name]) => !except.includes(name))
        .map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  className,
  type = "text",
  helpText,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  type?: string;
  helpText?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-3 w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-4 py-3 text-sm text-stone-50 outline-none transition-colors duration-300 placeholder:text-stone-400/50 focus:border-amber-100/50"
      />
      {helpText ? <p className="mt-2 text-sm leading-6 text-stone-200/72">{helpText}</p> : null}
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  className,
  rows = 4,
  helpText,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  className?: string;
  rows?: number;
  helpText?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-3 w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-4 py-3 text-sm leading-7 text-stone-50 outline-none transition-colors duration-300 placeholder:text-stone-400/50 focus:border-amber-100/50"
      />
      {helpText ? <p className="mt-2 text-sm leading-6 text-stone-200/72">{helpText}</p> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  required,
}: {
  label: string;
  name: string;
  value: string;
  options: Array<{ _id: string; title?: string | null }>;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">{label}</span>
      <select
        name={name}
        defaultValue={value}
        required={required}
        className="mt-3 w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-4 py-3 text-sm text-stone-50 outline-none transition-colors duration-300 focus:border-amber-100/50"
      >
        <option value="">Choose {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.title || "Untitled"}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-100">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-stone-50" />
      {label}
    </label>
  );
}

function ImageUploadField({
  label,
  name,
  currentUrl,
  helpText,
}: {
  label: string;
  name: string;
  currentUrl?: string | null;
  helpText: string;
}) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] md:items-center">
        <ImagePreview url={currentUrl} label={label} />
        <label>
          <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
            {label}
          </span>
          <input
            name={name}
            type="file"
            accept="image/*"
            className="mt-3 block w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-3 py-3 text-sm text-stone-50 file:mb-2 file:mr-3 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-950 min-[430px]:px-4 min-[430px]:file:mb-0"
          />
          <p className="mt-3 text-sm leading-7 text-stone-200/72">{helpText}</p>
        </label>
      </div>
    </div>
  );
}

function ProfileImageCropper({
  currentUrl,
  zoom,
  positionX,
  positionY,
}: {
  currentUrl?: string | null;
  zoom?: number | null;
  positionX?: number | null;
  positionY?: number | null;
}) {
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
  const [imageZoom, setImageZoom] = useState(zoom || 1);
  const [x, setX] = useState(positionX ?? 50);
  const [y, setY] = useState(positionY ?? 50);
  const dragStart = useRef<{ x: number; y: number; positionX: number; positionY: number } | null>(null);

  function handleDrag(clientX: number, clientY: number) {
    if (!dragStart.current) return;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    setX(Math.min(100, Math.max(0, dragStart.current.positionX + deltaX / 2)));
    setY(Math.min(100, Math.max(0, dragStart.current.positionY + deltaY / 2)));
  }

  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-center">
        <div>
          <div
            className="relative mx-auto aspect-square w-full max-w-[14rem] touch-none cursor-grab overflow-hidden rounded-full border border-stone-300 bg-white shadow-sm active:cursor-grabbing sm:max-w-[16rem]"
            onPointerDown={(event) => {
              dragStart.current = {
                x: event.clientX,
                y: event.clientY,
                positionX: x,
                positionY: y,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => handleDrag(event.clientX, event.clientY)}
            onPointerUp={() => {
              dragStart.current = null;
            }}
            onPointerCancel={() => {
              dragStart.current = null;
            }}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Author profile preview"
                className="h-full w-full object-cover"
                style={{
                  objectPosition: `${x}% ${y}%`,
                  transform: `scale(${imageZoom})`,
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-stone-100 text-center text-xs uppercase tracking-[0.22em] text-stone-500">
                No image
              </div>
            )}
          </div>
          <p className="mt-3 text-center text-xs uppercase tracking-[0.22em] text-stone-500">
            Drag image to adjust
          </p>
        </div>

        <div className="space-y-5">
          <label>
            <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
              Upload Profile Image
            </span>
            <input
              name="authorImage"
              type="file"
              accept="image/*"
              className="mt-3 block w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-3 py-3 text-sm text-stone-50 file:mb-2 file:mr-3 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-950 min-[430px]:px-4 min-[430px]:file:mb-0"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) setPreviewUrl(URL.createObjectURL(file));
              }}
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
              Zoom
            </span>
            <input
              type="range"
              min="1"
              max="2.4"
              step="0.05"
              value={imageZoom}
              onChange={(event) => setImageZoom(Number(event.currentTarget.value))}
              className="mt-3 w-full accent-stone-950"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
                Left / Right
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={x}
                onChange={(event) => setX(Number(event.currentTarget.value))}
                className="mt-3 w-full accent-stone-950"
              />
            </label>
            <label>
              <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
                Up / Down
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={y}
                onChange={(event) => setY(Number(event.currentTarget.value))}
                className="mt-3 w-full accent-stone-950"
              />
            </label>
          </div>

          <input type="hidden" name="authorImageZoom" value={imageZoom} />
          <input type="hidden" name="authorImagePositionX" value={x} />
          <input type="hidden" name="authorImagePositionY" value={y} />
          <p className="text-sm leading-7 text-stone-200/72">
            Upload a profile image, drag it inside the circle, adjust zoom, then save changes at the bottom.
          </p>
        </div>
      </div>
    </div>
  );
}

function ItemActions({
  id,
  type,
  label,
  previewHref,
}: {
  id: string;
  type: string;
  label: string;
  previewHref: string;
}) {
  const [state, formAction, pending] = useActionState(archiveDocumentAction, initialState);

  return (
    <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50/70 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-stone-950">Preview or remove</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Preview the public page, or hide this item without permanently deleting it.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-3 lg:w-auto">
          <Link
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2 text-center text-sm font-medium text-stone-800 sm:flex-none"
          >
            Preview
          </Link>
          <form
            action={formAction}
            className="flex-1 sm:flex-none"
            onSubmit={(event) => {
              if (!window.confirm(`Are you sure you want to remove ${label} from the public website?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="_id" value={id} />
            <input type="hidden" name="_type" value={type} />
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 disabled:opacity-60"
            >
              {pending ? "Removing..." : "Remove"}
            </button>
          </form>
        </div>
      </div>
      <FormStatus state={state} />
    </div>
  );
}

function GalleryRemovalGrid({
  journalId,
  gallery,
}: {
  journalId: string;
  gallery: GalleryImageRecord[];
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
        Remove Gallery Images
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 min-[390px]:grid-cols-2 md:grid-cols-4">
        {gallery.map((image, index) => (
          <GalleryRemoveItem
            key={image._key || image.url || index}
            journalId={journalId}
            image={image}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryRemoveItem({
  journalId,
  image,
  index,
}: {
  journalId: string;
  image: GalleryImageRecord;
  index: number;
}) {
  const [state, formAction, pending] = useActionState(removeGalleryImageAction, initialState);

  return (
    <form
      action={formAction}
      className="rounded-[1rem] border border-stone-200 bg-stone-50 p-3"
      onSubmit={(event) => {
        if (!window.confirm(`Remove Image ${index + 1} from this gallery?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="_id" value={journalId} />
      <input type="hidden" name="galleryImageKey" value={image._key || ""} />
      <ImagePreview url={image.url} label={image.caption || image.alt || `Image ${index + 1}`} />
      <p className="mt-3 text-sm font-medium text-stone-950">Image {index + 1}</p>
      <button
        type="submit"
        disabled={pending || !image._key}
        className="mt-3 w-full rounded-full border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-700 disabled:opacity-60"
      >
        {pending ? "Removing..." : "Remove Image"}
      </button>
      <FormStatus state={state} />
    </form>
  );
}

function GalleryUploadField({ gallery }: { gallery: GalleryImageRecord[] }) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-stone-200/70" />
        <div className="w-full">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
            Gallery Images
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-200/72">
            Upload multiple compressed JPG/WebP travel photos. Existing images stay in place; reorder and remove controls will be added next.
          </p>
          {gallery.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 md:grid-cols-4">
              {gallery.map((image, index) => (
                <ImagePreview
                  key={image._key || image.url || index}
                  url={image.url}
                  label={image.caption || image.alt || `Gallery image ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Shared Image Alt Text" name="galleryAlt" defaultValue="" />
            <Field label="Shared Caption" name="galleryCaption" defaultValue="" />
          </div>
          <input
            name="galleryImages"
            type="file"
            accept="image/*"
            multiple
            className="mt-5 block w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-3 py-3 text-sm text-stone-50 file:mb-2 file:mr-3 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-950 min-[430px]:px-4 min-[430px]:file:mb-0"
          />
        </div>
      </div>
    </div>
  );
}

function ImagePreview({
  url,
  label,
}: {
  url?: string | null;
  label: string;
}) {
  if (!url) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[1rem] border border-white/10 bg-stone-950/40 text-center text-xs uppercase tracking-[0.22em] text-stone-400/70">
        No image
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-white/10 bg-stone-950/40">
      <Image
        src={url}
        alt={label}
        fill
        sizes="(min-width: 768px) 12rem, 100vw"
        className="object-cover"
      />
    </div>
  );
}

function RecordList({ children, emptyText }: { children: ReactNode; emptyText: string }) {
  return <div className="space-y-4">{children || <p className="text-sm text-stone-300/60">{emptyText}</p>}</div>;
}

function FormStatus({ state }: { state: AdminState }) {
  if (state.error) return <p className="text-sm leading-7 text-amber-100">{state.error}</p>;

  if (state.message) {
    const savedAt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

    return (
      <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-[1rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100 sm:rounded-full">
        <span className="inline-flex items-center gap-2">
          <Check className="h-4 w-4" />
          {state.message}
        </span>
        <span className="text-xs text-emerald-100/75">Last saved: {savedAt}</span>
      </div>
    );
  }

  return null;
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-50 px-6 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Saving..." : label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function HiddenId({ id }: { id?: string }) {
  return id ? <input type="hidden" name="_id" value={id} /> : null;
}

function sectionId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function numberValue(value?: number | null) {
  return typeof value === "number" ? String(value) : "";
}

function dateValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}
