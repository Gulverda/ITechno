import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'price', 'category'],
    group: 'Shop Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'უნიკალური URL იდენტიფიკატორი',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return value?.toLowerCase().trim()
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'specifications',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'stock',
      type: 'select',
      defaultValue: 'in-stock',
      localized: true,
      options: [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
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
      labels: {
        singular: 'Gallery Image',
        plural: 'Gallery Images',
      },
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
