# 🚀 Guia de Deploy - Vercel + Neon + Clerk + Stripe

Este guia detalha o processo completo de deploy do Studio Santana AI na Vercel.

---

## 📋 Pré-requisitos

Antes de iniciar o deploy, você precisa ter contas em:

1. ✅ **Vercel** - https://vercel.com
2. ✅ **Neon** (PostgreSQL) - https://neon.tech
3. ✅ **Clerk** (Autenticação) - https://clerk.com
4. ✅ **Stripe** (Pagamentos) - https://stripe.com

---

## 🗃️ 1. Configurar Banco de Dados (Neon)

### Passo 1.1: Criar Projeto no Neon

1. Acesse: https://console.neon.tech
2. Clique em **"Create a project"**
3. Nome: `studio-santana-ai`
4. Região: **São Paulo (South America)** ou mais próximo
5. PostgreSQL Version: **16** (recomendado)

### Passo 1.2: Obter Connection String

1. No dashboard do projeto, clique em **"Connection Details"**
2. Copie a **"Connection string"**
3. Formato: `postgresql://username:password@host/database?sslmode=require`

### Passo 1.3: Testar Conexão Localmente

```bash
# Adicione ao .env.local
DATABASE_URL="postgresql://..."

# Execute
npx prisma generate
npx prisma db push
```

✅ **Sucesso**: Você verá as 18 tabelas criadas!

---

## 🔐 2. Configurar Autenticação (Clerk)

### Passo 2.1: Criar Aplicação

1. Acesse: https://dashboard.clerk.com
2. Clique em **"Add application"**
3. Nome: `Studio Santana AI`
4. Ative:
   - ✅ Email
   - ✅ Google (opcional)
   - ✅ Phone (opcional)

### Passo 2.2: Obter API Keys

1. No dashboard, vá em **"API Keys"**
2. Copie:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Passo 2.3: Configurar URLs

Em **"Paths"**, configure:
- Sign in: `/sign-in`
- Sign up: `/sign-up`
- User profile: `/dashboard/client/settings`
- After sign in: `/dashboard/client`

### Passo 2.4: Configurar Webhook (Opcional)

Para sincronizar usuários automaticamente:

1. Vá em **"Webhooks"**
2. Clique em **"Add Endpoint"**
3. URL: `https://seu-dominio.vercel.app/api/webhooks/clerk`
4. Events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

---

## 💳 3. Configurar Pagamentos (Stripe)

### Passo 3.1: Criar Conta e Ativar Modo Teste

1. Acesse: https://dashboard.stripe.com
2. Certifique-se de estar em **"Test mode"** (toggle no canto superior direito)

### Passo 3.2: Obter API Keys

1. Vá em **"Developers" → "API keys"**
2. Copie:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### Passo 3.3: Configurar Webhook

1. Vá em **"Developers" → "Webhooks"**
2. Clique em **"Add endpoint"**
3. URL: `https://seu-dominio.vercel.app/api/webhooks/stripe`
4. Events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o **"Signing secret"** → `STRIPE_WEBHOOK_SECRET`

### Passo 3.4: Configurar Métodos de Pagamento

1. Vá em **"Settings" → "Payment methods"**
2. Ative:
   - ✅ Cards (Visa, Mastercard, etc.)
   - ✅ Pix (no Brasil)
   - ✅ Boleto (opcional)

---

## 🚀 4. Deploy na Vercel

### Método 1: Via Dashboard (Recomendado)

#### Passo 4.1: Conectar Repositório

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Conecte seu GitHub/GitLab
4. Selecione o repositório `studio-santana-ai`

#### Passo 4.2: Configurar Projeto

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Passo 4.3: Adicionar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```env
# Database (Neon)
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App URL
NEXT_PUBLIC_URL=https://seu-dominio.vercel.app
```

#### Passo 4.4: Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. ✅ Deploy concluído!

### Método 2: Via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (primeira vez - configuração interativa)
vercel

# 4. Deploy em produção
vercel --prod

# 5. Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add CLERK_SECRET_KEY
# ... adicione todas as outras
```

---

## 🔧 5. Configurações Pós-Deploy

### 5.1: Atualizar URLs no Clerk

1. Volte ao dashboard do Clerk
2. Vá em **"Home URLs"**
3. Adicione seu domínio Vercel:
   - `https://seu-dominio.vercel.app`

### 5.2: Atualizar Webhook do Stripe

1. Volte ao dashboard do Stripe
2. Edite o webhook criado anteriormente
3. Atualize a URL para: `https://seu-dominio.vercel.app/api/webhooks/stripe`

### 5.3: Testar Webhook Localmente (Desenvolvimento)

```bash
# Instalar Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Linux: baixar de https://github.com/stripe/stripe-cli/releases

# Login
stripe login

# Forward webhooks para localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Você receberá um webhook secret
# Adicione ao .env.local: STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5.4: Configurar Domínio Customizado (Opcional)

1. No dashboard da Vercel, vá em **"Settings" → "Domains"**
2. Clique em **"Add"**
3. Digite seu domínio: `studiosantana.com.br`
4. Configure os DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Aguarde propagação (pode levar até 48h)

---

## 🧪 6. Testes Pós-Deploy

### 6.1: Testar Homepage

✅ Acesse: `https://seu-dominio.vercel.app`

Verifique:
- [ ] Página carrega corretamente
- [ ] Hero Section aparece
- [ ] AI Diagnostic funciona
- [ ] Formulário de contato envia

### 6.2: Testar Autenticação

✅ Acesse: `https://seu-dominio.vercel.app/sign-up`

Verifique:
- [ ] Formulário de cadastro aparece
- [ ] Consegue criar conta
- [ ] Recebe email de verificação
- [ ] Redireciona para dashboard

### 6.3: Testar Dashboard Admin

✅ Acesse: `https://seu-dominio.vercel.app/dashboard/admin`

Verifique:
- [ ] Exige autenticação
- [ ] Mostra estatísticas
- [ ] Lista de leads aparece
- [ ] Botão de aprovar funciona

### 6.4: Testar Pagamento (Modo Teste)

1. Crie um projeto de teste
2. Aprove-o no dashboard admin
3. Tente fazer o pagamento
4. Use cartão de teste do Stripe:
   ```
   Número: 4242 4242 4242 4242
   Data: 12/34
   CVC: 123
   CEP: 12345
   ```
5. Verifique:
   - [ ] Checkout do Stripe abre
   - [ ] Pagamento é processado
   - [ ] Webhook é recebido
   - [ ] Status do projeto muda para IN_PROGRESS
   - [ ] Comissão é calculada (se houver parceiro)

---

## 📊 7. Monitoramento

### Logs da Vercel

```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de uma função específica
vercel logs api/webhooks/stripe
```

### Analytics

1. Dashboard da Vercel → **"Analytics"**
2. Monitore:
   - Visitas à homepage
   - Conversões (sign-ups)
   - Tempo de resposta
   - Erros 500

### Stripe Dashboard

1. Acesse: https://dashboard.stripe.com
2. Monitore:
   - Pagamentos recebidos
   - Webhooks disparados
   - Falhas de pagamento

---

## 🐛 8. Troubleshooting

### Erro: "Database connection failed"

**Solução:**
1. Verifique se `DATABASE_URL` está correta na Vercel
2. Certifique-se de incluir `?sslmode=require` no final
3. Execute `npx prisma generate` localmente

### Erro: "Clerk keys invalid"

**Solução:**
1. Verifique se copiou as keys corretas (test mode)
2. Certifique-se de ter configurado as URLs no Clerk
3. Limpe o cache da Vercel: Settings → Data Cache → Purge

### Webhook do Stripe não funciona

**Solução:**
1. Verifique se a URL está correta (sem trailing slash)
2. Confirme que `STRIPE_WEBHOOK_SECRET` está correto
3. Teste localmente com `stripe listen`
4. Verifique logs da Vercel: `vercel logs api/webhooks/stripe`

### Build falha na Vercel

**Solução:**
1. Verifique se `DATABASE_URL` está nas env vars
2. Confirme que o comando de build está correto
3. Rode localmente: `npm run build`
4. Verifique logs: `vercel logs --follow`

---

## 🔄 9. Atualizações Futuras

### Deploy Automático

Após o setup inicial, cada push no GitHub dispara deploy automático:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy automático na Vercel! ✅
```

### Ambiente de Staging (Opcional)

```bash
# Criar branch de staging
git checkout -b staging

# Deploy de staging
vercel

# URL: https://studio-santana-ai-staging.vercel.app
```

---

## ✅ Checklist Final

Antes de ir para produção (modo real do Stripe):

- [ ] Todos os testes passam
- [ ] Domínio customizado configurado
- [ ] SSL ativo (Vercel faz automaticamente)
- [ ] Emails de notificação funcionando
- [ ] Contratos sendo gerados corretamente
- [ ] Comissões sendo calculadas
- [ ] Backup do banco configurado (Neon faz automaticamente)
- [ ] Monitoramento ativo
- [ ] Documentação atualizada
- [ ] Equipe treinada no uso do sistema

---

## 🎉 Produção

Quando estiver pronto para produção:

1. **Stripe**: Desative "Test mode"
2. **Stripe**: Reconfigure webhook com keys de produção
3. **Clerk**: Mude para plano pago (se necessário)
4. **Vercel**: Atualize env vars com keys de produção
5. **Neon**: Upgrade para plano pago (se necessário)

```bash
# Verificar todas as env vars de produção
vercel env ls

# Fazer deploy final
vercel --prod
```

---

## 📞 Suporte

- **Vercel**: https://vercel.com/support
- **Neon**: https://neon.tech/docs
- **Clerk**: https://clerk.com/support
- **Stripe**: https://support.stripe.com

---

**🚀 Pronto! Seu sistema está no ar e pronto para vender!**
