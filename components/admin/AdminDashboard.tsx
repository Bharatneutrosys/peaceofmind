"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
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
};

type CategoryRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  regionLabel?: string | null;
  featured?: boolean | null;
  order?: number | null;
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
};

type Action = (state: AdminState, formData: FormData) => Promise<AdminState>;

const initialState: AdminState = { error: null, message: null };

const tabs = [
  "Site Settings",
  "Hero",
  "Social Links",
  "Author Profile",
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
    <main className="min-h-screen px-6 pb-16 pt-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Traveller&apos;s Diary Admin
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-50 md:text-6xl">
              Simple website editing.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-200/72">
              Update the website text, links, destinations, stories, photo journals,
              and videos from one owner-friendly panel.
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 transition-colors duration-300 hover:bg-white/12"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>

        <nav className="mt-10 flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <a
              key={tab}
              href={`#${sectionId(tab)}`}
              className="shrink-0 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-100/72 transition-colors hover:bg-white/12"
            >
              {tab}
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-8">
          <AdminSection
            title="Site Settings"
            description="Website name, homepage intro, featured YouTube text, and the main reusable settings."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save site settings">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Website Name" name="brandName" defaultValue={settings.brandName || brandName} required />
                <Field label="Homepage Tagline" name="tagline" defaultValue={settings.tagline || ""} />
                <TextAreaField
                  label="Short Homepage Introduction"
                  name="shortDescription"
                  defaultValue={settings.shortDescription || ""}
                  className="md:col-span-2"
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
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save hero text">
              <div className="grid gap-5">
                <HiddenSettings settings={settings} brandName={brandName} except={["heroHeadline", "heroSubheading"]} />
                <Field label="Hero Headline" name="heroHeadline" defaultValue={settings.heroHeadline || ""} required />
                <TextAreaField label="Hero Description" name="heroSubheading" defaultValue={settings.heroSubheading || ""} />
                <ImageNote>
                  Image upload will be added next. For now, hero image can be managed by developer or Sanity Studio.
                </ImageNote>
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
                <Field label="Facebook Link" name="facebookUrl" defaultValue={settings.facebookUrl || ""} />
                <Field label="Instagram Link" name="instagramUrl" defaultValue={settings.instagramUrl || ""} />
                <Field label="YouTube Link" name="youtubeUrl" defaultValue={settings.youtubeUrl || ""} />
              </div>
            </ActionForm>
          </AdminSection>

          <AdminSection
            title="Author Profile"
            description="The author name and biography used on the About page and homepage profile section."
          >
            <ActionForm action={saveSiteSettingsAction} submitLabel="Save author profile">
              <div className="grid gap-5 md:grid-cols-2">
                <HiddenSettings settings={settings} brandName={brandName} except={["authorDisplayName", "authorBio"]} />
                <Field label="Author Display Name" name="authorDisplayName" defaultValue={settings.authorDisplayName || ""} />
                <TextAreaField
                  label="About the Author"
                  name="authorBio"
                  defaultValue={settings.authorBio || ""}
                  className="md:col-span-2"
                />
                <div className="md:col-span-2">
                  <ImageNote>
                    Image upload will be added next. For now, author image can be managed by developer or Sanity Studio.
                  </ImageNote>
                </div>
              </div>
            </ActionForm>
          </AdminSection>

          <AdminSection
            title="Categories"
            description="Create and update the travel groupings shown across the site. Delete is intentionally skipped for now to avoid removing content that may be in use."
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
            description="Create simple photo journal records now; gallery image upload is reserved for the next phase."
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
              Image uploads, gallery management, and advanced structured content can be added to this panel next.
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
        <Field label="Travel Region" name="regionLabel" defaultValue={category?.regionLabel || ""} />
        <Field label="Display Order" name="order" type="number" defaultValue={numberValue(category?.order)} />
        <CheckboxField label="Show on Homepage" name="featured" defaultChecked={Boolean(category?.featured)} />
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
        <CheckboxField label="Show on Homepage" name="featured" defaultChecked={Boolean(destination?.featured)} />
        <div className="md:col-span-2">
          <ImageNote>Cover Image upload will be added next.</ImageNote>
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
        <TextAreaField label="Story Body" name="bodyText" defaultValue={essay?.bodyText || ""} className="md:col-span-2" rows={8} />
        <CheckboxField label="Show on Homepage" name="featured" defaultChecked={Boolean(essay?.featured)} />
        <div className="md:col-span-2">
          <ImageNote>Cover Image upload will be added next.</ImageNote>
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
        <CheckboxField label="Show on Homepage" name="featured" defaultChecked={Boolean(journal?.featured)} />
        <div className="md:col-span-2">
          <ImageNote>Gallery image upload will be added next.</ImageNote>
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
        <Field label="YouTube Link" name="youtubeUrl" defaultValue={video?.youtubeUrl || ""} className="md:col-span-2" />
        <SelectField label="Destination" name="destinationId" value={video?.destinationId || ""} options={destinations} />
        <SelectField label="Category" name="categoryId" value={video?.categoryId || ""} options={categories} />
        <Field label="Publish Date" name="publishedAt" type="datetime-local" defaultValue={dateValue(video?.publishedAt)} />
        <TextAreaField label="Description" name="description" defaultValue={video?.description || ""} className="md:col-span-2" />
        <CheckboxField label="Show on Homepage" name="featured" defaultChecked={Boolean(video?.featured)} />
        <div className="md:col-span-2">
          <ImageNote>Cover Image upload will be added next.</ImageNote>
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
    <form action={formAction} className="space-y-6">
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
      <form action={formAction} className="mt-6 space-y-6">
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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  type?: string;
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
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  className,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  className?: string;
  rows?: number;
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

function ImageNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-stone-200/70" />
        <p className="text-sm leading-7 text-stone-200/72">{children}</p>
      </div>
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
