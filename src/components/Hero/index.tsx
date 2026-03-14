'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
  id: number
  title: string
  description: string
  image: string
  link: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'ვიდეოსამეთვალყურეო სისტემები',
    description:
      'თანამედროვე სისტემები საცხოვრებელი, კომერციული და სამრეწველო ობიექტებისთვის. მაღალი ხარისხის კამერები და პროფესიონალური ინსტალაცია.',
    image: '/hero/banner1.jpg',
    link: '/category/video-surveillance',
  },
  {
    id: 2,
    title: 'ჭკვიანი სახლის გადაწყვეტილებები',
    description:
      'აკონტროლეთ თქვენი სახლი დისტანციურად. სმარტ განათება, გათბობა და უსაფრთხოება ერთ აპლიკაციაში.',
    image: '/hero/banner2.jpg',
    link: '/category/smart-home',
  },
]

export const Hero = () => {
  const [current, setCurrent] = useState(0)

  // ავტომატური სლაიდერი (სურვილისამებრ)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="relative h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-60 scale-105"
              priority={index === 0}
            />

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl">
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] uppercase tracking-tighter drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-sm md:text-xl mb-10 leading-relaxed max-w-2xl font-medium opacity-90">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.link}
                  className="bg-[#1e73be] hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95"
                >
                  სრული პროდუქცია
                </Link>
                <Link
                  href="/services"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-2xl font-bold transition-all active:scale-95"
                >
                  სერვისები
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? 'w-12 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
