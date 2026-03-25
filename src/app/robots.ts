import { MetadataRoute } from 'next'
import { NextResponse } from 'next/server'

const isProduction = process.env.NEXT_PUBLIC_INDEXABLE === 'true'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/invoice-generator/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
