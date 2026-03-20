import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/ProductGallery'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { Metadata } from 'next'
import { Phone, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const sParams = await searchParams
  const lang = (sParams?.lang as 'ka' | 'en') || 'ka'

  const payload = await getPayload({ config: await config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: lang,
  })

  const product = docs[0]
  if (!product) return { title: 'Product Not Found | I-Techno' }

  const title = `${product.title} | I-Techno`
  const description =
    product.specifications ||
    (typeof product.description === 'string' ? product.description.substring(0, 160) : '')
  const imageUrl = typeof product.mainImage === 'object' ? (product.mainImage as any)?.url : ''
  const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : `${baseUrl}/og-image.jpg`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/${lang}/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/products/${slug}`,
      type: 'website',
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: product.title }],
    },
  }
}

export default async function ProductDetails({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sParams = await searchParams
  const lang = (sParams?.lang as 'ka' | 'en') || 'ka'

  const payload = await getPayload({ config: await config })

  // 1. მიმდინარე პროდუქტის წამოღება
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: lang,
    depth: 2,
  })

  const product = docs[0]
  if (!product) return notFound()

  // 2. მსგავსი პროდუქტების წამოღება (იგივე კატეგორიიდან, თავისი თავის გარდა)
  const categoryId =
    typeof product.category === 'object' ? (product.category as any).id : product.category
  const relatedRes = await payload.find({
    collection: 'products',
    limit: 4,
    where: {
      and: [{ category: { equals: categoryId } }, { slug: { not_equals: slug } }],
    },
    locale: lang,
    depth: 1,
  })

  const isPriceZero = !product.price || product.price === 0
  const hasDiscount =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
  const mainImageUrl = typeof product.mainImage === 'object' ? (product.mainImage as any)?.url : ''
  const category = typeof product.category === 'object' ? (product.category as any) : null
  const displayPrice = hasDiscount ? (product.discountPrice ?? 0) : (product.price ?? 0)

  return (
    <div className="bg-white min-h-screen text-slate-900 antialiased overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-start">
          {/* Left Side: Gallery */}
          <div className="w-full">
            <ProductGallery
              mainImage={mainImageUrl || ''}
              images={product.images || []}
              title={product.title}
            />
          </div>

          {/* Right Side: Product Info */}
          <div className="flex flex-col space-y-10 lg:pt-4">
            {/* Minimal Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <Link href={`/${lang}/products`} className="hover:text-black transition-colors">
                Shop
              </Link>
              {category && (
                <>
                  <ChevronRight size={10} />
                  <span className="text-black">{category.name}</span>
                </>
              )}
            </nav>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${product.stock === 'in-stock' ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
                {product.stock === 'in-stock'
                  ? lang === 'ka'
                    ? 'მარაგშია'
                    : 'In Stock'
                  : lang === 'ka'
                    ? 'არ არის'
                    : 'Out of Stock'}
              </div>
            </div>

            {/* Price Display */}
            <div className="py-4">
              {isPriceZero ? (
                <p className="text-2xl font-light text-slate-400 italic">
                  {lang === 'ka' ? 'ფასი შეთანხმებით' : 'Price on request'}
                </p>
              ) : (
                <div className="flex items-baseline gap-5">
                  <span className="text-6xl lg:text-7xl font-extralight tracking-tighter">
                    {displayPrice.toLocaleString()}₾
                  </span>
                  {hasDiscount && (
                    <span className="text-2xl text-slate-200 line-through font-extralight">
                      {product.price.toLocaleString()}₾
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Tech Specs Summary */}
            {product.specifications && (
              <div className="border-l-2 border-slate-100 pl-8 py-2">
                <p className="text-sm leading-relaxed text-slate-500 font-light max-w-md italic">
                  {product.specifications}
                </p>
              </div>
            )}

            {/* Contact Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <a
                href="tel:+995555123456"
                className="flex items-center justify-center gap-3 bg-black text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <Phone size={14} /> {lang === 'ka' ? 'დაგვირეკეთ' : 'Call Us'}
              </a>
              <a
                href="https://wa.me/995555123456"
                target="_blank"
                className="flex items-center justify-center gap-3 border border-slate-200 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                <MessageCircle size={16} className="text-green-500" /> WhatsApp
              </a>
            </div>

            {/* Detailed Description */}
            <div className="pt-12 space-y-6">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                {lang === 'ka' ? 'პროდუქტის აღწერა' : 'Description'}
              </h3>
              <div className="text-slate-600 text-[16px] leading-relaxed font-light whitespace-pre-line max-w-2xl">
                {product.description}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Section */}
        {relatedRes.docs.length > 0 && (
          <section className="border-t border-slate-50 pt-24">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-medium tracking-tight">
                  {lang === 'ka' ? 'მსგავსი მოდელები' : 'Similar Models'}
                </h2>
                <div className="h-1 w-12 bg-blue-500 rounded-full" />
              </div>
              <Link
                href={`/${lang}/products`}
                className="group flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
              >
                {lang === 'ka' ? 'ყველას ნახვა' : 'View All'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedRes.docs.map((item: any) => (
                <ProductCard key={item.id} product={item} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
