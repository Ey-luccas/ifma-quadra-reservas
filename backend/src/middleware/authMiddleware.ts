import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

/**
 * Estende o tipo Request do Express para incluir informações do usuário autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware de autenticação
 * Valida o token JWT enviado no header Authorization: Bearer <token>
 * Injeta os dados do usuário em req.user
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Token de autenticação não fornecido',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        message: 'Token inválido ou expirado',
      });
      return;
    }

    // Injeta dados do usuário na requisição
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Erro ao validar token de autenticação',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}

