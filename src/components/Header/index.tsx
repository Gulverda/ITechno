'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone } from 'lucide-react'
import { LangSwitcher } from '../LangSwitcher'
import Logo from '@/assets/logo.svg'
import dict from '@/lib/translations.json'

export const Header = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const currentLang = (['ka', 'en'].includes(segments[1]) ? segments[1] : 'ka') as 'ka' | 'en'
  const t = dict[currentLang]

  const getLocalizedHref = (path: string) => {
    return path === '/' ? `/${currentLang}` : `/${currentLang}${path}`
  }

  const navLinks = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.services, href: '/our-services' },
    { name: t.nav.products, href: '/products' },
    { name: t.nav.about, href: '/about-us' },
    { name: t.nav.contact, href: '/contact' },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link href={`/${currentLang}`} className="flex-shrink-0 flex items-center gap-2">
          <div className="relative w-28 h-28 lg:w-32 lg:h-32">
            <Image src={Logo} alt="I-TECHNO Logo" fill className="object-contain" priority />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={getLocalizedHref(link.href)}
              className="hover:text-blue-600 transition-colors font-semibold"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 justify-end max-w-xl">
          <Link
            href="tel:+995000000"
            className="hidden xl:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
          >
            <span>{t.header.contactBtn}</span>
            <Phone className="w-4 h-4" />
          </Link>

          <LangSwitcher />
        </div>
      </div>
    </header>
  )
}
