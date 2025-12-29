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

  // CORS - permite requisições do frontend configurado
  // Suporta múltiplas origens separadas por vírgula ou uma única origem
  const allowedOrigins = env.FRONTEND_URL.split(',').map((url) => url.trim());
  
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permite requisições sem origin (ex: Postman, mobile apps)
        if (!origin) {
          return callback(null, true);
        }
        
        // Verifica se a origem está na lista permitida
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        // Em produção, também aceita o domínio principal
        if (origin.includes('ifmaquadra.lualabs.com.br')) {
          return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Rota raiz - verificação de status da API
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      service: 'IFMA Quadra API',
      message: 'API rodando corretamente',
    });
  });

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

