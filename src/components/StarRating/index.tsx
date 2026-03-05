'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const StarRating = ({
  productId,
  initialRating = 0,
  lang = 'ka',
}: {
  productId: string
  initialRating?: number
  lang?: string
}) => {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [voted, setVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 1. ვამოწმებთ LocalStorage-ს ჩატვირთვისას
  useEffect(() => {
    const votedProducts = JSON.parse(localStorage.getItem('voted_products') || '[]')
    if (votedProducts.includes(productId)) {
      setVoted(true)
    }
  }, [productId])

  const handleVote = async (val: number) => {
    if (voted || isLoading) return

    setIsLoading(true)
    try {
      setRating(val)
      setVoted(true)

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: Number(productId),
          rating: val,
        }),
      })

      if (res.ok) {
        const votedProducts = JSON.parse(localStorage.getItem('voted_products') || '[]')
        if (!votedProducts.includes(productId)) {
          localStorage.setItem('voted_products', JSON.stringify([...votedProducts, productId]))
        }
        router.refresh()
      }
    } catch (error) {
      console.error('Rating error:', error)
      setVoted(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* 2. ვარსკვლავების კონტეინერი - თუ ხმა მიცემულია, ითიშება ინტერაქცია */}
      <div
        className={`flex gap-1 transition-all duration-300 ${
          voted ? 'pointer-events-none opacity-50 grayscale' : ''
        }`}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={voted}
            className={`text-3xl transition-transform ${
              star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
            } ${!voted ? 'hover:scale-110 active:scale-90 cursor-pointer' : 'cursor-default'}`}
            onMouseEnter={() => !voted && setHover(star)}
            onClick={() => handleVote(star)}
          >
            ★
          </button>
        ))}
      </div>

      {/* 3. სტატუსის ტექსტი */}
      <div className="min-w-[140px]">
        {voted ? (
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md animate-in fade-in zoom-in-95">
            {lang === 'ka' ? 'შენ უკვე შეგვაფასე' : 'Already reviewed'}
          </span>
        ) : isLoading ? (
          <span className="text-xs font-bold text-blue-500 animate-pulse">
            {lang === 'ka' ? 'იგზავნება...' : 'Sending...'}
          </span>
        ) : (
          <span className="text-xs font-bold text-gray-400">
            {lang === 'ka' ? 'შეაფასე პროდუქტი' : 'Rate product'}
          </span>
        )}
      </div>
    </div>
  )
}
