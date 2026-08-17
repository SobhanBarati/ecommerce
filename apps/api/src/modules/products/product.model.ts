import mongoose, { Schema, Document } from 'mongoose'
import { ICategory } from '../categories/category.model'
import { IProductVariant } from './productVariant.model'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  category: ICategory['_id']
  images: string[]
  variants: IProductVariant['_id'][]
  isActive: boolean
  isFeatured?: boolean
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: 'At least one image is required',
      },
    },
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        const result = ret.toObject ? ret.toObject() : ret
        result.id = result._id
        delete (result as any)._id
        delete (result as any).__v
        return ret
      },
    },
  }
)

// Compound indexes for search/filter
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ category: 1, price: 1 })
ProductSchema.index({ isActive: 1, isFeatured: 1 })

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema)