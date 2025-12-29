import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

/**
 * Rotas de autenticação
 */
router.post('/register', (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/verify-email', (req, res, next) =>
  authController.verifyEmail(req, res, next)
);

// Rota de desenvolvimento (criar admin)
router.post('/create-admin', (req, res, next) =>
  authController.createAdmin(req, res, next)
);

// NOTA: A criação de GUARD foi movida para POST /admin/guards
// Apenas ADMIN pode criar contas de GUARD

export default router;

