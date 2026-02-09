# 🎯 CHECKLIST DE DEPLOY - Studio Santana AI

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

---

## 📋 Pré-Deploy (Desenvolvimento Local)

### 1. Configuração Básica
- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] VSCode com extensões recomendadas
- [ ] Projeto clonado/criado

### 2. Variáveis de Ambiente (.env.local)
- [ ] `DATABASE_URL` configurada (Neon)
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` configurada
- [ ] `CLERK_SECRET_KEY` configurada
- [ ] `STRIPE_SECRET_KEY` configurada (test mode)
- [ ] `STRIPE_WEBHOOK_SECRET` configurada
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` configurada
- [ ] `NEXT_PUBLIC_URL` = `http://localhost:3000`

### 3. Banco de Dados
- [ ] Prisma Client gerado: `npx prisma generate`
- [ ] Tabelas criadas: `npx prisma db push`
- [ ] Prisma Studio abre: `npx prisma studio`
- [ ] 18 tabelas visíveis no Prisma Studio

### 4. Serviços Externos (Test Mode)
- [ ] Conta Neon criada e projeto ativo
- [ ] Conta Clerk criada e app configurada
- [ ] Conta Stripe criada em test mode
- [ ] Webhook Stripe configurado para localhost (opcional dev)

### 5. Testes Locais
- [ ] `npm run dev` inicia sem erros
- [ ] Homepage carrega: http://localhost:3000
- [ ] AI Diagnostic funciona
- [ ] Formulário de contato envia
- [ ] Sign Up funciona (Clerk)
- [ ] Dashboard admin carrega
- [ ] Dashboard cliente carrega
- [ ] Dashboard parceiro carrega

### 6. Build Local
- [ ] `npm run build` completa sem erros
- [ ] `npm run start` inicia em produção local
- [ ] `npm run type-check` não retorna erros
- [ ] `npm run lint` não retorna erros críticos

---

## 🚀 Deploy na Vercel

### 1. Preparação do Repositório
- [ ] Código commitado no Git
- [ ] `.env.local` no `.gitignore` (não fazer commit!)
- [ ] Push para GitHub/GitLab
- [ ] README.md atualizado

### 2. Criação do Projeto Vercel
- [ ] Conta Vercel criada
- [ ] Repositório conectado
- [ ] Framework detectado: Next.js
- [ ] Build Command: `prisma generate && next build`

### 3. Variáveis de Ambiente (Vercel)
- [ ] Todas as env vars adicionadas
- [ ] `NEXT_PUBLIC_URL` atualizada para domínio Vercel
- [ ] Variáveis aplicadas em "Production"
- [ ] Variáveis aplicadas em "Preview" (opcional)

### 4. Primeiro Deploy
- [ ] Deploy iniciado
- [ ] Build completa (2-5 minutos)
- [ ] Deploy bem-sucedido
- [ ] URL gerada: `https://seu-projeto.vercel.app`

### 5. Verificação Pós-Deploy
- [ ] Site carrega sem erros 500
- [ ] Homepage renderiza corretamente
- [ ] CSS/Tailwind aplicado
- [ ] Imagens carregam
- [ ] Links funcionam

---

## 🔧 Configuração de Serviços (Produção)

### Clerk
- [ ] Domínio Vercel adicionado em "Allowed Origins"
- [ ] URLs de redirecionamento atualizadas
- [ ] Sign In URL: `/sign-in`
- [ ] Sign Up URL: `/sign-up`
- [ ] After Sign In: `/dashboard/client`
- [ ] Testado: cadastro funciona na produção

### Stripe (Test Mode)
- [ ] Webhook criado para produção
- [ ] URL: `https://seu-dominio.vercel.app/api/webhooks/stripe`
- [ ] Events selecionados:
  - [ ] `checkout.session.completed`
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Webhook secret copiado
- [ ] `STRIPE_WEBHOOK_SECRET` atualizada na Vercel
- [ ] Testado: pagamento de teste funciona

### Neon (Database)
- [ ] Projeto ativo
- [ ] Connection pooling habilitado
- [ ] Backup automático configurado
- [ ] Tabelas criadas via Prisma

---

## 🧪 Testes em Produção

### Funcionalidades Básicas
- [ ] Homepage carrega
- [ ] Menu de navegação funciona
- [ ] Footer carrega
- [ ] SEO tags presentes (view-source)
- [ ] Sitemap acessível: `/sitemap.xml`
- [ ] Robots.txt acessível: `/robots.txt`

### Autenticação (Clerk)
- [ ] Sign Up funciona
- [ ] Email de verificação chega
- [ ] Sign In funciona
- [ ] Logout funciona
- [ ] Redirecionamento correto após login

### Dashboards
- [ ] Dashboard admin protegido (requer auth)
- [ ] Dashboard cliente acessível
- [ ] Dashboard parceiro acessível
- [ ] Dados carregam do banco
- [ ] Estatísticas aparecem

### Captura de Leads
- [ ] Formulário homepage envia
- [ ] Lead salvo no banco (verificar Prisma Studio)
- [ ] Notificação aparece no dashboard admin
- [ ] Email enviado (se configurado)

### Fluxo de Pagamento
- [ ] Criar projeto de teste
- [ ] Aprovar no dashboard admin
- [ ] Contrato gerado
- [ ] Link de pagamento funciona
- [ ] Checkout Stripe abre
- [ ] Pagamento com cartão teste:
  - Número: `4242 4242 4242 4242`
  - Data: qualquer futura
  - CVC: qualquer 3 dígitos
- [ ] Webhook recebido (ver logs Vercel)
- [ ] Status projeto atualizado para IN_PROGRESS
- [ ] Comissão calculada (se houver parceiro)

### Performance
- [ ] Lighthouse Score > 80
- [ ] Core Web Vitals verde
- [ ] Imagens otimizadas
- [ ] Tempo de carregamento < 3s

---

## 📊 Monitoramento

### Vercel
- [ ] Analytics habilitado
- [ ] Logs acessíveis: `vercel logs`
- [ ] Alertas configurados (opcional)

### Stripe
- [ ] Dashboard de test mode checado
- [ ] Webhooks mostrando sucesso
- [ ] Nenhum erro 500 nos webhooks

### Neon
- [ ] Uso do banco monitorado
- [ ] Queries lentas identificadas
- [ ] Backup funcionando

---

## 🔒 Segurança

- [ ] Env vars nunca commitadas
- [ ] API routes protegidas com auth
- [ ] Roles verificadas (Admin/Cliente/Parceiro)
- [ ] Webhook signatures validadas
- [ ] CORS configurado corretamente
- [ ] SQL Injection prevenido (Prisma)
- [ ] XSS prevenido (React escapa automaticamente)

---

## 📱 Responsividade

- [ ] Testado em desktop (1920px, 1366px)
- [ ] Testado em tablet (768px, 1024px)
- [ ] Testado em mobile (375px, 414px)
- [ ] Menu mobile funciona
- [ ] Sidebar dashboards responsiva
- [ ] Tabelas scrollam horizontalmente
- [ ] Formulários usáveis em mobile

---

## 🎨 Domínio Customizado (Opcional)

- [ ] Domínio comprado
- [ ] DNS configurado:
  - [ ] Registro A: `76.76.21.21`
  - [ ] Registro CNAME: `cname.vercel-dns.com`
- [ ] Domínio adicionado na Vercel
- [ ] SSL certificado emitido (automático)
- [ ] Redirecionamento www → domínio principal
- [ ] Clerk URLs atualizadas para novo domínio
- [ ] Stripe webhook atualizado para novo domínio

---

## 📧 Emails (Opcional - Resend)

- [ ] Conta Resend criada
- [ ] Domínio verificado
- [ ] `RESEND_API_KEY` configurada
- [ ] Templates de email criados
- [ ] Teste de envio funciona

---

## 🎉 Produção Real (Stripe Live Mode)

### ⚠️ ATENÇÃO: Só faça isso quando TUDO estiver testado!

- [ ] Todos os testes em test mode passaram
- [ ] Time treinado para usar o sistema
- [ ] Suporte ao cliente preparado
- [ ] Políticas de reembolso definidas
- [ ] Termos de serviço publicados

### Migração para Live Mode
- [ ] Stripe: desativar "Test mode"
- [ ] Stripe: obter novas API keys (live)
- [ ] Stripe: criar novo webhook (live)
- [ ] Vercel: atualizar env vars com keys live
- [ ] Clerk: upgrade plano (se necessário)
- [ ] Neon: upgrade plano (se necessário)
- [ ] Teste completo com pagamento real de R$1
- [ ] Reembolsar pagamento de teste
- [ ] Anunciar lançamento! 🚀

---

## ✅ Checklist Final Pré-Lançamento

- [ ] Backup do banco feito
- [ ] Documentação atualizada
- [ ] Equipe treinada
- [ ] Processo de suporte definido
- [ ] Monitoramento ativo
- [ ] Plano de contingência preparado
- [ ] Termos de Serviço publicados
- [ ] Política de Privacidade publicada
- [ ] LGPD compliance verificado
- [ ] Forma de contato clara no site

---

## 🆘 Troubleshooting Rápido

### Site não carrega
```bash
vercel logs --follow
# Verificar erros de build ou runtime
```

### Webhook não funciona
```bash
# Ver logs específicos do webhook
vercel logs api/webhooks/stripe

# Verificar no Stripe Dashboard → Webhooks → Event Logs
```

### Banco não conecta
```bash
# Verificar env var
vercel env ls

# Testar conexão local
npx prisma db pull
```

### Build falha
```bash
# Testar build local
npm run build

# Verificar logs da Vercel
```

---

## 📞 Contatos de Emergência

- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Neon Support**: https://neon.tech/docs
- **Clerk Support**: https://clerk.com/support

---

**✅ Quando todos os itens estiverem marcados, você está pronto para lançar!**

**🎉 Boa sorte com as vendas!**
