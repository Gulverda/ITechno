'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export const LangSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const changeLang = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', lang)
    router.push(`${pathname}?${params.toString()}`)
  }

  const currentLang = searchParams.get('lang') || 'ka'

  return (
    <div className="flex bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => changeLang('ka')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition ${currentLang === 'ka' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
      >
        KA
      </button>
      <button
        onClick={() => changeLang('en')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition ${currentLang === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
      >
        EN
      </button>
    </div>
  )
}
