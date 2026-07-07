import { NextFunction, Request, Response } from 'express';

export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL';

const STATUS: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL: 500,
};

export class AppError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.status = STATUS[code];
  }
}

export const badRequest = (message: string) => new AppError('BAD_REQUEST', message);
export const notFound = (message: string) => new AppError('NOT_FOUND', message);

type Handler = (req: Request, res: Response, next: NextFunction) => unknown;

export function asyncHandler(handler: Handler): Handler {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found', code: 'NOT_FOUND' });
}

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, code: err.code });
    return;
  }
  const message = err instanceof Error ? err.message : 'Unexpected error';
  res.status(500).json({ error: message, code: 'INTERNAL' });
}
