// collections/Reviews.ts
import { CollectionConfig } from 'payload'
import { recalculateRating } from './hooks/recalculateRating'
import { preventSpam } from './hooks/preventSpam' // ახალი ჰუკი

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: () => true,
    read: () => true,
  },
  hooks: {
    // ჩაწერამდე ვამოწმებთ IP-ს, ჩაწერის შემდეგ ვითვლით რეიტინგს
    beforeChange: [preventSpam],
    afterChange: [recalculateRating],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
    },
    {
      name: 'ipHash',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
