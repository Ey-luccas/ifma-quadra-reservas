# 🚀 Guia de Deploy - VPS

## Pré-requisitos na VPS

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL
sudo apt install -y mysql-server

# Instalar PM2 (gerenciador de processos)
sudo npm install -g pm2

# Instalar Nginx (opcional, para proxy reverso)
sudo apt install -y nginx
```

## 📦 Configuração do Projeto

### 1. Clonar repositório

```bash
cd /var/www
sudo git clone <seu-repositorio> ifma-quadra-reservas
sudo chown -R $USER:$USER ifma-quadra-reservas
cd ifma-quadra-reservas
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Copiar e configurar .env
cp .env.example .env
nano .env
```

**Configurar .env do backend:**
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/ifma_quadras"
JWT_SECRET="sua_chave_secreta_super_forte_aqui"
PORT=3001
FRONTEND_URL="https://seudominio.com.br"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_app"
```

### 3. Configurar Banco de Dados

```bash
# Criar banco de dados
mysql -u root -p
```

```sql
CREATE DATABASE ifma_quadras CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ifma_user'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON ifma_quadras.* TO 'ifma_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Executar migrações
cd backend
npx prisma generate
npx prisma migrate deploy

# Criar usuário ADMIN
npx tsx scripts/create-admin.ts
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install

# Copiar e configurar .env
cp .env.example .env
nano .env
```

**Configurar .env do frontend:**
```env
VITE_API_URL="https://api.seudominio.com.br"
# ou se backend e frontend estiverem no mesmo domínio:
# VITE_API_URL="https://seudominio.com.br/api"
```

```bash
# Build de produção
npm run build
```

## 🔄 Gerenciamento com PM2

### Iniciar Backend

```bash
cd /var/www/ifma-quadra-reservas/backend
pm2 start npm --name "ifma-backend" -- run dev
# ou para produção:
pm2 start npm --name "ifma-backend" -- start
```

### Iniciar Frontend (servir build)

```bash
cd /var/www/ifma-quadra-reservas/frontend
pm2 serve dist 5173 --name "ifma-frontend" --spa
```

### Comandos úteis PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs ifma-backend
pm2 logs ifma-frontend

# Reiniciar
pm2 restart ifma-backend
pm2 restart ifma-frontend

# Parar
pm2 stop ifma-backend
pm2 stop ifma-frontend

# Salvar configuração
pm2 save
pm2 startup  # Configurar para iniciar no boot
```

## 🌐 Configuração Nginx (Proxy Reverso)

### Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/ifma-quadra
```

```nginx
server {
    listen 80;
    server_name seudominio.com.br;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/ifma-quadra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL com Let's Encrypt (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br
```

## 🔒 Firewall

```bash
# Permitir portas necessárias
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📝 Atualização do Sistema

```bash
cd /var/www/ifma-quadra-reservas

# Atualizar código
git pull origin main

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
pm2 restart ifma-backend

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart ifma-frontend
```

## 🐛 Troubleshooting

### Ver logs do PM2
```bash
pm2 logs
```

### Ver logs do Nginx
```bash
sudo tail -f /var/log/nginx/error.log
```

### Verificar se portas estão abertas
```bash
sudo netstat -tulpn | grep -E '3001|5173'
```

### Reiniciar serviços
```bash
sudo systemctl restart nginx
pm2 restart all
```

## 📊 Monitoramento

```bash
# Status geral
pm2 monit

# Informações detalhadas
pm2 show ifma-backend
pm2 show ifma-frontend
```

