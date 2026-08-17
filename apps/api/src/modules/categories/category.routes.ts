import { Router } from 'express'
import { CategoryController } from './category.controller'

const router = Router()
const categoryController = new CategoryController()

// Public routes
router.get('/', categoryController.getAll)
router.get('/:slug', categoryController.getBySlug)

// Admin routes (will add auth middleware later)
router.post('/', categoryController.create)
router.put('/:id', categoryController.update)
router.delete('/:id', categoryController.delete)

export const categoryRoutes: Router = router