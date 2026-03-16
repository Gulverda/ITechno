'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({
  totalPages,
  currentPage,
}: {
  totalPages: number
  currentPage: number
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('limit')
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  const getVisiblePages = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 5) {
      // მცირე რაოდენობაზე პირდაპირ ვაჩვენოთ
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    // მობილურისთვის განკუთვნილი გამარტივებული მასივი
    pages.push(1)

    // თუ მე-3 გვერდზე შორს ვართ, დავსვათ შუა ნაწილი
    if (currentPage > 2) {
      if (currentPage > 3) pages.push('...')
      pages.push(currentPage)
    } else {
      pages.push(2)
    }

    // თუ ბოლოდან შორს ვართ, დავსვათ სამწერტილი და ბოლო გვერდი
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    } else if (currentPage !== totalPages && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    // დუბლიკატების მოცილება (უსაფრთხოებისთვის)
    return Array.from(new Set(pages)).sort((a, b) => {
      if (a === '...' || b === '...') return 0
      return (a as number) - (b as number)
    })
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8 mb-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg border border-slate-200 disabled:opacity-20 hover:bg-slate-50 flex-shrink-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => {
          const isActive = page === currentPage
          const isEllipsis = page === '...'

          return (
            <button
              key={index}
              onClick={() => !isEllipsis && handlePageChange(page as number)}
              disabled={isEllipsis}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center
                ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}
                ${isEllipsis ? 'text-slate-400 cursor-default px-1' : 'hover:bg-slate-100'}
              `}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg border border-slate-200 disabled:opacity-20 hover:bg-slate-50 flex-shrink-0"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
