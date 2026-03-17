import { CollectionConfig } from 'payload'

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

        if (!req.url) {
          return Response.json({ error: 'URL is missing' }, { status: 400 })
        }

        const { searchParams } = new URL(req.url)
        const lang = searchParams.get('lang') || 'ka'

        const result = await payload.find({
          collection: 'products',
          depth: 2,
          limit: 1000,
          pagination: false,
          // აქ "as any" იმიტომ გვინდა, რომ TS-მა არ იჩხუბოს მკაცრ ტიპებზე
          locale: lang as any,
        })

        const dynamicFilters: Record<string, string[]> = {}

        result.docs.forEach((prod: any) => {
          prod.filter_values?.forEach((item: any) => {
            const groupObj = item.filter_group

            // მთავარი ცვლილება აქ არის:
            // როცა locale: lang გვაქვს, groupObj.name უკვე არის სტრინგი სწორ ენაზე
            // არ გამოიყენო groupObj.name?.ka !!!
            const groupName = typeof groupObj === 'object' ? groupObj.name : null

            const valText = typeof item.value_rel === 'object' ? item.value_rel.value : null

            if (groupName && valText) {
              if (!dynamicFilters[groupName]) dynamicFilters[groupName] = []
              if (!dynamicFilters[groupName].includes(valText)) {
                dynamicFilters[groupName].push(valText)
              }
            }
          })
        })

        // სორტირება
        Object.keys(dynamicFilters).forEach((key) => {
          dynamicFilters[key].sort()
        })

        return Response.json(dynamicFilters)
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
    // --- აქ იწყება დინამიური ფილტრების ნაწილი ---
    {
      name: 'filter_values',
      type: 'array',
      label: 'ფილტრაციის პარამეტრები',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'filter_group',
          type: 'relationship',
          relationTo: 'filters',
          required: true,
          label: 'ფილტრის ჯგუფი',
        },
        {
          name: 'value_rel',
          type: 'relationship',
          relationTo: 'filter-options',
          required: true,
          label: 'აირჩიეთ მნიშვნელობა',
          // ფუნქციას პირდაპირ ვეუბნებით, რომ დააბრუნებს Where-ს
          filterOptions: ({ siblingData }: any): any => {
            const currentGroup = siblingData?.filter_group

            if (currentGroup) {
              const groupId = typeof currentGroup === 'object' ? currentGroup.id : currentGroup

              return {
                // ვიყენებთ დინამიურ Key-ს, რომ TS-მა არ იჩხუბოს ინდექსებზე
                group: {
                  equals: groupId,
                },
              }
            }

            // თუ ჯგუფი არაა, ვაბრუნებთ ფილტრს, რომელიც არაფერს იპოვის (false-ის ნაცვლად)
            return {
              id: {
                exists: false,
              },
            }
          },
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
