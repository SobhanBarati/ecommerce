import { apiClient } from './client'
import type { Product, ProductsResponse, ProductResponse } from '../../../../packages/shared/src/types/product';

export interface GetProductsParams {
  page?: number
  limit?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: string
  isActive?: boolean
}

export const productApi = {
  // Get all products with filters
  getAll: async (params: GetProductsParams = {}): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products', {
      params: {
        ...params,
        isActive: params.isActive !== undefined ? String(params.isActive) : 'true',
      },
    })
    return data
  },

  // Get product by slug
  getBySlug: async (slug: string): Promise<ProductResponse> => {
    const { data } = await apiClient.get<ProductResponse>(`/products/${slug}`)
    return data
  },

  // Create product (admin)
  create: async (product: Partial<Product>): Promise<ProductResponse> => {
    const { data } = await apiClient.post<ProductResponse>('/products', product)
    return data
  },

  // Update product (admin)
  update: async (id: string, product: Partial<Product>): Promise<ProductResponse> => {
    const { data } = await apiClient.put<ProductResponse>(`/products/${id}`, product)
    return data
  },

  // Delete product (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}

export const categoryApi = {
  // Get all categories
  getAll: async (activeOnly: boolean = true) => {
    const { data } = await apiClient.get('/categories', {
      params: { activeOnly: String(activeOnly) },
    })
    return data
  },

  // Get category by slug
  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get(`/categories/${slug}`)
    return data
  },
}