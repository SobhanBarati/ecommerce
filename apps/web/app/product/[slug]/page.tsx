'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useProduct } from '@/hooks/use-products'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import type { ProductVariant } from '../../../../../packages/shared/src/types/product'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Check, Heart } from 'lucide-react'
import { Toast } from '@/components/ui/toast'
import { useUIStore } from '@/stores/ui-store'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const { showToast } = useUIStore()

  const { data, isLoading, error } = useProduct(slug)
  const product = data?.data

  // Auto-select first variant with stock
  if (product && !selectedVariant && product.variants.length > 0) {
    const inStock = product.variants.find((v) => v.stock > 0)
    if (inStock) {
      setSelectedVariant(inStock)
    } else {
      setSelectedVariant(product.variants[0])
    }
  }

  // Set first image
  if (product && !selectedImage && product.images.length > 0) {
    setSelectedImage(product.images[0])
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast('لطفاً یک سایز و رنگ انتخاب کنید', 'warning')
      return
    }
    if (selectedVariant.stock === 0) {
      showToast('این محصول موجود نیست', 'error')
      return
    }
    // Will implement in Milestone 2
    showToast(`${product?.name} به سبد خرید اضافه شد`, 'success')
    console.log('Add to cart:', {
      product: product?.id,
      variant: selectedVariant.id,
      quantity: 1,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">محصول یافت نشد</h1>
          <p className="text-gray-500 mb-6">محصول مورد نظر شما موجود نیست یا حذف شده است</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    )
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : ''
  const hasStock = product.variants.some((v) => v.stock > 0)
  const isInStock = selectedVariant?.stock ? selectedVariant.stock > 0 : false

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50"
      >
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>بازگشت</span>
              </Link>
              <Link href="/" className="text-xl font-bold">
                🛍️ Fashion Store
              </Link>
              <div className="w-20" /> {/* Spacer */}
            </div>
          </div>
        </header>

        {/* Product Detail */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                  {product.isFeatured && (
                    <Badge
                      variant="primary"
                      className="absolute top-4 right-4"
                    >
                      ویژه
                    </Badge>
                  )}
                  {!isInStock && (
                    <Badge
                      variant="destructive"
                      className="absolute top-4 left-4"
                    >
                      ناموجود
                    </Badge>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 transition-colors ${
                          selectedImage === image
                            ? 'border-blue-600'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 12vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                  </div>
                  <p className="text-gray-500 mt-1">{categoryName}</p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {selectedVariant?.price && selectedVariant.price !== product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(selectedVariant.price)}
                    </span>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="leading-relaxed">{product.description}</p>
                </div>

                {/* Variants */}
                {product.variants.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">انتخاب سایز و رنگ</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {product.variants.map((variant) => {
                          const isSelected = selectedVariant?.id === variant.id
                          const isOutOfStock = variant.stock === 0
                          
                          return (
                            <button
                              key={variant.id}
                              onClick={() => setSelectedVariant(variant)}
                              disabled={isOutOfStock}
                              className={`
                                relative p-3 border-2 rounded-lg text-sm transition-all
                                ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                                ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                              `}
                            >
                              <div className="font-medium">{variant.color}</div>
                              <div className="text-xs text-gray-500">{variant.size}</div>
                              {isSelected && (
                                <Check className="absolute top-1 right-1 w-3 h-3 text-blue-600" />
                              )}
                              {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
                                  <span className="text-xs font-medium text-red-600">ناموجود</span>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Stock info */}
                    {selectedVariant && (
                      <p className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                        {isInStock
                          ? `موجودی: ${selectedVariant.stock} عدد`
                          : 'این محصول در حال حاضر موجود نیست'}
                      </p>
                    )}
                  </div>
                )}

                {/* Add to Cart */}
                <div className="space-y-3 pt-4 border-t">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!isInStock || !selectedVariant}
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {isInStock && selectedVariant ? 'افزودن به سبد خرید' : 'ناموجود'}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    افزودن به علاقه‌مندی‌ها
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

          {/* Related Products - Will add later */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">محصولات مشابه</h2>
            <p className="text-gray-500">به زودی...</p>
          </div>
        </div>
      </motion.main>

      <Toast />
    </>
  )
}