import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) return NextResponse.json([])

  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      or: [
        { title: { contains: query } },
        { description: { contains: query } },
        { slug: { contains: query } },
      ],
    },
    limit: 10,
    depth: 1, // რომ mainImage-იც წამოიღოს
  })

  return NextResponse.json(products.docs)
}
