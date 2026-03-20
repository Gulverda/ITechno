import { getPayload } from 'payload'
import config from '@/payload.config'
import { CategoryBar } from '@/components/CategoryBar'
import { Hero } from '@/components/Hero'
import Link from 'next/link'
import { PopularProducts } from '@/components/PopularProducts'
import { BrandsSlider } from '@/components/BrandSlider'
import { PromoBanner } from '@/components/PromoBanner'
import AboutGrid from '@/components/AboutGrid'

export default async function Page({ params, searchParams }: any) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const lang = (resolvedParams.lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'

  const payload = await getPayload({ config: await config })
  const popularProducts = await payload.find({
    collection: 'products',
    where: {
      isPopular: { equals: true },
    },
    limit: 10,
    locale: lang,
  })

  const brandsRes = await payload.find({
    collection: 'brands',
    limit: 20,
  })

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  let specs = { resolutions: [], capacities: [], technologies: [], connectionTypes: [] }
  try {
    const specsRes = await fetch(`${baseUrl}/api/products/unique-specs`, {
      next: { revalidate: 3600 },
    })
    if (specsRes.ok) specs = await specsRes.json()
  } catch (e) {}

  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
    locale: 'all' as any,
  })
  const allCategories = (categoriesRes.docs as any).map((cat: any) => ({
    ...cat,
    displayName: cat.name[lang] || cat.name.en || cat.name.ka,
  }))

  const createFilterUrl = (key: string, value: string | null) => {
    const p = new URLSearchParams()
    const keys = ['category', 'q', 'connectionType', 'technology', 'resolution', 'capacity']
    keys.forEach((k) => {
      const val = k === key ? value : resolvedSearchParams[k]
      if (val) p.set(k, val)
    })
    return `/${lang}${p.toString() ? `?${p.toString()}` : ''}`
  }

  const renderCategoryTree = (parentId: any, level = 0): any => {
    const children = allCategories.filter((c: any) => (c.parent?.id || c.parent) === parentId)
    if (children.length === 0) return null
    return (
      <div className={level > 0 ? 'ml-4 border-l pl-3' : 'flex flex-col gap-1'}>
        {children.map((cat: any) => (
          <div key={cat.id}>
            <Link
              href={createFilterUrl('category', String(cat.id))}
              className={`block p-2 text-sm ${resolvedSearchParams.category === String(cat.id) ? 'text-blue-600 font-bold' : ''}`}
            >
              {cat.displayName}
            </Link>
            {renderCategoryTree(cat.id, level + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <CategoryBar lang={lang} />
      <Hero lang={lang} />
      <BrandsSlider brands={brandsRes.docs} />
      <PopularProducts
        products={popularProducts.docs}
        lang={lang}
        title={params.lang === 'ka' ? 'პოპულარული პროდუქტები' : 'Popular Products'}
      />
      <PromoBanner />
      <AboutGrid lang={lang} />
    </div>
  )
}
