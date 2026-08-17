import { Request, Response, NextFunction } from 'express'
import { ProductModel } from './product.model'
import { ProductVariantModel } from './productVariant.model'
import { CategoryModel } from '../categories/category.model'
import { AppError } from '../../core/middleware/errorHandler'
import { z } from 'zod'

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string(),
  images: z.array(z.string().url()).min(1),
  variants: z.array(
    z.object({
      size: z.string(),
      color: z.string(),
      sku: z.string(),
      stock: z.number().int().min(0),
      price: z.number().positive().optional(),
    })
  ).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

const updateProductSchema = createProductSchema.partial()

export class ProductController {
  // Create product with variants
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validated = createProductSchema.parse(req.body)

      // Check category exists
      const category = await CategoryModel.findById(validated.category)
      if (!category) {
        throw new AppError('Category not found', 404)
      }

      // Check slug uniqueness
      const existing = await ProductModel.findOne({ slug: validated.slug })
      if (existing) {
        throw new AppError('Product with this slug already exists', 400)
      }

      // Create product
      const product = new ProductModel({
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        price: validated.price,
        category: validated.category,
        images: validated.images,
        isActive: validated.isActive,
        isFeatured: validated.isFeatured,
        tags: validated.tags,
      })

      // Create variants if provided
      if (validated.variants && validated.variants.length > 0) {
        const variantDocs = validated.variants.map((v) => ({
          ...v,
          product: product._id,
        }))
        const createdVariants = await ProductVariantModel.create(variantDocs)
        product.variants = createdVariants.map((v) => v._id)
      }

      await product.save()

      // Populate for response
      await product.populate('category', 'name slug')
      await product.populate('variants')

      res.status(201).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get all products with filters
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        minPrice,
        maxPrice,
        search,
        sort = '-createdAt',
        isActive = 'true',
      } = req.query

      const filter: any = {}

      // Active filter
      if (isActive === 'true') {
        filter.isActive = true
      } else if (isActive === 'false') {
        filter.isActive = false
      }

      // Category filter
      if (category) {
        filter.category = category
      }

      // Price range
      if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
      }

      // Search
      if (search && typeof search === 'string') {
        filter.$text = { $search: search }
      }

      const pageNum = Number(page)
      const limitNum = Number(limit)
      const skip = (pageNum - 1) * limitNum

      const [products, total] = await Promise.all([
        ProductModel.find(filter)
          .populate('category', 'name slug')
          .populate('variants')
          .sort(sort as string)
          .skip(skip)
          .limit(limitNum),
        ProductModel.countDocuments(filter),
      ])

      res.status(200).json({
        success: true,
        data: {
          products,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          },
        },
      })
    } catch (error) {
      next(error)
    }
  }

  // Get product by slug
  public getBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params

      const product = await ProductModel.findOne({ slug })
        .populate('category', 'name slug')
        .populate('variants')

      if (!product) {
        throw new AppError('Product not found', 404)
      }

      res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  // Update product
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const validated = updateProductSchema.parse(req.body)

      const product = await ProductModel.findById(id)
      if (!product) {
        throw new AppError('Product not found', 404)
      }

      // Check category exists if updating
      if (validated.category) {
        const category = await CategoryModel.findById(validated.category)
        if (!category) {
          throw new AppError('Category not found', 404)
        }
      }

      // Check slug uniqueness
      if (validated.slug && validated.slug !== product.slug) {
        const existing = await ProductModel.findOne({ slug: validated.slug })
        if (existing) {
          throw new AppError('Product with this slug already exists', 400)
        }
      }

      // Update variants if provided
      if (validated.variants) {
        // Remove existing variants
        await ProductVariantModel.deleteMany({ product: product._id })

        // Create new variants
        const variantDocs = validated.variants.map((v: any) => ({
          ...v,
          product: product._id,
        }))
        const createdVariants = await ProductVariantModel.create(variantDocs)
        product.variants = createdVariants.map((v) => v._id)
        delete validated.variants
      }

      Object.assign(product, validated)
      await product.save()

      await product.populate('category', 'name slug')
      await product.populate('variants')

      res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete product (soft delete)
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params

      const product = await ProductModel.findById(id)
      if (!product) {
        throw new AppError('Product not found', 404)
      }

      // Soft delete
      product.isActive = false
      await product.save()

      res.status(200).json({
        success: true,
        message: 'Product archived successfully',
      })
    } catch (error) {
      next(error)
    }
  }

  // Permanent delete (admin only)
  public permanentDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params

      const product = await ProductModel.findById(id)
      if (!product) {
        throw new AppError('Product not found', 404)
      }

      // Delete variants
      await ProductVariantModel.deleteMany({ product: product._id })

      // Delete product
      await product.deleteOne()

      res.status(200).json({
        success: true,
        message: 'Product permanently deleted',
      })
    } catch (error) {
      next(error)
    }
  }
}