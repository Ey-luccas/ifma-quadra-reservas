import { createApp } from './app';
import { env, validateEnv } from './config/env';

/**
 * Inicializa o servidor Express
 */
async function startServer() {
  try {
    // Valida variáveis de ambiente
    validateEnv();

    // Cria a aplicação Express
    const app = createApp();

    // Inicia o servidor
    const port = env.PORT;
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend permitido: ${env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Inicia o servidor
startServer();

