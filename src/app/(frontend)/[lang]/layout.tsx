import React from 'react'

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

// ეს ეუბნება Next.js-ს, რომ მხოლოდ ეს ორი ენაა ხელმისაწვდომი
export async function generateStaticParams() {
  return [{ lang: 'ka' }, { lang: 'en' }]
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params

  return (
    // მიუხედავად იმისა, რომ <html> მთავარ ლეიაუთშია,
    // ხშირად Next.js-ში [lang] layout-ში მაინც სვამენ სტრუქტურას
    // ენის ატრიბუტის სწორად მუშაობისთვის.
    <section lang={lang}>{children}</section>
  )
}
