'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '../../../../../packages/shared/src/types/product'
import { Search, X } from 'lucide-react'

interface ProductFiltersProps {
  categories: Category[]
  categoriesLoading?: boolean
  selectedCategory?: string
  onCategoryChange: (categoryId?: string) => void
  onSearchChange: (search: string) => void
  onPriceRangeChange: (min?: number, max?: number) => void
  onReset?: () => void
  isMobile?: boolean
}

export function ProductFilters({
  categories,
  categoriesLoading,
  selectedCategory,
  onCategoryChange,
  onSearchChange,
  onPriceRangeChange,
  onReset,
  isMobile = false,
}: ProductFiltersProps) {
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(search)
  }

  const handlePriceSubmit = () => {
    onPriceRangeChange(
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined
    )
  }

  const handleClearSearch = () => {
    setSearch('')
    onSearchChange('')
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold mb-3">جستجو</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="نام محصول..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <button type="submit" className="sr-only">جستجو</button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">دسته‌بندی</h3>
        {categoriesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(undefined)}
              className={isMobile ? 'w-full justify-start' : ''}
            >
              همه
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className={isMobile ? 'w-full justify-start' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">محدوده قیمت</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="از"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="تا"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Button size="sm" onClick={handlePriceSubmit}>
            اعمال
          </Button>
        </div>
      </div>

      {/* Reset */}
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full"
        >
          حذف همه فیلترها
        </Button>
      )}
    </div>
  )
}