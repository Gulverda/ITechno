'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce' // npm i use-debounce

export const Search = ({ lang }: { lang: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 1. ლოკალური State ინპუტისთვის
  const [text, setText] = useState(searchParams.get('q') || '')

  // 2. ველოდებით 500ms წერის დასრულებიდან
  const [query] = useDebounce(text, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    // ძებნისას ლიმიტი ისევ 20-ზე დავაბრუნოთ, რომ თავიდან დაიწყოს დათვლა
    params.set('limit', '16')

    router.push(`/?${params.toString()}`, { scroll: false })
  }, [query, router]) // მხოლოდ მაშინ გაეშვება, როცა 'query' შეიცვლება (500ms-ის შემდეგ)

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
