import { Router } from 'express';
import { guardController } from './guard.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

/**
 * Rotas de gerenciamento de guards (vigias)
 * Apenas ADMIN pode acessar estas rotas
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  (req, res, next) => guardController.create(req, res, next)
);

export default router;

