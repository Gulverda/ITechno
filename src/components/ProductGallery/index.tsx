'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({
  mainImage,
  images,
  title,
}: {
  mainImage: string
  images: any[]
  title: string
}) {
  const [activeImage, setActiveImage] = useState(mainImage)

  const showGallery = images && images.length > 1

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="relative aspect-square w-full overflow-hidden">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={title}
              fill
              priority
              className="object-contain hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              onClick={() => window.open(activeImage, '_blank')} // მარტივი "დიდზე ნახვა"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-300 italic">
              სურათი არ არის
            </div>
          )}
        </div>
      </div>

      {showGallery && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((item: any, index: number) => {
            const url = typeof item.image === 'object' ? item.image?.url : null
            if (!url) return null

            return (
              <div
                key={index}
                onClick={() => setActiveImage(url)}
                className={`relative aspect-square rounded-2xl border-2 overflow-hidden bg-white cursor-pointer transition-all p-2 group ${
                  activeImage === url
                    ? 'border-blue-600 shadow-md'
                    : 'border-gray-100 hover:border-blue-300'
                }`}
              >
                <Image
                  src={url}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-contain p-1 group-hover:scale-110 transition-transform"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
