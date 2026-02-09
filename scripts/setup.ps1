# Setup do Studio Santana AI - Windows PowerShell
Write-Host "🚀 Setup do Studio Santana AI" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "[1/8] Verificando Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "⚠ Node.js não encontrado. Instale: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 2. Instalar dependências
Write-Host "[2/8] Instalando dependências..." -ForegroundColor Blue
npm install
Write-Host "✓ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# 3. Verificar .env.local
Write-Host "[3/8] Verificando variáveis de ambiente..." -ForegroundColor Blue
if (!(Test-Path .env.local)) {
    Write-Host "⚠ Arquivo .env.local não encontrado" -ForegroundColor Yellow
    Write-Host "Copiando .env.example para .env.local..."
    Copy-Item .env.example .env.local
    Write-Host "✓ Arquivo .env.local criado" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ ATENÇÃO: Configure as variáveis em .env.local antes de continuar!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Você precisa configurar:"
    Write-Host "  • DATABASE_URL (Neon PostgreSQL)"
    Write-Host "  • CLERK_SECRET_KEY e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    Write-Host "  • STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    Write-Host ""
    Read-Host "Pressione ENTER depois de configurar o .env.local..."
} else {
    Write-Host "✓ Arquivo .env.local encontrado" -ForegroundColor Green
}
Write-Host ""

# 4. Verificar DATABASE_URL
Write-Host "[4/8] Verificando conexão com banco de dados..." -ForegroundColor Blue
$envContent = Get-Content .env.local -Raw
if ($envContent -match "your-database-url-here") {
    Write-Host "⚠ DATABASE_URL não configurada!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para obter o DATABASE_URL do Neon:"
    Write-Host "  1. Acesse: https://console.neon.tech"
    Write-Host "  2. Crie um projeto (ou use existente)"
    Write-Host "  3. Copie a Connection String"
    Write-Host "  4. Cole em .env.local na variável DATABASE_URL"
    Write-Host ""
    Read-Host "Pressione ENTER depois de configurar..."
}
Write-Host ""

# 5. Gerar Prisma Client
Write-Host "[5/8] Gerando Prisma Client..." -ForegroundColor Blue
npx prisma generate
Write-Host "✓ Prisma Client gerado" -ForegroundColor Green
Write-Host ""

# 6. Criar tabelas no banco
Write-Host "[6/8] Criando tabelas no banco de dados..." -ForegroundColor Blue
Write-Host "⚠ Isso vai criar/atualizar as tabelas no seu banco Neon" -ForegroundColor Yellow
$response = Read-Host "Continuar? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    npx prisma db push
    Write-Host "✓ Tabelas criadas" -ForegroundColor Green
} else {
    Write-Host "⚠ Pulado. Execute 'npm run db:push' manualmente depois" -ForegroundColor Yellow
}
Write-Host ""

# 7. Verificar Clerk
Write-Host "[7/8] Verificando Clerk..." -ForegroundColor Blue
if ($envContent -match "your-clerk-key-here") {
    Write-Host "⚠ Clerk não configurado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para configurar o Clerk:"
    Write-Host "  1. Acesse: https://dashboard.clerk.com"
    Write-Host "  2. Crie uma aplicação"
    Write-Host "  3. Copie as API Keys"
    Write-Host "  4. Cole em .env.local"
    Write-Host ""
} else {
    Write-Host "✓ Clerk configurado" -ForegroundColor Green
}
Write-Host ""

# 8. Verificar Stripe
Write-Host "[8/8] Verificando Stripe..." -ForegroundColor Blue
if ($envContent -match "your-stripe-key-here") {
    Write-Host "⚠ Stripe não configurado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para configurar o Stripe:"
    Write-Host "  1. Acesse: https://dashboard.stripe.com"
    Write-Host "  2. Ative o modo de teste"
    Write-Host "  3. Copie as API Keys de teste"
    Write-Host "  4. Cole em .env.local"
    Write-Host ""
} else {
    Write-Host "✓ Stripe configurado" -ForegroundColor Green
}
Write-Host ""

# Resumo final
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Iniciar servidor de desenvolvimento:"
Write-Host "     npm run dev" -ForegroundColor Blue
Write-Host ""
Write-Host "  2. Acessar a aplicação:"
Write-Host "     http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "  3. Testar dashboards:"
Write-Host "     • Admin:    http://localhost:3000/dashboard/admin"
Write-Host "     • Cliente:  http://localhost:3000/dashboard/client"
Write-Host "     • Parceiro: http://localhost:3000/dashboard/partner"
Write-Host ""
Write-Host "  4. Configurar webhook do Stripe:"
Write-Host "     stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor Blue
Write-Host ""
Write-Host "  5. Deploy na Vercel:"
Write-Host "     vercel --prod" -ForegroundColor Blue
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentação:"
Write-Host "  • README.md - Visão geral do projeto"
Write-Host "  • PROXIMOS_PASSOS.md - Guia de desenvolvimento"
Write-Host "  • IMPLEMENTADO_AGORA.md - Features recém-implementadas"
Write-Host ""
Write-Host "🎉 Boa sorte com as vendas!" -ForegroundColor Green
