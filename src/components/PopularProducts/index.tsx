'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { ProductCard } from '../ProductCard'
import { Product } from '@/payload-types'

// Swiper-ის სტილები
import 'swiper/css'
import 'swiper/css/navigation'

interface PopularProductsProps {
  products: Product[]
  lang: string
  title: string
}

export const PopularProducts = ({ products, lang, title }: PopularProductsProps) => {
  return (
    <section className="py-12 bg-gray-50/50 rounded-[40px] px-6 my-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Header სექცია ისე, როგორც სურათზეა */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 italic tracking-tight">{title}</h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
          </div>

          {/* Custom Navigation ღილაკები */}
          <div className="flex gap-2">
            <button className="swiper-prev-btn p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-blue-600 hover:text-white transition-all text-gray-400">
              <ChevronLeftIcon />
            </button>
            <button className="swiper-next-btn p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-blue-600 hover:text-white transition-all text-gray-400">
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-prev-btn',
            nextEl: '.swiper-next-btn',
          }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="popular-products-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="pb-4">
              <ProductCard product={product} lang={lang} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

// პატარა Icon კომპონენტები
const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
)
