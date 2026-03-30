import { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Services Page',
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
      defaultValue: 'Services',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება (მაგ: "Services - KA")',
      },
    },

    // სერვისების მასივი
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
        {
          name: 'brands',
          type: 'array',
          fields: [{ name: 'name', type: 'text', localized: true }],
        },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'name', type: 'text', localized: true }],
        },
      ],
    },

    // CTA SECTION
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },

    // PAGE HEADER
    {
      name: 'header',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'sub', type: 'textarea', localized: true },
      ],
    },
  ],
}
