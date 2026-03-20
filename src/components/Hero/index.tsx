'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroImage from '@/assets/images/hero.svg'
import dict from '@/lib/translations.json'

interface HeroProps {
  lang: 'ka' | 'en'
}

export const Hero = ({ lang = 'ka' }: HeroProps) => {
  const [current, setCurrent] = useState(0)

  const t = dict[lang as keyof typeof dict].hero

  const slides = [
    {
      id: 1,
      title: t.slide1.title,
      description: t.slide1.description,
      image: HeroImage,
      link: `/${lang}/category/video-surveillance`,
    },
    {
      id: 2,
      title: t.slide2.title,
      description: t.slide2.description,
      image: HeroImage,
      link: `/${lang}/category/smart-home`,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="relative h-[400px] md:h-[480px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-60 scale-105"
              priority={index === 0}
            />

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-semibold text-white mb-6 leading-[1.1] uppercase tracking-tighter drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-sm md:text-base mb-4 leading-relaxed max-w-2xl font-medium opacity-90">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.link}
                  className="bg-[#1e73be] hover:bg-blue-700 px-6 text-white text-xs sm:text-sm h-[50px] flex items-center justify-center rounded-lg font-bold transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95"
                >
                  {t.buttons.allProducts}
                </Link>
                <Link
                  href={`/${lang}/services`}
                  className="bg-white backdrop-blur-md px-6 text-[#1e73be] hover:bg-white/80 text-xs sm:text-sm h-[50px] flex items-center justify-center border border-white/30 rounded-lg font-bold transition-all active:scale-95"
                >
                  {t.buttons.ourServices}
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-12 h-2 bg-[#1976BA]' : 'w-2 h-2 bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
