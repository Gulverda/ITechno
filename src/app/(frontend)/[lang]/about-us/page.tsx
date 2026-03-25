import React from 'react'
import { Metadata } from 'next'
import dict from '@/lib/translations.json'
import AboutusClient from './AboutusClient'

interface Props {
  params: Promise<{ lang: string }>
}

// --- 1. SENIOR SEO: DYNAMIC METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const currentLang = lang === 'en' ? 'en' : 'ka'

  const title = currentLang === 'ka' ? 'ჩვენს შესახებ' : 'About Us'
  const description =
    currentLang === 'ka'
      ? 'გაიცანით I-TECHNO. ჩვენ გთავაზობთ უმაღლესი ხარისხის ვიდეომეთვალყურეობის, სამეთვალყურეო და უსაფრთხოების სისტემებს საქართველოში.'
      : 'Meet I-TECHNO. We provide high-quality video surveillance, monitoring, and security systems in Georgia.'

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
  const t = (dict as any)[lang] || dict.ka
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  // --- 2. SENIOR SEO: ORGANIZATION SCHEMA ---
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'I-TECHNO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: t.aboutUs.hero.story,
    sameAs: [
      'https://facebook.com/itechno', // დაამატე შენი რეალური ლინკები
      'https://instagram.com/itechno',
    ],
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
