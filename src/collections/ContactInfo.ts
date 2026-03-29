import { CollectionConfig } from 'payload'

export const ContactInfo: CollectionConfig = {
  slug: 'contact-info',
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
      defaultValue: 'Contact Info',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება',
      },
    },
    {
      name: 'infoTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'social',
      type: 'text',
      localized: true,
    },
    {
      name: 'address',
      type: 'text',
      localized: true,
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      admin: {
        description: 'Google Maps embed src URL',
      },
    },
  ],
}
