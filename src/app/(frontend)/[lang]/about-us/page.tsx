'use client'

import React, { use } from 'react'
import Image from 'next/image'
import { Shield, Network, Cpu, Flame, DoorOpen, CheckCircle } from 'lucide-react'
import dict from '@/lib/translations.json'

export default function aboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const t = (dict as any)[lang] || dict.ka

  return (
    <div className="bg-white text-[#0F172A]">
      {/* HERO */}
      <section className="max-w-7xl mx-auto pt-12 sm:pb-24 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-[52px] text-[#1976BA] md:text-[72px] font-lgv leading-[1.05] uppercase tracking-tight">
            {t.aboutUs.hero.titleBlue}
            <br />
            <span className="text-[#000000]">{t.aboutUs.hero.titleBlack}</span>
          </h1>

          <p className="mt-8 text-[18px] text-slate-500 leading-relaxed max-w-xl font-firaGo400">
            {t.aboutUs.hero.story}
          </p>
        </div>

        <div className="relative h-[520px] rounded-[30px] overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200"
            alt="Security Tech"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* aboutUs TEXT */}
      <section className="bg-white py-20 px-6 border-y border-slate-200">
        <div className="grid lg:grid-cols-12 gap-y-16 lg:gap-x-0 max-w-7xl mx-auto">
          <div className="lg:col-span-7 pr-0 lg:pr-20">
            <h3 className="text-[36px] md:text-[54px] font-bold leading-[1.05] tracking-tight text-[#0F172A]">
              {t.aboutUs.priority.title}
            </h3>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between pt-4">
            <p className="text-[18px] md:text-[21px] leading-relaxed mb-4 text-slate-600 font-light">
              {t.aboutUs.priority.sub}
            </p>

            <div className="mt-16 lg:mt-0 p-10 bg-[#F8FAFC] rounded-2xl">
              <p className="text-[16px] md:text-[18px] leading-relaxed text-[#0F172A]">
                {t.aboutUs.priority.analysis}
              </p>
              <div className="mt-6 flex gap-1">
                <div className="h-1 w-8 bg-[#1976BA]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[40px] font-bold text-[#0F172A] leading-tight max-w-3xl mx-auto">
              {t.aboutUs.brands.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                name: 'HIKVISION',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Hikvision_logo.svg/2560px-Hikvision_logo.svg.png',
              },
              {
                name: 'HIWATCH',
                logo: 'https://seeklogo.com/images/H/hiwatch-logo-7E6B81944E-seeklogo.com.png',
              },
              {
                name: 'EZVIZ',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Ezviz_logo.svg/2560px-Ezviz_logo.svg.png',
              },
              {
                name: 'AJAX',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ajax_Systems_logo.svg/1280px-Ajax_Systems_logo.svg.png',
              },
              {
                name: 'MIKROTIK',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/MikroTik_logo.svg/1280px-MikroTik_logo.svg.png',
              },
              {
                name: 'HP',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1200px-HP_logo_2012.svg.png',
              },
              {
                name: 'TRENDNET',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/TRENDnet_logo.svg/2560px-TRENDnet_logo.svg.png',
              },
            ].map((brand, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-[24px] p-8 h-[140px] flex items-center justify-center hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className="relative w-full h-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-center text-[42px] font-lgv uppercase tracking-widest mb-20">
          {t.aboutUs.directions.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: Shield,
              img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
            },
            {
              icon: Cpu,
              img: 'https://images.unsplash.com/photo-1558002038-1055e2e28ed1?q=80&w=1200',
            },
            {
              icon: Flame,
              img: 'https://images.unsplash.com/photo-1603727039546-4c5a5d7f3e89?q=80&w=1200',
            },
            {
              icon: DoorOpen,
              img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200',
            },
            {
              icon: Network,
              img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200',
            },
            {
              icon: CheckCircle,
              img: 'https://images.unsplash.com/photo-1526378722484-cc5c510f4b74?q=80&w=1200',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-12 rounded-[32px] overflow-hidden hover:shadow-2xl transition"
              style={{
                backgroundImage: `url(${item.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative z-10 text-white">
                <item.icon size={42} className="text-white" />
                <h3 className="mt-6 text-[22px] font-bold leading-snug">
                  {t.aboutUs.directions.items[i].title}
                </h3>
                <div className="mt-5 flex gap-2">
                  <div className="w-8 h-[2px] bg-[#1976BA]" />
                  <div className="w-4 h-[2px] bg-[#F49427]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WARRANTY SECTION */}
      <section className="bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[16px] text-[#1976BA] font-semibold">
            {t.aboutUs.support.badge}
          </span>
          <h3 className="mt-6 text-[34px] md:text-[44px] font-bold leading-tight text-[#0F172A]">
            {t.aboutUs.support.title}
          </h3>
          <div className="mt-8 space-y-4 text-[18px] leading-[1.9] text-slate-600 font-firaGo400">
            <p>{t.aboutUs.support.text1}</p>
            <p>{t.aboutUs.support.text2}</p>
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="bg-[#F8FAFC] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-4">
              <span className="text-[16px] text-[#1976BA] font-semibold">
                {t.aboutUs.whyUs.badge}
              </span>
              <h3 className="mt-6 text-[34px] md:text-[44px] font-bold leading-tight text-[#0F172A]">
                {t.aboutUs.whyUs.title.split(',')[0]},
                <br />
                {t.aboutUs.whyUs.title.split(',')[1]}
              </h3>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-slate-200 border-t border-slate-200">
                {t.aboutUs.whyUs.items.map((item: any, i: number) => (
                  <div key={i} className="grid md:grid-cols-12 gap-4 md:gap-8 py-7">
                    <div className="md:col-span-4">
                      <h4 className="text-[18px] font-semibold text-[#0F172A]">{item.title}</h4>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-[17px] leading-[1.8] text-slate-600 font-firaGo400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
