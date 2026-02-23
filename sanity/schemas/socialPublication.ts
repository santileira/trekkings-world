import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'socialPublication',
  title: 'Social Publication',
  type: 'document',
  fields: [
    defineField({
      name: 'trek',
      title: 'Trek',
      type: 'reference',
      to: [{ type: 'trek' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Bluesky', value: 'bluesky' },
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'Instagram', value: 'instagram' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locale',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'Spanish', value: 'es' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'es',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalId',
      title: 'External Post ID',
      type: 'string',
      description: 'ID of the post on the external platform',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to the post on the external platform',
    }),
    defineField({
      name: 'content',
      title: 'Content Published',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
    }),
    defineField({
      name: 'success',
      title: 'Success',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'error',
      title: 'Error Message',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'trek.title.es',
      platform: 'platform',
      success: 'success',
      date: 'publishedAt',
    },
    prepare({ title, platform, success, date }) {
      const statusIcon = success ? '✅' : '❌';
      const platformIcons: Record<string, string> = {
        bluesky: '🦋',
        twitter: '🐦',
        instagram: '📷',
      };
      const platformIcon = platformIcons[platform as string] || '📱';

      return {
        title: `${platformIcon} ${title || 'Unknown Trek'}`,
        subtitle: `${statusIcon} ${new Date(date).toLocaleDateString()}`,
      };
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
