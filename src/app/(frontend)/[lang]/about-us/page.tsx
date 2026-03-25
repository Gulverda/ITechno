'use client'

import React from 'react'
import Image from 'next/image'
import { Shield, Network, Cpu, Flame, DoorOpen, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-white text-[#0F172A]">
      {/* HERO */}
      <section className="max-w-7xl mx-auto pt-12 pb-24 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-[52px] text-[#1976BA] md:text-[72px] font-lgv leading-[1.05] uppercase tracking-tight">
            უსაფრთხოების
            <br />
            <span className="text-[#000000]">გარანტია თქვენთვის</span>
          </h1>

          <p className="mt-8 text-[18px] text-slate-500 leading-relaxed max-w-xl font-firaGo400">
            შპს აიტეჩნო დაარსდა 2017 წელს და უკვე 8 წელია წარმატებით ოპერირებს ქართულ ბაზარზე
            უსაფრთხოების სისტემების მიმართულებით. კომპანიის საქმიანობა ეფუძნება პროფესიონალიზმს,
            ტექნიკურ სიზუსტეს და მაღალ პასუხისმგებლობას თითოეული შესრულებული პროექტის მიმართ.
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

      {/* ABOUT TEXT */}
      <section className="bg-white py-20 px-6 border-y border-slate-200">
        <div className="grid lg:grid-cols-12 gap-y-16 lg:gap-x-0  max-w-7xl mx-auto">
          {/* Left Column: Bold Statement */}
          <div className="lg:col-span-7 pr-0 lg:pr-20">
            <h3 className="text-[36px] md:text-[54px] font-bold leading-[1.05] tracking-tight text-[#0F172A]">
              ჩვენი მთავარი პრიორიტეტია სანდო და სტაბილური უსაფრთხოების სისტემების დანერგვა
            </h3>
          </div>

          {/* Right Column: Context & Detail */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-4">
            <p className="text-[18px] md:text-[21px] leading-relaxed mb-4 text-slate-600 font-light">
              სისტემები, რომლებიც მომხმარებელს{' '}
              <span className="text-[#0F172A] font-medium">გრძელვადიან დაცვასა და სიმშვიდეს</span>{' '}
              უზრუნველყოფს.
            </p>

            <div className="mt-16 lg:mt-0 p-10 bg-[#F8FAFC] rounded-2xl">
              <p className="text-[16px] md:text-[18px] leading-relaxed text-[#0F172A]">
                თითოეული პროექტი იგეგმება დეტალურად — ობიექტის სპეციფიკის, რისკების და ტექნიკური
                მოთხოვნების სრული ანალიზის საფუძველზე.
              </p>
              <div className="mt-6 flex gap-1">
                <div className="h-1 w-8 bg-[#1976BA]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BRANDS SECTION (REPLACED) --- */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[40px] font-bold text-[#0F172A] leading-tight max-w-3xl mx-auto">
              კომპანია მუშაობს საერთაშორისო ბრენდების თანამედროვე ტექნოლოგიებთან, მათ შორის
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
          ძირითადი მიმართულებები
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: Shield,
              title: 'ვიდეოსამეთვალყურეო სისტემების პროექტირება და ინსტალაცია',
              img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
            },
            {
              icon: Cpu,
              title: 'სმარტ სისტემების ინტეგრირება',
              img: 'https://images.unsplash.com/photo-1558002038-1055e2e28ed1?q=80&w=1200&auto=format&fit=crop',
            },
            {
              icon: Flame,
              title: 'სახანძრო სიგნალიზაციის მოწყობა',
              img: 'https://images.unsplash.com/photo-1603727039546-4c5a5d7f3e89?q=80&w=1200&auto=format&fit=crop',
            },
            {
              icon: DoorOpen,
              title: 'დაშვების კონტროლის სისტემების დანერგვა',
              img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop',
            },
            {
              icon: Network,
              title: 'დომოფონების მონტაჟი',
              img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
            },
            {
              icon: CheckCircle,
              title: 'კომპიუტერული ქსელების პროექტირება და მოწყობა',
              img: 'https://images.unsplash.com/photo-1526378722484-cc5c510f4b74?q=80&w=1200&auto=format&fit=crop',
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
              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/55" />

              {/* CONTENT */}
              <div className="relative z-10 text-white">
                <item.icon size={42} className="text-white" />

                <h3 className="mt-6 text-[22px] font-bold leading-snug">{item.title}</h3>

                {/* BRAND ACCENT LINES */}
                <div className="mt-5 flex gap-2">
                  <div className="w-8 h-[2px] bg-[#1976BA]" />
                  <div className="w-4 h-[2px] bg-[#F49427]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[16px] text-[#1976BA] font-semibold">მომსახურება და გარანტია</span>

          <h3 className="mt-6 text-[34px] md:text-[44px] font-bold leading-tight text-[#0F172A]">
            სრული მხარდაჭერა ერთ სივრცეში
          </h3>

          <div className="mt-8 space-y-4 text-[18px] leading-[1.9] text-slate-600">
            <p>
              კომპანია უზრუნველყოფს როგორც პროდუქციის მიწოდებას, ასევე სრულ ტექნიკურ მომსახურებას —
              კონსულტაციიდან სისტემის ექსპლუატაციაში გაშვებამდე და შემდგომ მხარდაჭერამდე.
            </p>

            <p>
              ყველა ძირითად პროდუქტზე ვრცელდება ოფიციალური გარანტია, ასევე გარანტიას ვაძლევთ
              შესრულებულ სამუშაოს. ჩვენი გუნდი უზრუნველყოფს სწრაფ რეაგირებას და ტექნიკურ
              მხარდაჭერას, რაც მომხმარებლისთვის დამატებითი სანდოობის საფუძველს ქმნის.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-4">
              <span className="text-[16px] text-[#1976BA] font-semibold">
                რატომ აიტეჩნო ?
              </span>

              <h3 className="mt-6 text-[34px] md:text-[44px] font-bold leading-tight text-[#0F172A]">
                უსაფრთხოება,
                <br />
                რომელსაც შეგიძლიათ ენდოთ
              </h3>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-slate-200 border-t border-slate-200">
                {[
                  {
                    title: 'სანდოობა და გამოცდილება',
                    text: '8 წლიანი პრაქტიკა ქართულ ბაზარზე და მრავალი წარმატებით განხორციელებული პროექტი.',
                  },
                  {
                    title: 'პროფესიონალური მიდგომა',
                    text: 'თითოეული სისტემა იგეგმება ინდივიდუალურად, სტანდარტების სრული დაცვით.',
                  },
                  {
                    title: 'ხარისხიანი პროდუქცია',
                    text: 'ვმუშაობთ მხოლოდ სანდო საერთაშორისო ბრენდებთან.',
                  },
                  {
                    title: 'გარანტია და პასუხისმგებლობა',
                    text: 'ოფიციალური გარანტია პროდუქციაზე და შესრულებულ სამუშაოზე.',
                  },
                  {
                    title: 'მომსახურებაზე ორიენტაცია',
                    text: 'ჩვენი ამოცანაა არა მხოლოდ სისტემის მონტაჟი, არამედ მისი სტაბილური და უწყვეტი მუშაობის უზრუნველყოფა.',
                  },
                  {
                    title: 'გრძელვადიანი პარტნიორობა',
                    text: 'ვქმნით ურთიერთობას, რომელიც დაფუძნებულია ნდობაზე, გამჭვირვალობაზე და შედეგზე.',
                  },
                ].map((item, i) => (
                  <div key={i} className="grid md:grid-cols-12 gap-4 md:gap-8 py-7">
                    <div className="md:col-span-4">
                      <h4 className="text-[18px] font-semibold text-[#0F172A]">{item.title}</h4>
                    </div>

                    <div className="md:col-span-8">
                      <p className="text-[17px] leading-[1.8] text-slate-600">{item.text}</p>
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
