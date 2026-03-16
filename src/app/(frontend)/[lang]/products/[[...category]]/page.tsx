import { getPayload } from 'payload'
import config from '@/payload.config'
import { Products } from '@/components/Products'
import dict from '@/lib/translations.json'
import { Category } from '@/payload-types'
import { Where } from 'payload'
import { Metadata } from 'next'

// თარგმანის ტიპები
type Dictionary = typeof dict.ka
type SupportedLang = 'ka' | 'en'

interface PageProps {
  params: Promise<{
    lang: string
    category?: string[]
  }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

interface UniqueSpecs {
  resolutions: string[]
  connectionTypes: string[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, category } = await params
  const categorySlug = category?.[0]
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const canonicalPath = categorySlug ? `/${lang}/products/${categorySlug}` : `/${lang}/products`

  if (!categorySlug) {
    return {
      title: lang === 'ka' ? 'მაღაზია | I-Techno' : 'Shop | I-Techno',
      description:
        lang === 'ka'
          ? 'აღმოაჩინეთ უახლესი ტექნოლოგიები I-Techno-ზე'
          : 'Discover latest technologies at I-Techno',
      alternates: { canonical: `${baseUrl}${canonicalPath}` },
      openGraph: {
        title: 'I-Techno Shop',
        images: [`${baseUrl}/og-image.jpg`],
      },
    }
  }

  const displayTitle = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${displayTitle} | I-Techno`,
    description: `${displayTitle} - საუკეთესო ფასად I-Techno-ზე`,
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
    openGraph: {
      title: `${displayTitle} | I-Techno`,
      description: `${displayTitle} - საუკეთესო ფასად I-Techno-ზე`,
      url: `${baseUrl}${canonicalPath}`,
      type: 'website',
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { lang, category: categoryArray } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: await config })

  const currentLang: SupportedLang = lang === 'en' ? 'en' : 'ka'
  const t: Dictionary = (dict as Record<SupportedLang, Dictionary>)[currentLang] || dict.ka

  const categorySlug = categoryArray && categoryArray.length > 0 ? categoryArray[0] : null

  const currentPage = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1
  const validatedPage = !isNaN(currentPage) && currentPage > 0 ? currentPage : 1

  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 500,
    locale: currentLang,
  })

  const allCategories = categoriesRes.docs as Category[]

  let activeCategoryId: string | number | null = null
  if (categorySlug) {
    const foundCat = allCategories.find((c) => c.slug === categorySlug)
    if (foundCat) activeCategoryId = foundCat.id
  }

  // ტიპიზირებული ფილტრების მასივი (გასწორებული Where ტიპით)
  const andFilters: Where[] = []

  if (activeCategoryId) {
    const getAllChildIds = (parentId: string | number): (string | number)[] => {
      const children = allCategories.filter((c) => {
        const pId = typeof c.parent === 'object' ? (c.parent as Category | null)?.id : c.parent
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

  if (resolvedSearchParams.q) {
    andFilters.push({
      or: [
        { title: { contains: resolvedSearchParams.q } },
        { slug: { contains: resolvedSearchParams.q } },
      ],
    })
  }

  const productsRes = await payload.find({
    collection: 'products',
    where: andFilters.length > 0 ? { and: andFilters } : ({} as Where),
    locale: currentLang,
    limit: 16,
    page: validatedPage,
    sort: '-createdAt',
  })

  // Specs-ის საწყისი მნიშვნელობა ტიპით
  let specs: UniqueSpecs = { resolutions: [], connectionTypes: [] }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const specsRes = await fetch(`${baseUrl}/api/products/unique-specs`, {
      next: { revalidate: 3600 },
    })
    if (specsRes.ok) {
      specs = (await specsRes.json()) as UniqueSpecs
    }
  } catch (e) {
    console.error('Specs fetch failed, using defaults:', e)
  }

  return (
    <Products
      products={productsRes}
      allCategories={allCategories.map((c) => ({
        ...c,
        displayName: c.name || 'No Name',
      }))}
      lang={currentLang}
      t={t}
      specs={specs}
      activeCategorySlug={categorySlug}
    />
  )
}
