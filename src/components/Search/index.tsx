'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useDebounce } from 'use-debounce'

export const Search = ({ lang }: { lang: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true) // პირველი ჩატვირთვის დასაჭერად

  const [text, setText] = useState(searchParams.get('q') || '')
  const [query] = useDebounce(text, 500)

  useEffect(() => {
    // თუ პირველი რენდერია და ინპუტი ცარიელია, არაფერი ვქნათ
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (!query) return
    }

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    params.set('limit', '16')

    // ჩავანაცვლეთ "/" -> pathname-ით
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [query, router, pathname, searchParams])

  return (
    <div className="relative w-full max-w-md">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'ka' ? 'ძებნა...' : 'Search...'}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
      />
    </div>
  )
}
