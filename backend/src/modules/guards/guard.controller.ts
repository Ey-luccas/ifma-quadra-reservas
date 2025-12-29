import { Request, Response, NextFunction } from 'express';
import { guardService } from './guard.service';
import { createGuardSchema } from './guard.types';

/**
 * Controller de gerenciamento de guards (vigias)
 * Apenas ADMIN pode acessar estas rotas
 */
export class GuardController {
  /**
   * POST /admin/guards
   * Cria um novo guard (vigia)
   * Apenas ADMIN pode executar esta ação
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida body da requisição
      const validatedData = createGuardSchema.parse(req.body);

      // Chama serviço
      const guard = await guardService.createGuard(validatedData);

      res.status(201).json(guard);
    } catch (error) {
      next(error);
    }
  }
}

export const guardController = new GuardController();

