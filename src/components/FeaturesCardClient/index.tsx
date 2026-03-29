'use client'

import { CreditCard, Clock, Wrench, Home } from 'lucide-react'

type FeatureItem = {
  id?: string
  title: string
  description: string
}

type FeaturesCardsData = {
  items: FeatureItem[]
}

const ICONS = [
  <CreditCard strokeWidth={1.25} className="w-5 h-5" />,
  <Clock strokeWidth={1.25} className="w-5 h-5" />,
  <Wrench strokeWidth={1.25} className="w-5 h-5" />,
  <Home strokeWidth={1.25} className="w-5 h-5" />,
]

export default function FeaturesCards({ t }: { t: FeaturesCardsData | undefined | null }) {
  if (!t?.items?.length) return null

  return (
    <section className="w-full px-6 py-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.items.map((feature, i) => (
          <div key={feature.id ?? i} className="bg-[#F1F3F8] rounded-[18px] p-8 flex flex-col">
            {/* Icon */}
            <div className="mb-8 text-[#0F172A]">
              <div className="w-9 h-9 flex items-center justify-center border border-[#CBD5E1] rounded-lg bg-transparent">
                {ICONS[i] ?? ICONS[0]}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[24px] font-bold leading-[1.3] text-[#0F172A] mb-4">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] leading-[1.65] text-[#64748B] font-normal">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
