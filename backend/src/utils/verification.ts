/**
 * Utilitário para geração de código de verificação
 * Gera um código numérico de 4 dígitos
 */
export function generateVerificationCode(): string {
  // Gera número aleatório entre 1000 e 9999
  const code = Math.floor(1000 + Math.random() * 9000);
  return code.toString();
}

