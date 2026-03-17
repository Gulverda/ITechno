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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, category } = await params
  const categorySlug = category?.[0]
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const canonicalPath = categorySlug ? `/${lang}/products/${categorySlug}` : `/${lang}/products`

  if (!categorySlug) {
    return {
      title: lang === 'ka' ? 'მაღაზია | I-Techno' : 'Shop | I-Techno',
      description: lang === 'ka' ? 'აღმოაჩინეთ უახლესი ტექნოლოგიები' : 'Discover technologies',
      alternates: { canonical: `${baseUrl}${canonicalPath}` },
    }
  }

  const displayTitle = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return {
    title: `${displayTitle} | I-Techno`,
    alternates: { canonical: `${baseUrl}${canonicalPath}` },
  }
}

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

  // --- ცვლილება 1: კატეგორიებს ვიღებთ ლოკალის გარეშე (fallback ka), რომ სახელები specs-ს დაემთხვეს ---
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 500,
    locale: currentLang, // აქ ყოველთვის 'ka' გვინდა შედარებისთვის
    depth: 2,
  })

  // ცალკე წამოვიღოთ კატეგორიები მიმდინარე ენაზე საჩვენებლად
  const categoriesDisplay = await payload.find({
    collection: 'categories',
    limit: 500,
    locale: currentLang,
    depth: 1,
  })

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

  const andFilters: Where[] = []

  // კატეგორიის ფილტრი
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

  // დინამიური ფილტრების ლოგიკა
  Object.entries(filterParams).forEach(([groupName, value]) => {
    if (value) {
      andFilters.push({
        'filter_values.value_rel.value': {
          equals: value,
        },
      })
    }
  })

  const productsRes = await payload.find({
    collection: 'products',
    where: andFilters.length > 0 ? { and: andFilters } : {},
    locale: currentLang,
    limit: 16,
    page: validatedPage,
    depth: 2,
    sort: '-createdAt',
  })

  // --- ცვლილება 2: Fetch Specs ქეშის გარეშე, რომ ენის ცვლილებაზე არ გაიჭედოს ---
  let specs: UniqueSpecs = {}
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const specsRes = await fetch(
      `${baseUrl}/api/products/unique-specs?lang=${currentLang}&v=${Math.random()}`,
      {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      },
    )
    if (specsRes.ok) {
      specs = (await specsRes.json()) as UniqueSpecs
    }
  } catch (e) {
    console.error('Specs fetch failed:', e)
  }

  return (
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
      // აქ გადაეცემა ქართული სახელები, რომელიც specs-შია
      categoryFilters={activeCategoryFilters.map((f) => f.name)}
    />
  )
}
