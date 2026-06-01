import { defineField, defineType } from 'sanity';

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'country',
      region: 'region',
      category: 'category.title',
      media: 'coverImage',
      featured: 'featured',
      description: 'description',
    },
    prepare(selection) {
      const {
        title,
        subtitle,
        region,
        category,
        featured,
        description,
      } = selection as {
        title?: string;
        subtitle?: string;
        region?: string;
        category?: string;
        featured?: boolean;
        description?: string;
      };

      return {
        title: title || 'Untitled destination',
        subtitle:
          subtitle ||
          region ||
          category ||
          description ||
          (featured ? 'Show on homepage' : 'Destination'),
        media: selection.media,
      };
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Destination name shown on the website.',
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
      description: 'Auto-generated URL identifier for the destination.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Travel Region',
      type: 'string',
      description: 'Optional label for grouping destinations, such as Nepal, South Asia, or Europe.',
    }),
    defineField({
      name: 'category',
      title: 'Related Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional reusable category reference for site-wide grouping.',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 4,
      description: 'Optional short description for the destination card.',
    }),
    defineField({
      name: 'shortIntro',
      title: 'Short Introduction',
      type: 'text',
      rows: 3,
      description: 'A brief introduction for the destination section.',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Optional country name for this destination.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional image used on destination cards.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on if the destination should appear higher in lists.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear earlier in lists and sections.',
    }),
  ],
});
