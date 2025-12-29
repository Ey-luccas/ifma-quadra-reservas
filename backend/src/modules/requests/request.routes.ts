import { Router } from 'express';
import { requestController } from './request.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

/**
 * Rotas de requisições de quadra
 */

// Rotas para alunos (STUDENT)
router.post(
  '/',
  authMiddleware,
  roleMiddleware([Role.STUDENT]),
  (req, res, next) => requestController.create(req, res, next)
);

router.get(
  '/my',
  authMiddleware,
  roleMiddleware([Role.STUDENT]),
  (req, res, next) => requestController.getMyRequests(req, res, next)
);

// Rotas para administradores (ADMIN)
const adminRouter = Router();
adminRouter.get(
  '/requests',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  (req, res, next) => requestController.getAllRequests(req, res, next)
);

adminRouter.patch(
  '/requests/:id/status',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  (req, res, next) => requestController.updateRequestStatus(req, res, next)
);

// Rotas para vigias (GUARD)
const guardRouter = Router();
guardRouter.get(
  '/agenda',
  authMiddleware,
  roleMiddleware([Role.GUARD]),
  (req, res, next) => requestController.getGuardAgenda(req, res, next)
);

export { router as requestRouter, adminRouter, guardRouter };

