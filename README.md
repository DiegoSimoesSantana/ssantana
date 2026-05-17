# Studio Santana AI - Plataforma Completa de Vendas e Gestão

> Sistema completo de vendas automatizado com funil de marketing, gestão de projetos, contratos digitais, pagamentos e programa de parceiros.

## 🚀 Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados:** Neon (PostgreSQL Serverless)
- **ORM:** Prisma
- **Autenticação:** Clerk
- **Pagamentos:** Stripe / Mercado Pago
- **Assinatura Digital:** ZapSign / Clicksign
- **Email:** Resend
- **Deploy:** Vercel

## 📋 Funcionalidades Principais

### Marketing & Vendas
- ✅ Homepage com funil completo de vendas
- ✅ Calculadora interativa de potencial de IA
- ✅ Formulário de captura de leads
- ✅ SEO otimizado com JSON-LD
- ✅ Sitemap e robots.txt

### Gestão de Projetos
- ✅ Sistema de análise e aprovação
- ✅ Contratos online com assinatura digital
- ✅ Gestão de pagamentos e parcelas
- ✅ Acompanhamento de prazos de entrega
- ✅ Sistema de aceite do cliente
- ✅ Tracking de custos de IA (tokens)

### Programa de Parceiros
- ✅ Dashboard exclusivo para parceiros
- ✅ Sistema de comissões (5% a 25%)
- ✅ Calculadora de comissões
- ✅ Pagamento recorrente ou integral
- ✅ Rastreamento de indicações

### Regras de Negócio
- ⚙️ R$ 200/hora base | R$ 600/hora com código fonte
- ⚙️ Projetos simples: R$ 2.000 / 5 dias úteis
- ⚙️ Consultoria: R$ 100 (promoção 50% OFF)
- ⚙️ Cancelamento: 30% retenção + custos de tokens
- ⚙️ Aceite do cliente: 7 dias após entrega
- ⚙️ Contrato expira em 30 dias sem assinatura

## 🛠️ Setup do Projeto

### 1. Instalar Dependências

\`\`\`bash
cd studio-santana-ai
npm install
\`\`\`

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Configurar Banco de Dados Neon

1. Acesse [neon.tech](https://neon.tech) e crie um projeto
2. Copie a connection string para `.env.local`:

\`\`\`env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
\`\`\`

3. Execute as migrações:

\`\`\`bash
npm run db:push
npm run db:generate
\`\`\`

### 4. Configurar Autenticação (Clerk)

1. Acesse [clerk.com](https://clerk.com) e crie uma aplicação
2. Copie as chaves para `.env.local`:

\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"
\`\`\`

### 5. Configurar Pagamentos (Stripe)

1. Acesse [stripe.com](https://stripe.com)
2. Copie as chaves de API:

\`\`\`env
STRIPE_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
\`\`\`

### 6. Rodar o Projeto

\`\`\`bash
npm run dev
\`\`\`

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

\`\`\`
studio-santana-ai/
├── app/
│   ├── (marketing)/         # Páginas públicas
│   │   ├── page.tsx         # Homepage com funil
│   │   ├── partners/        # Programa de parceiros
│   │   └── ...
│   ├── dashboard/           # Área logada
│   │   ├── client/          # Dashboard do cliente
│   │   ├── partner/         # Dashboard do parceiro
│   │   └── admin/           # Painel administrativo
│   ├── api/                 # API Routes
│   │   ├── leads/           # Gestão de leads
│   │   ├── contracts/       # Contratos
│   │   ├── payments/        # Pagamentos
│   │   └── webhooks/        # Webhooks externos
│   ├── layout.tsx           # Layout raiz com SEO
│   └── globals.css          # Estilos globais
├── components/
│   ├── layout/              # Header, Footer
│   ├── marketing/           # Componentes do funil
│   │   ├── HeroSection.tsx
│   │   ├── AIDiagnostic.tsx
│   │   ├── ServicesShowcase.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTASection.tsx
│   ├── dashboard/           # Componentes de dashboard
│   └── ui/                  # Componentes reutilizáveis
├── lib/
│   ├── business-rules.ts    # Regras de negócio centralizadas
│   ├── db.ts                # Cliente Prisma
│   └── utils.ts             # Funções utilitárias
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── public/
│   └── robots.txt           # Robots.txt
└── types/
    └── index.ts             # Tipos TypeScript

\`\`\`

## 🗄️ Banco de Dados

### Modelos Principais

- **User:** Usuários (Cliente, Parceiro, Admin)
- **Lead:** Leads capturadas
- **Project:** Projetos em desenvolvimento
- **Contract:** Contratos com assinatura digital
- **Payment:** Pagamentos e parcelas
- **Partner:** Perfil de parceiros
- **Commission:** Comissões de parceiros
- **Referral:** Indicações de parceiros
- **AIUsageLog:** Registro de uso de tokens de IA
- **ProjectAcceptance:** Aceite formal do cliente

### Migrations

\`\`\`bash
# Aplicar schema ao banco
npm run db:push

# Gerar cliente Prisma
npm run db:generate

# Abrir Prisma Studio
npm run db:studio
\`\`\`

## 🚢 Deploy na Vercel

### 1. Conectar Repositório

\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### 2. Configurar Variáveis de Ambiente

No dashboard da Vercel, adicione todas as variáveis do `.env.local`:

- DATABASE_URL
- CLERK_SECRET_KEY
- STRIPE_SECRET_KEY
- RESEND_API_KEY
- etc.

### 3. Configurar Domínio

1. Adicione domínio personalizado na Vercel
2. Configure DNS:

\`\`\`
Type: CNAME
Name: @
Value: cname.vercel-dns.com
\`\`\`

## 📊 Regras de Negócio

### Precificação

| Item | Valor |
|------|-------|
| Hora Base | R$ 200/hora |
| Hora com Código Fonte | R$ 600/hora (3x) |
| Consultoria (normal) | R$ 200 |
| Consultoria (promoção) | R$ 100 (50% OFF) |
| Projeto Simples | R$ 2.000 / 5 dias |

### Comissões de Parceiros

| Valor do Projeto | Comissão |
|------------------|----------|
| Até R$ 5.000 | 5% |
| R$ 5.001 - R$ 15.000 | 10% |
| R$ 15.001 - R$ 30.000 | 15% |
| R$ 30.001 - R$ 50.000 | 20% |
| Acima de R$ 50.000 | 25% |

### Cancelamento

- **Não iniciado:** Retenção de 30% + custos de tokens
- **Iniciado:** Desconto de horas trabalhadas + tokens
- **Devolução máxima:** 70% (se não iniciado)

## 🔐 Segurança

- ✅ Autenticação via Clerk (SSO, 2FA)
- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs
- ✅ Rate limiting em APIs
- ✅ CORS configurado
- ✅ Webhooks verificados por assinatura

## 📝 Roadmap

### Fase 1 - MVP (Concluído)
- [x] Setup do projeto
- [x] Schema do banco de dados
- [x] Homepage com funil completo
- [x] Calculadora de IA
- [x] Formulário de leads
- [x] Programa de parceiros

### Fase 2 - Dashboard
- [ ] Dashboard do cliente
- [ ] Dashboard do parceiro
- [ ] Dashboard do admin
- [ ] Sistema de mensagens

### Fase 3 - Automação
- [ ] Geração de contratos
- [ ] Integração ZapSign
- [ ] Webhooks de pagamento
- [ ] Notificações por email
- [ ] Notificações por WhatsApp

### Fase 4 - Analytics
- [ ] Dashboard de métricas
- [ ] Relatórios financeiros
- [ ] Tracking de conversões
- [ ] Analytics de parceiros

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário da Studio Santana. Todos os direitos reservados.

## 📞 Contato

- **Site:** [studio-santana.vercel.app](https://studio-santana.vercel.app)
- **Email:** contato@ssantana.com.br
- **WhatsApp:** (71) 98806-8222
- **Localização:** Salvador, Bahia - Brasil

---

Desenvolvido com ❤️ e ☕ pela Studio Santana
