import { CollectionConfig } from 'payload'

export const AboutUs: CollectionConfig = {
  slug: 'about-us',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    // TOP-LEVEL TITLE (admin პანელისთვის)
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'About Us',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება (მაგ: "About Us - კა")',
      },
    },

    // HERO SECTION
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'titleBlue', type: 'text', required: true, localized: true },
        { name: 'titleBlack', type: 'text', required: true, localized: true },
        { name: 'story', type: 'textarea', required: true, localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },

    // PRIORITY SECTION
    {
      name: 'priority',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'sub', type: 'textarea', localized: true },
        { name: 'analysis', type: 'textarea', localized: true },
      ],
    },

    // DIRECTIONS (6 სერვისი)
    {
      name: 'directions',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        {
          name: 'items',
          type: 'array',
          minRows: 6,
          maxRows: 6,
          fields: [
            { name: 'title', type: 'text', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
          ],
        },
      ],
    },

    // SUPPORT
    {
      name: 'support',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true },
        { name: 'text1', type: 'textarea', localized: true },
        { name: 'text2', type: 'textarea', localized: true },
      ],
    },

    // WHY US
    {
      name: 'whyUs',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', localized: true },
            { name: 'text', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}
