'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, Check, Zap, Target, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-akolkhn antialiased">
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-[48px] md:text-[64px] font-lgv leading-[1.1] uppercase tracking-tight">
              Building Trust, <br />
              <span className="text-blue-600">Securing Future</span>
            </h1>
            <p className="text-[18px] text-slate-500 font-light leading-relaxed max-w-lg">
              შპს აიტეჩნო 2017 წლიდან ქმნის უსაფრთხო გარემოს. ჩვენი საქმიანობა ეფუძნება
              პროფესიონალიზმს და უახლეს ტექნოლოგიურ მიღწევებს.
            </p>
            <button className="bg-[#0A0A0A] text-white px-10 py-4 rounded-full text-[14px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
              გაიგე მეტი
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-[32px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600"
                  alt="CCTV"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-[32px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600"
                  alt="Smart Home"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative h-full rounded-[32px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600"
                alt="Tech"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-28 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-lgv uppercase tracking-widest leading-tight">
            რატომ აიტეჩნო?
          </h2>
          <div className="h-1 w-16 bg-[#FF6B00] mx-auto rounded-full pt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {[
            {
              t: 'სანდოობა',
              d: '8 წლიანი პრაქტიკა ბაზარზე და მრავალი წარმატებით განხორციელებული პროექტი.',
              icon: Zap,
            },
            {
              t: 'პროფესიონალიზმი',
              d: 'თითოეული სისტემა იგეგმება ინდივიდუალურად, სტანდარტების სრული დაცვით.',
              icon: Target,
            },
            {
              t: 'ხარისხი',
              d: 'ვმუშაობთ მხოლოდ სანდო საერთაშორისო ბრენდებთან და უახლეს ტექნოლოგიებთან.',
              icon: Zap,
            },
            {
              t: 'გარანტია',
              d: 'ოფიციალური გარანტია პროდუქციაზე და შესრულებულ სამუშაოზე.',
              icon: Target,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 hover:border-blue-600 transition-all group flex gap-6 items-start"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <item.icon size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-bold mt-1 text-slate-900 leading-snug">{item.t}</h4>
                <p className="text-slate-500 font-light text-[16px] leading-relaxed">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 space-y-12">
            <div className="relative">
              <span className="text-[13px] font-black uppercase tracking-[0.5em] text-blue-600/50 mb-4 block">
                Our Legacy
              </span>
              <h2 className="text-[48px] md:text-[56px] font-lgv uppercase leading-[0.9] tracking-tighter">
                უსაფრთხოების <br />
                <span className="text-blue-600">ახალი ერა</span>
              </h2>
            </div>

            <div className="space-y-6">
              {[
                { text: '8 წლიანი გამოცდილება', val: '08' },
                { text: '1500+ დასრულებული პროექტი', val: '1.5K' },
                { text: 'ავტორიზებული პარტნიორობა', val: 'Elite' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 text-[17px] font-medium">{item.text}</span>
                  </div>
                  <span className="text-[14px] font-black text-slate-300 group-hover:text-blue-200 transition-colors uppercase tracking-widest">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative group pt-4">
              <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800"
                  alt="Quality"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 -right-6 md:right-10 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-2xl max-w-[240px] hidden md:block">
                <div className="w-10 h-1 bg-[#FF6B00] mb-4 rounded-full" />
                <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Status
                </p>
                <h4 className="text-[18px] font-bold text-[#0A0A0A] leading-tight text-balance">
                  გარანტირებული ხარისხის კონტროლი
                </h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-12 pt-12 lg:pt-0">
            <div className="mb-12">
              <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-[#FF6B00] mb-4">
                სერვისები
              </h3>
              <p className="text-slate-400 text-[18px] font-light italic">
                ჩვენ ვფარავთ ციფრული და ფიზიკური დაცვის სრულ სპექტრს.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  t: 'ვიდეო კონტროლი',
                  d: 'პროფესიონალური მონტაჟი Hikvision-ის უახლესი კამერებით. AI ანალიტიკა, რომელიც რეალურ დროში ამოიცნობს საფრთხეს.',
                  icon: '01',
                },
                {
                  t: 'სმარტ სისტემები',
                  d: 'თქვენი სივრცის სრული ავტომატიზაცია. განათება, სენსორები და საკეტები — ყველაფერი თქვენს სმარტფონში.',
                  icon: '02',
                },
                {
                  t: 'ქსელური მოწყობა',
                  d: 'ოპტიკური და უსადენო ქსელების პროექტირება. სტაბილური IT ინფრასტრუქტურა ბიზნესის შეუფერხებელი მუშაობისთვის.',
                  icon: '03',
                },
                {
                  t: 'უსაფრთხოების აუდიტი',
                  d: 'არსებული სისტემების დიაგნოსტიკა და ოპტიმიზაცია. რისკების შეფასება საერთაშორისო სტანდარტების მიხედვით.',
                  icon: '04',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`group rounded-[32px] transition-all duration-500 border ${openIndex === i ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-transparent hover:bg-slate-50/50'}`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full py-10 px-8 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-8">
                      <span
                        className={`text-[14px] font-black transition-colors ${openIndex === i ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}
                      >
                        {s.icon}
                      </span>
                      <span
                        className={`text-[22px] md:text-[26px] font-bold tracking-tight transition-colors ${openIndex === i ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}
                      >
                        {s.t}
                      </span>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-500 ${openIndex === i ? 'bg-blue-600 border-blue-600 text-white rotate-45 scale-110 shadow-lg shadow-blue-200' : 'text-slate-400 group-hover:border-slate-400'}`}
                    >
                      <Plus size={20} />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-8 pb-10 ml-16">
                      <p className="text-slate-500 text-[18px] font-light leading-relaxed max-w-xl">
                        {s.d}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-[14px] uppercase tracking-widest cursor-pointer hover:gap-4 transition-all">
                        დეტალურად <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-[#0A0A0A] rounded-[48px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <h2 className="text-white text-[32px] md:text-[48px] font-lgv uppercase tracking-widest relative z-10">
            მზად ხართ <br /> <span className="text-blue-500">დაცვისთვის?</span>
          </h2>
          <p className="text-white/50 text-[18px] font-light max-w-xl mx-auto relative z-10">
            დაგვიკავშირდით დღესვე და მიიღეთ ინდივიდუალური გადაწყვეტილება თქვენი უსაფრთხოებისთვის.
          </p>
          <div className="relative z-10 pt-4">
            <button className="bg-white text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-[14px] hover:bg-[#FF6B00] hover:text-white transition-all">
              კონტაქტი
            </button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
      </section>
    </div>
  )
}
