# Frontend - Sistema de Agendamento de Quadra IFMA

Frontend desenvolvido em React + Vite + TypeScript + Tailwind CSS para gerenciamento de reservas de quadra escolar.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Backend rodando em `/api` (proxy Nginx em produção) ou `http://localhost:3001` (desenvolvimento)
- npm ou yarn

## 🔧 Instalação

1. **Instale as dependências:**
```bash
npm install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📚 Estrutura do Projeto

```
frontend/
├── src/
│   ├── main.tsx              # Ponto de entrada
│   ├── App.tsx               # Componente raiz
│   ├── index.css             # Estilos globais e Tailwind
│   ├── config/
│   │   └── api.ts            # Configuração do Axios
│   ├── contexts/
│   │   └── AuthContext.tsx   # Contexto de autenticação
│   ├── hooks/
│   │   └── useAuth.ts        # Hook de autenticação
│   ├── components/
│   │   ├── Button.tsx        # Componente de botão
│   │   ├── Input.tsx         # Componente de input
│   │   ├── Card.tsx          # Componente de card
│   │   ├── Navbar.tsx        # Barra de navegação
│   │   ├── Toast.tsx         # Notificações
│   │   └── PrivateRoute.tsx  # Rota protegida
│   ├── pages/
│   │   ├── LoginPage.tsx           # Página de login
│   │   ├── StudentRegisterPage.tsx # Cadastro de aluno
│   │   ├── StudentRequestsPage.tsx # Requisições do aluno
│   │   ├── NewRequestPage.tsx      # Nova requisição
│   │   ├── AdminRequestsPage.tsx   # Painel do diretor
│   │   └── GuardAgendaPage.tsx     # Agenda do vigia
│   └── router/
│       └── Router.tsx        # Configuração de rotas
├── index.html
└── package.json
```

## 🎨 Design

- **Mobile-first**: Layout otimizado para dispositivos móveis
- **Largura máxima**: ~480px centralizado em telas grandes
- **Cores**: Tons suaves de azul (primary-600)
- **Tipografia**: Sistema de fontes do sistema
- **Componentes**: Simples e leves para performance

## 🔐 Autenticação

O sistema usa JWT armazenado no `localStorage`. O token é automaticamente incluído em todas as requisições autenticadas via interceptor do Axios.

### Fluxo de Autenticação

1. **Login**: Usuário faz login e recebe token + dados do usuário
2. **Armazenamento**: Token e user são salvos no `localStorage` e no `AuthContext`
3. **Requisições**: Token é enviado automaticamente no header `Authorization: Bearer <token>`
4. **Logout**: Remove token e user do `localStorage` e do contexto

## 📡 Rotas

### Públicas
- `/login` - Página de login
- `/register` - Cadastro de aluno

### Protegidas (Aluno)
- `/student/requests` - Lista de requisições do aluno
- `/student/requests/new` - Criar nova requisição

### Protegidas (Administrador)
- `/admin/requests` - Painel de gerenciamento de requisições

### Protegidas (Vigia)
- `/guard/agenda` - Agenda de reservas aprovadas

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa linter

## 📱 Funcionalidades

### Para Alunos
- Cadastro com validação de email institucional
- Login
- Visualizar suas requisições
- Criar nova requisição de quadra
- Ver status das requisições (Pendente, Aprovado, Rejeitado)

### Para Administradores
- Visualizar todas as requisições
- Filtrar por status e data
- Aprovar ou rejeitar requisições
- Adicionar observações
- Copiar mensagem de WhatsApp para envio manual

### Para Vigias
- Visualizar agenda do dia
- Ver reservas aprovadas com dados do aluno
- Filtrar por data

## 🎯 Boas Práticas Implementadas

- **Validação de formulários** no frontend
- **Feedback visual** com toasts
- **Estados de loading** nos botões
- **Tratamento de erros** padronizado
- **Rotas protegidas** por autenticação e role
- **Design responsivo** mobile-first
- **Performance** otimizada (sem libs pesadas)

## 🔗 Integração com Backend

O frontend consome a API usando `/api` como base URL (proxy Nginx em produção). Em desenvolvimento, pode ser configurado via `VITE_API_URL` em `src/config/api.ts`.

Todas as requisições autenticadas incluem automaticamente o header:
```
Authorization: Bearer <token>
```

Em caso de erro 401 (não autorizado), o usuário é redirecionado automaticamente para a página de login.

