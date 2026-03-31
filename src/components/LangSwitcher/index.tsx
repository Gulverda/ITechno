'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

export const LangSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()

  // pathname არის მაგალითად: "/ka/category/test" ან "/"
  const segments = pathname.split('/')
  const currentLang = ['ka', 'en'].includes(segments[1]) ? segments[1] : 'ka'

  const changeLang = (newLang: string) => {
    if (currentLang === newLang) return

    let newPath = ''
    if (['ka', 'en'].includes(segments[1])) {
      // თუ უკვე გვაქვს ენა URL-ში, ჩავანაცვლოთ
      segments[1] = newLang
      newPath = segments.join('/')
    } else {
      // თუ არ გვაქვს (მთავარზე ვართ), დავამატოთ
      newPath = `/${newLang}${pathname === '/' ? '' : pathname}`
    }

    router.push(newPath)
  }

  return (
    <button
      onClick={() => changeLang(currentLang === 'ka' ? 'en' : 'ka')}
      className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors group"
    >
      <div className="relative w-5 h-4 overflow-hidden rounded-sm shadow-sm border border-gray-100">
        <Image
          src={currentLang === 'ka' ? 'https://flagcdn.com/ge.svg' : 'https://flagcdn.com/us.svg'}
          alt="flag"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <span className="text-xs font-bold text-slate-700 uppercase">
        {currentLang === 'ka' ? 'GEO' : 'ENG'}
      </span>
    </button>
  )
}
