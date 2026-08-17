import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { CategoryModel } from './category.model'
import { clearDatabase } from '../../test/setup'

describe('Category Controller', () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  describe('POST /api/categories', () => {
    it('should create a category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'New Category',
          slug: 'new-category',
          description: 'Test category',
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('New Category')
    })

    it('should reject invalid slug', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Invalid',
          slug: 'Invalid Slug!', // Invalid: contains space and !
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBeDefined()
    })

    it('should reject duplicate category name', async () => {
      // Create first category
      await request(app)
        .post('/api/categories')
        .send({
          name: 'Duplicate',
          slug: 'duplicate-1',
        })

      // Try to create another with same name
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Duplicate',
          slug: 'duplicate-2',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      await CategoryModel.create([
        { name: 'Category 1', slug: 'category-1', isActive: true },
        { name: 'Category 2', slug: 'category-2', isActive: true },
      ])

      const response = await request(app).get('/api/categories')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
    })

    it('should return only active categories when activeOnly=true', async () => {
      await CategoryModel.create([
        { name: 'Active 1', slug: 'active-1', isActive: true },
        { name: 'Active 2', slug: 'active-2', isActive: true },
        { name: 'Inactive', slug: 'inactive', isActive: false },
      ])

      const response = await request(app)
        .get('/api/categories')
        .query({ activeOnly: 'true' })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
    })
  })
})