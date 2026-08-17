import mongoose from 'mongoose'
import { env } from '../core/config'
import { CategoryModel } from '../modules/categories/category.model'
import { ProductModel } from '../modules/products/product.model'
import { ProductVariantModel } from '../modules/products/productVariant.model'

const seedData = async () => {
  try {
    await mongoose.connect(env.mongodbUri)
    console.log('Connected to MongoDB')

    // Clear existing data
    await CategoryModel.deleteMany({})
    await ProductModel.deleteMany({})
    await ProductVariantModel.deleteMany({})
    console.log('Cleared existing data')

    // Create categories
    const categories = await CategoryModel.create([
      {
        name: 'لباس زنانه',
        slug: 'women',
        description: 'جدیدترین مدل‌های لباس زنانه',
        isActive: true,
      },
      {
        name: 'لباس مردانه',
        slug: 'men',
        description: 'جدیدترین مدل‌های لباس مردانه',
        isActive: true,
      },
      {
        name: 'اکسسوری',
        slug: 'accessories',
        description: 'انواع اکسسوری و زیورآلات',
        isActive: true,
      },
    ])
    console.log('Categories seeded')

    // Create products
    const products = await ProductModel.create([
      {
        name: 'پیراهن مجلسی زنانه',
        slug: 'women-party-dress',
        description: 'پیراهن مجلسی با طراحی خاص و شیک، مناسب مهمانی‌ها و مراسم رسمی',
        price: 450000,
        category: categories[0]._id,
        images: ['https://via.placeholder.com/600x800/FF6B6B/FFFFFF?text=Women+Dress'],
        isActive: true,
        isFeatured: true,
        tags: ['مجلسی', 'رسمی', 'زنانه'],
      },
      {
        name: 'کت و شلوار مردانه',
        slug: 'men-suit',
        description: 'کت و شلوار کلاسیک با پارچه مرغوب و دوخت عالی',
        price: 1200000,
        category: categories[1]._id,
        images: ['https://via.placeholder.com/600x800/2C3E50/FFFFFF?text=Men+Suit'],
        isActive: true,
        isFeatured: true,
        tags: ['رسمی', 'کلاسیک', 'مردانه'],
      },
      {
        name: 'کیف چرم زنانه',
        slug: 'women-leather-bag',
        description: 'کیف چرم طبیعی با طراحی مدرن و فضای کافی',
        price: 320000,
        category: categories[2]._id,
        images: ['https://via.placeholder.com/600x800/8B4513/FFFFFF?text=Leather+Bag'],
        isActive: true,
        isFeatured: false,
        tags: ['چرم', 'کیف', 'زنانه'],
      },
    ])
    console.log('Products seeded')

    // Create variants
    const variantData = [
      {
        product: products[0]._id,
        size: 'M',
        color: 'قرمز',
        sku: 'WOMEN-DRESS-M-RED',
        stock: 10,
      },
      {
        product: products[0]._id,
        size: 'L',
        color: 'مشکی',
        sku: 'WOMEN-DRESS-L-BLK',
        stock: 8,
      },
      {
        product: products[1]._id,
        size: '42',
        color: 'آبی سرمه‌ای',
        sku: 'MEN-SUIT-42-NAVY',
        stock: 5,
      },
      {
        product: products[2]._id,
        size: 'متوسط',
        color: 'قهوه‌ای',
        sku: 'BAG-BROWN-M',
        stock: 15,
      },
    ]

    const variants = await ProductVariantModel.create(variantData)
    console.log('Variants seeded')

    // Update products with variants
    for (let i = 0; i < products.length; i++) {
      const productVariants = variants.filter(
        (v) => v.product.toString() === products[i]._id.toString()
      )
      products[i].variants = productVariants.map((v) => v._id)
      await products[i].save()
    }

    console.log('✅ Seed completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedData()