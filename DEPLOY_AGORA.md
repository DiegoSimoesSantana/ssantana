# 🚀 DEPLOY NA VERCEL - PASSO A PASSO

## 📋 O que você precisa fazer:

### Opção 1: Deploy via CLI (Mais Rápido)

```powershell
# 1. Fazer login na Vercel
vercel login

# 2. Deploy (será perguntado algumas coisas)
vercel
```

**Quando perguntado:**
- "Set up and deploy "C:\Projetos\ssantana\studio-santana-ai"?" → **Y**
- "Which scope should contain your project?" → Selecione sua conta pessoal
- "Link to existing project?" → **N** (primeira vez)
- "What's your project's name?" → `studio-santana-ai`
- "In which directory is your code located?" → `.` (ponto)
- "Want to modify your vercel.json?" → **N** (já está configurado)

**Resultado:**
```
✅ Deployed to https://studio-santana-ai.vercel.app
```

---

### Opção 2: Deploy via Dashboard (Melhor Controle)

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Conecte seu GitHub
4. Encontre o repositório `studio-santana-ai`
5. Clique em **"Import"**
6. Configure as variáveis de ambiente
7. Clique em **"Deploy"**

---

## ⚙️ VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Você precisa adicionar na Vercel (após o deploy inicial):

### Via CLI:
```powershell
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_URL
```

### Via Dashboard:
1. Vá em **Settings** → **Environment Variables**
2. Adicione cada uma manualmente
3. Clique em **Save**

---

## 🎯 CREDENCIAIS QUE VOCÊ PRECISA

Se ainda não tem, crie agora:

### 1. Neon Database
- Acesse: https://console.neon.tech
- Crie um projeto
- Copie a Connection String
- Formato: `postgresql://user:password@host/db?sslmode=require`

### 2. Clerk
- Acesse: https://dashboard.clerk.com
- Crie uma aplicação
- Copie as API Keys

### 3. Stripe
- Acesse: https://dashboard.stripe.com
- Vá em **Developers** → **API Keys**
- Copie os test keys

### 4. Stripe Webhook
- Em **Developers** → **Webhooks**
- Clique em **Add endpoint**
- URL: `https://studio-santana-ai.vercel.app/api/webhooks/stripe`
- Events: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed
- Copie o signing secret

---

## ✅ CHECKLIST

- [ ] Vercel CLI instalada (`vercel --version`)
- [ ] Conectado ao Vercel (`vercel login`)
- [ ] Git init feito
- [ ] Commit inicial feito
- [ ] DATABASE_URL obtida do Neon
- [ ] Clerk keys obtidas
- [ ] Stripe keys obtidas
- [ ] Stripe webhook secret obtido

---

## 🚀 PRÓXIMO: Execute um destes comandos

**Mais rápido (recomendado):**
```powershell
vercel
```

**Ou completo com opções:**
```powershell
vercel --prod
```

---

## 📍 APÓS O DEPLOY

Você receberá uma URL tipo: `https://studio-santana-ai.vercel.app`

Acesse e veja seu site ao vivo! 🎉
