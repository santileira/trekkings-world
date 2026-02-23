import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'trek',
  title: 'Trek',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      to: [{ type: 'country' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Moderate', value: 'moderate' },
          { title: 'Hard', value: 'hard' },
          { title: 'Expert', value: 'expert' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "1 day", "2-3 days", "4-5 days"',
    }),
    defineField({
      name: 'distance',
      title: 'Distance (km)',
      type: 'number',
    }),
    defineField({
      name: 'elevation',
      title: 'Elevation Gain (m)',
      type: 'number',
    }),
    defineField({
      name: 'bestSeason',
      title: 'Best Season',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'January', value: 'January' },
          { title: 'February', value: 'February' },
          { title: 'March', value: 'March' },
          { title: 'April', value: 'April' },
          { title: 'May', value: 'May' },
          { title: 'June', value: 'June' },
          { title: 'July', value: 'July' },
          { title: 'August', value: 'August' },
          { title: 'September', value: 'September' },
          { title: 'October', value: 'October' },
          { title: 'November', value: 'November' },
          { title: 'December', value: 'December' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
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
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Starting point of the trek',
    }),
    defineField({
      name: 'gpxTrack',
      title: 'GPX Track',
      type: 'file',
      options: {
        accept: '.gpx',
      },
    }),
    defineField({
      name: 'tips',
      title: 'Tips',
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
      name: 'essentialInfo',
      title: 'Essential Information (Importante a Saber)',
      type: 'object',
      description: 'Critical information that every trekker must know before attempting this trek',
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
      name: 'externalLinks',
      title: 'External Resources',
      type: 'array',
      description: 'Links to other websites/blogs about this trek',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Link Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description (optional)',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Official Links & Social Media',
      type: 'object',
      description: 'Official website and social media accounts for this trek/park',
      fields: [
        {
          name: 'website',
          title: 'Official Website',
          type: 'url',
          description: 'Official park or tourism website',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'Instagram profile URL (e.g., https://instagram.com/parquesnacionales)',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          description: 'Facebook page URL',
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          description: 'YouTube channel URL',
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
          description: 'Twitter/X profile URL',
        },
      ],
    }),
    defineField({
      name: 'hasRefugio',
      title: 'Has Refugio',
      type: 'boolean',
      description: 'Trek has a mountain refuge/shelter along the route',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'region.name.en',
      media: 'mainImage',
    },
  },
});
