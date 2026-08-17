import { describe, it, expect, beforeEach } from 'vitest'
import { ProductModel } from './product.model'
import { CategoryModel } from '../categories/category.model'
import { clearDatabase } from '../../test/setup'

describe('Product Model', () => {
  let categoryId: string

  beforeEach(async () => {
    await clearDatabase()

    const category = await CategoryModel.create({
      name: 'Test Category',
      slug: 'test-category',
      isActive: true,
    })
    categoryId = category.id
  })

  it('should create a product with valid data', async () => {
    const product = await ProductModel.create({
      name: 'Test Product',
      slug: 'test-product',
      description: 'This is a test product',
      price: 100000,
      category: categoryId,
      images: ['https://example.com/image.jpg'],
      isActive: true,
    })

    expect(product).toHaveProperty('id')
    expect(product.name).toBe('Test Product')
    expect(product.slug).toBe('test-product')
    expect(product.price).toBe(100000)
  })

  it('should not create a product without required fields', async () => {
    await expect(
      ProductModel.create({
        name: 'Test Product',
        // missing required fields
      })
    ).rejects.toThrow()
  })

  it('should not allow duplicate slugs', async () => {
    await ProductModel.create({
      name: 'Test Product 1',
      slug: 'test-product',
      description: 'Test description',
      price: 100000,
      category: categoryId,
      images: ['https://example.com/image.jpg'],
    })

    await expect(
      ProductModel.create({
        name: 'Test Product 2',
        slug: 'test-product',
        description: 'Another test',
        price: 200000,
        category: categoryId,
        images: ['https://example.com/image.jpg'],
      })
    ).rejects.toThrow()
  })

  it('should support text search', async () => {
    await ProductModel.create({
      name: 'Searchable Product',
      slug: 'searchable-product',
      description: 'This product has amazing features',
      price: 150000,
      category: categoryId,
      images: ['https://example.com/image.jpg'],
      tags: ['amazing', 'featured'],
    })

    const results = await ProductModel.find(
      { $text: { $search: 'amazing features' } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toBe('Searchable Product')
  })

  it('should filter by price range', async () => {
    await ProductModel.create({
      name: 'Cheap Product',
      slug: 'cheap-product',
      description: 'Cheap product',
      price: 50000,
      category: categoryId,
      images: ['https://example.com/image.jpg'],
    })

    await ProductModel.create({
      name: 'Expensive Product',
      slug: 'expensive-product',
      description: 'Expensive product',
      price: 200000,
      category: categoryId,
      images: ['https://example.com/image.jpg'],
    })

    const results = await ProductModel.find({
      price: { $gte: 100000, $lte: 150000 },
    })

    expect(results.length).toBe(0)
  })
})