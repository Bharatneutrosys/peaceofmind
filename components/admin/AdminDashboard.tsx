"use client";

import { useActionState } from "react";
import { ArrowRight, Check, ImagePlus, LogOut, Sparkles } from "lucide-react";

import { logoutAction, saveSiteSettingsAction, type AdminState } from "@/app/admin/actions";

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

const initialState: AdminState = { error: null, message: null };

function SectionCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-300/55">{status}</p>
      <h3 className="mt-3 font-serif text-2xl text-stone-50">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-200/74">{description}</p>
    </article>
  );
}

export default function AdminDashboard({
  initialSettings,
  brandName,
}: {
  initialSettings?: SiteSettings | null;
  brandName: string;
}) {
  const [state, formAction, pending] = useActionState(saveSiteSettingsAction, initialState);

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
              Clean editing for the website owner.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-200/72">
              Update the homepage text, social links, and author profile without
              touching code. More content panels can be added later.
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

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                  Site Settings
                </p>
                <h2 className="mt-4 font-serif text-3xl text-stone-50">
                  Edit the parts the owner changes most.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-stone-200/68">
                Image uploads stay in Sanity for now. This panel focuses on
                text, links, and homepage copy.
              </p>
            </div>

            <form action={formAction} className="mt-8 space-y-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Website Name" name="brandName" defaultValue={settings.brandName || brandName} required />
                <Field label="Homepage Tagline" name="tagline" defaultValue={settings.tagline || ""} />
                <TextAreaField
                  label="Short Homepage Introduction"
                  name="shortDescription"
                  defaultValue={settings.shortDescription || ""}
                  className="md:col-span-2"
                />
                <Field label="Hero Headline" name="heroHeadline" defaultValue={settings.heroHeadline || ""} className="md:col-span-2" />
                <TextAreaField
                  label="Hero Description"
                  name="heroSubheading"
                  defaultValue={settings.heroSubheading || ""}
                  className="md:col-span-2"
                />
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-stone-950/25 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-100" />
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
                    Social Links
                  </p>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <Field label="Facebook Link" name="facebookUrl" defaultValue={settings.facebookUrl || ""} />
                  <Field label="Instagram Link" name="instagramUrl" defaultValue={settings.instagramUrl || ""} />
                  <Field label="YouTube Link" name="youtubeUrl" defaultValue={settings.youtubeUrl || ""} />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-stone-950/25 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
                  About the Author
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Author Display Name" name="authorDisplayName" defaultValue={settings.authorDisplayName || ""} />
                  <Field
                    label="YouTube Feature Title"
                    name="youtubeFeatureTitle"
                    defaultValue={settings.youtubeFeatureTitle || ""}
                  />
                  <TextAreaField
                    label="About the Author"
                    name="authorBio"
                    defaultValue={settings.authorBio || ""}
                    className="md:col-span-2"
                  />
                  <TextAreaField
                    label="YouTube Feature Description"
                    name="youtubeFeatureDescription"
                    defaultValue={settings.youtubeFeatureDescription || ""}
                    className="md:col-span-2"
                  />
                  <Field
                    label="YouTube Feature Link"
                    name="youtubeFeatureUrl"
                    defaultValue={settings.youtubeFeatureUrl || ""}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6">
                    <ImagePlus className="h-5 w-5 text-stone-200/70" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
                      Coming next
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-200/72">
                      Hero image and author image uploads can be added in a later
                      phase. The current admin keeps the owner on the text and
                      link updates that matter most.
                    </p>
                  </div>
                </div>
              </div>

              {state.error ? (
                <p className="text-sm leading-7 text-amber-100">{state.error}</p>
              ) : null}
              {state.message ? (
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
                  <Check className="h-4 w-4" />
                  {state.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-6 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Saving..." : "Save changes"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Dashboard
              </p>
              <h2 className="mt-4 font-serif text-3xl text-stone-50">
                What this admin panel covers now.
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-200/72">
                {brandName} stays simple on purpose. The owner can change the
                homepage voice, social links, and author copy without touching the
                technical CMS.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Content areas
              </p>
              <div className="mt-5 grid gap-4">
                <SectionCard
                  status="Ready"
                  title="Site Settings"
                  description="Homepage name, headline, intro, social links, and author copy."
                />
                <SectionCard
                  status="Ready"
                  title="Hero"
                  description="The headline and description are editable here. Image uploads come next."
                />
                <SectionCard
                  status="Ready"
                  title="Social Links"
                  description="Facebook, Instagram, and YouTube links flow from the settings form."
                />
                <SectionCard
                  status="Connected"
                  title="Categories"
                  description="Categories continue to live in Sanity for content browsing."
                />
                <SectionCard
                  status="Connected"
                  title="Destinations"
                  description="Destination stories, archives, and featured travel locations."
                />
                <SectionCard
                  status="Connected"
                  title="Journal Stories"
                  description="Editorial essays and travel writing stay available in the public site."
                />
                <SectionCard
                  status="Connected"
                  title="Photo Journals"
                  description="Gallery-led stories and visual travel notes remain in the CMS."
                />
                <SectionCard
                  status="Connected"
                  title="Videos"
                  description="YouTube-ready travel films and future channel content."
                />
                <SectionCard
                  status="Connected"
                  title="Author Profile"
                  description="The site settings bio powers the philosophy/about section."
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Advanced CMS
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-200/72">
                The Sanity Studio remains available at <span className="text-stone-50">/studio</span> for
                developer-level content work. The owner panel at <span className="text-stone-50">/admin</span> is the
                simpler day-to-day workflow.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
        {label}
      </span>
      <input
        name={name}
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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={4}
        className="mt-3 w-full rounded-[1rem] border border-white/10 bg-stone-950/40 px-4 py-3 text-sm leading-7 text-stone-50 outline-none transition-colors duration-300 placeholder:text-stone-400/50 focus:border-amber-100/50"
      />
    </label>
  );
}
