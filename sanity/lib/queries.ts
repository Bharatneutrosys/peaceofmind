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
    subtitle,
    tagline,
    shortDescription,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    contactEmail,
    authorDisplayName,
    authorBio,
    authorImage { ${imageFields} },
    "authorImageUrl": authorImage.asset->url,
    authorImageZoom,
    authorImagePositionX,
    authorImagePositionY,
    heroImage { ${imageFields} },
    "heroImageUrl": heroImage.asset->url,
    heroHeadline,
    heroSubheading,
    heroAuthorImage { ${imageFields} },
    "heroAuthorImageUrl": heroAuthorImage.asset->url,
    heroQuote,
    heroIntroShort,
    youtubeFeatureTitle,
    youtubeFeatureDescription,
    youtubeFeatureUrl
  }
`;

export const getCategoriesQuery = groq`
  *[_type == "category" && isArchived != true] | order(featured desc, coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    regionLabel,
    featured,
    order,
    coverImage { ${imageFields} }
  }
`;

export const getAllCategoriesQuery = getCategoriesQuery;

export const getFeaturedCategoriesQuery = groq`
  *[_type == "category" && featured == true && isArchived != true] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    regionLabel,
    featured,
    order,
    coverImage { ${imageFields} }
  }
`;

export const getDestinationsQuery = groq`
  *[_type == "destination" && isArchived != true] | order(featured desc, coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    region,
    description,
    shortIntro,
    country,
    featured,
    order,
    parentDestination->{
      _id,
      title,
      "slug": slug.current,
      country
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      description,
      regionLabel,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} }
  }
`;

export const getAllDestinationsQuery = getDestinationsQuery;

export const getDestinationBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug && isArchived != true][0] {
    _id,
    title,
    "slug": slug.current,
    region,
    description,
    shortIntro,
    country,
    featured,
    order,
    parentDestination->{
      _id,
      title,
      "slug": slug.current,
      country
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      description,
      regionLabel,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} },
    "children": *[_type == "destination" && parentDestination._ref == ^._id && isArchived != true] | order(coalesce(order, 9999) asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      region,
      description,
      shortIntro,
      country,
      featured,
      order,
      coverImage { ${imageFields} },
      category->{
        _id,
        title,
        "slug": slug.current,
        description,
        regionLabel,
        featured,
        order,
        coverImage { ${imageFields} }
      }
    }
  }
`;

export const getFeaturedDestinationsQuery = groq`
  *[_type == "destination" && featured == true && isArchived != true] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    region,
    description,
    shortIntro,
    country,
    featured,
    order,
    parentDestination->{
      _id,
      title,
      "slug": slug.current,
      country
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      description,
      regionLabel,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    coverImage { ${imageFields} }
  }
`;

export const getLatestEssaysQuery = groq`
  *[_type == "essay" && isArchived != true] | order(featured desc, coalesce(publishedAt, date) desc, title asc) [0...3] {
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
      regionLabel,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    body
  }
`;

export const getFeaturedEssaysQuery = groq`
  *[_type == "essay" && featured == true && isArchived != true] | order(coalesce(order, 9999) asc, coalesce(publishedAt, date) desc, title asc) {
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
  *[_type == "essay" && isArchived != true] | order(featured desc, coalesce(order, 9999) asc, coalesce(publishedAt, date) desc, title asc) {
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

export const getAllEssaysQuery = getEssaysQuery;

export const getEssayBySlugQuery = groq`
  *[_type == "essay" && slug.current == $slug && isArchived != true][0] {
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
    "destination": destination->{
      _id,
      title,
      "slug": slug.current
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      regionLabel,
      featured,
      order,
      coverImage { ${imageFields} }
    },
    body
  }
`;

export const getRelatedEssaysByDestinationQuery = groq`
  *[_type == "essay" && destination._ref == $destinationId && isArchived != true] | order(featured desc, coalesce(publishedAt, date) desc, title asc) {
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
    "destination": destination->{
      _id,
      title,
      "slug": slug.current
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      regionLabel,
      featured,
      order,
      coverImage { ${imageFields} }
    }
  }
`;

export const getLatestPhotoJournalsQuery = groq`
  *[_type == "photoJournal" && isArchived != true] | order(featured desc, coalesce(publishedAt, _createdAt) desc, title asc) [0...4] {
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
  *[_type == "photoJournal" && featured == true && isArchived != true] | order(coalesce(order, 9999) asc, coalesce(publishedAt, _createdAt) desc, title asc) {
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
  *[_type == "photoJournal" && isArchived != true] | order(featured desc, coalesce(order, 9999) asc, coalesce(publishedAt, _createdAt) desc, title asc) {
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

export const getAllPhotoJournalsQuery = getPhotoJournalsQuery;

export const getRelatedPhotoJournalsByDestinationQuery = groq`
  *[_type == "photoJournal" && destination._ref == $destinationId && isArchived != true] | order(featured desc, coalesce(publishedAt, _createdAt) desc, title asc) {
    _id,
    title,
    excerpt,
    featured,
    tags,
    publishedAt,
    "destination": destination->{
      _id,
      title,
      "slug": slug.current
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      regionLabel,
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
  *[_type == "photoJournal" && isArchived != true] | order(featured desc, coalesce(order, 9999) asc, coalesce(publishedAt, _createdAt) desc, title asc) {
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
  *[_type == "video" && featured == true && isArchived != true] | order(coalesce(publishedAt, _createdAt) desc, title asc) [0] {
    _id,
    title,
    description,
    youtubeUrl,
    featured,
    publishedAt,
    "slug": slug.current,
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

export const getAllVideosQuery = groq`
  *[_type == "video" && isArchived != true] | order(featured desc, coalesce(publishedAt, _createdAt) desc, title asc) {
    _id,
    title,
    description,
    youtubeUrl,
    featured,
    publishedAt,
    "slug": slug.current,
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

export const getAdminCategoriesQuery = groq`
  *[_type == "category"] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    regionLabel,
    featured,
    order,
    isArchived,
    coverImage { ${imageFields} },
    "coverImageUrl": coverImage.asset->url
  }
`;

export const getAdminDestinationsQuery = groq`
  *[_type == "destination"] | order(coalesce(order, 9999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    country,
    shortIntro,
    description,
    featured,
    order,
    isArchived,
    "categoryId": category._ref,
    "parentDestinationId": parentDestination._ref,
    coverImage { ${imageFields} },
    "coverImageUrl": coverImage.asset->url
  }
`;

export const getAdminEssaysQuery = groq`
  *[_type == "essay"] | order(coalesce(publishedAt, date, _createdAt) desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "destinationId": destination._ref,
    "categoryId": category._ref,
    publishedAt,
    featured,
    isArchived,
    estimatedReadTime,
    coverImage { ${imageFields} },
    "coverImageUrl": coverImage.asset->url,
    "bodyText": array::join(body[_type == "block"].children[].text, "\n\n")
  }
`;

export const getAdminPhotoJournalsQuery = groq`
  *[_type == "photoJournal"] | order(coalesce(publishedAt, _createdAt) desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "destinationId": destination._ref,
    "categoryId": category._ref,
    publishedAt,
    featured,
    isArchived,
    coverImage { ${imageFields} },
    "coverImageUrl": coverImage.asset->url,
    gallery[] {
      _key,
      asset,
      "url": asset->url,
      alt,
      caption
    }
  }
`;

export const getAdminVideosQuery = groq`
  *[_type == "video"] | order(coalesce(publishedAt, _createdAt) desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    youtubeUrl,
    publishedAt,
    featured,
    isArchived,
    "destinationId": destination._ref,
    "categoryId": category._ref,
    thumbnail { ${imageFields} },
    "thumbnailUrl": thumbnail.asset->url
  }
`;
