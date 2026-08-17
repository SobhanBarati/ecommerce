import { Request, Response } from 'express'

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

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'
  
  console.error(`❌ Error: ${message}`)
  console.error(err.stack)
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}