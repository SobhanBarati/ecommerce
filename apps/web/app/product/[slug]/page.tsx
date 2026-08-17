'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { productApi } from '../../../lib/api/product'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import type { ProductVariant } from '../../../../../packages/shared/src/types/product'
import { motion } from 'framer-motion'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
  })

  const product = data?.data

  // Auto-select first variant with stock
  if (product && !selectedVariant && product.variants.length > 0) {
    const inStock = product.variants.find((v) => v.stock > 0)
    if (inStock) {
      setSelectedVariant(inStock)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">محصول یافت نشد</h1>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    )
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : ''
  const hasStock = product.variants.some((v) => v.stock > 0)
  const variantSelected = selectedVariant || product.variants[0]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold hover:underline">
            🛍️ Fashion Store
          </Link>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                {product.isFeatured && (
                  <Badge variant="primary">ویژه</Badge>
                )}
              </div>
              <p className="text-gray-500 mt-1">{categoryName}</p>
            </div>

            <div>
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">سایز و رنگ</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock === 0}
                        className={`p-2 border rounded-lg text-sm transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div>{variant.color}</div>
                        <div className="text-xs text-gray-500">{variant.size}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock info */}
                {selectedVariant && (
                  <p className="text-sm text-gray-500">
                    {selectedVariant.stock > 0
                      ? `موجودی: ${selectedVariant.stock} عدد`
                      : 'ناموجود'}
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!hasStock || !selectedVariant}
                onClick={() => {
                  // Will implement in Milestone 2
                  console.log('Add to cart:', {
                    product: product.id,
                    variant: selectedVariant?.id,
                  })
                }}
              >
                {hasStock && selectedVariant ? 'افزودن به سبد خرید' : 'ناموجود'}
              </Button>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}