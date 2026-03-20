import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

export default async function BrandsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const payload = await getPayload({ config: await config })

  const brands = await payload.find({
    collection: 'brands',
    limit: 100,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800 uppercase tracking-wide">
        {lang === 'ka' ? 'ბრენდები' : 'Brands'}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.docs.map((brand) => (
          <Link
            key={brand.id}
            // თუ მთავარი გვერდი (frontend) საქაღალდეშია პირდაპირ:
            href={`/?lang=${lang}&brand=${brand.id}`}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full mb-4 flex items-center justify-center text-2xl font-semibold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {brand.name ? brand.name[0].toUpperCase() : '?'}
            </div>
            <span className="font-bold text-gray-800 group-hover:text-blue-600 text-center text-sm">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
