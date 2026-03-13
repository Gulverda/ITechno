import React from 'react'
import Link from 'next/link'
import Image from 'next/image' // სურათებისთვის
import './globals.css'
import { LangSwitcher } from '@/components/LangSwitcher'

export const metadata = {
  title: 'I-TECHNO | სმარტ სისტემები',
  description: 'უახლესი ტექნოლოგიები და უსაფრთხოების სისტემები',
  icons: {
    icon: '/favicon.ico',
  },
  // სანამ დეველოპმენტში ხარ, ბოტებს ვუბლოკავთ წვდომას
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ka">
      {' '}
      {/* ენა შევცვალოთ ka-ზე თუ ქართულია საიტი */}
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              {/* ლოგოს სექცია */}
              <Link href="/" className="flex items-center gap-2 group">
                {/* თუ public-ში logo.svg-ს ჩააგდებ, Image-ით შეცვალე ეს ტექსტი */}
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-blue-700 transition-colors">
                  IT
                </div>
                <span className="text-xl font-black text-gray-800 tracking-tighter group-hover:text-blue-600 transition-colors">
                  I-TECHNO
                </span>
              </Link>

              <div className="flex gap-8 items-center">
                <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-600">
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    მთავარი
                  </Link>
                  <Link href="/products" className="hover:text-blue-600 transition-colors">
                    პროდუქცია
                  </Link>
                  <Link
                    href="/ka/category/smart-home"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Smart Home
                  </Link>
                </nav>
                <div className="h-6 w-px bg-gray-200 hidden md:block" /> {/* გამყოფი ხაზი */}
                <LangSwitcher />
              </div>
            </div>
          </header>

          {/* flex-grow იზრუნებს იმაზე, რომ ფუტერი ყოველთვის ბოლოში იყოს */}
          <main className="flex-grow">{children}</main>

          <footer className="bg-white border-t py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
                <div>
                  <h3 className="font-bold text-lg mb-4">I-TECHNO</h3>
                  <p className="text-gray-500 text-sm">
                    სმარტ გადაწყვეტილებები თქვენი სახლისა და ბიზნესისთვის.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gray-800">ნავიგაცია</h4>
                  <ul className="text-sm text-gray-500 space-y-2">
                    <li>
                      <Link href="/about" className="hover:text-blue-600">
                        ჩვენს შესახებ
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-blue-600">
                        კონტაქტი
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gray-800">კონტაქტი</h4>
                  <p className="text-sm text-gray-500">თბილისი, საქართველო</p>
                  <p className="text-sm text-gray-500">info@i-techno.ge</p>
                </div>
              </div>

              <div className="border-t pt-8 text-center text-gray-400 text-xs">
                © {new Date().getFullYear()} I-TECHNO. ყველა უფლება დაცულია.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
