import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import mongoose from 'mongoose'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

// Helper to check if error is Mongoose duplicate key error
const isDuplicateKeyError = (err: any): boolean => {
  return err instanceof mongoose.mongo.MongoServerError && err.code === 11000
}

// Helper to check if error is Mongoose validation error
const isValidationError = (err: any): boolean => {
  return err instanceof mongoose.Error.ValidationError
}

export const errorHandler = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error caught:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    ...(err.errors && { errors: err.errors }),
    ...(err.code && { code: err.code }),
    ...(err.keyPattern && { keyPattern: err.keyPattern }),
  })

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    })
    return
  }

  // 2. Mongoose Duplicate Key Error
  if (isDuplicateKeyError(err)) {
    const field = Object.keys(err.keyPattern)[0]
    res.status(400).json({
      success: false,
      error: {
        message: `${field} already exists`,
        field: field,
      },
    })
    return
  }

  // 3. Mongoose Validation Error
  if (isValidationError(err)) {
    const errors = Object.values(err.errors).map((e: any) => e.message)
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: errors,
      },
    })
    return
  }

  // 4. Custom App Error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    })
    return
  }

  // 5. Unknown Error
  const statusCode = 500
  const message = err.message || 'Internal Server Error'
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}