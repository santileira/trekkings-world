import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      name: 'code',
      title: 'Country Code',
      type: 'string',
      description: 'ISO 3166-1 alpha-2 code (e.g., ar, cl, us)',
      validation: (Rule) => Rule.required().max(2),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'code',
        maxLength: 2,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'flag',
      title: 'Flag Emoji',
      type: 'string',
    }),
    defineField({
      name: 'safetyInfo',
      title: 'Safety Information',
      description: 'Country-wide safety info: emergency numbers, national rescue organizations, common frequencies',
      type: 'object',
      fields: [
        {
          name: 'es',
          title: 'Spanish',
          type: 'array',
          of: [{ type: 'block' }],
        },
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Show this country in the menu',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      subtitle: 'code',
      media: 'image',
    },
  },
});
