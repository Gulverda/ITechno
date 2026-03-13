import React from 'react'
import Link from 'next/link'
import Image from 'next/image' // სურათებისთვის
import './globals.css'
import { LangSwitcher } from '@/components/LangSwitcher'
import { Header } from '@/components/Header'

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
          <Header />

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
