/**
 * Script para criar usuário ADMIN
 * Execute: npx tsx scripts/create-admin.ts
 */
import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'franck.lima@ifma.edu.br';
  const password = 'IFMAquadra2025';
  const name = 'Franck Lima';

  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  Usuário já existe! Atualizando senha...');
      
      // Atualiza senha e garante que é ADMIN
      const passwordHash = await hashPassword(password);
      await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          role: Role.ADMIN,
          emailVerified: true, // Admin não precisa verificar email
        },
      });
      
      console.log('✓ Usuário ADMIN atualizado com sucesso!');
      console.log(`  Email: ${email}`);
      console.log(`  Senha: ${password}`);
    } else {
      // Cria novo usuário ADMIN
      const passwordHash = await hashPassword(password);
      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: Role.ADMIN,
          emailVerified: true, // Admin não precisa verificar email
        },
      });

      console.log('✓ Usuário ADMIN criado com sucesso!');
      console.log(`  ID: ${user.id}`);
      console.log(`  Nome: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Senha: ${password}`);
    }
  } catch (error) {
    console.error('❌ Erro ao criar/atualizar admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

