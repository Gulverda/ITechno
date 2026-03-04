import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { LangSwitcher } from '@/components/LangSwitcher'

export default async function Page({
  searchParams,
}: {
  searchParams: { category?: string; lang?: string }
}) {
  const lang = searchParams.lang || 'ka'
  const payload = await getPayload({ config: await config })

  // 1. წამოვიღოთ ყველა კატეგორია ფილტრისთვის
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  // 2. მოვამზადოთ ფილტრი პროდუქტებისთვის
  const query: any = {}
  if (searchParams.category) {
    query.category = { equals: searchParams.category }
  }

  // 3. წამოვიღოთ პროდუქტები ფილტრის გათვალისწინებით
  const products = await payload.find({
    collection: 'products',
    where: query,
    locale: lang as any,
    depth: 1,
    limit: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - კატეგორიები */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <h3 className="font-bold text-gray-900 mb-4 px-2">კატეგორიები</h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm transition ${!searchParams.category ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                ყველა პროდუქტი
              </Link>
              {categories.docs.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.id}`}
                  className={`px-4 py-2 rounded-lg text-sm transition ${String(searchParams.category) === String(cat.id) ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </aside>

          {/* პროდუქტების სექცია */}
          <section className="flex-1">
            {products.docs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.docs.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
                <p className="text-gray-400">ამ კატეგორიაში პროდუქტები არ არის.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
