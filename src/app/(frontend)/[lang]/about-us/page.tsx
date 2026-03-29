import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import AboutusClient from './AboutusClient'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ lang: string }>
}

// AboutUs დოკუმენტის ტიპი (payload-types.ts გენერაციამდე ხელით ვწერთ)
type AboutUsDoc = {
  hero: {
    titleBlue: string
    titleBlack: string
    story: string
    image: string | { url: string; alt?: string }
  }
  priority: {
    title: string
    sub: string
    analysis: string
  }
  directions: {
    title: string
    items: Array<{
      title: string
      image: string | { url: string; alt?: string }
    }>
  }
  support: {
    badge: string
    title: string
    text1: string
    text2: string
  }
  whyUs: {
    badge: string
    title: string
    items: Array<{
      title: string
      text: string
    }>
  }
}

// --- 1. SENIOR SEO: DYNAMIC METADATA FROM PAYLOAD ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const payload = await getPayload({ config: configPromise })
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'en' | 'ka'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const aboutData = await payload.find({
    collection: 'about-us' as any,
    locale: currentLang,
    limit: 1,
  })

  const doc = aboutData.docs[0] as unknown as AboutUsDoc | undefined

  const title = doc?.hero?.titleBlue
    ? `${doc.hero.titleBlue} ${doc.hero.titleBlack}`
    : currentLang === 'ka'
      ? 'ჩვენს შესახებ | I-TECHNO'
      : 'About Us | I-TECHNO'

  const description =
    doc?.hero?.story?.slice(0, 160) ||
    (currentLang === 'ka'
      ? 'გაიცანით I-TECHNO. ჩვენ გთავაზობთ უმაღლესი ხარისხის უსაფრთხოების სისტემებს საქართველოში.'
      : 'Meet I-TECHNO. High-quality security systems in Georgia.')

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${currentLang}/about-us`,
      languages: {
        'ka-GE': `${baseUrl}/ka/about-us`,
        'en-US': `${baseUrl}/en/about-us`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${currentLang}/about-us`,
      siteName: 'I-TECHNO',
      type: 'website',
      images: [{ url: '/og-about.jpg', width: 1200, height: 630, alt: 'About I-TECHNO' }],
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'en' | 'ka'
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const aboutData = await payload.find({
    collection: 'about-us' as any,
    locale: currentLang,
    limit: 1,
  })

  if (!aboutData.docs.length) {
    return notFound()
  }

  const t = aboutData.docs[0] as unknown as AboutUsDoc

  // --- 2. SENIOR SEO: ORGANIZATION SCHEMA ---
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'I-TECHNO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: t.hero?.story,
    sameAs: ['https://facebook.com/itechno', 'https://instagram.com/itechno'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <AboutusClient lang={lang} t={t} />
    </>
  )
}
