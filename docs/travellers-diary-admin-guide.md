# Traveller's Diary Admin Guide

Use this guide when updating the website from the simple owner panel.

## Open and log in

1. Open `/admin`.
2. Enter the admin passcode.
3. Use Home or Preview Website to check the public site.
4. Use Logout when finished.

Local URL: `http://localhost:3000/admin`
Vercel URL: `https://peaceofmind-steel.vercel.app/admin`

The owner should use `/admin`. Sanity Studio at `/studio` is advanced developer CMS access and is usually not needed.

## Edit website settings

Open Website Settings to update:

- Website Name
- Tagline
- Short Description
- YouTube feature title, description, and link

Select Save after editing. The public site updates after revalidation or refresh.

## Edit hero text

Open the Hero section to update:

- Hero Heading
- Hero Description
- Hero Image

Keep hero text short so the mountain image stays visible. Use a wide panorama image, ideally 2400px or wider. Avoid very large uncompressed files.

## Add social links

Open Social Links and add:

- Facebook URL
- Instagram URL
- YouTube URL

Leave a field empty to hide that social link on the public site.

## Edit about the traveler

Open About the Traveler to update:

- Display Name
- About/Bio Text
- Author Image

Write simply and naturally. Use a clear portrait or creator image owned by the creator.

## Add a category

Open Categories, then Add Category. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Description
- Region Label
- Featured
- Display Order
- Cover Image

Delete is intentionally not available yet so existing content is not removed accidentally.

## Add a destination

Open Destinations, then Add Destination. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Country
- Short Introduction
- Description
- Category
- Featured
- Display Order
- Cover Image

Recommended cover image size: 1600px or wider.

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
- Featured
- Cover Image

Story Body is plain text in the admin panel and is saved as simple website paragraphs. Short paragraphs are easier to read.
Use a real travel photo owned by the creator. The title is used as fallback image alt text.

## Add a photo journal

Open Photo Journals, then Add Photo Journal. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Destination
- Category
- Publish Date
- Short Introduction
- Featured
- Cover Image
- Gallery Images

Use compressed JPG/WebP travel photos. You can upload multiple gallery images at once. Shared alt text and caption apply to the new uploaded batch. Existing gallery images stay visible; reorder and remove controls are still pending.

## Add a video

Open Videos, then Add Video. Fill in:

- Title
- Slug, or leave empty to generate from the title
- YouTube URL
- Destination
- Category
- Publish Date
- Description
- Featured
- Video Thumbnail

Accepted YouTube links include `youtube.com/watch?v=`, `youtu.be/`, and `youtube.com/embed/`.
If no thumbnail is uploaded, the public videos page shows a polished fallback.

## Image quality tips

- Use real travel photos owned by the creator.
- Recommended hero image: wide panorama, 2400px+ width.
- Recommended cover image: 1600px+ width.
- Recommended gallery images: compressed JPG/WebP, clear travel photos.
- Avoid very large uncompressed files.

## Preview changes

Use the Home button to return to the site in the same tab. Use Preview Website to open the public homepage in a new tab. Most pages update after revalidation or refresh.

## Required Vercel environment variables

- `ADMIN_PASSCODE=`
- `SANITY_API_WRITE_TOKEN=`
- `NEXT_PUBLIC_SANITY_PROJECT_ID=`
- `NEXT_PUBLIC_SANITY_DATASET=`
- `NEXT_PUBLIC_SANITY_API_VERSION=`

`SANITY_API_WRITE_TOKEN` must be created in Sanity Manage with write access. Keep it server-side only and never expose it in the browser.

After adding or changing these environment variables in Vercel, redeploy the site so the admin panel can read them.

## Not finished yet

- Gallery reorder controls
- Gallery remove controls
- Safe delete controls
