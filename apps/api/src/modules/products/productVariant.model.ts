import mongoose, { Schema, Document } from 'mongoose'

export interface IProductVariant extends Document {
  size: string
  color: string
  sku: string
  stock: number
  price?: number
  product: Schema.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    size: {
      type: String,
      required: [true, 'Size is required'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true, // Remove index: true - already unique
      trim: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Only add additional indexes
ProductVariantSchema.index({ product: 1, isActive: 1 })

export const ProductVariantModel = mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema)