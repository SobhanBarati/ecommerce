'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductGrid } from '@/components/features/products/product-grid'
import { ProductFilters } from '@/components/features/products/product-filters'
import { productApi, categoryApi } from '../lib/api/product'
import type { Product } from '../../../packages/shared/src/types/product'


export default function HomePage() {
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    search: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    page: 1,
  })

  // Fetch products
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () =>
      productApi.getAll({
        page: filters.page,
        category: filters.category,
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        limit: 12,
      }),
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(true),
  })

  const products = productsData?.data?.products || []
  const categories = categoriesData?.data || []

  const handleAddToCart = (product: Product) => {
    // Will implement in Milestone 2
    console.log('Add to cart:', product.id)
    // TODO: Show toast notification
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">🛍️ Fashion Store</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              selectedCategory={filters.category}
              onCategoryChange={(categoryId) =>
                setFilters((prev) => ({ ...prev, category: categoryId }))
              }
              onSearchChange={(search) =>
                setFilters((prev) => ({ ...prev, search }))
              }
              onPriceRangeChange={(min, max) =>
                setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
              }
            />
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {productsError ? (
              <div className="text-center py-12 text-red-600">
                <p>خطا در بارگذاری محصولات</p>
                <p className="text-sm text-gray-500">
                  {(productsError as Error).message}
                </p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                isLoading={productsLoading}
                onAddToCart={handleAddToCart}
              />
            )}

            {/* Pagination */}
            {productsData?.data?.pagination && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from(
                  { length: productsData.data.pagination.pages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilters((prev) => ({ ...prev, page }))}
                    className={`px-4 py-2 rounded-lg border ${
                      page === filters.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}