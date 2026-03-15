import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import { LangSwitcher } from '@/components/LangSwitcher'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

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
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
