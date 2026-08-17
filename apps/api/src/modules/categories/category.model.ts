import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  parent?: ICategory['_id'] | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
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

// Indexes
CategorySchema.index({ slug: 1 })
CategorySchema.index({ parent: 1 })
CategorySchema.index({ isActive: 1 })

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema)