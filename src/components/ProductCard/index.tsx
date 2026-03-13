import Image from 'next/image'
import Link from 'next/link'

export const ProductCard = ({ product, lang }: { product: any; lang: string }) => {
  const imageUrl = typeof product.mainImage === 'object' ? product.mainImage?.url : ''
  const hasDiscount =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
  const isPriceZero = !product.price || product.price === 0

  return (
    <Link href={`/products/${product.slug}?lang=${lang}`} className="group">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 p-3 h-full flex flex-col relative">
        {/* Sale Badge - მხოლოდ მაშინ თუ ფასი 0 არ არის */}
        {hasDiscount && !isPriceZero && (
          <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-black shadow-lg animate-pulse">
            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </div>
        )}

        <div
          className={`absolute top-4 left-4 z-10 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            product.stock === 'in-stock' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {product.stock === 'in-stock' ? '● მარაგშია' : '● არ არის მარაგში'}
        </div>

        <div className="relative h-48 w-full mb-4 bg-gray-50 rounded-xl overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 italic text-xs">
              სურათი არ არის
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-1">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              {typeof product.category === 'object' ? product.category?.name : 'სხვადასხვა'}
            </p>
          </div>

          <h2 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[40px] leading-tight group-hover:text-blue-600 transition-colors">
            {product.title}
          </h2>

          <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-3">
            <div className="flex flex-col flex-1">
              {isPriceZero ? (
                // 0 ფასის შემთხვევაში
                <span className="text-[11px] font-bold text-blue-600 leading-tight">
                  {lang === 'ka'
                    ? 'ფასის დასაზუსტებლად გთხოვთ დაგვიკავშირდეთ'
                    : 'Contact us for a price'}
                </span>
              ) : hasDiscount ? (
                // ფასდაკლების შემთხვევაში
                <>
                  <span className="text-[10px] text-red-500 line-through font-medium">
                    {product.price} ₾
                  </span>
                  <span className="text-xl font-black text-gray-900 leading-none">
                    {product.discountPrice} <span className="text-sm font-normal">₾</span>
                  </span>
                </>
              ) : (
                // სტანდარტული ფასი
                <>
                  <span className="text-[10px] text-gray-400 font-medium -mb-1">ფასი</span>
                  <span className="text-xl font-black text-gray-900 leading-none">
                    {product.price} <span className="text-sm font-normal">₾</span>
                  </span>
                </>
              )}
            </div>

            <div className="bg-gray-900 text-white p-2.5 rounded-xl shadow-lg group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shrink-0 ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
