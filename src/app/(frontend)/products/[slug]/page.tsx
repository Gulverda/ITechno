import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/ProductGallery'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function ProductDetails({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { lang = 'ka' } = await searchParams
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: lang as any,
    depth: 2,
  })

  const product = docs[0]
  if (!product) return notFound()

  const mainImageUrl = typeof product.mainImage === 'object' ? product.mainImage?.url : ''
  const category = typeof product.category === 'object' ? product.category : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href={`/?lang=${lang}`} className="hover:text-blue-600 transition">
          მთავარი
        </Link>
        <span>/</span>
        {category && (
          <Link
            href={`/${lang}/category/${category.slug}`}
            className="hover:text-blue-600 transition"
          >
            {category.name as string}
          </Link>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductGallery
          mainImage={mainImageUrl || ''}
          images={product.images || []}
          title={product.title}
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            {category && (
              <Link
                href={`/${lang}/category/${category.slug}`}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition"
              >
                {category.name as string}
              </Link>
            )}
            <span
              className={`text-sm font-medium ${product.stock === 'in-stock' ? 'text-green-500' : 'text-red-500'}`}
            >
              {product.stock === 'in-stock' ? '● მარაგშია' : '● მარაგში არ არის'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            {product.title}
          </h1>

          <div className="text-4xl font-black text-gray-900 mb-8 flex items-baseline gap-1">
            {product.price} <span className="text-xl font-normal text-gray-500">₾</span>
          </div>

          <div className="bg-white border-l-4 border-l-blue-600 p-5 mb-8 rounded-r-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              მოკლე მახასიათებლები:
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              {product.specifications || 'მონაცემები არ არის'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="flex-1 bg-gray-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-95">
              კალათაში დამატება
            </button>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">პროდუქტის აღწერა</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
              {product.description || 'აღწერა არ არის მოცემული'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
