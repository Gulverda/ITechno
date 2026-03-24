import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'updatedAt'],
    group: 'Shop Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (!data) return undefined
            if (operation === 'create' || (operation === 'update' && !data.slug)) {
              const nameToConvert = data?.name?.en || data?.name?.ka || data?.name
              if (nameToConvert) {
                return slugify(nameToConvert, { lower: true, strict: true })
              }
            }
            return data?.slug
          },
        ],
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'assignedFilters',
      type: 'relationship',
      relationTo: 'filters',
      hasMany: true,
      label: 'მიბმული ფილტრები',
      admin: {
        description:
          'აირჩიეთ ფილტრის ჯგუფები (მაგ: რეზოლუცია), რომლებიც ამ კატეგორიაში უნდა გამოჩნდეს',
      },
    },
  ],
}
