import { groq } from 'next-sanity';

const imageFields = `
  asset,
  "url": asset->url,
  hotspot,
  crop
`;

export const getSiteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    _id,
    brandName,
    tagline,
    shortDescription,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    contactEmail,
    authorDisplayName,
    authorBio,
    authorImage { ${imageFields} },
    heroImage { ${imageFields} },
    heroHeadline,
    heroSubheading
  }
`;

export const getCategoriesQuery = groq`
  *[_type == "category"] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    featured,
    order,
    coverImage { ${imageFields} }
  }
`;

export const getFeaturedCategoriesQuery = groq`
  *[_type == "category" && featured == true] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    featured,
    order,
    coverImage { ${imageFields} }
  }
`;

export const getDestinationsQuery = groq`
  *[_type == "destination"] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    region,
    description,
    shortIntro,
    country,
    featured,
    order,
    category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} }
  }
`;

export const getFeaturedDestinationsQuery = groq`
  *[_type == "destination" && featured == true] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    region,
    description,
    shortIntro,
    country,
    featured,
    order,
    category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} }
  }
`;

export const getLatestEssaysQuery = groq`
  *[_type == "essay"] | order(date desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featured,
    estimatedReadTime,
    tags,
    publishedAt,
    coverImage { ${imageFields} },
    date,
    "destination": destination->title,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    body
  }
`;

export const getFeaturedEssaysQuery = groq`
  *[_type == "essay" && featured == true] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featured,
    estimatedReadTime,
    tags,
    publishedAt,
    coverImage { ${imageFields} },
    date,
    "destination": destination->title,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    body
  }
`;

export const getEssaysQuery = groq`
  *[_type == "essay"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featured,
    estimatedReadTime,
    tags,
    publishedAt,
    coverImage { ${imageFields} },
    date,
    "destination": destination->title,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    body
  }
`;

export const getLatestPhotoJournalsQuery = groq`
  *[_type == "photoJournal"] | order(coalesce(publishedAt, _createdAt) desc) [0...4] {
    _id,
    title,
    excerpt,
    featured,
    tags,
    publishedAt,
    "destination": destination->title,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} },
    gallery[] {
      _key,
      asset,
      "url": asset->url,
      alt,
      caption,
      hotspot,
      crop
    },
    featuredVideoUrl
  }
`;

export const getFeaturedPhotoJournalsQuery = groq`
  *[_type == "photoJournal" && featured == true] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    excerpt,
    featured,
    tags,
    publishedAt,
    "destination": destination->title,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} },
    gallery[] {
      _key,
      asset,
      "url": asset->url,
      alt,
      caption,
      hotspot,
      crop
    },
    featuredVideoUrl
  }
`;

export const getPhotoJournalsQuery = groq`
  *[_type == "photoJournal"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    excerpt,
    featured,
    tags,
    publishedAt,
    "destination": destination->title,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} },
    gallery[] {
      _key,
      asset,
      "url": asset->url,
      alt,
      caption,
      hotspot,
      crop
    },
    featuredVideoUrl
  }
`;

export const getGalleryImagesQuery = groq`
  *[_type == "photoJournal"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    gallery[] {
      _key,
      asset,
      "url": asset->url,
      alt,
      caption,
      hotspot,
      crop
    },
    coverImage { ${imageFields} }
  }
`;

export const getFeaturedVideoQuery = groq`
  *[_type == "video" && featured == true] | order(coalesce(publishedAt, _createdAt) desc) [0] {
    _id,
    title,
    description,
    youtubeUrl,
    featured,
    publishedAt,
    thumbnail { ${imageFields} },
    destination->{
      _id,
      title,
      "slug": slug.current
    },
    category->{
      _id,
      title,
      "slug": slug.current
    }
  }
`;
