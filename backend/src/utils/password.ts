import bcrypt from 'bcrypt';

/**
 * Gera hash da senha usando bcrypt
 * @param password Senha em texto plano
 * @returns Hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compara senha em texto plano com hash
 * @param password Senha em texto plano
 * @param hash Hash da senha armazenado
 * @returns true se a senha corresponder, false caso contrário
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

