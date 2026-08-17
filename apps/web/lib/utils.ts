import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function getImageUrl(image: string): string {
  if (image.startsWith('http')) return image
  return `${process.env.NEXT_PUBLIC_API_URL || ''}${image}`
}