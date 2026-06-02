import { defineField, defineType } from 'sanity';

export const photoJournal = defineType({
  name: 'photoJournal',
  title: 'Photo Journal',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      destination: 'destination.title',
      category: 'category.title',
      publishedAt: 'publishedAt',
      media: 'coverImage',
      galleryThumb: 'gallery.0',
      featured: 'featured',
      excerpt: 'excerpt',
    },
    prepare(selection) {
      const {
        title,
        destination,
        category,
        publishedAt,
        featured,
        excerpt,
      } = selection as {
        title?: string;
        destination?: string;
        category?: string;
        publishedAt?: string;
        featured?: boolean;
        excerpt?: string;
      };

      return {
        title: title || 'Untitled photo journal',
        subtitle:
          excerpt ||
          [destination, category, publishedAt && new Date(publishedAt).getFullYear()]
            .filter(Boolean)
            .join(' • ') || (featured ? 'Show on homepage' : 'Photo journal'),
        media: selection.media || selection.galleryThumb,
      };
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Photo journal title shown on the website.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Auto-generated URL identifier for the photo journal.',
    }),
    defineField({
      name: 'destination',
      title: 'Related Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      description: 'Reference to the place featured in this photo journal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Travel Region',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional category reference for grouping photo journals.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Cover image used on the homepage and archive cards.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      description: 'Add one or more images for the gallery grid.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Describe the image for accessibility and search.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption shown with the image.',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Introduction',
      type: 'text',
      rows: 4,
      description: 'Short summary used on the homepage and archive cards.',
    }),
    defineField({
      name: 'featuredVideoUrl',
      title: 'Featured Video Link',
      type: 'url',
      description: 'Optional YouTube or video URL for future homepage embedding.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'Optional publishing date for sorting and display.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on if the journal should appear first on the homepage.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional keywords for the photo journal.',
    }),
    defineField({
      name: 'isArchived',
      title: 'Hidden from Website',
      type: 'boolean',
      initialValue: false,
      description: 'Hide this photo journal from the public website without deleting it.',
    }),
  ],
});
