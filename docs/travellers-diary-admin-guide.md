# Traveller's Diary Admin Guide

Use this guide when updating the website from the simple owner panel.

## Open and log in

1. Open `/admin`.
2. Enter the admin passcode.
3. Choose the card for the area you want to edit.
4. Use Home or Preview Website to check the public site.
5. Use Logout when finished.

Local URL: `http://localhost:3000/admin`
Vercel URL: `https://peaceofmind-steel.vercel.app/admin`

The owner should use `/admin`. Sanity Studio at `/studio` is advanced developer CMS access and is usually not needed.

## Editing existing content

Existing website content is pre-filled in the admin forms. If a form says `Editing: Nepal`, saving updates that existing item. If a form says `Add New Category`, saving creates a new item.

Edit only the fields you want to change. Unchanged text and images stay in place. Image fields are only replaced when you choose a new image file.

The admin dashboard is now organized into separate pages:

- `/admin/settings`
- `/admin/hero`
- `/admin/author`
- `/admin/social`
- `/admin/categories`
- `/admin/destinations`
- `/admin/journal`
- `/admin/photo-journals`
- `/admin/videos`

Each page has its own Save Changes button at the bottom of the form.

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
- Hero Quote
- Hero Author Intro
- Hero Author Image

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
- Author Image Zoom
- Author Image Position

Write simply and naturally. Use a clear portrait or creator image owned by the creator. Upload the profile image, drag it inside the circular preview, adjust the zoom slider, and save.

## Add a category

Open Categories, then Add New Category. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Description
- Region Label
- Featured
- Display Order
- Cover Image

Delete is intentionally not available yet so existing content is not removed accidentally.

## Add a destination

Open Destinations, then Add New Destination. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Country
- Travel Region
- Parent Place
- Short Introduction
- Description
- Category
- Featured
- Display Order
- Cover Image

Recommended cover image size: 1600px or wider.

Use Parent Place to make nested locations. Example: create Nepal, then create Pokhara with Nepal as the parent, then create Annapurna Base Camp with Pokhara as the parent.

## Add a journal story

Open Journal Stories, then Add New Journal Story. Fill in:

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

Use Preview beside an existing story to open the public story page. Use Remove only when you want to hide it from the public website. Remove does not permanently delete the document.

## Add a photo journal

Open Photo Journals, then Add New Photo Journal. Fill in:

- Title
- Slug, or leave empty to generate from the title
- Destination
- Category
- Publish Date
- Short Introduction
- Featured
- Cover Image
- Gallery Images

Use compressed JPG/WebP travel photos. Existing gallery images are shown in the edit form. You can upload multiple new gallery images at once. Shared alt text and caption apply to the new uploaded batch.

To remove one gallery image, open the existing photo journal and use the Remove Image button under that image number. Confirm the action when asked. This removes only that one image from the gallery.

## Add a video

Open Videos, then Add New Video. Fill in:

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

## Remove content safely

Existing categories, destinations, stories, photo journals, and videos have a Remove action. Remove hides the item from the public website by archiving it. It does not permanently delete the Sanity document.

## Image quality tips

- Use real travel photos owned by the creator.
- Recommended hero image: wide panorama, 2400px+ width.
- Recommended cover image: 1600px+ width.
- Recommended gallery images: compressed JPG/WebP, clear travel photos.
- Avoid very large uncompressed files.

## Preview changes

After saving, the form shows `Saved successfully` with a last-saved time. Use the Home button to return to the site in the same tab. Use Preview Website to open the public homepage in a new tab. Most pages update after revalidation or refresh.

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
- Restore/unarchive controls for hidden content
