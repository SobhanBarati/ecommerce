'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Category } from '../../../../../packages/shared/src/types/product'

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange: (categoryId?: string) => void
  onSearchChange: (search: string) => void
  onPriceRangeChange: (min?: number, max?: number) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onSearchChange,
  onPriceRangeChange,
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

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی محصول..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit">جستجو</Button>
      </form>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">دسته‌بندی</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(undefined)}
          >
            همه
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
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
            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="تا"
            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="sm" onClick={handlePriceSubmit}>
            اعمال
          </Button>
        </div>
      </div>
    </div>
  )
}