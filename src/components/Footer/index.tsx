import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import WhiteLogo from '@/assets/white_logo.svg'

export const Footer = () => {
  return (
    <footer className="bg-[#1e73be] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link href="/" className="inline-block p-2 rounded-lg">
              <Image
                src={WhiteLogo}
                alt="ITECHNO"
                width={150}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-blue-50 opacity-90">
              ჩვენი მთავარი პრიორიტეტია სანდო და სტაბილური უსაფრთხოების სისტემების დანერგვა,
              რომლებიც მომხმარებელს გრძელვადიან დაცვასა და სიმშვიდეს უზრუნველყოფს.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 uppercase tracking-wider">პროდუქცია</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/category/ezviz"
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  EVIZ - Smart Home
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ajax"
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  AJAX
                </Link>
              </li>
              <li>
                <Link
                  href="/category/video-surveillance"
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  ვიდეო სამეთვალყურეო
                </Link>
              </li>
              <li>
                <Link
                  href="/category/storage"
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  შენახვის მოწყობილობები
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fire-alarm"
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  სახანძრო სიგნალიზაცია
                </Link>
              </li>
              <li>
                <Link
                  href="/category/security-alarm"
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  დაცვის სიგნალიზაცია
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 uppercase tracking-wider">კომპანია</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services" className="hover:underline opacity-80 hover:opacity-100">
                  სერვისები
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline opacity-80 hover:opacity-100">
                  ჩვენ შესახებ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 uppercase tracking-wider">დაგვიკავშირდი</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-blue-200" />
                <span className="opacity-90">თბილისი, აგლაძის ქუჩა 32</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-blue-200" />
                <span className="opacity-90">+995 555 50 69 50</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-blue-200" />
                <span className="opacity-90">+995 532 69 48 42</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-blue-200" />
                <span className="opacity-90">info@itechno.ge</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium opacity-80">
          <div>© {new Date().getFullYear()} ITECHNO ყველა უფლება დაცულია</div>
          <div className="uppercase">Powered By GARGARI</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              წესები და პირობები
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
