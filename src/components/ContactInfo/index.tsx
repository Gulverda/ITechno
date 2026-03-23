import { Phone, Mail, Facebook, MapPin } from 'lucide-react'
import dict from '@/lib/translations.json'

const ContactInfo = ({ lang = 'ka' }: { lang: 'ka' | 'en' }) => {
  const d = dict[lang as keyof typeof dict]
  const t = d.contact

  return (
    <div className="bg-gradient-to-br from-[#1976BA] to-[#71C3FF] text-white p-8 rounded-[30px] shadow-lg h-full flex flex-col justify-between min-h-[500px]">
      {' '}
      <div>
        <h2 className="text-2xl md:text-3xl mb-8">{t.infoTitle}</h2>

        <div className="space-y-6 font-firaGo400">
          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 flex-shrink-0" />
            <p>+995 559 89 64 50</p>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 flex-shrink-0" />
            <p>itechno@info.com</p>
          </div>

          <div className="flex items-center gap-4">
            <Facebook className="w-6 h-6 flex-shrink-0" />
            <p>Facebook / Instagram</p>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <MapPin className="w-6 h-6 flex-shrink-0" />
            <p>{d.about.address}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-56 mt-8 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=..."
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  )
}

export default ContactInfo
