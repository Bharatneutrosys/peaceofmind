import { createClient } from 'next-sanity'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.SANITY_API_VERSION || '2024-10-01'

if (!projectId || !dataset || !token) {
  console.error(
    [
      'Missing required env vars.',
      'Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_TOKEN before running this script.',
      'Nothing was written to Sanity.',
    ].join('\n'),
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3200&auto=format&fit=crop'
const AUTHOR_IMAGE_URL =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1800&auto=format&fit=crop'
const ESSAY_IMAGE_URL =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop'
const JOURNAL_IMAGE_URL =
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2400&auto=format&fit=crop'
const VIDEO_IMAGE_URL =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2400&auto=format&fit=crop'

const starterCategories = [
  {
    _id: 'category-nepal',
    _type: 'category',
    title: 'Nepal',
    slug: { _type: 'slug', current: 'nepal' },
    description: 'Home routes, mountain light, and stories rooted close to the hills.',
    regionLabel: 'Nepal',
    featured: true,
    order: 1,
  },
  {
    _id: 'category-south-asia',
    _type: 'category',
    title: 'South Asia',
    slug: { _type: 'slug', current: 'south-asia' },
    description: 'Regional journeys across borders, cultures, and changing landscapes.',
    regionLabel: 'South Asia',
    featured: true,
    order: 2,
  },
  {
    _id: 'category-europe',
    _type: 'category',
    title: 'Europe',
    slug: { _type: 'slug', current: 'europe' },
    description: 'Future city notes, rail journeys, and slower long-haul chapters.',
    regionLabel: 'Europe',
    featured: true,
    order: 3,
  },
]

const starterDestinationIds = {
  farWesternNepal: 'destination-far-western-nepal',
  kathmanduValley: 'destination-kathmandu-valley',
  pokhara: 'destination-pokhara',
  southAsiaJourney: 'destination-south-asia-journey',
  europeNotes: 'destination-europe-notes',
}

const starterDestinations = [
  {
    _id: starterDestinationIds.farWesternNepal,
    _type: 'destination',
    title: 'Far Western Nepal',
    slug: { _type: 'slug', current: 'far-western-nepal' },
    region: 'Nepal',
    description: 'A home-region entry for hills, roads, weather, and early memory.',
    shortIntro: 'The starting point of Traveller’s Diary, grounded in the landscapes that shaped the voice of the brand.',
    country: 'Nepal',
    category: { _type: 'reference', _ref: 'category-nepal' },
    featured: true,
    order: 1,
  },
  {
    _id: starterDestinationIds.kathmanduValley,
    _type: 'destination',
    title: 'Kathmandu Valley',
    slug: { _type: 'slug', current: 'kathmandu-valley' },
    region: 'Nepal',
    description: 'Temple courtyards, old streets, and city rhythms between the hills.',
    shortIntro: 'A future travel note space for the capital valley and its layered texture.',
    country: 'Nepal',
    category: { _type: 'reference', _ref: 'category-nepal' },
    featured: true,
    order: 2,
  },
  {
    _id: starterDestinationIds.pokhara,
    _type: 'destination',
    title: 'Pokhara',
    slug: { _type: 'slug', current: 'pokhara' },
    region: 'Nepal',
    description: 'Lake light, mountain reflection, and a calmer route through western Nepal.',
    shortIntro: 'A gentle destination note for future stories around the lake and the surrounding ridgelines.',
    country: 'Nepal',
    category: { _type: 'reference', _ref: 'category-nepal' },
    featured: false,
    order: 3,
  },
  {
    _id: starterDestinationIds.southAsiaJourney,
    _type: 'destination',
    title: 'South Asia Journey',
    slug: { _type: 'slug', current: 'south-asia-journey' },
    region: 'South Asia',
    description: 'A flexible placeholder for regional stories as the archive expands.',
    shortIntro: 'A future-ready destination note for routes across the wider region.',
    country: 'South Asia',
    category: { _type: 'reference', _ref: 'category-south-asia' },
    featured: false,
    order: 4,
  },
  {
    _id: starterDestinationIds.europeNotes,
    _type: 'destination',
    title: 'Europe Notes',
    slug: { _type: 'slug', current: 'europe-notes' },
    region: 'Europe',
    description: 'A future archive space for slower city chapters and train-based travel.',
    shortIntro: 'Reserved for the first European stories whenever they are ready.',
    country: 'Europe',
    category: { _type: 'reference', _ref: 'category-europe' },
    featured: false,
    order: 5,
  },
]

const starterEssay = {
  _id: 'essay-first-light',
  _type: 'essay',
  title: 'First Light on the Road',
  slug: { _type: 'slug', current: 'first-light-on-the-road' },
  excerpt:
    'A short starter story about learning to read roads, weather, and silence with care.',
  destination: { _type: 'reference', _ref: starterDestinationIds.farWesternNepal },
  category: { _type: 'reference', _ref: 'category-nepal' },
  coverImage: null,
  date: '2026-05-31T00:00:00.000Z',
  publishedAt: '2026-05-31T00:00:00.000Z',
  featured: true,
  estimatedReadTime: '3 min read',
  tags: ['Nepal', 'travel diary', 'starter story'],
  body: [
    {
      _type: 'block',
      _key: 'essay-block-1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'essay-span-1',
          text:
            'This is a quiet beginning, not a grand claim. Traveller’s Diary opens as a place for observing the small things that make movement feel personal: a road turning slowly through hills, a window catching afternoon light, and the way a journey changes when it is written down carefully.',
          marks: [],
        },
      ],
    },
    {
      _type: 'block',
      _key: 'essay-block-2',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'essay-span-2',
          text:
            'The early archive can stay simple. The important part is the voice: calm, observant, and rooted in Far Western Nepal while looking outward with patience.',
          marks: [],
        },
      ],
    },
  ],
}

const starterPhotoJournal = {
  _id: 'photoJournal-mountain-notes',
  _type: 'photoJournal',
  title: 'Mountain Notes',
  destination: { _type: 'reference', _ref: starterDestinationIds.farWesternNepal },
  category: { _type: 'reference', _ref: 'category-nepal' },
  excerpt:
    'A placeholder journal for mountain weather, roadside stops, and quiet frames from home territory.',
  coverImage: null,
  gallery: [],
  featuredVideoUrl: undefined,
  publishedAt: '2026-05-31T00:00:00.000Z',
  featured: true,
  tags: ['mountains', 'Nepal', 'photo journal'],
}

const starterVideo = {
  _id: 'video-channel-placeholder',
  _type: 'video',
  title: 'Channel Opening Film',
  slug: { _type: 'slug', current: 'channel-opening-film' },
  description:
    'A placeholder entry for the first YouTube story once the channel is ready.',
  youtubeUrl: undefined,
  thumbnail: null,
  category: { _type: 'reference', _ref: 'category-nepal' },
  featured: true,
  publishedAt: '2026-05-31T00:00:00.000Z',
}

const starterSiteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  brandName: "Traveller's Diary",
  tagline: 'A young travel diary from the hills of Nepal to the wider world',
  shortDescription:
    'Stories, photos, and slow journeys shaped by mountains, people, culture, and memory.',
  heroHeadline: 'Travel begins where the road starts to feel personal',
  heroSubheading:
    'Stories, photos, and slow journeys shaped by mountains, people, culture, and memory.',
  authorBio:
    'Traveller’s Diary is the reflective travel journal of a young woman from Far Western Nepal who grew up near hills and mountains and is studying travel and tourism. The site will hold stories, photo journals, and future film notes shaped by a calm, observant voice.',
  youtubeFeatureTitle: 'A cinematic frame reserved for future travel films.',
  youtubeFeatureDescription:
    'The official channel space is ready for future films, route stories, and slower documentary pieces.',
  heroImage: {
    _type: 'image',
    asset: { _type: 'reference', _ref: null },
  },
}

async function uploadImage(url, filename) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${filename}: ${response.status} ${response.statusText}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  return client.assets.upload('image', buffer, { filename })
}

async function ensureDocument(document) {
  const existing = await client.getDocument(document._id)
  if (existing) {
    console.log(`Skipped existing: ${document._type} ${document._id}`)
    return existing
  }

  const created = await client.createIfNotExists(document)
  console.log(`Created: ${document._type} ${document._id}`)
  return created
}

async function main() {
  console.log(`Seeding Traveller’s Diary into ${projectId}/${dataset}...`)

  const siteSettingsExists = await client.fetch(
    '*[_type == "siteSettings"][0]._id',
    {},
  )

  if (!siteSettingsExists) {
    const [heroImage, authorImage, essayImage, journalImage, videoImage] =
      await Promise.all([
        uploadImage(HERO_IMAGE_URL, 'travellers-diary-hero.jpg'),
        uploadImage(AUTHOR_IMAGE_URL, 'travellers-diary-author.jpg'),
        uploadImage(ESSAY_IMAGE_URL, 'travellers-diary-essay.jpg'),
        uploadImage(JOURNAL_IMAGE_URL, 'travellers-diary-journal.jpg'),
        uploadImage(VIDEO_IMAGE_URL, 'travellers-diary-video.jpg'),
      ])

    starterSiteSettings.heroImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: heroImage._id },
    }
    starterSiteSettings.authorImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: authorImage._id },
    }

    starterEssay.coverImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: essayImage._id },
      alt: 'Starter essay cover image',
      caption: 'Starter essay cover image',
    }

    starterPhotoJournal.coverImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: journalImage._id },
      alt: 'Starter photo journal cover image',
      caption: 'Starter photo journal cover image',
    }
    starterPhotoJournal.gallery = [
      {
        _type: 'image',
        _key: 'starter-photo-1',
        asset: { _type: 'reference', _ref: journalImage._id },
        alt: 'Starter mountain frame',
        caption: 'Starter mountain frame',
      },
    ]

    starterVideo.thumbnail = {
      _type: 'image',
      asset: { _type: 'reference', _ref: videoImage._id },
      alt: 'Starter video thumbnail',
      caption: 'Starter video thumbnail',
    }

    await ensureDocument(starterSiteSettings)
  } else {
    console.log('Site Settings already exist; leaving the singleton untouched.')
  }

  for (const category of starterCategories) {
    await ensureDocument(category)
  }

  for (const destination of starterDestinations) {
    await ensureDocument(destination)
  }

  if (!(await client.getDocument(starterEssay._id))) {
    const essayImage = await uploadImage(ESSAY_IMAGE_URL, 'travellers-diary-essay.jpg')
    starterEssay.coverImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: essayImage._id },
      alt: 'Starter essay cover image',
      caption: 'Starter essay cover image',
    }
    await ensureDocument(starterEssay)
  }

  if (!(await client.getDocument(starterPhotoJournal._id))) {
    const journalImage = await uploadImage(JOURNAL_IMAGE_URL, 'travellers-diary-journal.jpg')
    starterPhotoJournal.coverImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: journalImage._id },
      alt: 'Starter photo journal cover image',
      caption: 'Starter photo journal cover image',
    }
    starterPhotoJournal.gallery = [
      {
        _type: 'image',
        _key: 'starter-photo-1',
        asset: { _type: 'reference', _ref: journalImage._id },
        alt: 'Starter mountain frame',
        caption: 'Starter mountain frame',
      },
    ]
    await ensureDocument(starterPhotoJournal)
  }

  if (!(await client.getDocument(starterVideo._id))) {
    const videoImage = await uploadImage(VIDEO_IMAGE_URL, 'travellers-diary-video.jpg')
    starterVideo.thumbnail = {
      _type: 'image',
      asset: { _type: 'reference', _ref: videoImage._id },
      alt: 'Starter video thumbnail',
      caption: 'Starter video thumbnail',
    }
    await ensureDocument(starterVideo)
  }

  console.log('Traveller’s Diary starter content is ready.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
