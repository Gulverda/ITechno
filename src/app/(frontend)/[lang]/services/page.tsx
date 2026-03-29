import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ServicesClient from './ServicesClient'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ lang: string }>
}

type ServicesDoc = {
  items: Array<{
    id?: string
    title: string
    description: string
    brands?: Array<{ name: string }>
    features?: Array<{ name: string }>
  }>
  cta: {
    title: string
    text: string
  }
  header: {
    badge: string
    heading: string
    sub: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'en' | 'ka'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const payload = await getPayload({ config: configPromise })
  const data = await payload.find({
    collection: 'services' as any,
    locale: currentLang,
    limit: 1,
  })

  const doc = data.docs[0] as unknown as ServicesDoc | undefined

  const title =
    doc?.header?.heading || (currentLang === 'ka' ? 'სერვისები | I-TECHNO' : 'Services | I-TECHNO')

  const description =
    doc?.header?.sub?.slice(0, 160) ||
    (currentLang === 'ka'
      ? 'I-TECHNO გთავაზობთ უსაფრთხოების სისტემების სრულ სპექტრს.'
      : 'I-TECHNO offers a full range of security systems.')

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${currentLang}/services`,
      languages: {
        'ka-GE': `${baseUrl}/ka/services`,
        'en-US': `${baseUrl}/en/services`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${currentLang}/services`,
      siteName: 'I-TECHNO',
      type: 'website',
    },
  }
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'en' | 'ka'
  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'services' as any,
    locale: currentLang,
    limit: 1,
  })

  if (!data.docs.length) {
    return notFound()
  }

  const t = data.docs[0] as unknown as ServicesDoc

  return <ServicesClient lang={lang} t={t} />
}
