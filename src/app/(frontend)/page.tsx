import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { Search } from '@/components/Search'
import { LoadMore } from '@/components/LoadMore'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    lang?: string
    q?: string
    limit?: string
    brand?: string
    connectionType?: string
    technology?: string
    resolution?: string
    capacity?: string
  }>
}) {
  const params = await searchParams
  const lang = params.lang || 'ka'
  const queryTerm = params.q || ''
  const currentLimit = Number(params.limit) || 16

  // აქტიური ფილტრები URL-დან
  const activeCategoryId = params.category
  const activeBrandId = params.brand
  const activeConnectionType = params.connectionType
  const activeTechnology = params.technology
  const activeResolution = params.resolution
  const activeCapacity = params.capacity

  const payload = await getPayload({ config: await config })

  // 1. დინამიური სპეციფიკაციების წამოღება API-დან (CCTV & Ajax)
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  let specs = { resolutions: [], capacities: [], technologies: [], connectionTypes: [] }

  try {
    const specsRes = await fetch(`${baseUrl}/api/products/unique-specs`, {
      next: { revalidate: 3600 },
    })
    if (specsRes.ok) {
      specs = await specsRes.json()
    }
  } catch (e) {
    console.error('Specs fetch failed')
  }

  // 2. კატეგორიების წამოღება და დამუშავება
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
    locale: 'all' as any,
  })

  const allCategories = (categoriesRes.docs as any).map((cat: any) => ({
    ...cat,
    displayName: cat.name[lang] || cat.name.en,
  }))

  const activeCategory = allCategories.find((c: any) => String(c.id) === String(activeCategoryId))

  // --- დამხმარე ფუნქციები კატეგორიებისთვის ---
  const getParentId = (cat: any) => {
    if (!cat.parent) return null
    return typeof cat.parent === 'object' ? cat.parent.id : cat.parent
  }

  const getAllChildIds = (parentId: string | number): (string | number)[] => {
    const children = allCategories.filter((c: any) => String(getParentId(c)) === String(parentId))
    return children.reduce(
      (acc: any, child: any) => [...acc, child.id, ...getAllChildIds(child.id)],
      [] as (string | number)[],
    )
  }

  // URL-ის გენერატორი ფილტრებისთვის
  const createFilterUrl = (key: string, value: string | null) => {
    const p = new URLSearchParams()
    const currentParams: any = {
      category: activeCategoryId,
      brand: activeBrandId,
      lang,
      q: queryTerm,
      connectionType: activeConnectionType,
      technology: activeTechnology,
      resolution: activeResolution,
      capacity: activeCapacity,
    }
    Object.keys(currentParams).forEach((k) => {
      if (currentParams[k]) p.set(k, currentParams[k])
    })
    if (value) p.set(key, value)
    else p.delete(key)
    return `/?${p.toString()}`
  }

  // კატეგორიების ხის რენდერი
  const renderCategoryTree = (parentId: string | number | null, level = 0) => {
    const children = allCategories.filter((c: any) => String(getParentId(c)) === String(parentId))
    if (children.length === 0) return null

    return (
      <div
        className={`${level > 0 ? 'ml-4 border-l-2 border-blue-100 pl-3 py-1 my-1' : 'flex flex-col gap-1'}`}
      >
        {children.map((cat: any) => {
          const isDirectlyActive = String(activeCategoryId) === String(cat.id)
          return (
            <div key={cat.id} className="flex flex-col gap-1">
              <Link
                href={createFilterUrl('category', String(cat.id))}
                className={`px-4 py-2 rounded-lg transition ${
                  level === 0 ? 'text-sm border border-gray-100 shadow-sm' : 'text-xs'
                } ${isDirectlyActive ? 'bg-blue-600 text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {level > 0 && '• '} {cat.displayName}
              </Link>
              {isDirectlyActive && renderCategoryTree(cat.id, level + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  // --- ფილტრაციის Query Payload-ისთვის ---
  const andFilters: any[] = []
  if (activeCategoryId)
    andFilters.push({ category: { in: [activeCategoryId, ...getAllChildIds(activeCategoryId)] } })
  if (activeConnectionType)
    andFilters.push({ 'specifications_group.connectionType': { equals: activeConnectionType } })
  if (activeTechnology)
    andFilters.push({ 'specifications_group.technology': { equals: activeTechnology } })
  if (activeResolution)
    andFilters.push({ 'specifications_group.resolution': { equals: activeResolution } })
  if (activeCapacity)
    andFilters.push({ 'specifications_group.capacity': { equals: activeCapacity } })
  if (queryTerm)
    andFilters.push({
      or: [{ title: { contains: queryTerm } }, { description: { contains: queryTerm } }],
    })

  const products = await payload.find({
    collection: 'products',
    where: andFilters.length > 0 ? { and: andFilters } : {},
    locale: lang as any,
    depth: 1,
    limit: currentLimit,
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 mt-8">
        {/* Header სექცია */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            {activeCategory?.displayName || (lang === 'ka' ? 'ყველა პროდუქტი' : 'All Products')}
          </h1>
          <Search lang={lang} />
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold italic">
            Total: {products.totalDocs}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* საიდბარი (ფილტრები) */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 px-2">
                {lang === 'ka' ? 'კატეგორიები' : 'Categories'}
              </h3>
              <Link
                href={createFilterUrl('category', null)}
                className={`block px-4 py-2 rounded-lg text-sm mb-2 ${!activeCategoryId ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-gray-100'}`}
              >
                {lang === 'ka' ? 'ყველა' : 'All'}
              </Link>
              {renderCategoryTree(null)}
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-8">
              {/* CCTV კავშირი */}
              <FilterSection
                title="CCTV სტანდარტი"
                activeValue={activeConnectionType}
                items={['ip', 'analog']}
                onSelect={(v: string | null) => createFilterUrl('connectionType', v)}
                isUppercase
              />

              {/* Ajax & Other Connection Types (Jeweller / Fibra) */}
              <FilterSection
                title="Ajax კავშირი"
                activeValue={activeConnectionType}
                items={specs.connectionTypes.filter((i) => i !== 'ip' && i !== 'analog')}
                onSelect={(v: string | null) => createFilterUrl('connectionType', v)}
              />

              {/* რეზოლუცია & PhOD */}
              <FilterSection
                title="რეზოლუცია / მოდელი"
                activeValue={activeResolution}
                items={specs.resolutions}
                onSelect={(v: string | null) => createFilterUrl('resolution', v)}
                isGrid
              />

              {/* ტექნოლოგია / ფერი (თეთრი/შავი) */}
              <FilterSection
                title="ტექნოლოგია / ფერი"
                activeValue={activeTechnology}
                items={specs.technologies}
                onSelect={(v: string | null) => createFilterUrl('technology', v)}
              />

              {/* მოცულობა / დაცვა */}
              <FilterSection
                title="მოცულობა / მეხსიერება"
                activeValue={activeCapacity}
                items={specs.capacities}
                onSelect={(v: string | null) => createFilterUrl('capacity', v)}
                isGrid
              />
            </div>
          </aside>

          {/* პროდუქტების სია */}
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.docs.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))}
            </div>

            {products.docs.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  {lang === 'ka' ? 'პროდუქტები ვერ მოიძებნა' : 'No products found'}
                </p>
              </div>
            )}

            <LoadMore hasNextPage={products.hasNextPage} currentLimit={currentLimit} lang={lang} />
          </section>
        </div>
      </main>
    </div>
  )
}

// ფილტრის კომპონენტი
function FilterSection({ title, items = [], activeValue, onSelect, isGrid, isUppercase }: any) {
  if (!items || items.length === 0) return null

  return (
    <div>
      <h4 className="font-bold text-[10px] uppercase text-gray-400 mb-3 tracking-widest">
        {title}
      </h4>
      <div className={isGrid ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
        {items.map((item: string) => (
          <Link
            key={item}
            href={onSelect(activeValue === item ? null : item)}
            className={`text-[10px] text-center px-2 py-1.5 border rounded-lg transition-all ${
              activeValue === item
                ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md'
                : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-blue-300 hover:bg-white'
            }`}
          >
            {isUppercase ? item.toUpperCase() : item}
          </Link>
        ))}
      </div>
    </div>
  )
}
