import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Interface para erros padronizados da aplicação
 */
export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

/**
 * Middleware de tratamento de erros
 * Captura erros e retorna respostas JSON padronizadas
 */
export function errorMiddleware(
  err: AppError | Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Tratamento especial para erros do Zod (validação)
  if (err instanceof ZodError) {
    const errors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    res.status(400).json({
      message: 'Erro de validação',
      details: errors,
    });
    return;
  }

  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  const details = (err as AppError).details;

  // Log do erro no console (em produção, usar um logger adequado)
  console.error('Erro:', {
    message,
    statusCode,
    details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    message,
    ...(details && { details }),
  });
}

/**
 * Helper para criar erros padronizados
 */
export function createError(
  message: string,
  statusCode: number = 400,
  details?: any
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

