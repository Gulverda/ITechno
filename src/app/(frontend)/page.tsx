import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { Search } from '@/components/Search'
import { LoadMore } from '@/components/LoadMore'

// ... (ინტერფეისები უცვლელია)
interface Category {
  id: string | number
  name: string | { en: string; ka: string }
  displayName?: string
  parent?: string | number | Category | null
  updatedAt: string
  createdAt: string
}

interface LocalizedName {
  en: string
  ka: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    lang?: string
    q?: string
    limit?: string
    brand?: string
  }>
}) {
  const params = await searchParams
  const lang = params.lang || 'ka'
  const queryTerm = params.q || ''
  const currentLimit = Number(params.limit) || 16
  const activeCategoryId = params.category
  const activeBrandId = params.brand // წამოვიღოთ ბრენდის ID

  const payload = await getPayload({ config: await config })

  // 1. ბრენდის ინფორმაციის წამოღება (სათაურისთვის)
  let activeBrandName = ''
  if (activeBrandId) {
    try {
      const brandDoc = await payload.findByID({
        collection: 'brands',
        id: activeBrandId,
      })
      activeBrandName = brandDoc.name as string
    } catch (e) {
      console.error('Brand not found')
    }
  }

  // 2. კატეგორიების წამოღება და ლოკალიზაცია (იგივე ლოგიკა)
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
    locale: 'all' as any,
  })

  const allCategories = (categoriesRes.docs as unknown as Category[]).map((cat) => {
    const localizedName = cat.name as unknown as LocalizedName
    return {
      ...cat,
      displayName: localizedName[lang as keyof LocalizedName] || localizedName.en,
    }
  })

  const activeCategory = allCategories.find((c) => String(c.id) === String(activeCategoryId))

  // --- დამხმარე ფუნქციები (getParentId, renderCategoryTree, getAllChildIds იგივე რჩება) ---
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
          const isDirectlyActive = String(activeCategoryId) === String(cat.id)
          const isAncestor = allCategories.some((c) => {
            if (String(activeCategoryId) !== String(c.id)) return false
            let current: any = c
            while (current?.parent) {
              const pId = typeof current.parent === 'object' ? current.parent.id : current.parent
              if (String(pId) === String(cat.id)) return true
              current = allCategories.find((allC) => String(allC.id) === String(pId))
            }
            return false
          })

          const shouldShowChildren = isDirectlyActive || isAncestor

          return (
            <div key={cat.id} className="flex flex-col gap-1">
              <Link
                // ვინარჩუნებთ ბრენდის ფილტრს კატეგორიის შეცვლისას
                href={`/?category=${cat.id}&lang=${lang}${activeBrandId ? `&brand=${activeBrandId}` : ''}`}
                className={`px-4 py-2 rounded-lg transition ${
                  level === 0 ? 'text-sm border border-gray-100 shadow-sm' : 'text-xs'
                } ${
                  isDirectlyActive
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {level > 0 && '• '} {cat.displayName}
              </Link>
              {shouldShowChildren && renderCategoryTree(cat.id, level + 1)}
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

  // --- ფილტრაციის ლოგიკის განახლება ---
  const andFilters: any[] = []

  if (activeCategoryId) {
    const allRelatedIds = [activeCategoryId, ...getAllChildIds(activeCategoryId)]
    andFilters.push({ category: { in: allRelatedIds } })
  }

  if (activeBrandId) {
    andFilters.push({ brand: { equals: activeBrandId } })
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

  const products = await payload.find({
    collection: 'products',
    where: andFilters.length > 0 ? { and: andFilters } : {},
    locale: lang as any,
    depth: 1,
    limit: currentLimit,
    sort: 'title',
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <h1 className="text-xl font-bold text-gray-900">
              {activeBrandId
                ? activeBrandName
                : activeCategory
                  ? activeCategory.displayName
                  : lang === 'ka'
                    ? 'ყველა პროდუქტი'
                    : 'All Products'}
            </h1>
            {activeBrandId && (
              <Link
                href={`/?lang=${lang}${activeCategoryId ? `&category=${activeCategoryId}` : ''}`}
                className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition uppercase font-bold"
              >
                ✕ {lang === 'ka' ? 'ბრენდის მოხსნა' : 'Remove Brand'}
              </Link>
            )}
          </div>
          <Search lang={lang} />
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100 shrink-0">
            {lang === 'ka' ? 'სულ:' : 'Total:'} {products.totalDocs}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <h3 className="font-bold text-gray-900 mb-4 px-2">
              {lang === 'ka' ? 'კატეგორიები' : 'Categories'}
            </h3>
            <div className="flex flex-col gap-1">
              <Link
                href={`/?lang=${lang}${activeBrandId ? `&brand=${activeBrandId}` : ''}`}
                className={`px-4 py-2 rounded-lg text-sm transition mb-2 ${
                  !activeCategoryId
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {lang === 'ka' ? 'ყველა' : 'All'}
              </Link>
              {renderCategoryTree(null)}
            </div>
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
