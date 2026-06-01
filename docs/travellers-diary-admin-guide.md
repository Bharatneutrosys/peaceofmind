# Traveller's Diary Admin Guide

Use this guide when updating the website in Sanity Studio.

## Open the admin panel

You can also open **Admin** from the main website navbar, which takes you to the Studio.

Visit `/studio` in the browser and sign in with the authorized Sanity account.
The sidebar is organized so the owner can update content without touching code.

Local admin URL: `http://localhost:3000/studio`

On Vercel, the direct URL is `https://peaceofmind-steel.vercel.app/studio`.

## 1. Start with Site Settings

Open **Site Settings** first. This controls the brand and homepage.

Update:
- Brand Name
- Secondary Brand Line
- Tagline
- Short Homepage Introduction
- Hero Image
- Hero Headline
- Hero Subheading
- Author Bio
- Author Image
- Facebook Page URL
- Instagram Profile URL
- YouTube Channel URL
- Featured Video Link

Leave optional fields empty if you do not need them yet.

## 2. Add a Category

Use **Category** when you want to group travel content.

Recommended categories:
- Nepal
- South Asia
- Europe

Fill in:
- Title
- Slug
- Short Description
- Cover Image
- Travel Region
- Show on Homepage
- Display Order

## 3. Add a Destination

Use **Destination** for a place page or future archive section.

Fill in:
- Title
- Slug
- Related Category
- Travel Region
- Short Description
- Short Introduction
- Country
- Cover Image
- Show on Homepage
- Display Order

## 4. Add a Journal Story

Use **Essay** for long-form travel writing.

Fill in:
- Title
- Slug
- Cover Image
- Short Introduction
- Travel Region
- Story Date
- Published Date
- Destination
- Show on Homepage
- Estimated Read Time
- Tags / Keywords
- Body

Tip: the body can start with a few short paragraphs. You do not need to fill every section right away.

## 5. Add a Photo Journal

Use **Photo Journal** for visual stories and gallery sets.

Fill in:
- Title
- Related Destination
- Travel Region
- Cover Image
- Gallery Images
- Short Introduction
- Featured Video Link
- Published Date
- Show on Homepage
- Tags / Keywords

Tip: each gallery image can include alternative text and an optional caption.

## 6. Add a Video

Use **Video** for YouTube or other travel video links.

Fill in:
- Title
- Slug
- Short Description
- YouTube Video URL
- Thumbnail Image
- Related Destination
- Travel Region
- Show on Homepage
- Published Date

Supported YouTube links:
- `youtube.com/watch?v=...`
- `youtu.be/...`
- `youtube.com/embed/...`

## 7. Featured content rules

Turn on **Show on Homepage** for items you want to appear first.

The homepage will still work if nothing is featured. It will fall back to the latest content or polished empty states.

## 8. Recommended publishing order

1. Site Settings
2. Categories
3. Destinations
4. Journal Stories
5. Photo Journals
6. Videos

## 9. Image guidance

Recommended image shapes:
- Hero Image: wide landscape
- Cover Image: wide 16:9 or near 16:10
- Author Image: portrait
- Gallery Images: any strong frame, but keep the subject clear

Good practice:
- Use clear, high-resolution images
- Add alt text for accessibility
- Add captions when they help the story

## 10. Writing tips

- Keep titles short and clear
- Use the first paragraph to set the mood
- Avoid fake claims or over-promising language
- Write in a calm, premium voice
- Keep social URLs empty until the official pages are ready

## 11. Deployment checklist

- Add the Sanity environment variables in Vercel Project Settings
- Add your Vercel domain to Sanity CORS origins
- Redeploy after changing environment variables
- Visit `/studio` and sign in with the authorized Sanity account

If the Studio opens but content does not load, check the dataset, project ID, and CORS settings first.

Required environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=`
- `NEXT_PUBLIC_SANITY_DATASET=`
- `NEXT_PUBLIC_SANITY_API_VERSION=`

If the dataset is private or preview access is needed, a Sanity token may also be required in the server environment. Do not expose it in the public frontend.
