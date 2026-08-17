import { Request, Response, NextFunction } from 'express'
import { CategoryModel } from './category.model'
import { AppError } from '../../core/middleware/errorHandler'
import { z } from 'zod'

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  parent: z.string().nullable().optional(),
})

const updateCategorySchema = createCategorySchema.partial()

export class CategoryController {
  // Create category
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validated = createCategorySchema.parse(req.body)

      // Check if parent exists
      if (validated.parent) {
        const parentExists = await CategoryModel.findById(validated.parent)
        if (!parentExists) {
          throw new AppError('Parent category not found', 404)
        }
      }

      const category = await CategoryModel.create(validated)
      res.status(201).json({
        success: true,
        data: category,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get all categories
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { activeOnly = 'true' } = req.query

      const filter: any = {}
      if (activeOnly === 'true') {
        filter.isActive = true
      }

      const categories = await CategoryModel.find(filter)
        .populate('parent', 'name slug')
        .sort({ name: 1 })

      res.status(200).json({
        success: true,
        data: categories,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get category by slug
  public getBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params
      const category = await CategoryModel.findOne({ slug })
        .populate('parent', 'name slug')

      if (!category) {
        throw new AppError('Category not found', 404)
      }

      res.status(200).json({
        success: true,
        data: category,
      })
    } catch (error) {
      next(error)
    }
  }

  // Update category
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const validated = updateCategorySchema.parse(req.body)

      const category = await CategoryModel.findById(id)
      if (!category) {
        throw new AppError('Category not found', 404)
      }

      // Check if parent exists (if being updated)
      if (validated.parent) {
        const parentExists = await CategoryModel.findById(validated.parent)
        if (!parentExists) {
          throw new AppError('Parent category not found', 404)
        }
        // Prevent self-referencing
        if (validated.parent === id) {
          throw new AppError('Category cannot be its own parent', 400)
        }
      }

      Object.assign(category, validated)
      await category.save()

      res.status(200).json({
        success: true,
        data: category,
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete category (soft delete)
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const category = await CategoryModel.findById(id)

      if (!category) {
        throw new AppError('Category not found', 404)
      }

      // Check if category has products
      const ProductModel = require('../products/product.model').ProductModel
      const productCount = await ProductModel.countDocuments({ category: id })
      if (productCount > 0) {
        throw new AppError(
          `Cannot delete category with ${productCount} products. Archive it instead.`,
          400
        )
      }

      // Check if category has children
      const childrenCount = await CategoryModel.countDocuments({ parent: id })
      if (childrenCount > 0) {
        throw new AppError(
          `Cannot delete category with ${childrenCount} sub-categories. Archive it instead.`,
          400
        )
      }

      await category.deleteOne()

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  }
}