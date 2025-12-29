import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * Payload do JWT contendo informações do usuário autenticado
 */
export interface JWTPayload {
  id: string;
  email: string;
  role: 'STUDENT' | 'GUARD' | 'ADMIN';
}

/**
 * Gera um token JWT para o usuário
 * @param payload Dados do usuário a serem incluídos no token
 * @returns Token JWT assinado
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d', // Token expira em 7 dias
  });
}

/**
 * Verifica e decodifica um token JWT
 * @param token Token JWT a ser verificado
 * @returns Payload decodificado ou null se inválido
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

