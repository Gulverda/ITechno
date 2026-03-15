import React from 'react'

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  // params-ის ამოღება (Next.js 15-ში Promise-ია)
  const { lang } = await params

  return (
    // აქ არ გვჭირდება <html> ან <body>, რადგან მთავარ layout-ში უკვე გვაქვს
    // უბრალოდ ვაბრუნებთ შიგთავსს
    <>{children}</>
  )
}
