import { defineField, defineType } from 'sanity';

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
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
      title: 'Region / Category',
      type: 'string',
      description: 'Optional label for grouping destinations, such as Nepal, South Asia, or Europe.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional reusable category reference for site-wide grouping.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Optional short description for the destination card.',
    }),
    defineField({
      name: 'shortIntro',
      title: 'Short Intro',
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
      title: 'Featured on Homepage',
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
