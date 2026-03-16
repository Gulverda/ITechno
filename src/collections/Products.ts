import { CollectionConfig } from 'payload'

interface SpecRow {
  res: string | null
  cap: string | null
  tech: string | null
  conn: string | null
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'price', 'isPopular', 'category'],
    group: 'Shop Content',
  },
  endpoints: [
    {
      path: '/unique-specs',
      method: 'get',
      handler: async (req) => {
        const { payload } = req

        // SQL Query
        const result = await payload.db.drizzle.execute(
          'SELECT DISTINCT ' +
            'specifications_group_resolution as res, ' +
            'specifications_group_capacity as cap, ' +
            'specifications_group_technology as tech, ' +
            'specifications_group_connection_type as conn ' +
            'FROM products',
        )

        // ვუკავშირებთ შედეგს ჩვენს ინტერფეისს
        const rows = result.rows as unknown as SpecRow[]

        // დამხმარე ფუნქცია უნიკალური და სუფთა მასივის მისაღებად
        const getUnique = (arr: (string | null)[]) =>
          [...new Set(arr.filter((v): v is string => !!v))].sort()

        return Response.json({
          resolutions: getUnique(rows.map((r) => r.res)),
          capacities: getUnique(rows.map((r) => r.cap)),
          technologies: getUnique(rows.map((r) => r.tech)),
          connectionTypes: getUnique(rows.map((r) => r.conn)),
        })
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
      label: 'პოპულარული პროდუქტი',
      admin: {
        position: 'sidebar',
        description: 'მონიშნეთ, თუ გსურთ გამოჩნდეს მთავარ სლაიდერში',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.title) {
              const titleToConvert =
                typeof data.title === 'object' ? data.title.en || data.title.ka : data.title

              return String(titleToConvert)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return value
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
      name: 'specifications_group',
      type: 'group',
      label: 'ტექნიკური მახასიათებლები',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'resolution',
          type: 'text',
          localized: false,
        },
        {
          name: 'capacity',
          type: 'text',
          localized: false,
        },
        {
          name: 'size',
          type: 'text',
          localized: false,
        },
        {
          name: 'connectionType',
          type: 'text',
          localized: false,
        },
        {
          name: 'technology',
          type: 'text',
          localized: false,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'discountPrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'stock',
      type: 'select',
      defaultValue: 'in-stock',
      options: [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
    },
    {
      name: 'mainImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
