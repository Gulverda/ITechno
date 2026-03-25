import React from 'react'
import './globals.css'
import { firaGo400, firaGo600, lgvAnastasia } from '../fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ka"
      className={`${firaGo400.variable} ${firaGo600.variable} ${lgvAnastasia.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
