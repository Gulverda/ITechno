import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { Search } from '@/components/Search'

interface LocalizedName {
  en: string
  ka: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; lang?: string; q?: string }>
}) {
  const params = await searchParams
  const lang = params.lang || 'ka'
  const queryTerm = params.q || ''
  const payload = await getPayload({ config: await config })

  const order = [
    'EZVIZ - Smart Home',
    'AJAX',
    'Video Surveillance',
    'Storage Devices',
    'Fire Alarm Systems',
    'Security Alarm',
    'Access Control Systems',
    'TV/Displays',
    'Network Equipment',
  ]

  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
    locale: 'all' as any,
  })

  const sortedCategories = categoriesRes.docs
    .sort((a, b) => {
      const nameA = (a.name as unknown as LocalizedName)?.en || ''
      const nameB = (b.name as unknown as LocalizedName)?.en || ''

      const indexA = order.indexOf(nameA)
      const indexB = order.indexOf(nameB)

      const finalIndexA = indexA !== -1 ? indexA : 99
      const finalIndexB = indexB !== -1 ? indexB : 99

      return finalIndexA - finalIndexB
    })
    .map((cat) => {
      const localizedName = cat.name as unknown as LocalizedName
      return {
        ...cat,
        displayName: localizedName[lang as keyof LocalizedName] || localizedName.en,
      }
    })

  const query: any = {}
  if (params.category) {
    query.category = { equals: params.category }
  }

  const andFilters: any[] = []

  if (params.category) {
    andFilters.push({ category: { equals: params.category } })
  }

  if (queryTerm) {
    andFilters.push({
      or: [
        { title: { contains: queryTerm } },
        { description: { contains: queryTerm } },
        { slug: { contains: queryTerm } },
      ],
    })
  }

  if (andFilters.length > 0) {
    query.and = andFilters
  }

  const products = await payload.find({
    collection: 'products',
    where: query,
    locale: lang as any,
    depth: 1,
    limit: 100,
    sort: 'title',
  })

  const activeCategory = params.category
    ? sortedCategories.find((c) => String(c.id) === String(params.category))
    : null

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">
            {activeCategory
              ? activeCategory.displayName
              : lang === 'ka'
                ? 'ყველა პროდუქტი'
                : 'All Products'}
          </h1>
          <Search lang={lang} />
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
            {lang === 'ka' ? 'სულ:' : 'Total:'} {products.totalDocs}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <h3 className="font-bold text-gray-900 mb-4 px-2">
              {lang === 'ka' ? 'კატეგორიები' : 'Categories'}
            </h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              <Link
                href={`/?lang=${lang}`}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  !params.category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {lang === 'ka' ? 'ყველა პროდუქტი' : 'All Products'}
              </Link>

              {sortedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.id}&lang=${lang}`}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    String(params.category) === String(cat.id)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.displayName}
                </Link>
              ))}
            </div>
          </aside>

          <section className="flex-1">
            {products.docs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.docs.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">
                  {lang === 'ka' ? 'ამ კატეგორიაში პროდუქტები არ არის.' : 'No products found.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
