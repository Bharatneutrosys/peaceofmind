import { defineField, defineType } from 'sanity';

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      destination: 'destination.title',
      category: 'category.title',
      publishedAt: 'publishedAt',
      media: 'thumbnail',
      featured: 'featured',
      description: 'description',
    },
    prepare(selection) {
      const {
        title,
        destination,
        category,
        publishedAt,
        featured,
        description,
      } = selection as {
        title?: string;
        destination?: string;
        category?: string;
        publishedAt?: string;
        featured?: boolean;
        description?: string;
      };

      const when = publishedAt ? new Date(publishedAt).getFullYear() : null;

      return {
        title: title || 'Untitled video',
        subtitle:
          description ||
          [destination, category, when].filter(Boolean).join(' • ') ||
          (featured ? 'Show on homepage' : 'Video'),
        media: selection.media,
      };
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Video title shown on the homepage and in the Studio.',
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
      description: 'Auto-generated URL identifier for the video.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 4,
      description: 'Optional summary shown in the video feature.',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description: 'Paste a watch or embed-friendly YouTube URL here.',
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional thumbnail image for the video feature.',
    }),
    defineField({
      name: 'destination',
      title: 'Related Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      description: 'Optional destination connected to this video.',
    }),
    defineField({
      name: 'category',
      title: 'Travel Region',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional category connected to this video.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on if the video should appear first on the homepage.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'Optional publish date used for sorting.',
    }),
    defineField({
      name: 'isArchived',
      title: 'Hidden from Website',
      type: 'boolean',
      initialValue: false,
      description: 'Hide this video from the public website without deleting it.',
    }),
  ],
});
