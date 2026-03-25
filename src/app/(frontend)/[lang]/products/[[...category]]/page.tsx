import { getPayload } from 'payload'
import config from '@/payload.config'
import { Products } from '@/components/Products'
import dict from '@/lib/translations.json'
import { Where } from 'payload'
import { Metadata } from 'next'

type Dictionary = typeof dict.ka
type SupportedLang = 'ka' | 'en'
type UniqueSpecs = Record<string, string[]>

interface PageProps {
  params: Promise<{
    lang: string
    category?: string[]
  }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// --- SEO & DYNAMIC METADATA ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, category } = await params
  const categorySlug = category?.[0]
  const currentLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  // Default values
  let title = currentLang === 'ka' ? 'მაღაზია' : 'Shop'
  let description =
    currentLang === 'ka'
      ? 'აღმოაჩინეთ უახლესი ტექნოლოგიები, უსაფრთხოების კამერები და ჭკვიანი სახლის სისტემები I-TECHNO-ზე.'
      : 'Discover the latest technologies, security cameras, and smart home systems at I-TECHNO.'

  if (categorySlug) {
    try {
      const payload = await getPayload({ config: await config })
      const categoryRes = await payload.find({
        collection: 'categories',
        where: { slug: { equals: categorySlug } },
        locale: currentLang,
        limit: 1,
      })

      if (categoryRes.docs.length > 0) {
        const cat = categoryRes.docs[0]
        const catName = (cat as any).name || categorySlug
        title = `${catName}`
        description =
          currentLang === 'ka'
            ? `იყიდეთ ${catName} საუკეთესო ფასად. გარანტია და ადგილზე მიტანის სერვისი მთელ საქართველოში.`
            : `Buy ${catName} at the best price. Warranty and delivery service throughout Georgia.`
      }
    } catch (e) {
      console.error('Metadata fetch error', e)
    }
  }

  const canonicalPath = categorySlug ? `/${lang}/products/${categorySlug}` : `/${lang}/products`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        'ka-GE': `/ka/products${categorySlug ? `/${categorySlug}` : ''}`,
        'en-US': `/en/products${categorySlug ? `/${categorySlug}` : ''}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonicalPath}`,
      siteName: 'I-TECHNO',
      locale: currentLang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
      images: [{ url: '/og-shop.jpg', width: 1200, height: 630 }],
    },
  }
}

// --- MAIN PAGE COMPONENT ---
export default async function Page({ params, searchParams }: PageProps) {
  const { lang, category: categoryArray } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: await config })

  const currentLang: SupportedLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const t: Dictionary = (dict as Record<SupportedLang, Dictionary>)[currentLang] || dict.ka

  const categorySlug = categoryArray && categoryArray.length > 0 ? categoryArray[0] : null
  const currentPage = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1
  const validatedPage = !isNaN(currentPage) && currentPage > 0 ? currentPage : 1

  const { q, page, ...filterParams } = resolvedSearchParams

  // 1. Fetch Categories for Logic & Display
  const [categoriesRes, categoriesDisplay] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 500,
      locale: currentLang,
      depth: 2,
    }),
    payload.find({
      collection: 'categories',
      limit: 500,
      locale: currentLang,
      depth: 1,
    }),
  ])

  const allCategories = categoriesRes.docs as any[]
  let activeCategoryId: string | number | null = null
  let activeCategoryFilters: any[] = []

  if (categorySlug) {
    const foundCat = allCategories.find((c) => c.slug === categorySlug)
    if (foundCat) {
      activeCategoryId = foundCat.id
      activeCategoryFilters = foundCat.assignedFilters || []
    }
  }

  // 2. Build Filters
  const andFilters: Where[] = []

  if (activeCategoryId) {
    const getAllChildIds = (parentId: string | number): (string | number)[] => {
      const children = allCategories.filter((c) => {
        const pId = typeof c.parent === 'object' ? (c.parent as any)?.id : c.parent
        return String(pId) === String(parentId)
      })
      return children.reduce<(string | number)[]>(
        (acc, child) => [...acc, child.id, ...getAllChildIds(child.id)],
        [],
      )
    }
    const allRelatedIds = [activeCategoryId, ...getAllChildIds(activeCategoryId)]
    andFilters.push({ category: { in: allRelatedIds } })
  }

  if (q) {
    andFilters.push({
      or: [{ title: { contains: q } }, { slug: { contains: q } }],
    })
  }

  Object.entries(filterParams).forEach(([groupName, value]) => {
    if (value) {
      andFilters.push({
        'filter_values.value_rel.value': { equals: value },
      })
    }
  })

  // 3. Fetch Products
  const productsRes = await payload.find({
    collection: 'products',
    where: andFilters.length > 0 ? { and: andFilters } : {},
    locale: currentLang,
    limit: 16,
    page: validatedPage,
    depth: 2,
    sort: '-createdAt',
  })

  // 4. Fetch Specs
  let specs: UniqueSpecs = {}
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const specsRes = await fetch(
      `${baseUrl}/api/products/unique-specs?lang=${currentLang}&v=${Math.random()}`,
      { cache: 'no-store' },
    )
    if (specsRes.ok) specs = (await specsRes.json()) as UniqueSpecs
  } catch (e) {
    console.error('Specs fetch failed:', e)
  }

  return (
    <main className="min-h-screen">
      <h1 className="sr-only">
        {categorySlug
          ? `${categorySlug} - I-TECHNO`
          : currentLang === 'ka'
            ? 'პროდუქტების კატალოგი'
            : 'Products Catalog'}
      </h1>

      <Products
        products={productsRes as any}
        allCategories={categoriesDisplay.docs.map((c: any) => ({
          ...c,
          displayName: c.name || 'No Name',
        }))}
        lang={currentLang}
        t={t}
        specs={specs}
        activeCategorySlug={categorySlug}
        categoryFilters={activeCategoryFilters.map((f) => f.name)}
      />

      {/* Structured Data (JSON-LD) for better Google indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: productsRes.docs.map((p: any, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${currentLang}/products/${p.slug}`,
              name: p.title,
            })),
          }),
        }}
      />
    </main>
  )
}
