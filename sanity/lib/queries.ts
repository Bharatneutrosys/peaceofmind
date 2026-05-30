import { groq } from 'next-sanity';

export const getDestinationsQuery = groq`
  *[_type == "destination"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    region,
    description,
    coverImage {
      asset,
      "url": asset->url,
      hotspot,
      crop
    }
  }
`;

export const getPhotoJournalsQuery = groq`
  *[_type == "photoJournal"] | order(_createdAt desc) {
    _id,
    title,
    "destination": destination->title,
    coverImage {
      asset,
      "url": asset->url,
      hotspot,
      crop
    },
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

export const getEssaysQuery = groq`
  *[_type == "essay"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    coverImage {
      asset,
      "url": asset->url,
      hotspot,
      crop
    },
    date,
    "destination": destination->title,
    body
  }
`;
