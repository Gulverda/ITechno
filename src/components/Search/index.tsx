'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { SearchIcon, X } from 'lucide-react'

export const Search = ({ lang }: { lang: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  const [text, setText] = useState(searchParams.get('q') || '')
  const [query] = useDebounce(text, 500)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (!query) return
    }

    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
      params.set('page', '1')
    } else {
      params.delete('q')
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [query, router, pathname, searchParams])

  return (
    <div className="relative w-full max-w-[400px] group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1976BA] transition-colors">
        <SearchIcon size={18} />
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'ka' ? 'მოძებნე პროდუქტი...' : 'Search products...'}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl 
                   shadow-sm outline-none transition-all duration-200
                   placeholder:text-gray-400 text-sm
                   focus:border-[#1976BA] focus:ring-4 focus:ring-[#1976BA]/10 
                   hover:border-gray-300"
      />

      {text && (
        <button
          onClick={() => setText('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full 
                     hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
