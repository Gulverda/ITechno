import { CollectionConfig } from 'payload'

export const CategoryBar: CollectionConfig = {
  slug: 'category-bar',
  admin: {
    useAsTitle: 'title',
    group: 'Main Page',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Category Bar',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება',
      },
    },
    {
      name: 'allShopLabel',
      type: 'text',
      localized: true,
      admin: {
        description: 'პირველი ღილაკის ტექსტი (მაგ: "ყველა" / "All Shop")',
      },
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          hasMany: false,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'ბარათის ფონის სურათი',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'პატარა ხატულა (SVG/PNG, თეთრი ფონზე)',
          },
        },
      ],
    },
  ],
}
