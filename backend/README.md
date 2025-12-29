# Backend - Sistema de Agendamento de Quadra IFMA

Backend desenvolvido em Node.js + Express + TypeScript com Prisma e MySQL para gerenciamento de reservas de quadra escolar.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MySQL 8+ instalado e rodando
- npm ou yarn

## 🔧 Instalação

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure o arquivo `.env`:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL`: URL de conexão com MySQL
- `JWT_SECRET`: Chave secreta para assinar tokens JWT
- `PORT`: Porta do servidor (padrão: 3001)
- `FRONTEND_URL`: URL do frontend para CORS
- `SETUP_KEY`: Chave para criar usuários admin/guard em desenvolvimento

3. **Configure o banco de dados:**
```bash
# Gera o cliente Prisma
npx prisma generate

# Cria as tabelas no banco
npx prisma migrate dev
```

4. **Inicie o servidor:**
```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm run build
npm start
```

## 📚 Estrutura do Projeto

```
backend/
├── src/
│   ├── app.ts                 # Configuração do Express
│   ├── server.ts              # Inicialização do servidor
│   ├── config/
│   │   └── env.ts             # Variáveis de ambiente
│   ├── prisma/
│   │   └── client.ts          # Cliente Prisma
│   ├── modules/
│   │   ├── auth/              # Módulo de autenticação
│   │   ├── users/             # Modelos de usuário
│   │   └── requests/          # Módulo de requisições
│   ├── middleware/
│   │   ├── authMiddleware.ts  # Validação JWT
│   │   ├── roleMiddleware.ts  # Verificação de roles
│   │   └── errorMiddleware.ts # Tratamento de erros
│   └── utils/
│       ├── jwt.ts             # Funções JWT
│       ├── password.ts        # Hash de senhas
│       └── whatsappMessage.ts # Geração de mensagens
├── prisma/
│   └── schema.prisma          # Schema do banco
└── package.json
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

## 📡 Rotas da API

### Autenticação

- `POST /auth/register` - Registro de aluno (STUDENT)
- `POST /auth/login` - Login
- `POST /auth/create-admin` - Criar admin (desenvolvimento)
- `POST /auth/create-guard` - Criar vigia

### Requisições (Alunos)

- `POST /requests` - Criar requisição (STUDENT)
- `GET /requests/my` - Minhas requisições (STUDENT)

### Administração

- `GET /admin/requests` - Listar todas as requisições (ADMIN)
- `PATCH /admin/requests/:id/status` - Atualizar status (ADMIN)

### Vigia

- `GET /guard/agenda?date=YYYY-MM-DD` - Agenda do dia (GUARD)

## 👥 Roles (Papéis)

- **STUDENT**: Aluno - pode criar e ver suas próprias requisições
- **GUARD**: Vigia - pode ver agenda de requisições aprovadas
- **ADMIN**: Administrador - pode gerenciar todas as requisições

## 📝 Exemplos de Uso

### Registrar Aluno
```bash
POST /auth/register
{
  "name": "João Silva",
  "email": "joao.silva@acad.ifma.edu.br",
  "password": "senha123",
  "whatsapp": "98999999999",
  "birthDate": "2000-01-01"
}
```

### Criar Requisição
```bash
POST /requests
Authorization: Bearer <token>
{
  "date": "2025-03-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "optionalObservation": "Para treino de futebol"
}
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Inicia em produção
- `npm run prisma:generate` - Gera cliente Prisma
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:studio` - Abre Prisma Studio

## 📄 Licença

Este projeto é educacional.

