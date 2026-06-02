# Traveller's Diary Admin Guide

Use this guide when updating the website.

## Open the admin panel

- Local URL: `http://localhost:3000/admin`
- Vercel URL: `https://peaceofmind-steel.vercel.app/admin`
- Later custom domain: `https://yourdomain.com/admin`

Open the page and enter the admin passcode. The owner panel uses a simple secure session cookie after login.

## What the owner can update

- Website Name
- Homepage Tagline
- Short Homepage Introduction
- Hero Headline
- Hero Description
- Facebook Link
- Instagram Link
- YouTube Link
- About the Author
- YouTube feature title, description, and link

Save changes after editing. The public site updates after revalidation or refresh.

## Image fields

Hero image and author image are coming in a later phase. The current admin focuses on the text and links the owner changes most often.

## Simple workflow

1. Open `/admin`
2. Enter the admin passcode
3. Update the text and links
4. Save changes
5. Refresh the public site if needed

## Deployment checklist

- Add the Vercel environment variables
- Add the Vercel domain to Sanity CORS origins
- Redeploy after environment updates
- Use the `/admin` route for the owner workflow
- Keep `/studio` available only for advanced developer CMS work

If the panel does not load or the content is missing, check:

- Sanity project access
- CORS origins
- `ADMIN_PASSCODE`
- `SANITY_API_WRITE_TOKEN`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

## Required Vercel environment variables

- `ADMIN_PASSCODE=`
- `SANITY_API_WRITE_TOKEN=`
- `NEXT_PUBLIC_SANITY_PROJECT_ID=`
- `NEXT_PUBLIC_SANITY_DATASET=`
- `NEXT_PUBLIC_SANITY_API_VERSION=`

`SANITY_API_WRITE_TOKEN` must be created in Sanity Manage with write access. Keep it server-side only and never expose it in the browser.

After adding or changing these environment variables in Vercel, redeploy the site so the admin panel can read them.
