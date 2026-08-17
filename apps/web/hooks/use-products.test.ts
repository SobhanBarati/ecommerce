import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createElement } from 'react'
import { useProducts, useProduct } from './use-products'
import { productApi } from '../lib/api/product'

// Mock the API module
vi.mock('@/lib/api/products', () => ({
  productApi: {
    getAll: vi.fn(),
    getBySlug: vi.fn(),
  },
}))

// ✅ استفاده از createElement به جای JSX
function TestWrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  )
}

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch products successfully', async () => {
    const mockProducts = {
      data: {
        products: [
          { id: '1', name: 'Product 1' },
          { id: '2', name: 'Product 2' },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      },
      success: true,
    }

    vi.mocked(productApi.getAll).mockResolvedValue(mockProducts as any)

    const { result } = renderHook(() => useProducts({ page: 1 }), {
      wrapper: TestWrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockProducts)
    expect(productApi.getAll).toHaveBeenCalledWith({ page: 1, limit: 12 })
  })

  it('should handle error', async () => {
    const error = new Error('Network error')
    vi.mocked(productApi.getAll).mockRejectedValue(error)

    const { result } = renderHook(() => useProducts({ page: 1 }), {
      wrapper: TestWrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(error)
  })
})

describe('useProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch product by slug', async () => {
    const mockProduct = {
      data: {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
      },
      success: true,
    }

    vi.mocked(productApi.getBySlug).mockResolvedValue(mockProduct as any)

    const { result } = renderHook(() => useProduct('test-product'), {
      wrapper: TestWrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockProduct)
    expect(productApi.getBySlug).toHaveBeenCalledWith('test-product')
  })

  it('should not fetch when slug is empty', () => {
    const { result } = renderHook(() => useProduct(''), {
      wrapper: TestWrapper,
    })

    expect(result.current.isLoading).toBe(false)
    expect(productApi.getBySlug).not.toHaveBeenCalled()
  })
})