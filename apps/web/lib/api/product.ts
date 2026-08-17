import { apiClient } from './client'
import type { Product, ProductsResponse, ProductResponse, CategoriesResponse } from '../../../../packages/shared/src/types/product'

export interface GetProductsParams {
  page?: number
  limit?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: string
  isActive?: boolean
  featured?: boolean
}

export const productApi = {
  // Get all products with filters
  getAll: async (params: GetProductsParams = {}): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products', {
      params: {
        ...params,
        isActive: params.isActive !== undefined ? String(params.isActive) : 'true',
        page: params.page || 1,
        limit: params.limit || 12,
      },
    })
    return data
  },

  // Get product by slug
  getBySlug: async (slug: string): Promise<ProductResponse> => {
    const { data } = await apiClient.get<ProductResponse>(`/products/${slug}`)
    return data
  },

  // Get featured products
  getFeatured: async (limit: number = 4): Promise<ProductsResponse> => {
    return productApi.getAll({ featured: true, limit, isActive: true })
  },

  // Create product (admin)
  create: async (product: FormData | Partial<Product>): Promise<ProductResponse> => {
    const isFormData = product instanceof FormData
    const { data } = await apiClient.post<ProductResponse>('/products', product, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    return data
  },

  // Update product (admin)
  update: async (id: string, product: FormData | Partial<Product>): Promise<ProductResponse> => {
    const isFormData = product instanceof FormData
    const { data } = await apiClient.put<ProductResponse>(`/products/${id}`, product, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    return data
  },

  // Delete product (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },

  // Permanently delete product (admin)
  deletePermanent: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}/permanent`)
  },
}

export const categoryApi = {
  // Get all categories
  getAll: async (activeOnly: boolean = true): Promise<CategoriesResponse> => {
    const { data } = await apiClient.get<CategoriesResponse>('/categories', {
      params: { activeOnly: String(activeOnly) },
    })
    return data
  },

  // Get category by slug
  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get(`/categories/${slug}`)
    return data
  },

  // Create category (admin)
  create: async (category: { name: string; slug: string; description?: string; parent?: string }) => {
    const { data } = await apiClient.post('/categories', category)
    return data
  },

  // Update category (admin)
  update: async (id: string, category: Partial<{ name: string; slug: string; description?: string; parent?: string }>) => {
    const { data } = await apiClient.put(`/categories/${id}`, category)
    return data
  },

  // Delete category (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`)
  },
}