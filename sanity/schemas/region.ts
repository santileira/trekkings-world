import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'region',
  title: 'Region',
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
      name: 'country',
      title: 'Country',
      type: 'reference',
      to: [{ type: 'country' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
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
      name: 'safetyInfo',
      title: 'Safety Information',
      description: 'Region-specific safety info: emergency frequencies, contacts, local tips',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'array', of: [{ type: 'block' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      subtitle: 'country.name.en',
      media: 'image',
    },
  },
});
