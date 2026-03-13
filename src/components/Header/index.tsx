import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Phone } from 'lucide-react'
import { LangSwitcher } from '../LangSwitcher'
import Logo from '@/assets/logo.svg'

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <div className="relative w-28 h-28 lg:w-32 lg:h-32">
            <Image src={Logo} alt="I-TECHNO Logo" fill className="object-contain" priority />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            მთავარი
          </Link>
          <Link href="/our-services" className="hover:text-blue-600 transition-colors">
            ჩვენი სერვისები
          </Link>
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            პროდუქცია
          </Link>
          <Link href="/about-us" className="hover:text-blue-600 transition-colors">
            ჩვენს შესახებ
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            კონტაქტი
          </Link>
        </nav>

        <div className="flex items-center gap-4 flex-grow justify-end max-w-xl">
          <div className="relative hidden md:block w-full max-w-[240px]">
            <input
              type="text"
              placeholder="პროდუქტის ძიება..."
              className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          <Link
            href="tel:+995000000"
            className="hidden xl:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all"
          >
            <span>დაგვიკავშირდით</span>
            <Phone className="w-4 h-4" />
          </Link>

          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />

          <LangSwitcher />
        </div>
      </div>
    </header>
  )
}
