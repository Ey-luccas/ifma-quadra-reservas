import { z } from 'zod';

/**
 * Schema de validação para criação de guard pelo ADMIN
 * Aceita email OU username (pelo menos um deve ser fornecido)
 */
export const createGuardSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  whatsapp: z.string().optional(),
}).refine(
  (data) => data.email || data.username,
  {
    message: 'Email ou username é obrigatório',
    path: ['email'],
  }
);

export type CreateGuardInput = z.infer<typeof createGuardSchema>;

