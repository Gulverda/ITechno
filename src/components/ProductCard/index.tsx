import Image from 'next/image'
import Link from 'next/link'
import dict from '@/lib/translations.json'

type Product = {
  id: string | number
  slug: string
  title: string
  price: number
  discountPrice?: number
  stock: 'in-stock' | 'out-of-stock'
  mainImage?:
    | {
        url: string
      }
    | string
}

const translations = dict as Record<string, any>

export const ProductCard = ({ product, lang }: { product: Product; lang: string }) => {
  const imageUrl = typeof product.mainImage === 'object' ? product.mainImage?.url : ''

  const hasDiscount =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price

  const isPriceZero = !product.price || product.price === 0

  const t = translations[lang] || translations['ka']

  return (
    <Link href={`/${lang}/product-details/${product.slug}`} className="group block h-full">
      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl p-4 h-full flex flex-col relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#2979BC] text-white text-[10px] px-3 py-1 rounded-md font-bold">
            {product.stock === 'in-stock' ? t.productCard.inStock : t.productCard.outOfStock}
          </span>
        </div>

        {hasDiscount && !isPriceZero && product.discountPrice && (
          <div className="absolute top-12 left-4 z-10 bg-[#EE3E33] text-white px-2 py-0.5 rounded-md text-[11px] font-bold">
            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </div>
        )}

        <div className="relative h-48 w-full mb-4 mt-6 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-300 text-[10px] italic">სურათი არ არის</div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-[10px] text-gray-400 font-mono mb-1 uppercase">
            CODE: {product.id?.toString().slice(-5)}
          </p>

          <h2 className="font-semibold text-gray-700 text-[13px] mb-4 line-clamp-2 leading-snug min-h-[34px]">
            {product.title}
          </h2>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              {isPriceZero ? (
                <span className="text-[13px] font-bold text-[#2979BC]">
                  {t.productCard.contactUs}
                </span>
              ) : hasDiscount && product.discountPrice ? (
                <>
                  <span className="text-[20px] font-bold text-[#2979BC]">
                    {product.discountPrice.toFixed(2)}₾
                  </span>
                  <span className="text-[13px] text-gray-400 line-through">
                    {product.price.toFixed(2)}₾
                  </span>
                </>
              ) : (
                <span className="text-[20px] font-bold text-[#2979BC]">
                  {product.price.toFixed(2)}₾
                </span>
              )}
            </div>

            {/* ღილაკი */}
            <div className="w-full bg-[#2979BC] text-white py-2.5 rounded-xl font-bold text-[13px] transition-colors group-hover:bg-[#1E5D91] text-center">
              <span>{t.productCard.buttonTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
