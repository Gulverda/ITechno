import { CollectionConfig } from 'payload'

export const Filters: CollectionConfig = {
  slug: 'filters',
  admin: {
    useAsTitle: 'name',
    group: 'Shop Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'ფილტრის ჯგუფის სახელი (მაგ: რეზოლუცია)',
    },
  ],
}
