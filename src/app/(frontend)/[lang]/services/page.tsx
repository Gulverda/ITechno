'use client'

import React, { useState } from 'react'
import { Camera, ShieldAlert, Key, Cpu, Network, ChevronDown, ArrowRight } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'ვიდეოსამეთვალყურეო სისტემები',
    icon: <Camera className="w-6 h-6 text-slate-900" />,
    description:
      'შპს აიტეჩნო უზრუნველყოფს ვიდეოსამეთვალყურეო სისტემების სრულ პროექტირებას, მიწოდებასა და ინსტალაციას. ჩვენ ვმუშაობთ საერთაშორისო ლიდერ ბრენდებთან, მათ შორის: Hikvision, Hiwatch, EZVIZ. ვახორციელებთ როგორც მცირე ობიექტების, ასევე ფართომასშტაბიანი სისტემების დანერგვას. თითოეული პროექტი იგეგმება ინდივიდუალურად, კამერების სწორი განლაგებით, ოპტიმალური ხედვის კუთხით და უსაფრთხოების სტანდარტების სრული დაცვით. სისტემა უზრუნველყოფს დისტანციურ მონიტორინგს, არქივაციას და სტაბილურ მუშაობას.',
    brands: ['Hikvision', 'Hiwatch', 'EZVIZ'],
  },
  {
    id: 2,
    title: 'სახანძრო სიგნალიზაცია',
    icon: <ShieldAlert className="w-6 h-6 text-slate-900" />,
    description:
      'ჩვენ ვახორციელებთ სახანძრო სიგნალიზაციის სისტემების პროექტირებასა და მონტაჟს მოქმედი ტექნიკური მოთხოვნების შესაბამისად. სისტემა უზრუნველყოფს კვამლისა და ცეცხლის დროულ აღმოჩენას, ხმოვან და ვიზუალურ გაფრთხილებას და ცენტრალიზებულ კონტროლს. ჩვენი გუნდი უზრუნველყოფს სისტემის სწორ კონფიგურაციას, ტესტირებას და შემდგომ ტექნიკურ მხარდაჭერას.',
    features: ['კვამლის აღმოჩენა', 'ვიზუალური გაფრთხილება', 'ცენტრალიზებული კონტროლი'],
  },
  {
    id: 3,
    title: 'დაშვების კონტროლის სისტემა',
    icon: <Key className="w-6 h-6 text-slate-900" />,
    description:
      'დაშვების კონტროლის სისტემა საშუალებას გაძლევთ მართოთ, აკონტროლოთ და შეზღუდოთ წვდომა კონკრეტულ სივრცეებზე. ჩვენ ვახორციელებთ ბარათის სისტემებს, ბიომეტრიულ სისტემებს, ელექტრო საკეტების ინტეგრაციას და ანგარიშგების და ლოგირების სისტემების კონფიგურაციას. სისტემა ინტეგრირდება ვიდეოსამეთვალყურეო და სხვა უსაფრთხოების გადაწყვეტილებებთან.',
    features: ['ბიომეტრია', 'ბარათის სისტემები', 'ელექტრო საკეტები'],
  },
  {
    id: 4,
    title: 'სმარტ სისტემების ინტეგრირება',
    icon: <Cpu className="w-6 h-6 text-slate-900" />,
    description:
      'ვახორციელებთ სმარტ სისტემების ინტეგრაციას, რომელიც აერთიანებს ვიდეოსამეთვალყურეო, დაშვების კონტროლის და სხვა ტექნოლოგიურ გადაწყვეტილებებს ერთიან პლატფორმაში. სისტემა უზრუნველყოფს დისტანციურ მართვას, მობილურ წვდომას და ავტომატიზირებულ სცენარებს.',
    features: ['დისტანციური მართვა', 'ავტომატიზირებული სცენარები'],
  },
  {
    id: 5,
    title: 'კომპიუტერული ქსელები',
    icon: <Network className="w-6 h-6 text-slate-900" />,
    description:
      'უსაფრთხოების ნებისმიერი სისტემა საჭიროებს ხარისხიან ქსელურ ინფრასტრუქტურას. ჩვენ ვახორციელებთ სტრუქტურირებული კაბელირების დაგეგმვას, ქსელური მოწყობილობების მონტაჟს, სერვერული სივრცის ორგანიზებას და ოპტიმალურ ქსელურ კონფიგურაციას. სწორად დაგეგმილი ქსელი უზრუნველყოფს სისტემების სტაბილურ და უწყვეტ მუშაობას.',
    features: ['კაბელირება', 'სერვერული მოწყობა', 'ქსელის კონფიგურაცია'],
  },
]

export default function ServicesPage() {
  const [openId, setOpenId] = useState<number | null>(1)

  const toggleService = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen text-slate-900">
      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <p className="text-sm text-slate-400">ჩვენი სერვისები</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#111111] md:text-4xl">
                დეტალური მიმართულებები
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-600">
                გახსენით თითოეული სერვისი და ნახეთ აღწერა, ძირითადი შესაძლებლობები და ბრენდები,
                რომლებთანაც ვმუშაობთ.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-4">
              {services.map((service) => {
                const isOpen = openId === service.id

                return (
                  <div
                    key={service.id}
                    className="overflow-hidden rounded-[20px] border border-slate-200 bg-white transition duration-300"
                  >
                    <button
                      onClick={() => toggleService(service.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left md:px-8 md:py-7"
                    >
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                          {service.icon}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-[#1976BA] md:text-2xl">
                            {service.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            დააჭირეთ დეტალების სანახავად
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDown className="h-5 w-5 text-slate-700" />
                      </div>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-slate-100 px-6 pb-6 pt-6 md:px-8 md:pb-8 md:pt-7">
                          <p className="max-w-4xl text-base leading-8 text-slate-700 md:text-[17px]">
                            {service.description}
                          </p>

                          {service.brands && (
                            <div className="mt-6">
                              <p className="mb-3 text-sm font-medium text-slate-400">ბრენდები</p>
                              <div className="flex flex-wrap gap-2">
                                {service.brands.map((brand) => (
                                  <span
                                    key={brand}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                                  >
                                    {brand}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {service.features && (
                            <div className="mt-6">
                              <p className="mb-3 text-sm font-medium text-slate-400">
                                ძირითადი შესაძლებლობები
                              </p>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {service.features.map((feature, idx) => (
                                  <div
                                    key={idx}
                                    className="rounded-xl border border-slate-200 bg-[#f8f8f6] px-4 py-4 text-sm font-medium text-slate-800"
                                  >
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="rounded-[32px] bg-[#1976BA] px-8 py-10 text-white md:px-12 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h3 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
                დაგეგმეთ თქვენზე მორგებული უსაფრთხოების სისტემა
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
                თუ გჭირდებათ ობიექტის შეფასება, სისტემის შერჩევა ან სრული პროექტირება-მონტაჟი,
                დაგვიკავშირდით და ერთად განვსაზღვროთ საუკეთესო გადაწყვეტა.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
