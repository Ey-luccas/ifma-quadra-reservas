import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import {
  registerStudentSchema,
  loginSchema,
  createAdminSchema,
  verifyEmailSchema,
} from './auth.types';
import { env } from '../../config/env';
import { createError } from '../../middleware/errorMiddleware';

/**
 * Controller de autenticação
 * Lida com as requisições HTTP relacionadas a autenticação
 */
export class AuthController {
  /**
   * POST /auth/register
   * Registra um novo aluno (STUDENT)
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida body da requisição
      const validatedData = registerStudentSchema.parse(req.body);

      // Chama serviço
      const result = await authService.registerStudent(validatedData);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Realiza login do usuário
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida body da requisição
      const validatedData = loginSchema.parse(req.body);

      // Chama serviço
      const result = await authService.login(validatedData);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/create-admin
   * Cria um usuário ADMIN (apenas para desenvolvimento)
   * Protegido por SETUP_KEY
   */
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida body da requisição
      const validatedData = createAdminSchema.parse(req.body);

      // Chama serviço com setup key
      const result = await authService.createAdmin(
        validatedData,
        env.SETUP_KEY
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/verify-email
   * Verifica o código de verificação enviado por email
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida body da requisição
      const validatedData = verifyEmailSchema.parse(req.body);

      // Chama serviço
      const result = await authService.verifyEmail(
        validatedData.email,
        validatedData.code
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // NOTA: A criação de GUARD foi movida para POST /admin/guards
  // Apenas ADMIN pode criar contas de GUARD
  // Esta função foi removida - use a rota protegida em /admin/guards
}

export const authController = new AuthController();

