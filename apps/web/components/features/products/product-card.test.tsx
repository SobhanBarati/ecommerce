import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom' 
import { ProductCard } from './product-card'
import type { Product } from '../../../../../packages/shared/src/types/product'

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '123',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    price: 150000,
    category: {
      id: 'cat1',
      name: 'Test Category',
      slug: 'test-category',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    images: ['https://example.com/image.jpg'],
    variants: [
      {
        id: 'v1',
        size: 'M',
        color: 'Red',
        sku: 'TEST-M-RED',
        stock: 10,
        product: '123',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  it('should render product name and price', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    // Price is formatted with ریال, look for the number part
    expect(screen.getByText(/۱۵۰,۰۰۰/)).toBeInTheDocument()
  })

  it('should show out of stock badge when no stock', () => {
    const outOfStockProduct = {
      ...mockProduct,
      variants: [
        {
          ...mockProduct.variants[0],
          stock: 0,
        },
      ],
    }

    render(<ProductCard product={outOfStockProduct} />)
    // Use getAllByText and check first one (badge)
    const outOfStockElements = screen.getAllByText('ناموجود')
    expect(outOfStockElements.length).toBeGreaterThan(0)
    // The badge is the first one
    expect(outOfStockElements[0]).toBeInTheDocument()
  })

  it('should call onAddToCart when button clicked', () => {
    const mockAddToCart = vi.fn()
    render(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    )
    
    const button = screen.getByText('افزودن به سبد خرید')
    fireEvent.click(button)
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('should have link to product detail', () => {
    render(<ProductCard product={mockProduct} />)
    
    // Use getAllByRole to handle multiple links
    const links = screen.getAllByRole('link', { name: /Test Product/i })
    expect(links.length).toBeGreaterThan(0)
    // Check the first link (the title link) has correct href
    const titleLink = screen.getByRole('link', { name: 'Test Product' })
    expect(titleLink).toHaveAttribute('href', '/product/test-product')
  })
})