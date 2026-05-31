# Traveller’s Diary Starter Content Guide

Use this if you want to add the first content manually in Sanity Studio before running the seed script.

## 1. Site Settings

Create one `Site Settings` document.

- Brand Name: `Traveller's Diary`
- Secondary Name / Subtitle: `A young travel diary from the hills of Nepal to the wider world`
- Tagline: `A young travel diary from the hills of Nepal to the wider world`
- Short Homepage Introduction: `Stories, photos, and slow journeys shaped by mountains, people, culture, and memory.`
- Hero Headline: `Travel begins where the road starts to feel personal`
- Hero Subheading: `Stories, photos, and slow journeys shaped by mountains, people, culture, and memory.`
- Author Bio: `Traveller’s Diary is the reflective travel journal of a young woman from Far Western Nepal who grew up near hills and mountains and is studying travel and tourism.`
- Social URLs: leave blank until the official pages are ready
- YouTube Feature Title: `A cinematic frame reserved for future travel films.`
- YouTube Feature Description: `The official channel space is ready for future films, route stories, and slower documentary pieces.`

## 2. Categories

Create three `Category` documents:

- Nepal
- South Asia
- Europe

Set `Featured on Homepage` on all three if you want them shown first.

## 3. Destinations

Create five `Destination` documents:

- Far Western Nepal
- Kathmandu Valley
- Pokhara
- South Asia Journey
- Europe Notes

Link them to the matching category.

## 4. Essays / Travel Stories

Create one starter essay:

- Title: `First Light on the Road`
- Excerpt: `A short starter story about learning to read roads, weather, and silence with care.`
- Destination: `Far Western Nepal`
- Category: `Nepal`
- Featured on Homepage: on
- Body: use two or three short paragraphs about the beginning of the diary, not a fake travel claim

## 5. Photo Journals

Create one starter photo journal:

- Title: `Mountain Notes`
- Excerpt: `A placeholder journal for mountain weather, roadside stops, and quiet frames from home territory.`
- Destination: `Far Western Nepal`
- Category: `Nepal`
- Featured on Homepage: on
- Gallery: add at least one image when ready

## 6. Videos

Create one starter video:

- Title: `Channel Opening Film`
- Description: `A placeholder entry for the first YouTube story once the channel is ready.`
- Featured on Homepage: on
- YouTube URL: leave blank until the official channel is ready

## 7. Recommended order

1. Site Settings
2. Categories
3. Destinations
4. Essay
5. Photo Journal
6. Video

## 8. Seed script

If your Sanity token is available, you can also run:

```bash
node scripts/seed-travellers-diary.mjs
```

Required environment variables:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN`

The script is guarded against missing environment variables and will not write anything unless the required values are present.
