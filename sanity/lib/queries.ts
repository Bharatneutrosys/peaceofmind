import { groq } from 'next-sanity';

export const getDestinationsQuery = groq`
  *[_type == "destination"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

export const getPhotoJournalsQuery = groq`
  *[_type == "photoJournal"] | order(_createdAt desc) {
    _id,
    title,
    "destination": destination->title,
    coverImage {
      asset->{
        _id,
        url
      },
      hotspot,
      crop
    },
    gallery[] {
      _key,
      asset->{
        _id,
        url
      },
      alt,
      caption,
      hotspot,
      crop
    }
  }
`;

export const getEssaysQuery = groq`
  *[_type == "essay"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    coverImage {
      asset->{
        _id,
        url
      },
      hotspot,
      crop
    },
    date,
    "destination": destination->title,
    body
  }
`;
