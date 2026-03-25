import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import ContactImage from '@/assets/images/Contact.png'
import Image from 'next/image'
import dict from '@/lib/translations.json'

interface Props {
  params: Promise<{ lang: 'ka' | 'en' }> // Next.js 15 compatibility
}

// --- 1. DYNAMIC METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const title = lang === 'ka' ? 'კონტაქტი - დაგვიკავშირდით' : 'Contact Us - Get in Touch'

  const description =
    lang === 'ka'
      ? 'დაგვიკავშირდით I-TECHNO-ს გუნდს. მისამართი: თბილისი, საქართველო. ტელეფონი: +995 555 12 34 56. მოგვწერეთ ნებისმიერ დროს.'
      : 'Contact I-TECHNO team. Address: Tbilisi, Georgia. Phone: +995 555 12 34 56. Reach out to us for any inquiries.'

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: {
        'ka-GE': `${baseUrl}/ka/contact`,
        'en-US': `${baseUrl}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/contact`,
      siteName: 'I-TECHNO',
      images: [{ url: '/og-contact.jpg', width: 1200, height: 630 }],
      locale: lang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  const t = dict[lang as keyof typeof dict].contact
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  //ამოსაცვლელია ნამდვილი ინფორმაციით

  // --- 2. LOCAL BUSINESS SCHEMA ---
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'I-TECHNO',
    image: `${baseUrl}/og-image.jpg`,
    '@id': `${baseUrl}/${lang}/contact`,
    url: baseUrl,
    telephone: '+995555123456',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'თქვენი მისამართი ქუჩა #',
      addressLocality: 'Tbilisi',
      postalCode: '0100',
      addressCountry: 'GE',
    },

    //ამოსაცვლელია ნამდვილი ინფორმაციით
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
  }

  return (
    <main className="min-h-screen pb-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="relative w-full max-w-[1440px] h-[250px] md:h-[300px] mx-auto flex items-center justify-center overflow-hidden rounded-[30px] md:rounded-[40px] mt-8">
        <Image src={ContactImage} alt={t.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter leading-tight">
            {t.title}
          </h1>
          <p className="text-lg md:text-2xl font-light">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-12 lg:mt-24 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5">
            <h2 className="sr-only">Contact Information</h2>
            <ContactInfo lang={lang} />
          </div>
          <div className="lg:col-span-7">
            <h2 className="sr-only">Send us a message</h2>
            <ContactForm lang={lang} />
          </div>
        </div>
      </div>
    </main>
  )
}
