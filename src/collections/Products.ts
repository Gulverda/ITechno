import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'specifications', // <-- ახალი ველი
      type: 'textarea',
      localized: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'rating', // <-- ახალი ველი (მაქს. 5.0)
      type: 'number',
      admin: {
        step: 0.1,
      },
      min: 0,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'stock', // <-- ახალი ველი (მარაგი)
      type: 'select',
      defaultValue: 'in-stock',
      localized: true, // თუ გინდა "მარაგშია" / "In Stock" გამოჩნდეს
      options: [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any,
      required: true,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands' as any,
    },
    {
      name: 'mainImage',
      type: 'relationship',
      relationTo: 'media' as any,
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media' as any,
          required: true,
        },
      ],
    },
  ],
}
