import { getPayload } from 'payload'
import config from '@/payload.config'
import { Products } from '@/components/Products'
import dict from '@/lib/translations.json'
import { Category } from '@/payload-types'

interface PageProps {
  params: Promise<{
    lang: string
    category?: string[]
  }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  // 1. პარამეტრების მიღება და ენის ვალიდაცია
  const { lang, category: categoryArray } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: await config })

  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'
  const t = (dict as any)[currentLang] || dict.ka

  // კატეგორიის slug-ის ამოღება მასივიდან
  const categorySlug = categoryArray && categoryArray.length > 0 ? categoryArray[0] : null

  // 2. კატეგორიების წამოღება
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 500,
    locale: currentLang as any,
  })
  const allCategories = categoriesRes.docs as Category[]

  // 3. აქტიური კატეგორიის და შვილების იდენტიფიცირება
  let activeCategoryId: string | number | null = null
  if (categorySlug) {
    const foundCat = allCategories.find((c) => c.slug === categorySlug)
    if (foundCat) activeCategoryId = foundCat.id
  }

  const andFilters: any[] = []

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

  // ძებნის ფილტრი
  if (resolvedSearchParams.q) {
    andFilters.push({
      or: [
        { title: { contains: resolvedSearchParams.q } },
        { slug: { contains: resolvedSearchParams.q } },
      ],
    })
  }

  // 4. NaN Error Prevention (Limit-ის ვალიდაცია)
  const rawLimit = Number(resolvedSearchParams.limit)
  const limitValue = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 16

  // 5. პროდუქტების წამოღება
  const productsRes = await payload.find({
    collection: 'products',
    where: andFilters.length > 0 ? { and: andFilters } : {},
    locale: currentLang as any,
    limit: limitValue,
    sort: '-createdAt',
  })

  // 6. Specs Fetch (დაცვით)
  let specs = { resolutions: [], connectionTypes: [] }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const specsRes = await fetch(`${baseUrl}/api/products/unique-specs`, {
      next: { revalidate: 3600 },
    })
    if (specsRes.ok) {
      specs = await specsRes.json()
    }
  } catch (e) {
    console.error('Specs fetch failed, using defaults')
  }

  return (
    <Products
      products={productsRes}
      allCategories={allCategories.map((c) => ({
        ...c,
        displayName: (c.name as any) || 'No Name',
      }))}
      lang={currentLang}
      t={t}
      specs={specs} // ყოველთვის გადაეცემა, მაშინაც თუ Fetch ჩავარდა
      activeCategorySlug={categorySlug}
      currentLimit={limitValue}
    />
  )
}
