'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { ProductCard } from '../ProductCard'
import { Product } from '@/payload-types'

import 'swiper/css'
import 'swiper/css/navigation'

interface PopularProductsProps {
  products: Product[]
  lang: string
  title: string
}

export const PopularProducts = ({ products, lang, title }: PopularProductsProps) => {
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'

  return (
    <section className="px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* დავამატე gap-4 და items-center უკეთესი განლაგებისთვის მობილურზე */}
        <div className="flex justify-between items-center sm:items-end mb-8 border-b border-gray-100 pb-4 gap-4">
          <div className="space-y-1">
            {/* მობილურზე ტექსტი text-xl, დიდ ეკრანზე ისევ text-2xl */}
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>
            <div className="h-1 w-20 bg-[#1976BA] rounded-full"></div>
          </div>

          <div className="flex gap-2 shrink-0">
            {/* p-2 მობილურზე, sm:p-3 დიდ ეკრანებზე */}
            <button className="swiper-prev-btn p-2 sm:p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-[#1976BA] hover:text-white transition-all text-gray-400">
              <ChevronLeftIcon />
            </button>
            <button className="swiper-next-btn p-2 sm:p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-[#1976BA] hover:text-white transition-all text-gray-400">
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
              <ProductCard product={product} lang={currentLang} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

const ChevronLeftIcon = () => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5" /* ხატულას ზომაც დინამიურია */
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
    className="w-4 h-4 sm:w-5 sm:h-5" /* ხატულას ზომაც დინამიურია */
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