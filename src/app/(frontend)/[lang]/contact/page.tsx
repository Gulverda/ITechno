import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import ContactImage from '@/assets/images/Contact.png'
import Image from 'next/image'
import dict from '@/lib/translations.json'

interface Props {
  params: { lang: 'ka' | 'en' }
}

export default function ContactPage({ params: { lang } }: Props) {
  const t = dict[lang as keyof typeof dict].contact

  return (
    <main className="min-h-screen pb-12">
      <div className="relative w-full max-w-[1440px] h-[250px] md:h-[300px] mx-auto flex items-center justify-center overflow-hidden rounded-[30px] md:rounded-[40px] mt-8">
        <Image src={ContactImage} alt="Contact" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter leading-tight">
            {t.title}
          </h1>
          <p className="text-lg md:text-2xl font-light">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-12 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5">
            <ContactInfo lang={lang} />
          </div>
          <div className="lg:col-span-7">
            <ContactForm lang={lang} />
          </div>
        </div>
      </div>
    </main>
  )
}
