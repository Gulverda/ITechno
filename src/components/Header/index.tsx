'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X } from 'lucide-react'
import { LangSwitcher } from '../LangSwitcher'
import Logo from '@/assets/logo.svg'
import dict from '@/lib/translations.json'

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const segments = pathname.split('/')
  const currentLang = (['ka', 'en'].includes(segments[1]) ? segments[1] : 'ka') as 'ka' | 'en'
  const t = dict[currentLang]

  const getLocalizedHref = (path: string) => {
    return path === '/' ? `/${currentLang}` : `/${currentLang}${path}`
  }

  const navLinks = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.products, href: '/products' },
    { name: t.nav.about, href: '/about-us' },
    { name: t.nav.contact, href: '/contact' },
  ]

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 px-4">
        <div className="container max-w-[1440px] mx-auto h-20 flex items-center justify-between gap-4">
          <Link href={`/${currentLang}`} className="flex-shrink-0 flex items-center gap-2">
            <div className="relative w-24 h-24 lg:w-32 lg:h-32">
              <Image src={Logo} alt="I-TECHNO Logo" fill className="object-contain" priority />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            {navLinks.map((link) => {
              const localizedPath = getLocalizedHref(link.href)
              const isActive = pathname === localizedPath
              return (
                <Link
                  key={link.href}
                  href={localizedPath}
                  className={`transition-colors font-semibold ${
                    isActive ? 'text-[#1976BA] border-b-2 border-[#1976BA]' : 'hover:text-[#1976BA]'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="tel:+995000000"
              className="hidden xl:flex items-center gap-2 border border-[#1976BA] text-[#1976BA] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1976BA] hover:text-white transition-all"
            >
              <span>{t.header.contactBtn}</span>
              <Phone className="w-4 h-4" />
            </Link>

            <LangSwitcher />

            <button
              className="lg:hidden p-2 text-slate-600 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-7 h-7 transition-transform" />
              ) : (
                <Menu className="w-7 h-7 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </header>
      <div
        className={`
          fixed left-0 right-0 bg-white border-b shadow-lg transition-all duration-500 ease-in-out lg:hidden z-40
          ${isOpen ? 'top-20 opacity-100' : '-top-full opacity-0'}
        `}
      >
        <nav className="flex flex-col p-6 gap-5">
          {navLinks.map((link) => {
            const localizedPath = getLocalizedHref(link.href)
            const isActive = pathname === localizedPath
            return (
              <Link
                key={link.href}
                href={localizedPath}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold py-2 border-b border-slate-50 ${
                  isActive ? 'text-[#1976BA]' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          <Link
            href="tel:+995000000"
            className="flex items-center justify-center gap-2 bg-[#1976BA] text-white px-5 py-3.5 rounded-xl font-semibold mt-2 shadow-md active:scale-95 transition-transform"
          >
            <span>{t.header.contactBtn}</span>
            <Phone className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </>
  )
}
