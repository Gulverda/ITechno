'use client'

import { Phone, Mail, Facebook, MapPin } from 'lucide-react'

type ContactInfoData = {
  infoTitle: string
  phone: string
  email: string
  social: string
  address: string
  mapEmbedUrl: string
}

const ContactInfo = ({ t }: { t: ContactInfoData }) => {
  return (
    <div className="bg-gradient-to-br from-[#1976BA] to-[#71C3FF] text-white p-8 rounded-[30px] shadow-lg h-full flex flex-col justify-between min-h-[500px]">
      {' '}
      <div>
        <h2 className="text-2xl md:text-3xl mb-8">{t.infoTitle}</h2>

        <div className="space-y-6 font-firaGo400">
          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 flex-shrink-0" />
            <p>{t.phone}</p>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 flex-shrink-0" />
            <p>{t.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <Facebook className="w-6 h-6 flex-shrink-0" />
            <p>{t.social}</p>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <MapPin className="w-6 h-6 flex-shrink-0" />
            <p>{t.address}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-56 mt-8 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl">
        <iframe
          src={t.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}

export default ContactInfo
