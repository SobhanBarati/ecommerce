import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom' 
import { ProductGrid } from './product-grid'
import type { Product } from '../../../../../packages/shared/src/types/product'

describe('ProductGrid', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      slug: 'product-1',
      description: 'Desc 1',
      price: 100000,
      category: {
        id: 'cat1',
        name: 'Category 1',
        slug: 'category-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      images: ['https://example.com/1.jpg'],
      variants: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Product 2',
      slug: 'product-2',
      description: 'Desc 2',
      price: 200000,
      category: {
        id: 'cat1',
        name: 'Category 1',
        slug: 'category-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      images: ['https://example.com/2.jpg'],
      variants: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  it('should render all products', () => {
    render(<ProductGrid products={mockProducts} />)
    
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('should show loading skeletons when isLoading is true', () => {
    render(<ProductGrid products={[]} isLoading={true} />)
    
    // Check for skeleton elements (animate-pulse class)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show empty state when no products', () => {
    render(<ProductGrid products={[]} />)
    
    expect(screen.getByText('محصولی یافت نشد')).toBeInTheDocument()
  })
})