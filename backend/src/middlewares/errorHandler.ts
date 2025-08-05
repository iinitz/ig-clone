import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack) // Log the error stack for debugging

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    message,
    // In production, you might not want to send the stack trace
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
