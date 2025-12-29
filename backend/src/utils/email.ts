import nodemailer from 'nodemailer';
import { env } from '../config/env';

/**
 * Configura o transporter do nodemailer
 * Usa variáveis de ambiente para configuração
 */
const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465, // true para 465, false para outras portas
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

/**
 * Envia email de verificação com código de 4 dígitos
 * @param email - Email do destinatário
 * @param code - Código de verificação de 4 dígitos
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: env.EMAIL_USER,
      to: email,
      subject: 'Código de Verificação - IFMA Quadra',
      text: `Seu código de verificação é: ${code}. Ele expira em 10 minutos.`,
    });
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    // Não lança erro para não expor detalhes do servidor
    // O sistema continuará funcionando mesmo se o email falhar
    throw new Error('Erro ao enviar email de verificação');
  }
}

