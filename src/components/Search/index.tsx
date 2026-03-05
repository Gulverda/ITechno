'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export const Search = ({ lang }: { lang: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        defaultValue={searchParams.get('q') || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={lang === 'ka' ? 'ძებნა...' : 'Search...'}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
      />
      {isPending && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}
