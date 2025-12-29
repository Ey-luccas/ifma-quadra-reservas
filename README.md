# IFMA Quadra Reservas

Sistema de agendamento de quadra poliesportiva para o IFMA.

## 🚀 Tecnologias

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + MySQL
- JWT Authentication
- Nodemailer (verificação de email)

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- React Router DOM
- Axios

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8+
- npm ou yarn

## 🔧 Instalação

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run dev
```

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL="mysql://user:password@localhost:3306/ifma_quadras"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3001
FRONTEND_URL="http://localhost:5173"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_app"
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3001"
```

## 🗄️ Banco de Dados

### Migrações

```bash
cd backend
npx prisma migrate dev
```

### Criar Admin

```bash
cd backend
npx tsx scripts/create-admin.ts
```

## 👥 Roles

- **STUDENT**: Alunos que fazem requisições de quadra
- **GUARD**: Vigias que visualizam a agenda
- **ADMIN**: Diretores que aprovam/rejeitam requisições

## 📱 Funcionalidades

- ✅ Cadastro de alunos com verificação de email
- ✅ Login com email ou username (vigias)
- ✅ Requisições de quadra por alunos
- ✅ Aprovação/rejeição de requisições (ADMIN)
- ✅ Agenda do vigia
- ✅ Cadastro de vigias pelo ADMIN
- ✅ Geração de links WhatsApp para confirmação

## 🚀 Deploy

### VPS Setup

1. Instale Node.js e MySQL
2. Clone o repositório
3. Configure as variáveis de ambiente
4. Execute as migrações do Prisma
5. Use PM2 ou systemd para manter os processos rodando

### PM2 (Recomendado)

```bash
# Backend
cd backend
pm2 start npm --name "backend" -- run dev

# Frontend (build)
cd frontend
npm run build
pm2 serve dist 5173 --name "frontend" --spa
```

## 📄 Licença

Desenvolvido por [Lualabs](https://lualabs.com.br)
