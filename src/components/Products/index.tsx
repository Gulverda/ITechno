'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { Pagination } from '@/components/Pagination'
import { Search } from '@/components/Search'
import { ChevronRight } from 'lucide-react'
import { Category, Product } from '@/payload-types'
import { PaginatedDocs } from 'payload'

interface CategoryWithDisplay extends Category {
  displayName?: string
}

interface ProductsProps {
  products: PaginatedDocs<Product>
  allCategories: CategoryWithDisplay[]
  lang: 'ka' | 'en'
  t: Record<string, Record<string, string>>
  specs: {
    resolutions: string[]
    connectionTypes: string[]
  }
  activeCategorySlug: string | null
}

export const Products = ({
  products,
  allCategories,
  lang,
  t,
  specs,
  activeCategorySlug,
}: ProductsProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createCategoryLink = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('limit')
    params.delete('page')

    const basePath = `/${lang}/products`
    const urlPath = slug ? `${basePath}/${slug}` : basePath
    const queryString = params.toString()

    return queryString ? `${urlPath}?${queryString}` : urlPath
  }

  const createFilterUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)

    params.delete('page')
    return `${pathname}?${params.toString()}`
  }

  const activeCategory = allCategories.find((c) => c.slug === activeCategorySlug)

  const getParentId = (cat: CategoryWithDisplay): string | number | null | undefined => {
    return typeof cat.parent === 'object' ? cat.parent?.id : cat.parent
  }

  const isBranchActive = (cat: CategoryWithDisplay): boolean => {
    if (activeCategorySlug === cat.slug) return true
    return allCategories.some((c) => {
      const pId = getParentId(c)
      return String(pId) === String(cat.id) && isBranchActive(c)
    })
  }

  const renderCategoryTree = (parentId: string | number | null = null, level = 0) => {
    const children = allCategories.filter((c) => {
      const pId = getParentId(c)
      return parentId === null ? !pId : String(pId) === String(parentId)
    })

    if (children.length === 0) return null

    return (
      <div className={`${level > 0 ? 'ml-3 border-l border-slate-200 pl-3 mt-1' : 'space-y-1'}`}>
        {children.map((cat) => {
          const isActive = activeCategorySlug === cat.slug
          const isOpen = isBranchActive(cat)
          const hasChildren = allCategories.some((c) => String(getParentId(c)) === String(cat.id))

          return (
            <div key={cat.id}>
              <Link
                href={createCategoryLink(cat.slug || null)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                <span>{cat.displayName || cat.name}</span>
                {isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-white" />
                ) : isOpen ? (
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-blue-600" />
                ) : hasChildren ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-all" />
                ) : null}
              </Link>
              {isOpen && renderCategoryTree(cat.id, level + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 pt-6 pb-20">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              <span className="text-blue-600">#</span>{' '}
              {activeCategory
                ? activeCategory.displayName || activeCategory.name
                : lang === 'ka'
                  ? 'მაღაზია'
                  : 'Shop'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {lang === 'ka' ? 'ნაპოვნია' : 'Found'} {products.totalDocs}{' '}
              {lang === 'ka' ? 'პროდუქტი' : 'products'}
            </p>
          </div>
          <Search lang={lang} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b pb-4">
                {t.shop?.categories || (lang === 'ka' ? 'კატეგორიები' : 'Categories')}
              </h3>

              <Link
                href={createCategoryLink(null)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-2 transition-all ${
                  !activeCategorySlug
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{t.shop?.all || (lang === 'ka' ? 'ყველა' : 'All')}</span>
                {!activeCategorySlug && (
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-white" />
                )}
              </Link>

              <nav>{renderCategoryTree(null)}</nav>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <FilterSection
                title={t.filters?.cctvStandard || 'Standard'}
                items={['ip', 'analog']}
                activeValue={searchParams.get('connectionType')}
                onSelect={(v) => createFilterUrl('connectionType', v)}
                isUppercase
              />
              <FilterSection
                title={t.filters?.resolution || 'Resolution'}
                items={specs?.resolutions || []}
                activeValue={searchParams.get('resolution')}
                onSelect={(v) => createFilterUrl('resolution', v)}
                isGrid
              />
            </div>
          </div>
        </aside>

        <section className="flex-1">
          {products.docs && products.docs.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.docs.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang} />
                ))}
              </div>

              <div className="flex justify-center border-t border-slate-100 pt-10">
                <Pagination
                  totalPages={products.totalPages ?? 1}
                  currentPage={products.page ?? 1}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                {lang === 'ka' ? 'პროდუქტები არ მოიძებნა' : 'No products found'}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

interface FilterSectionProps {
  title: string
  items: string[]
  activeValue: string | null
  onSelect: (v: string | null) => string
  isGrid?: boolean
  isUppercase?: boolean
}

function FilterSection({
  title,
  items,
  activeValue,
  onSelect,
  isGrid,
  isUppercase,
}: FilterSectionProps) {
  if (!items?.length) return null
  return (
    <div>
      <h4 className="font-bold text-[10px] uppercase text-gray-400 mb-3 tracking-widest">
        {title}
      </h4>
      <div className={isGrid ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
        {items.map((item) => {
          const isActive = activeValue === item
          return (
            <Link
              key={item}
              href={onSelect(isActive ? null : item)}
              className={`px-3 py-2 text-[10px] border rounded-xl text-center transition-all ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md'
                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-blue-300'
              }`}
            >
              {isUppercase ? item.toUpperCase() : item}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
