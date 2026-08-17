'use client'

import { useState, useEffect } from 'react'
import { useProducts, useCategories } from '@/hooks/use-products'
import { ProductGrid } from '@/components/features/products/product-grid'
import { ProductFilters } from '@/components/features/products/product-filters'
import { Toast } from '@/components/ui/toast'
import { useUIStore } from '@/stores/ui-store'
import type { Product } from '../../../packages/shared/src/types/product'
import { Search, Filter, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    search: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    page: 1,
    sort: '-createdAt',
  })
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const { showToast } = useUIStore()

  // Fetch products with filters
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useProducts({
    page: filters.page,
    category: filters.category,
    search: filters.search || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
    limit: 12,
  })

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories(true)

  const products = productsData?.data?.products || []
  const categories = categoriesData?.data || []
  const pagination = productsData?.data?.pagination

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    // Will implement in Milestone 2
    showToast(`${product.name} به سبد خرید اضافه شد`, 'success')
    console.log('Add to cart:', product.id)
  }

  // Handle filter changes
  const handleCategoryChange = (categoryId?: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId, page: 1 }))
    if (isMobileFiltersOpen) setIsMobileFiltersOpen(false)
  }

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }

  const handlePriceRangeChange = (min?: number, max?: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }))
  }

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: undefined,
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
      sort: '-createdAt',
    })
    if (isMobileFiltersOpen) setIsMobileFiltersOpen(false)
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🛍️ Fashion Store
              </h1>
              
              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <ProductFilters
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                    selectedCategory={filters.category}
                    onCategoryChange={handleCategoryChange}
                    onSearchChange={handleSearchChange}
                    onPriceRangeChange={handlePriceRangeChange}
                    onReset={handleResetFilters}
                  />
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <section className="lg:col-span-3">
              {/* Sort and results info */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="text-sm text-gray-600">
                  {productsLoading ? 'در حال بارگذاری...' : 
                    pagination ? `${pagination.total} محصول` : '۰ محصول'}
                </p>
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="-createdAt">جدیدترین</option>
                  <option value="price">ارزان‌ترین</option>
                  <option value="-price">گران‌ترین</option>
                  <option value="name">الفبایی</option>
                </select>
              </div>

              {/* Products */}
              {productsError ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <p className="text-red-600 font-semibold">خطا در بارگذاری محصولات</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {(productsError as Error).message || 'لطفاً دوباره تلاش کنید'}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    تلاش مجدد
                  </button>
                </div>
              ) : (
                <ProductGrid
                  products={products}
                  isLoading={productsLoading}
                  onAddToCart={handleAddToCart}
                />
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    قبلی
                  </button>
                  
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    let pageNum
                    if (pagination.pages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    بعدی
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)}>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h2 className="font-semibold">فیلترها</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <ProductFilters
                categories={categories}
                categoriesLoading={categoriesLoading}
                selectedCategory={filters.category}
                onCategoryChange={handleCategoryChange}
                onSearchChange={handleSearchChange}
                onPriceRangeChange={handlePriceRangeChange}
                onReset={handleResetFilters}
                isMobile
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      <Toast />
    </>
  )
}