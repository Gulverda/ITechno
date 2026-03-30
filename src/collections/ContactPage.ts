import { CollectionConfig } from 'payload'

export const ContactPage: CollectionConfig = {
  slug: 'contact-page',
  admin: {
    useAsTitle: 'title',
    group: 'Contact Page',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Contact Page',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება',
      },
    },
    {
      name: 'contactPageTitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Hero სათაური (საიტზე გამოჩნდება)',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
  ],
}
