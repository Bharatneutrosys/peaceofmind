# Traveller's Diary Admin Guide

Use this guide when updating the website from the simple owner panel.

## Open and log in

1. Open `/admin`.
2. Enter the admin passcode.
3. Use Logout when finished.

Local URL: `http://localhost:3000/admin`
Vercel URL: `https://peaceofmind-steel.vercel.app/admin`

The owner should use `/admin`. Sanity Studio at `/studio` is advanced developer CMS access and is usually not needed.

## Edit site settings

Open the Site Settings section to update:

- Website Name
- Homepage Tagline
- Short Homepage Introduction
- YouTube feature title, description, and link

Select Save after editing. The public site updates after revalidation or refresh.

## Edit hero text

Open the Hero section to update:

- Hero Headline
- Hero Description

Hero image upload is not part of this version. For now, hero image can be managed by a developer or in Sanity Studio.

## Add social links

Open Social Links and add:

- Facebook Link
- Instagram Link
- YouTube Link

Leave a field empty to hide that social link on the public site.

## Edit author profile

Open Author Profile to update:

- Author Display Name
- About the Author

Author image upload is not part of this version.

## Add a category

Open Categories, then Add Category. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Description
- Travel Region
- Show on Homepage
- Display Order

Delete is intentionally not available yet so existing content is not removed accidentally.

## Add a destination

Open Destinations, then Add Destination. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Country
- Short Introduction
- Description
- Category
- Show on Homepage
- Display Order

Cover Image upload will be added next.

## Add a journal story

Open Journal Stories, then Add Journal Story. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Destination
- Category
- Publish Date
- Estimated Read Time
- Short Introduction
- Story Body
- Show on Homepage

Story Body is plain text in the admin panel and is saved as simple website paragraphs.
Cover Image upload will be added next.

## Add a photo journal

Open Photo Journals, then Add Photo Journal. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Destination
- Category
- Publish Date
- Short Introduction
- Show on Homepage

Gallery image upload will be added next.

## Add a video

Open Videos, then Add Video. Fill in:

- Title
- Slug, or leave empty to generate from the title
- YouTube Link
- Destination
- Category
- Publish Date
- Description
- Show on Homepage

Accepted YouTube links include `youtube.com/watch?v=`, `youtu.be/`, and `youtube.com/embed/`.

## Required Vercel environment variables

- `ADMIN_PASSCODE=`
- `SANITY_API_WRITE_TOKEN=`
- `NEXT_PUBLIC_SANITY_PROJECT_ID=`
- `NEXT_PUBLIC_SANITY_DATASET=`
- `NEXT_PUBLIC_SANITY_API_VERSION=`

`SANITY_API_WRITE_TOKEN` must be created in Sanity Manage with write access. Keep it server-side only and never expose it in the browser.

After adding or changing these environment variables in Vercel, redeploy the site so the admin panel can read them.

## Not finished yet

- Hero image upload
- Author image upload
- Destination cover image upload
- Journal cover image upload
- Photo journal gallery upload
- Video thumbnail upload
- Safe delete controls
