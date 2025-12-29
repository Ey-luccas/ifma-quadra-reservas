import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Configuração centralizada das variáveis de ambiente
 * Garante que todas as variáveis necessárias estejam definidas
 */
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  
  // Frontend URL (para CORS) - pode ser uma URL ou múltiplas separadas por vírgula
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Setup Key (para criar usuários admin/guard em desenvolvimento)
  SETUP_KEY: process.env.SETUP_KEY || '',
  
  // Email (para verificação de email)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
};

/**
 * Valida se todas as variáveis de ambiente obrigatórias estão definidas
 */
export function validateEnv(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing: string[] = [];

  for (const key of required) {
    if (!env[key as keyof typeof env]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}`
    );
  }
}

