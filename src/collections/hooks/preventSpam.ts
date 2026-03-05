import { CollectionBeforeChangeHook } from 'payload'
import crypto from 'crypto'
import { headers } from 'next/headers' // 👈 ეს დაგვეხმარება IP-ის ამოღებაში

export const preventSpam: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data

  // 1. უსაფრთხოდ ამოვიღოთ IP (Next.js-ის და Payload-ის კომბინაციით)
  const headerList = await headers()
  const rawIp = headerList.get('x-forwarded-for')?.split(',')[0] || (req as any).ip || '127.0.0.1'

  // 2. დავჰეშოთ (რომ IP პირდაპირ არ შევინახოთ ბაზაში)
  const hashedIp = crypto.createHash('sha256').update(rawIp).digest('hex')

  // 3. შევამოწმოთ დუბლიკატი
  const existingReview = await req.payload.find({
    collection: 'reviews',
    depth: 0,
    where: {
      and: [{ product: { equals: data.product } }, { ipHash: { equals: hashedIp } }],
    },
  })

  if (existingReview.totalDocs > 0) {
    throw new Error('თქვენ უკვე შეაფასეთ ეს პროდუქტი')
  }

  // 4. დავუბრუნოთ ჰეში ბაზაში ჩასაწერად
  return {
    ...data,
    ipHash: hashedIp,
  }
}
