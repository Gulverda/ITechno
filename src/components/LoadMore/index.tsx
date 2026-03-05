'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition as useReactTransition } from 'react'

export const LoadMore = ({
  hasNextPage,
  currentLimit,
  lang,
}: {
  hasNextPage: boolean
  currentLimit: number
  lang: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useReactTransition()

  if (!hasNextPage) return null

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams)
    params.set('limit', String(currentLimit + 16))

    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={handleLoadMore}
        disabled={isPending}
        className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 min-w-[200px]"
      >
        {isPending
          ? lang === 'ka'
            ? 'იტვირთება...'
            : 'Loading...'
          : lang === 'ka'
            ? 'მეტის ჩვენება'
            : 'Load More'}
      </button>
    </div>
  )
}
