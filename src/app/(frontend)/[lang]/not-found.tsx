'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import dict from '@/lib/translations.json'

// Lottie-ს კომპონენტის დინამიური იმპორტი, რათა თავიდან ავიცილოთ SSR პრობლემები
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// შენი ანიმაციის JSON ფაილის იმპორტი
import cameraAnimation from '@/assets/animations/camera_404.json'

export default function NotFound() {
  const params = useParams()
  const lang = (params.lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'
  const t = dict[lang]

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-sm">
        <Lottie
          animationData={cameraAnimation}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <h1 className="text-9xl font-extrabold text-[#1976BA] tracking-tight">404</h1>

      <p className="text-2xl font-semibold text-slate-800 mt-4 max-w-md">
        {lang === 'ka' ? 'გვერდი ვერ მოიძებნა...' : 'Oops! Page not found...'}
      </p>

      <p className="text-slate-600 mt-2 mb-10 max-w-sm">
        {lang === 'ka'
          ? 'როგორც ჩანს, კამერამ ვერ დააფიქსირა ის, რასაც ეძებდით. არ ინერვიულოთ, მთავარი გვერდი ჯერ კიდევ ადგილზეა!'
          : "It looks like our camera couldn't focus on what you were looking for. No worries, the main page is still right here!"}
      </p>

      <Link
        href={`/${lang}`}
        className="px-8 py-3.5 bg-[#1976BA] text-white rounded-xl font-semibold text-lg hover:bg-[#1976BA]/90 transition-colors shadow-lg shadow-[#1976BA]/20 active:scale-95 transition-transform"
      >
        {lang === 'ka' ? 'მთავარზე დაბრუნება' : 'Back to Home'}
      </Link>
    </div>
  )
}
