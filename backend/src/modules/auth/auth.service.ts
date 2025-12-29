import { Role } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { toPublicUser } from '../users/user.model';
import { createError } from '../../middleware/errorMiddleware';
import { generateVerificationCode } from '../../utils/verification';
import { sendVerificationEmail } from '../../utils/email';
import {
  RegisterStudentInput,
  LoginInput,
  CreateAdminInput,
} from './auth.types';

/**
 * Serviço de autenticação
 * Contém toda a lógica de negócio relacionada a autenticação e usuários
 */
export class AuthService {
  /**
   * Registra um novo aluno (STUDENT)
   * Valida que o email seja do domínio @acad.ifma.edu.br
   * Gera código de verificação e envia por email
   * NÃO loga o aluno ainda - ele precisa verificar o email primeiro
   */
  async registerStudent(input: RegisterStudentInput) {
    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw createError('Email já cadastrado', 409);
    }

    // Gera hash da senha
    const passwordHash = await hashPassword(input.password);

    // Gera código de verificação de 4 dígitos
    const verificationCode = generateVerificationCode();

    // Calcula data de expiração (10 minutos a partir de agora)
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 10);

    // Cria o usuário com role STUDENT e código de verificação
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: Role.STUDENT,
        whatsapp: input.whatsapp,
        birthDate: new Date(input.birthDate),
        emailVerified: false, // Email ainda não verificado
        verificationCode,
        verificationExpires,
      },
    });

    // Envia email com código de verificação
    try {
      await sendVerificationEmail(input.email, verificationCode);
    } catch (error) {
      // Se falhar ao enviar email, remove o usuário criado
      await prisma.user.delete({ where: { id: user.id } });
      throw createError('Erro ao enviar email de verificação', 500);
    }

    // NÃO gera token - aluno precisa verificar email primeiro
    return {
      message: 'Cadastro iniciado. Verifique seu e-mail.',
    };
  }

  /**
   * Realiza login do usuário
   * Aceita email OU username
   * Verifica senha, retorna token JWT
   * Bloqueia login se email não foi verificado (apenas para STUDENT)
   */
  async login(input: LoginInput) {
    // Tenta buscar por email primeiro
    let user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    // Se não encontrar por email, tenta buscar por username
    if (!user) {
      user = await prisma.user.findUnique({
        where: { username: input.email },
      });
    }

    if (!user) {
      throw createError('Email/usuário ou senha inválidos', 401);
    }

    // Verifica senha
    const isValidPassword = await comparePassword(
      input.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw createError('Email/usuário ou senha inválidos', 401);
    }

    // Verifica se o email foi verificado (apenas para STUDENT)
    // ADMIN e GUARD não precisam verificar email
    if (user.role === Role.STUDENT && !user.emailVerified) {
      throw createError('Verifique seu e-mail antes de entrar.', 403);
    }

    // Gera token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: toPublicUser(user),
    };
  }

  /**
   * Verifica o código de verificação enviado por email
   * Ativa a conta do aluno após verificação bem-sucedida
   */
  async verifyEmail(email: string, code: string) {
    // Busca usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError('Usuário não encontrado', 404);
    }

    // Verifica se já está verificado
    if (user.emailVerified) {
      throw createError('Email já foi verificado', 400);
    }

    // Verifica se o código existe
    if (!user.verificationCode) {
      throw createError('Código de verificação não encontrado', 400);
    }

    // Verifica se o código bate
    if (user.verificationCode !== code) {
      throw createError('Código de verificação inválido', 400);
    }

    // Verifica se o código não expirou
    if (!user.verificationExpires) {
      throw createError('Código de verificação expirado', 400);
    }

    const now = new Date();
    if (user.verificationExpires < now) {
      throw createError('Código de verificação expirado', 400);
    }

    // Atualiza usuário: marca como verificado e limpa código
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    return {
      message: 'E-mail verificado com sucesso.',
    };
  }

  /**
   * Cria um usuário ADMIN (apenas para desenvolvimento)
   * Protegido por SETUP_KEY
   */
  async createAdmin(input: CreateAdminInput, setupKey: string) {
    // Verifica setup key
    if (input.setupKey !== setupKey) {
      throw createError('Setup key inválida', 403);
    }

    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw createError('Email já cadastrado', 409);
    }

    // Gera hash da senha
    const passwordHash = await hashPassword(input.password);

    // Cria o usuário com role ADMIN
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: Role.ADMIN,
      },
    });

    // Gera token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: toPublicUser(user),
    };
  }

  // NOTA: A criação de GUARD foi movida para o módulo guards
  // Use POST /admin/guards (apenas ADMIN pode criar guards)
}

export const authService = new AuthService();

