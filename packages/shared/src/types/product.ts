export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  size: string
  color: string
  sku: string
  stock: number
  price?: number
  product: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: Category | string
  images: string[]
  variants: ProductVariant[]
  isActive: boolean
  isFeatured?: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export interface ProductResponse {
  success: boolean
  data: Product
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
}