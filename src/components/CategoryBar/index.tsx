import React from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Category } from '@/payload-types'
import { CategoryScrollWrapper } from '../CategoryScrollWrapper'

import SmartHomeImage from '@/assets/images/smart-home.png'
import AjaxImage from '@/assets/images/ajax.png'
import VideoSurImage from '@/assets/images/video-surveillance.png'
import StorageImage from '@/assets/images/monitors.png'
import FireAlarmImage from '@/assets/images/fire-system.png'
import AccessControlImage from '@/assets/images/alarm-system.png'

import SmartHomeIcon from '@/assets/icons/smart-home.svg'
import AjaxIcon from '@/assets/icons/ajax.svg'
import VideoSurIcon from '@/assets/icons/video-sur.svg'
import StorageIcon from '@/assets/icons/storage.svg'
import FireAlarmIcon from '@/assets/icons/fire-system.svg'
import MenuIcon from '@/assets/icons/menu.svg'

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

const categoryIcons: Record<string, any> = {
  'ezviz-smart-home': SmartHomeIcon,
  ajax: AjaxIcon,
  'video-surveillance': VideoSurIcon,
  'storage-devices': StorageIcon,
  'fire-alarm-systems': FireAlarmIcon,
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

export const CategoryBar = async ({ lang = 'ka' }: { lang?: string }) => {
  const payload = await getPayload({ config: await config })

  const { docs: fetchedCategories }: { docs: Category[] } = await payload.find({
    collection: 'categories',
    where: { slug: { in: targetSlugs } },
    depth: 0,
    limit: 12,
    locale: lang as any,
  })

  const categories = targetSlugs
    .map((slug) => fetchedCategories.find((cat) => cat.slug === slug))
    .filter((cat): cat is Category => !!cat)

  return (
    <div className="max-w-[1440px] container mx-auto px-8 py-8">
      <CategoryScrollWrapper>
        <Link
          href={`/${lang}/products`}
          className="group flex-shrink-0 w-36 h-24 md:w-40 md:h-28 bg-[#2979BC] rounded-2xl flex flex-col items-center justify-center text-white gap-2 hover:bg-blue-700 transition-all shadow-md overflow-hidden"
        >
          <div className="relative w-7 h-7 transition-transform duration-500 group-hover:scale-125">
            <Image src={MenuIcon} alt="menu" fill className="invert brightness-0" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tighter">
            {lang === 'ka' ? 'ყველა' : 'All Shop'}
          </span>
        </Link>

        {categories.map((cat) => {
          const bgImg =
            categoryImages[cat.slug as string] || 'https://img.icons8.com/color/512/box.png'
          const iconImg = categoryIcons[cat.slug as string]

          return (
            <Link
              key={cat.id}
              href={`/${lang}/products/${cat.slug}`}
              className="group relative flex-shrink-0 w-36 h-24 md:w-40 md:h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all"
            >
              <Image
                src={bgImg}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:bg-black/30" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 text-center gap-1.5">
                {iconImg && (
                  <div className="relative w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={iconImg}
                      alt="icon"
                      fill
                      className="object-contain invert brightness-0"
                    />
                  </div>
                )}
                <span className="text-[10px] md:text-[11px] font-bold leading-tight uppercase tracking-tight drop-shadow-xl">
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
