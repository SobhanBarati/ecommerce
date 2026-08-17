'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '../../../../../packages/shared/src/types/product'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasStock = product.variants.some((v) => v.stock > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                priority={false}
              />
            )}
            {product.isFeatured && (
              <Badge
                variant="primary"
                className="absolute top-2 right-2"
              >
                ویژه
              </Badge>
            )}
            {!hasStock && (
              <Badge
                variant="destructive"
                className="absolute top-2 left-2"
              >
                ناموجود
              </Badge>
            )}
          </div>
        </Link>

        <CardHeader className="flex-1">
          <CardTitle className="text-base line-clamp-2">
            <Link href={`/product/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </CardTitle>
          <p className="text-sm text-gray-500 line-clamp-1">
            {typeof product.category === 'object' ? product.category.name : ''}
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.variants.length > 0 && (
              <span className="text-sm text-gray-500">
                {product.variants.length} رنگ
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="primary"
            className="w-full"
            disabled={!hasStock}
            onClick={() => onAddToCart?.(product)}
          >
            {hasStock ? 'افزودن به سبد خرید' : 'ناموجود'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}