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

  // ფასის ლოგიკა
  const isPriceZero = !product.price || product.price === 0
  const hasDiscount =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price

  const mainImageUrl = typeof product.mainImage === 'object' ? product.mainImage?.url : ''
  const category = typeof product.category === 'object' ? product.category : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href={`/?lang=${lang}`} className="hover:text-blue-600 transition">
          {lang === 'ka' ? 'მთავარი' : 'Home'}
        </Link>
        <span>/</span>
        {category && (
          <Link
            href={`/?category=${category.id}&lang=${lang}`}
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
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {category.name as string}
              </div>
            )}
            <span
              className={`text-sm font-medium ${product.stock === 'in-stock' ? 'text-green-500' : 'text-red-500'}`}
            >
              {product.stock === 'in-stock'
                ? lang === 'ka'
                  ? '● მარაგშია'
                  : '● In Stock'
                : lang === 'ka'
                  ? '● მარაგში არ არის'
                  : '● Out of Stock'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            {product.title}
          </h1>

          {/* ფასის სექცია */}
          <div className="mb-8">
            {isPriceZero ? (
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl inline-block">
                <span className="text-xl md:text-2xl font-bold text-blue-700">
                  {lang === 'ka'
                    ? 'ფასის დასაზუსტებლად გთხოვთ დაგვიკავშირდეთ'
                    : 'Contact us for a price'}
                </span>
              </div>
            ) : hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-lg text-red-500 line-through mb-1">{product.price} ₾</span>
                <div className="text-5xl font-black text-gray-900 flex items-baseline gap-1">
                  {product.discountPrice}{' '}
                  <span className="text-2xl font-normal text-gray-500">₾</span>
                </div>
              </div>
            ) : (
              <div className="text-5xl font-black text-gray-900 flex items-baseline gap-1">
                {product.price} <span className="text-2xl font-normal text-gray-500">₾</span>
              </div>
            )}
          </div>

          <div className="bg-white border-l-4 border-l-blue-600 p-5 mb-8 rounded-r-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              {lang === 'ka' ? 'მოკლე მახასიათებლები:' : 'Quick Specs:'}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              {product.specifications ||
                (lang === 'ka' ? 'მონაცემები არ არის' : 'No specs available')}
            </p>
          </div>

          {/* ღილაკები */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {isPriceZero ? (
              <>
                <a
                  href="tel:+995555123456"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl text-center flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {lang === 'ka' ? 'დაგვირეკეთ' : 'Call Us'}
                </a>
                <a
                  href="https://wa.me/995555123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl text-center flex items-center justify-center gap-2"
                >
                  WhatsApp
                </a>
              </>
            ) : (
              <button className="flex-1 bg-gray-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-95">
                {lang === 'ka' ? 'კალათაში დამატება' : 'Add to Cart'}
              </button>
            )}
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {lang === 'ka' ? 'პროდუქტის აღწერა' : 'Product Description'}
            </h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
              {product.description ||
                (lang === 'ka' ? 'აღწერა არ არის მოცემული' : 'No description provided')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
