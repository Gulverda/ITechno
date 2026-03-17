import { CollectionConfig } from 'payload'

export const FilterOptions: CollectionConfig = {
  slug: 'filter-options',
  admin: {
    useAsTitle: 'value',
    group: 'Shop Content',
  },
  fields: [
    {
      name: 'value',
      type: 'text',
      required: true,
      label: 'მნიშვნელობა (მაგ: 4MP)',
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'filters',
      required: true,
    },
  ],
}
