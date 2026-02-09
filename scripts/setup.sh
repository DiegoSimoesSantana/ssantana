#!/bin/bash

echo "🚀 Setup do Studio Santana AI"
echo "================================"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo -e "${BLUE}[1/8]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js não encontrado. Instale: https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION instalado"
echo ""

# 2. Instalar dependências
echo -e "${BLUE}[2/8]${NC} Instalando dependências..."
npm install
echo -e "${GREEN}✓${NC} Dependências instaladas"
echo ""

# 3. Verificar .env.local
echo -e "${BLUE}[3/8]${NC} Verificando variáveis de ambiente..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠ Arquivo .env.local não encontrado${NC}"
    echo "Copiando .env.example para .env.local..."
    cp .env.example .env.local
    echo -e "${GREEN}✓${NC} Arquivo .env.local criado"
    echo ""
    echo -e "${YELLOW}⚠ ATENÇÃO: Configure as variáveis em .env.local antes de continuar!${NC}"
    echo ""
    echo "Você precisa configurar:"
    echo "  • DATABASE_URL (Neon PostgreSQL)"
    echo "  • CLERK_SECRET_KEY e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    echo "  • STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo ""
    read -p "Pressione ENTER depois de configurar o .env.local..."
else
    echo -e "${GREEN}✓${NC} Arquivo .env.local encontrado"
fi
echo ""

# 4. Verificar DATABASE_URL
echo -e "${BLUE}[4/8]${NC} Verificando conexão com banco de dados..."
if grep -q "your-database-url-here" .env.local; then
    echo -e "${YELLOW}⚠ DATABASE_URL não configurada!${NC}"
    echo ""
    echo "Para obter o DATABASE_URL do Neon:"
    echo "  1. Acesse: https://console.neon.tech"
    echo "  2. Crie um projeto (ou use existente)"
    echo "  3. Copie a Connection String"
    echo "  4. Cole em .env.local na variável DATABASE_URL"
    echo ""
    read -p "Pressione ENTER depois de configurar..."
fi
echo ""

# 5. Gerar Prisma Client
echo -e "${BLUE}[5/8]${NC} Gerando Prisma Client..."
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client gerado"
echo ""

# 6. Criar tabelas no banco
echo -e "${BLUE}[6/8]${NC} Criando tabelas no banco de dados..."
echo -e "${YELLOW}⚠ Isso vai criar/atualizar as tabelas no seu banco Neon${NC}"
read -p "Continuar? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    npx prisma db push
    echo -e "${GREEN}✓${NC} Tabelas criadas"
else
    echo -e "${YELLOW}⚠ Pulado. Execute 'npm run db:push' manualmente depois${NC}"
fi
echo ""

# 7. Verificar Clerk
echo -e "${BLUE}[7/8]${NC} Verificando Clerk..."
if grep -q "your-clerk-key-here" .env.local; then
    echo -e "${YELLOW}⚠ Clerk não configurado!${NC}"
    echo ""
    echo "Para configurar o Clerk:"
    echo "  1. Acesse: https://dashboard.clerk.com"
    echo "  2. Crie uma aplicação"
    echo "  3. Copie as API Keys"
    echo "  4. Cole em .env.local"
    echo ""
else
    echo -e "${GREEN}✓${NC} Clerk configurado"
fi
echo ""

# 8. Verificar Stripe
echo -e "${BLUE}[8/8]${NC} Verificando Stripe..."
if grep -q "your-stripe-key-here" .env.local; then
    echo -e "${YELLOW}⚠ Stripe não configurado!${NC}"
    echo ""
    echo "Para configurar o Stripe:"
    echo "  1. Acesse: https://dashboard.stripe.com"
    echo "  2. Ative o modo de teste"
    echo "  3. Copie as API Keys de teste"
    echo "  4. Cole em .env.local"
    echo ""
else
    echo -e "${GREEN}✓${NC} Stripe configurado"
fi
echo ""

# Resumo final
echo "================================"
echo -e "${GREEN}✓ Setup concluído!${NC}"
echo ""
echo "Próximos passos:"
echo ""
echo "  1. Iniciar servidor de desenvolvimento:"
echo "     ${BLUE}npm run dev${NC}"
echo ""
echo "  2. Acessar a aplicação:"
echo "     ${BLUE}http://localhost:3000${NC}"
echo ""
echo "  3. Testar dashboards:"
echo "     • Admin:    http://localhost:3000/dashboard/admin"
echo "     • Cliente:  http://localhost:3000/dashboard/client"
echo "     • Parceiro: http://localhost:3000/dashboard/partner"
echo ""
echo "  4. Configurar webhook do Stripe:"
echo "     ${BLUE}stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
echo ""
echo "  5. Deploy na Vercel:"
echo "     ${BLUE}vercel --prod${NC}"
echo ""
echo "================================"
echo ""
echo "📚 Documentação:"
echo "  • README.md - Visão geral do projeto"
echo "  • PROXIMOS_PASSOS.md - Guia de desenvolvimento"
echo "  • IMPLEMENTADO_AGORA.md - Features recém-implementadas"
echo ""
echo "🎉 Boa sorte com as vendas!"
