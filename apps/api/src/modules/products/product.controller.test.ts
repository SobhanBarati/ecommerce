import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { CategoryModel } from '../categories/category.model'
import { ProductModel } from './product.model'
import { clearDatabase } from '../../test/setup'

describe('Product Controller', () => {
  let categoryId: string

  beforeEach(async () => {
    await clearDatabase()
    
    // Create a test category
    const category = await CategoryModel.create({
      name: 'Test Category',
      slug: 'test-category',
      isActive: true,
    })
    categoryId = category.id
  })

  describe('POST /api/products', () => {
    it('should create a product with variants', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          slug: 'test-product',
          description: 'Test description',
          price: 100000,
          category: categoryId,
          images: ['https://example.com/image.jpg'],
          variants: [
            {
              size: 'M',
              color: 'Red',
              sku: 'TEST-M-RED',
              stock: 10,
            },
            {
              size: 'L',
              color: 'Blue',
              sku: 'TEST-L-BLUE',
              stock: 5,
            },
          ],
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data.variants).toHaveLength(2)
    })

    it('should reject invalid data', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test',
          // missing required fields
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBeDefined()
    })

    it('should reject duplicate slug', async () => {
      // Create first product
      await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product 1',
          slug: 'test-product',
          description: 'Test description',
          price: 100000,
          category: categoryId,
          images: ['https://example.com/image.jpg'],
        })

      // Try to create another with same slug
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product 2',
          slug: 'test-product',
          description: 'Another test',
          price: 200000,
          category: categoryId,
          images: ['https://example.com/image.jpg'],
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('GET /api/products', () => {
    beforeEach(async () => {
      for (let i = 0; i < 5; i++) {
        await ProductModel.create({
          name: `Product ${i}`,
          slug: `product-${i}`,
          description: 'Test description',
          price: 100000 + i * 10000,
          category: categoryId,
          images: ['https://example.com/image.jpg'],
          isActive: true,
        })
      }
    })

    it('should return paginated products', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 3 })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.products).toHaveLength(3)
      expect(response.body.data.pagination.total).toBe(5)
      expect(response.body.data.pagination.pages).toBe(2)
    })

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ category: categoryId })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.products.length).toBe(5)
    })

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ minPrice: 120000, maxPrice: 150000 })

      expect(response.status).toBe(200)
      expect(response.body.data.products).toHaveLength(3)
    })
  })

  describe('GET /api/products/:slug', () => {
    it('should return product by slug', async () => {
      const product = await ProductModel.create({
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        price: 100000,
        category: categoryId,
        images: ['https://example.com/image.jpg'],
      })

      const response = await request(app)
        .get(`/api/products/${product.slug}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(product.id)
      expect(response.body.data.name).toBe('Test Product')
    })

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/non-existent')

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBeDefined()
    })
  })
})