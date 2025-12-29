import { z } from 'zod';

/**
 * Schema de validação para registro de aluno (STUDENT)
 */
export const registerStudentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z
    .string()
    .email('Email inválido')
    .refine(
      (email) => email.endsWith('@acad.ifma.edu.br'),
      'Email deve ser do domínio @acad.ifma.edu.br'
    ),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  whatsapp: z.string().min(1, 'WhatsApp é obrigatório'),
  birthDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Data de nascimento inválida'
  ),
});

/**
 * Schema de validação para login
 * Aceita email OU username
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email ou usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

/**
 * Schema de validação para criação de admin (desenvolvimento)
 */
export const createAdminSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  setupKey: z.string().min(1, 'Setup key é obrigatória'),
});

/**
 * Schema de validação para verificação de email
 */
export const verifyEmailSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().length(4, 'Código deve ter 4 dígitos'),
});

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

