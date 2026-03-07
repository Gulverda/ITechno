import React from 'react'
import Link from 'next/link'
import './globals.css'
import { LangSwitcher } from '@/components/LangSwitcher'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-black text-blue-600 tracking-tighter">
                I-TECHNO
              </Link>
              <div className="flex gap-6 items-center">
                <nav className="hidden md:flex gap-4 text-sm font-medium text-gray-600">
                  <Link href="/" className="hover:text-blue-600">
                    მთავარი
                  </Link>
                  <Link href="/ka/category/smart-home" className="hover:text-blue-600">
                    Smart Home
                  </Link>
                </nav>
                <LangSwitcher />
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="bg-white border-t py-10 mt-20">
            <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} I-TECHNO. ყველა უფლება დაცულია.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
