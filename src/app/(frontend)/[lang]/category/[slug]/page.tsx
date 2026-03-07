import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { Search } from '@/components/Search'
import { LoadMore } from '@/components/LoadMore'
import { notFound } from 'next/navigation'

interface Category {
  id: string | number
  name: string | { en: string; ka: string }
  slug: string
  displayName?: string
  parent?: string | number | Category | null
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>
  searchParams: Promise<{ q?: string; limit?: string }>
}) {
  const { lang, slug: activeCategorySlug } = await params
  const { q: queryTerm = '', limit } = await searchParams
  const currentLimit = Number(limit) || 16
  const payload = await getPayload({ config: await config })

  // locale: 'all' ამოღებულია — slug non-localized ველია
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 200,
  })

  const allCategories = (categoriesRes.docs as unknown as Category[]).map((cat) => ({
    ...cat,
    displayName:
      typeof cat.name === 'object'
        ? (cat.name as { en: string; ka: string })[lang as 'ka' | 'en'] ||
          (cat.name as { en: string; ka: string }).en
        : (cat.name as string),
  }))

  const activeCategory = allCategories.find((c) => c.slug === activeCategorySlug)
  if (!activeCategory) return notFound()

  const getParentId = (cat: Category) => {
    if (!cat.parent) return null
    return typeof cat.parent === 'object' ? cat.parent.id : cat.parent
  }

  const renderCategoryTree = (parentId: string | number | null, level = 0) => {
    const children = allCategories.filter((c) => String(getParentId(c)) === String(parentId))
    if (children.length === 0) return null

    return (
      <div
        className={`${level > 0 ? 'ml-4 border-l-2 border-blue-100 pl-3 py-1 my-1' : 'flex flex-col gap-1'}`}
      >
        {children.map((cat) => {
          const isDirectlyActive = activeCategorySlug === cat.slug

          const isAncestor = allCategories.some((c) => {
            if (activeCategorySlug !== c.slug) return false
            let current: any = c
            while (current?.parent) {
              const pId = typeof current.parent === 'object' ? current.parent.id : current.parent
              if (String(pId) === String(cat.id)) return true
              current = allCategories.find((allC) => String(allC.id) === String(pId))
            }
            return false
          })

          return (
            <div key={cat.id} className="flex flex-col gap-1">
              <Link
                href={`/${lang}/category/${cat.slug}${queryTerm ? `?q=${queryTerm}` : ''}`}
                className={`block px-4 py-2 rounded-lg transition ${
                  level === 0 ? 'text-sm border border-gray-100 shadow-sm' : 'text-xs'
                } ${
                  isDirectlyActive
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {level > 0 && '• '} {cat.displayName}
              </Link>
              {(isDirectlyActive || isAncestor) && renderCategoryTree(cat.id, level + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  const getAllChildIds = (parentId: string | number): (string | number)[] => {
    const children = allCategories.filter((c) => String(getParentId(c)) === String(parentId))
    return children.reduce(
      (acc, child) => [...acc, child.id, ...getAllChildIds(child.id)],
      [] as (string | number)[],
    )
  }

  const allRelatedIds = [activeCategory.id, ...getAllChildIds(activeCategory.id)]

  const products = await payload.find({
    collection: 'products',
    where: {
      and: [
        { category: { in: allRelatedIds } },
        ...(queryTerm
          ? [
              {
                or: [
                  { title: { contains: queryTerm } },
                  { description: { contains: queryTerm } },
                  { slug: { contains: queryTerm } },
                ],
              },
            ]
          : []),
      ],
    },
    locale: lang as any,
    limit: currentLimit,
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20 mt-8">
      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gray-100 gap-4 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 shrink-0">{activeCategory.displayName}</h1>
          <Search lang={lang} />
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100 shrink-0">
            {lang === 'ka' ? 'სულ:' : 'Total:'} {products.totalDocs}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <Link
              href="/"
              className="block px-4 py-2 bg-gray-900 text-white rounded-lg text-sm mb-4 text-center hover:bg-gray-800 transition"
            >
              {lang === 'ka' ? '← მთავარი' : '← Home'}
            </Link>
            {renderCategoryTree(null)}
          </aside>

          <section className="flex-1">
            {products.docs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.docs.map((product) => (
                    <ProductCard key={product.id} product={product} lang={lang} />
                  ))}
                </div>
                <LoadMore
                  hasNextPage={products.hasNextPage}
                  currentLimit={currentLimit}
                  lang={lang}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">
                  {lang === 'ka' ? 'პროდუქტები ვერ მოიძებნა.' : 'No products found.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
