import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi, type GetProductsParams } from '../lib/api/product'
import type { Product } from '../../../packages/shared/src/types/product'

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: GetProductsParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
}

// Hooks
export function useProducts(filters: GetProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useInfiniteProducts(filters: Omit<GetProductsParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: productKeys.list({ ...filters, page: 1 }),
    queryFn: ({ pageParam = 1 }) => 
      productApi.getAll({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data.pagination
      return page < pages ? page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useFeaturedProducts(limit: number = 4) {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productApi.getFeatured(limit),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCategories(activeOnly: boolean = true) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryApi.getAll(activeOnly),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (product: FormData | Partial<Product>) => productApi.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: FormData | Partial<Product> }) =>
      productApi.update(id, product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (category: { name: string; slug: string; description?: string; parent?: string }) =>
      categoryApi.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: Partial<{ name: string; slug: string; description?: string; parent?: string }> }) =>
      categoryApi.update(id, category),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
    },
  })
}