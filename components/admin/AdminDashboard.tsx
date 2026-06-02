"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
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
  logoutAction,
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
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  authorDisplayName?: string | null;
  authorBio?: string | null;
  youtubeFeatureTitle?: string | null;
  youtubeFeatureDescription?: string | null;
  youtubeFeatureUrl?: string | null;
  heroImageUrl?: string | null;
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
  coverImageUrl?: string | null;
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

export default function AdminDashboard({
  initialSettings,
  brandName,
  categories,
  destinations,
  essays,
  photoJournals,
  videos,
}: {
  initialSettings?: SiteSettings | null;
  brandName: string;
  categories: CategoryRecord[];
  destinations: DestinationRecord[];
  essays: EssayRecord[];
  photoJournals: PhotoJournalRecord[];
  videos: VideoRecord[];
}) {
  const settings = initialSettings || {};

  return (
    <main className="admin-panel min-h-screen bg-[#f7f2ea] px-6 pb-16 pt-10 text-stone-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
              Traveller&apos;s Diary Admin
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-950 md:text-6xl">
              Simple website editing.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Update the website text, links, destinations, stories, photo journals,
              and videos from one owner-friendly panel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 shadow-sm transition-colors duration-300 hover:bg-stone-50"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 shadow-sm transition-colors duration-300 hover:bg-stone-50"
            >
              <ExternalLink className="h-4 w-4" />
              Preview Website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-stone-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>

        <nav className="mt-10 flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <a
              key={tab}
              href={`#${sectionId(tab)}`}
              className="shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-600 shadow-sm transition-colors hover:bg-stone-50"
            >
              {tab}
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-8">
          <AdminSection
            title="Website Settings"
            description="Website name, tagline, short description, and the homepage video text."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save website settings">
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
                <Field label="YouTube Feature Title" name="youtubeFeatureTitle" defaultValue={settings.youtubeFeatureTitle || ""} />
                <Field label="YouTube Feature Link" name="youtubeFeatureUrl" defaultValue={settings.youtubeFeatureUrl || ""} />
                <TextAreaField
                  label="YouTube Feature Description"
                  name="youtubeFeatureDescription"
                  defaultValue={settings.youtubeFeatureDescription || ""}
                  className="md:col-span-2"
                />
                <input type="hidden" name="heroHeadline" value={settings.heroHeadline || ""} />
                <input type="hidden" name="heroSubheading" value={settings.heroSubheading || ""} />
                <input type="hidden" name="facebookUrl" value={settings.facebookUrl || ""} />
                <input type="hidden" name="instagramUrl" value={settings.instagramUrl || ""} />
                <input type="hidden" name="youtubeUrl" value={settings.youtubeUrl || ""} />
                <input type="hidden" name="authorDisplayName" value={settings.authorDisplayName || ""} />
                <input type="hidden" name="authorBio" value={settings.authorBio || ""} />
              </div>
            </ActionForm>
          </AdminSection>

          <AdminSection
            title="Hero"
            description="The first headline and description visitors see on the homepage."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save hero">
              <div className="grid gap-5">
                <HiddenSettings settings={settings} brandName={brandName} except={["heroHeadline", "heroSubheading"]} />
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
                  helpText="Recommended hero image: wide panorama, 2400px+ width. Avoid very large uncompressed files."
                />
              </div>
            </ActionForm>
          </AdminSection>

          <AdminSection
            title="Social Links"
            description="Leave a link empty to hide it gracefully on the public site."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save social links">
              <div className="grid gap-5 md:grid-cols-3">
                <HiddenSettings settings={settings} brandName={brandName} except={["facebookUrl", "instagramUrl", "youtubeUrl"]} />
                <Field label="Facebook URL" name="facebookUrl" defaultValue={settings.facebookUrl || ""} />
                <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl || ""} />
                <Field label="YouTube URL" name="youtubeUrl" defaultValue={settings.youtubeUrl || ""} />
              </div>
            </ActionForm>
          </AdminSection>

          <AdminSection
            title="About the Traveler"
            description="The traveler name and short profile used on the About page and homepage profile section."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save author profile">
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
                  <ImageUploadField
                    label="Author Image"
                    name="authorImage"
                    currentUrl={settings.authorImageUrl}
                    helpText="Use a clear portrait or creator image. Compressed JPG or WebP works best."
                  />
                </div>
              </div>
            </ActionForm>
          </AdminSection>

          <AdminSection
            title="Categories"
            description="Create and update the travel groupings shown across the site. Delete is skipped for now to avoid removing content that may be in use."
          >
            <CategoryForm title="Add Category" />
            <RecordList emptyText="No categories yet.">
              {categories.map((category) => (
                <CategoryForm key={category._id} title={category.title || "Edit Category"} category={category} />
              ))}
            </RecordList>
          </AdminSection>

          <AdminSection
            title="Destinations"
            description="Create and update the places connected to stories, photos, and videos."
          >
            <DestinationForm title="Add Destination" categories={categories} />
            <RecordList emptyText="No destinations yet.">
              {destinations.map((destination) => (
                <DestinationForm
                  key={destination._id}
                  title={destination.title || "Edit Destination"}
                  destination={destination}
                  categories={categories}
                />
              ))}
            </RecordList>
          </AdminSection>

          <AdminSection
            title="Journal Stories"
            description="Write basic story text without raw JSON. Body text is saved as simple readable paragraphs."
          >
            <EssayForm title="Add Journal Story" categories={categories} destinations={destinations} />
            <RecordList emptyText="No journal stories yet.">
              {essays.map((essay) => (
                <EssayForm
                  key={essay._id}
                  title={essay.title || "Edit Journal Story"}
                  essay={essay}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>

          <AdminSection
            title="Photo Journals"
            description="Create photo journal records and upload gallery images for the public gallery."
          >
            <PhotoJournalForm title="Add Photo Journal" categories={categories} destinations={destinations} />
            <RecordList emptyText="No photo journals yet.">
              {photoJournals.map((journal) => (
                <PhotoJournalForm
                  key={journal._id}
                  title={journal.title || "Edit Photo Journal"}
                  journal={journal}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>

          <AdminSection
            title="Videos"
            description="Add YouTube watch, embed, or youtu.be links. No YouTube API connection is needed."
          >
            <VideoForm title="Add Video" categories={categories} destinations={destinations} />
            <RecordList emptyText="No videos yet.">
              {videos.map((video) => (
                <VideoForm
                  key={video._id}
                  title={video.title || "Edit Video"}
                  video={video}
                  categories={categories}
                  destinations={destinations}
                />
              ))}
            </RecordList>
          </AdminSection>

          <AdminSection
            title="Developer CMS"
            description="The owner should use this admin panel. Sanity Studio remains available at /studio only for advanced developer CMS work."
          >
            <p className="text-sm leading-7 text-stone-200/72">
              Gallery reorder/remove controls and advanced structured content can be added to this panel next.
            </p>
          </AdminSection>
        </div>
      </div>
    </main>
  );
}

function CategoryForm({ title, category }: { title: string; category?: CategoryRecord }) {
  return (
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
  );
}

function DestinationForm({
  title,
  destination,
  categories,
}: {
  title: string;
  destination?: DestinationRecord;
  categories: CategoryRecord[];
}) {
  return (
    <ContentForm title={title} action={saveDestinationAction}>
      <HiddenId id={destination?._id} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={destination?.title || ""} required />
        <Field label="Slug" name="slug" defaultValue={destination?.slug || ""} />
        <Field label="Country" name="country" defaultValue={destination?.country || ""} />
        <SelectField label="Category" name="categoryId" value={destination?.categoryId || ""} options={categories} />
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
    <section id={sectionId(title)} className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">{title}</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-50">{title}</h2>
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
    <details className="rounded-[1.5rem] border border-white/10 bg-stone-950/25 p-5" open={!title.startsWith("Edit")}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-stone-50">
        <span className="inline-flex items-center gap-2 font-serif text-2xl">
          {title.startsWith("Add") ? <Plus className="h-5 w-5" /> : <PencilLine className="h-5 w-5" />}
          {title}
        </span>
        <span className="text-xs uppercase tracking-[0.22em] text-stone-300/55">Open</span>
      </summary>
      <form action={formAction} encType="multipart/form-data" className="mt-6 space-y-6">
        {children}
        <FormStatus state={state} />
        <SubmitButton pending={pending} label="Save" />
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
            className="mt-3 block w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-4 py-3 text-sm text-stone-50 file:mr-4 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-950"
          />
          <p className="mt-3 text-sm leading-7 text-stone-200/72">{helpText}</p>
        </label>
      </div>
    </div>
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
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
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
            className="mt-5 block w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-4 py-3 text-sm text-stone-50 file:mr-4 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-950"
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
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
        <Check className="h-4 w-4" />
        {state.message}
      </p>
    );
  }

  return null;
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-6 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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
