import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CategoryBar } from '@/components/CategoryBar'
import { Hero } from '@/components/Hero'
import { PopularProducts } from '@/components/PopularProducts'
import { BrandsSlider } from '@/components/BrandSlider'
import { PromoBanner } from '@/components/PromoBanner'
import AboutGrid from '@/components/AboutGrid'

type PageParams = { params: Promise<{ lang: string }> }

// --- 1. METADATA (უკვე გაქვს, დავამატე მხოლოდ მცირე ოპტიმიზაცია) ---
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang === 'en' ? 'en' : 'ka'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const siteName = 'I-TECHNO'

  const data = {
    ka: {
      title: 'I-TECHNO - უსაფრთხოების სისტემები და ტექნოლოგიები',
      description:
        'უმაღლესი ხარისხის სამეთვალყურეო კამერები, სიგნალიზაცია და ჭკვიანი სახლის სისტემები საქართველოში.',
    },
    en: {
      title: 'I-TECHNO - Security Systems & Technologies',
      description: 'High-quality surveillance cameras, alarms, and smart home systems in Georgia.',
    },
  }

  const currentData = data[lang as keyof typeof data]

  return {
    title: {
      default: currentData.title,
      template: `%s | ${siteName}`,
    },
    description: currentData.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'ka-GE': '/ka',
        'en-US': '/en',
      },
    },
    openGraph: {
      title: currentData.title,
      description: currentData.description,
      url: `/${lang}`,
      siteName: siteName,
      locale: lang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function Page({ params }: PageParams) {
  const resolvedParams = await params
  const lang = (resolvedParams.lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const payload = await getPayload({ config: await config })

  const [popularProducts] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { isPopular: { equals: true } },
      limit: 10,
      locale: lang,
    }),
    payload.find({
      collection: 'brands',
      limit: 20,
    }),
  ])

  // --- 2. SEO: WEB-SITE & LOCAL BUSINESS SCHEMA ---
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/${lang}/#website`,
        url: `${baseUrl}/${lang}`,
        name: 'I-TECHNO',
        publisher: { '@id': `${baseUrl}/${lang}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/${lang}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/${lang}/#organization`,
        name: 'I-TECHNO',
        image: `${baseUrl}/og-image.jpg`,
        url: `${baseUrl}/${lang}`,
        telephone: '+995595126054',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Tbilisi, Georgia', // შეცვალე რეალურით
          addressLocality: 'Tbilisi',
          addressCountry: 'GE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.7151,
          longitude: 44.8271,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:00',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen pb-20 antialiased font-firaGo">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 3. SEO: HIDDEN H1 (კრიტიკულია, თუ ჰერო კომპონენტში არ გაქვს H1) */}
      <h1 className="sr-only">
        {lang === 'ka'
          ? 'I-TECHNO - უსაფრთხოების სისტემების და ვიდეო კამერების ონლაინ მაღაზია'
          : 'I-TECHNO - Online Store for Security Systems and Cameras'}
      </h1>

      <CategoryBar lang={lang} />

      <main>
        {/* Hero სექცია */}
        <section aria-label="Main Introduction">
          <Hero lang={lang} />
        </section>

        {/* ბრენდების სექცია */}
        <section className="mt-8" aria-label="Our Partners">
          <BrandsSlider />
        </section>

        {/* პოპულარული პროდუქტები */}
        <section className="py-12" aria-labelledby="popular-heading">
          <PopularProducts
            products={popularProducts.docs}
            lang={lang}
            title={lang === 'ka' ? 'პოპულარული პროდუქტები' : 'Popular Products'}
          />
        </section>

        <PromoBanner />

        <section className="py-16" aria-labelledby="about-grid-heading">
          <AboutGrid lang={lang} />
        </section>
      </main>
    </div>
  )
}
