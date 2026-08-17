import { Router } from 'express'
import { ProductController } from './product.controller'

const router = Router()
const productController = new ProductController()

// Public routes
router.get('/', productController.getAll)
router.get('/:slug', productController.getBySlug)

// Admin routes (will add auth middleware later)
router.post('/', productController.create)
router.put('/:id', productController.update)
router.delete('/:id', productController.delete)
router.delete('/:id/permanent', productController.permanentDelete)

export const productRoutes: Router = router