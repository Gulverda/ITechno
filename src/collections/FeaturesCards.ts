import { CollectionConfig } from 'payload'

export const FeaturesCards: CollectionConfig = {
  slug: 'features-cards',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Features Cards',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
