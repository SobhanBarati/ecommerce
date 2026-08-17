import express , { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
//import { env } from './core/config'
import { connectDatabase } from './core/database/mongodb'
import { loggerMiddleware } from './core/middleware/logger'
import { errorHandler } from './core/middleware/errorHandler'
import { healthRoutes } from './modules/health/health.routes'
import { categoryRoutes } from './modules/categories/category.routes'
import { productRoutes } from './modules/products/product.routes'

const app: Express = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(loggerMiddleware)

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

// Error handler
app.use(errorHandler)

// Database connection
connectDatabase()

export { app }