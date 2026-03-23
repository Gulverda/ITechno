import React from 'react'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { firaGo400, firaGo600, lgvAnastasia } from '../fonts'

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
    <html
      lang="ka"
      className={`${firaGo400.variable} ${firaGo600.variable} ${lgvAnastasia.variable}`}
    >
      <body>
        <div className="min-h-screen text-gray-900 flex flex-col px-4">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
