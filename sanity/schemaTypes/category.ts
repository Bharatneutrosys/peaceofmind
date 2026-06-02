import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'regionLabel',
      media: 'coverImage',
      featured: 'featured',
      description: 'description',
    },
    prepare(selection) {
      const { title, subtitle, featured, description } = selection as {
        title?: string;
        subtitle?: string;
        featured?: boolean;
        description?: string;
      };

      return {
        title: title || 'Untitled category',
        subtitle:
          subtitle || description || (featured ? 'Show on homepage' : 'Travel category'),
        media: selection.media,
      };
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Category name shown on the website and in the Studio.',
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
      description: 'Auto-generated URL identifier for the category.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Optional short note about what this category covers.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional image used for category cards.',
    }),
    defineField({
      name: 'regionLabel',
      title: 'Travel Region',
      type: 'string',
      description: 'Optional editorial label such as Nepal, Europe, or South Asia.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on if the category should appear higher in the homepage.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear earlier in lists and sections.',
    }),
    defineField({
      name: 'isArchived',
      title: 'Hidden from Website',
      type: 'boolean',
      initialValue: false,
      description: 'Hide this category from the public website without deleting it.',
    }),
  ],
});
