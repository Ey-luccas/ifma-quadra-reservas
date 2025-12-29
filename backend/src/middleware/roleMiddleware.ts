import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

/**
 * Middleware de verificação de role
 * Verifica se o usuário autenticado possui uma das roles permitidas
 * @param allowedRoles Array de roles permitidas para acessar a rota
 */
export function roleMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: 'Usuário não autenticado',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({
        message: 'Acesso negado. Permissão insuficiente.',
      });
      return;
    }

    next();
  };
}

