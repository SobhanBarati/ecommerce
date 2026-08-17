import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fashion Store',
  description: 'Premium fashion e-commerce store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}