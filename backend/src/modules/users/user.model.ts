import { Role } from '@prisma/client';

/**
 * Tipo para dados públicos do usuário (retornados nas respostas)
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  whatsapp?: string | null;
  birthDate?: Date | null;
}

/**
 * Converte um usuário do Prisma para formato público (sem passwordHash)
 */
export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  whatsapp?: string | null;
  birthDate?: Date | null;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    whatsapp: user.whatsapp,
    birthDate: user.birthDate,
  };
}

