import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  preview: {
    select: {
      title: 'brandName',
      subtitle: 'tagline',
      media: 'heroImage',
    },
    prepare(selection) {
      const { title, subtitle } = selection as {
        title?: string;
        subtitle?: string;
      };

      return {
        title: title || "Traveller's Diary",
        subtitle: subtitle || 'Homepage settings and brand details',
        media: selection.media,
      };
    },
  },
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: "Traveller's Diary",
      description: 'Primary name shown across the website.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Secondary Brand Line',
      type: 'string',
      description: 'Optional shorter line for the brand, if you want one.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short line used in the hero or close to the brand.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Homepage Introduction',
      type: 'text',
      rows: 3,
      description: 'A short introduction for the homepage and footer.',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook Page URL',
      type: 'url',
      description: 'Paste your official Facebook page link here.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Profile URL',
      type: 'url',
      description: 'Paste your official Instagram profile link here.',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Channel URL',
      type: 'url',
      description: 'Paste your official YouTube channel link here.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email',
      description: 'Optional email address for enquiries or collaboration.',
    }),
    defineField({
      name: 'authorDisplayName',
      title: 'Author Display Name',
      type: 'string',
      description: 'Optional display name for the author profile.',
    }),
    defineField({
      name: 'authorBio',
      title: 'Author Bio',
      type: 'text',
      rows: 5,
      description: 'A short biography for the philosophy section.',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Portrait image shown in the philosophy section.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Main image used at the top of the homepage.',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'The main hero headline shown on the homepage.',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 3,
      description: 'Short supporting copy under the hero headline.',
    }),
    defineField({
      name: 'heroAuthorImage',
      title: 'Hero Author Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional portrait or creator image shown in the hero author card.',
    }),
    defineField({
      name: 'heroQuote',
      title: 'Hero Quote',
      type: 'text',
      rows: 3,
      description: 'A short personal quote shown in the hero author card.',
    }),
    defineField({
      name: 'heroIntroShort',
      title: 'Hero Short Intro',
      type: 'text',
      rows: 3,
      description: 'A short author intro shown in the hero author card.',
    }),
    defineField({
      name: 'youtubeFeatureTitle',
      title: 'YouTube Feature Title',
      type: 'string',
      description: 'Optional title for the featured video section.',
    }),
    defineField({
      name: 'youtubeFeatureDescription',
      title: 'YouTube Feature Description',
      type: 'text',
      rows: 3,
      description: 'Optional description for the featured video section.',
    }),
    defineField({
      name: 'youtubeFeatureUrl',
      title: 'Featured Video Link',
      type: 'url',
      description: 'Optional YouTube link for the homepage video feature.',
    }),
  ],
});
