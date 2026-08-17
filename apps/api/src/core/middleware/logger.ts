import { Request, Response, NextFunction } from 'express'

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const { method, url } = req
    const { statusCode } = res
    console.log(`${method} ${url} ${statusCode} - ${duration}ms`)
  })
  
  next()
}