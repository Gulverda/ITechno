import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/ProductGallery'
import { StarRating } from '@/components/StarRating'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function ProductDetails({ params, searchParams }: PageProps) {
  // 1. პარამეტრების მიღება
  const { slug } = await params
  const { lang = 'ka' } = await searchParams

  const payload = await getPayload({ config: await config })

  // 2. პროდუქტის წამოღება (depth: 2 მოიტანს კატეგორიის და ბრენდის დეტალებს)
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: lang as any,
    depth: 2,
  })

  const product = docs[0]
  if (!product) return notFound()

  const mainImageUrl = typeof product.mainImage === 'object' ? product.mainImage?.url : ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* მარცხენა მხარე: გალერეა */}
        <ProductGallery
          mainImage={mainImageUrl || ''}
          images={product.images || []}
          title={product.title}
        />

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

          {/* ინტერაქტიული რეიტინგი */}
          <div className="flex items-center gap-3 mb-6 bg-gray-50/50 self-start p-2 px-3 rounded-xl border border-gray-100">
            <StarRating
              productId={product.id.toString()}
              initialRating={product.rating || 0}
              lang={lang}
            />{' '}
            <span className="text-sm font-black text-gray-400 border-l pl-3 border-gray-200">
              {product.rating?.toFixed(1)}
            </span>
          </div>

          {/* ფასი */}
          <div className="text-4xl font-black text-gray-900 mb-8 flex items-baseline gap-1">
            {product.price} <span className="text-xl font-normal text-gray-500 font-sans">₾</span>
          </div>

          {/* მოკლე სპეციფიკაცია */}
          <div className="bg-white border border-gray-100 border-l-4 border-l-blue-600 p-5 mb-8 rounded-r-2xl shadow-sm">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              მოკლე მახასიათებლები:
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              {product.specifications || 'მონაცემები არ არის'}
            </p>
          </div>

          {/* ღილაკები */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="flex-1 bg-gray-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95 group">
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
                className="group-hover:rotate-12 transition-transform"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              კალათაში დამატება
            </button>
            <button className="px-8 py-4 bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-900 font-bold rounded-2xl transition-all active:scale-95">
              ყიდვა 1 წკაპით
            </button>
          </div>

          {/* სრული აღწერა */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">პროდუქტის აღწერა</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-line text-sm md:text-base bg-gray-50/30 p-4 rounded-2xl border border-gray-50">
              {product.description || 'აღწერა არ არის მოცემული'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
