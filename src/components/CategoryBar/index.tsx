import React from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { LayoutGrid } from 'lucide-react'
import { Category } from '@/payload-types'
import { CategoryScrollWrapper } from '../CategoryScrollWrapper'

import SmartHomeImage from '@/assets/images/smart-home.png'
import AjaxImage from '@/assets/images/ajax.png'
import VideoSurImage from '@/assets/images/video-surveillance.png'
import StorageImage from '@/assets/images/monitors.png'
import FireAlarmImage from '@/assets/images/fire-system.png'
import AccessControlImage from '@/assets/images/alarm-system.png'

const categoryImages: Record<string, string | StaticImageData> = {
  'ezviz-smart-home': SmartHomeImage,
  ajax: AjaxImage,
  'video-surveillance': VideoSurImage,
  'storage-devices': StorageImage,
  'fire-alarm-systems': FireAlarmImage,
  'access-control-systems': AccessControlImage,
  'tv-displays': 'https://img.icons8.com/color/512/monitor.png',
  'network-equipment': 'https://img.icons8.com/color/512/server.png',
  cables: 'https://img.icons8.com/color/512/ethernet-off.png',
}

const targetSlugs = [
  'ezviz-smart-home',
  'ajax',
  'video-surveillance',
  'storage-devices',
  'fire-alarm-systems',
  'security-alarm-systems',
  'access-control-systems',
  'tv-displays',
  'network-equipment',
  'cables',
]

// ექსპორტი აუცილებლად უნდა იყოს Named, თუ page.tsx-ში { CategoryBar } ასე აიმპორტებ
export const CategoryBar = async ({ lang = 'ka' }: { lang?: string }) => {
  const payload = await getPayload({ config: await config })

  const { docs: fetchedCategories }: { docs: Category[] } = await payload.find({
    collection: 'categories',
    where: { slug: { in: targetSlugs } },
    depth: 0,
    limit: 12,
  })

  // სორტირება targetSlugs-ის მიხედვით
  const categories = targetSlugs
    .map((slug) => fetchedCategories.find((cat) => cat.slug === slug))
    .filter((cat): cat is Category => !!cat)

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryScrollWrapper>
        {/* "ყველა" ლინკი */}
        <Link
          href={`/${lang}/products`}
          className="flex-shrink-0 w-36 h-24 md:w-40 md:h-28 bg-[#2979BC] rounded-2xl flex flex-col items-center justify-center text-white gap-2 hover:bg-blue-700 transition-all shadow-md group"
        >
          <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tighter">
            {lang === 'ka' ? 'ყველა' : 'All Shop'}
          </span>
        </Link>

        {/* კატეგორიების ლინკები SLUG-ით */}
        {categories.map((cat) => {
          const localImg =
            categoryImages[cat.slug as string] || 'https://img.icons8.com/color/512/box.png'

          return (
            <Link
              key={cat.id}
              // მთავარი ცვლილება: აქ ID-ს ნაცვლად გადავცემთ SLUG-ს
              href={`/${lang}/products/${cat.slug}`}
              className="group relative flex-shrink-0 w-36 h-24 md:w-40 md:h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-xl"
            >
              <Image
                src={localImg}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-white p-2 text-center">
                <span className="text-[10px] md:text-[11px] font-semibold leading-tight uppercase tracking-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          )
        })}
      </CategoryScrollWrapper>
    </div>
  )
}
