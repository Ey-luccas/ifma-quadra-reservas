import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware } from './middleware/errorMiddleware';
import authRoutes from './modules/auth/auth.routes';
import { requestRouter, adminRouter, guardRouter } from './modules/requests/request.routes';
import guardRoutes from './modules/guards/guard.routes';

/**
 * Configura e retorna a aplicação Express
 */
export function createApp(): Express {
  const app = express();

  // Middleware para parsing JSON
  app.use(express.json());

  // CORS - permite apenas requisições do frontend configurado
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API está funcionando' });
  });

  // Rotas de autenticação
  app.use('/auth', authRoutes);

  // Rotas de requisições (alunos)
  app.use('/requests', requestRouter);

  // Rotas administrativas
  app.use('/admin', adminRouter);
  
  // Rotas de gerenciamento de guards (apenas ADMIN)
  app.use('/admin/guards', guardRoutes);

  // Rotas de vigia
  app.use('/guard', guardRouter);

  // Middleware de tratamento de erros (deve ser o último)
  app.use(errorMiddleware);

  return app;
}

