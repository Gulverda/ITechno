import { CollectionConfig } from 'payload'

export const HeroSlider: CollectionConfig = {
  slug: 'hero-slider',
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
      defaultValue: 'Hero Slider',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება',
      },
    },
    {
      name: 'buttonAllProducts',
      type: 'text',
      localized: true,
      admin: {
        description: 'ღილაკი 1 - ტექსტი (მაგ: "ყველა პროდუქტი")',
      },
    },
    {
      name: 'buttonOurServices',
      type: 'text',
      localized: true,
      admin: {
        description: 'ღილაკი 2 - ტექსტი (მაგ: "ჩვენი სერვისები")',
      },
    },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link1',
          type: 'text',
          required: true,
          admin: { description: 'ღილაკი 1 - ლინკი (მაგ: /ka/products)' },
        },
        {
          name: 'link2',
          type: 'text',
          required: true,
          admin: { description: 'ღილაკი 2 - ლინკი (მაგ: /ka/about-us)' },
        },
      ],
    },
  ],
}
