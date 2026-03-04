import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function ProductDetails({ params, searchParams }: PageProps) {
  // 1. დავაჰლოდოთ პარამეტრები (Next.js 15+ სავალდებულოა)
  const { slug } = await params
  const { lang = 'ka' } = await searchParams

  const payload = await getPayload({ config: await config })

  // 2. პროდუქტის წამოღება slug-ით და სწორი ლოკალით
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: lang as any,
    depth: 2, // აუცილებელია რელაციური ველებისთვის (category.name)
  })

  const product = docs[0]
  if (!product) return notFound()

  const mainImageUrl = typeof product.mainImage === 'object' ? product.mainImage?.url : ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* მარცხენა მხარე: სურათი და გალერეა */}
        <div className="flex flex-col gap-6 sticky top-24">
          <div className="bg-white border border-gray-100 rounded-3xl p-8">
            <div className="relative aspect-square w-full overflow-hidden">
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 text-gray-300 italic">
                  სურათი არ არის
                </div>
              )}
            </div>
          </div>

          {/* 📸 გალერეის სექცია */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((item: any, index: number) => {
                const url = typeof item.image === 'object' ? item.image?.url : null
                if (!url) return null

                return (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl border border-gray-100 overflow-hidden bg-white hover:border-blue-400 cursor-pointer transition-colors p-2"
                  >
                    <Image
                      src={url}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* მარჯვენა მხარე: ინფორმაცია */}
        <div className="flex flex-col">
          {/* კატეგორია და მარაგი */}
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {typeof product.category === 'object' ? product.category?.name : 'სხვადასხვა'}
            </span>
            <span
              className={`text-sm font-medium ${
                product.stock === 'in-stock' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {product.stock === 'in-stock' ? '● მარაგშია' : '○ მარაგში არ არის'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            {product.title}
          </h1>

          {/* რეიტინგი */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-gray-500">({product.rating || '5.0'})</span>
          </div>

          <div className="text-4xl font-black text-gray-900 mb-8">
            {product.price} <span className="text-xl font-normal text-gray-500">₾</span>
          </div>

          {/* მოკლე სპეციფიკაცია */}
          <div className="bg-gray-50 border-l-4 border-blue-600 p-4 mb-8 rounded-r-xl">
            <h3 className="text-sm font-bold text-gray-900 mb-1">მოკლე მახასიათებლები:</h3>
            <p className="text-gray-600 text-sm italic leading-relaxed">
              {product.specifications || 'მონაცემები არ არის'}
            </p>
          </div>

          {/* ღილაკები */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              კალათაში დამატება
            </button>
            <button className="px-8 py-4 bg-white border-2 border-gray-100 hover:border-blue-100 hover:text-blue-600 text-gray-900 font-bold rounded-2xl transition-all active:scale-95">
              ყიდვა 1 წკაპით
            </button>
          </div>

          {/* სრული აღწერა */}
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
              პროდუქტის აღწერა
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-line text-sm md:text-base">
              {product.description || 'აღწერა არ არის მოცემული'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
