# ⚡ Comandos Rápidos - Studio Santana AI

Guia de referência rápida para os comandos mais usados no projeto.

---

## 🚀 Setup Inicial

```bash
# Windows
npm run setup:win

# Mac/Linux
npm run setup:unix

# Ou manualmente
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🛠️ Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em: http://localhost:3000
```

### Prisma (Banco de Dados)

```bash
# Gerar Prisma Client (após mudar schema)
npx prisma generate

# Aplicar mudanças no banco
npx prisma db push

# Abrir Prisma Studio (visualizar dados)
npm run db:studio

# Reset do banco (⚠️ APAGA TUDO)
npx prisma db push --force-reset

# Popular banco com dados de teste
npm run db:seed
```

### Stripe (Pagamentos)

```bash
# Instalar Stripe CLI (Windows)
scoop install stripe

# Instalar Stripe CLI (Mac)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Testar webhooks localmente
npm run stripe:webhook
# ou
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Criar pagamento de teste
stripe payment_intents create --amount=10000 --currency=brl

# Ver logs de webhooks
stripe events list --limit 10
```

---

## 🏗️ Build e Deploy

```bash
# Build local (testar antes de fazer deploy)
npm run build

# Iniciar em modo produção
npm run start

# Verificar tipos TypeScript
npm run type-check

# Lint (verificar código)
npm run lint

# Deploy na Vercel (primeira vez)
vercel

# Deploy em produção
vercel --prod

# Ver logs da Vercel
vercel logs --follow

# Baixar env vars da Vercel
npm run vercel:env
```

---

## 🧪 Testes

```bash
# Testar API de leads
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@example.com","phone":"11999999999","serviceType":"consultoria"}'

# Testar geração de contrato
curl -X POST http://localhost:3000/api/contracts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"projectId":"PROJECT_ID"}'
```

### Webhooks Locais

```bash
# Stripe
stripe trigger payment_intent.succeeded

# Ver webhooks recebidos
stripe events list

# Reenviar webhook
stripe events resend evt_xxx
```

---

## 📊 Monitoramento

```bash
# Ver logs em tempo real (Vercel)
vercel logs --follow

# Ver logs de uma função específica
vercel logs api/webhooks/stripe

# Ver logs do Prisma
DEBUG=prisma:query npm run dev

# Análise de bundle
npm run build -- --profile
```

---

## 🗃️ Banco de Dados (Neon)

```bash
# Conectar via psql
psql $DATABASE_URL

# Ver tabelas
\dt

# Ver dados de uma tabela
SELECT * FROM "User" LIMIT 10;

# Contar registros
SELECT COUNT(*) FROM "Lead";

# Ver leads do mês
SELECT * FROM "Lead" 
WHERE "createdAt" >= date_trunc('month', CURRENT_DATE);

# Sair
\q
```

---

## 🔧 Utilitários

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Adicionar nova dependência
npm install nome-do-pacote

# Adicionar dependência de dev
npm install -D nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacete
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
npm run dev
```

### Erro: "Database connection failed"
```bash
# Verificar .env.local
cat .env.local | grep DATABASE_URL

# Testar conexão
npx prisma db pull
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 📦 Git

```bash
# Status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push origin main

# Ver histórico
git log --oneline

# Criar branch
git checkout -b feature/nome-da-feature

# Voltar para main
git checkout main

# Merge
git merge feature/nome-da-feature
```

---

## 🎨 VSCode

Atalhos úteis:

- `Ctrl + P` - Buscar arquivo
- `Ctrl + Shift + P` - Command Palette
- `Ctrl + ` ` - Toggle terminal
- `Ctrl + B` - Toggle sidebar
- `F2` - Renomear símbolo
- `Ctrl + Space` - Autocomplete
- `Alt + Shift + F` - Formatar documento

---

## 🌐 URLs Importantes

### Desenvolvimento
- **App**: http://localhost:3000
- **Admin**: http://localhost:3000/dashboard/admin
- **Cliente**: http://localhost:3000/dashboard/client
- **Parceiro**: http://localhost:3000/dashboard/partner
- **Prisma Studio**: http://localhost:5555

### Dashboards Externos
- **Vercel**: https://vercel.com/dashboard
- **Neon**: https://console.neon.tech
- **Clerk**: https://dashboard.clerk.com
- **Stripe**: https://dashboard.stripe.com

---

## 💡 Dicas

1. **Use o setup script**: Economiza tempo na configuração inicial
2. **Teste webhooks localmente**: Use `stripe listen` antes de fazer deploy
3. **Commit frequentemente**: Pequenos commits são mais fáceis de reverter
4. **Use Prisma Studio**: Visualize e edite dados facilmente
5. **Monitore logs**: Use `vercel logs --follow` em produção
6. **Sempre teste build local**: `npm run build` antes de fazer deploy

---

## 🆘 Ajuda

- **Docs Next.js**: https://nextjs.org/docs
- **Docs Prisma**: https://prisma.io/docs
- **Docs Clerk**: https://clerk.com/docs
- **Docs Stripe**: https://stripe.com/docs
- **Docs Vercel**: https://vercel.com/docs

---

**💡 Dica**: Adicione este arquivo aos favoritos do seu navegador para acesso rápido!
