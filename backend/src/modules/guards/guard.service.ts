import { Role } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/password';
import { toPublicUser } from '../users/user.model';
import { createError } from '../../middleware/errorMiddleware';
import { CreateGuardInput } from './guard.types';

/**
 * Serviço de gerenciamento de guards (vigias)
 * Apenas ADMIN pode criar guards
 */
export class GuardService {
  /**
   * Cria um novo guard (vigia)
   * Apenas ADMIN pode executar esta ação
   * Aceita email OU username (pelo menos um deve ser fornecido)
   */
  async createGuard(input: CreateGuardInput) {
    // Verifica se email ou username já estão cadastrados
    if (input.email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existingByEmail) {
        throw createError('Email já cadastrado', 409);
      }
    }

    if (input.username) {
      const existingByUsername = await prisma.user.findUnique({
        where: { username: input.username },
      });
      if (existingByUsername) {
        throw createError('Username já cadastrado', 409);
      }
    }

    // Gera hash da senha
    const passwordHash = await hashPassword(input.password);

    // Cria o usuário com role GUARD
    // Se não tiver email, usa um email placeholder (vigias podem usar só username)
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email || `vigia.${input.username}@ifma.local`, // Email placeholder se não fornecido
        username: input.username || null,
        passwordHash,
        role: Role.GUARD,
        whatsapp: input.whatsapp || null,
        emailVerified: true, // Guards não precisam verificar email
      },
    });

    // Retorna usuário sem passwordHash
    return toPublicUser(user);
  }
}

export const guardService = new GuardService();

