# Pendencias de Adaptacao do Modelo de Paginas

## Modelo base definido (ja aplicado)
- Home institucional com tom de autoridade e navegacao por objetivo.
- Separacao clara entre pagina institucional e funis de captacao.
- Pagina de parcerias B2B sem simulador mensal agressivo.

## Regras do modelo para replicar
- Home: foco em visao, valores, governanca, estrutura de equipes e orientacao de caminhos.
- Funis internos: foco em dores especificas, prova de capacidade, escopo e CTA unico por objetivo.
- Linguagem: direta, sem excesso de jargao tecnico; promessa com limites claros.
- Comercial: quando houver reuniao paga, destacar isencoes (cliente ativo e indicacao parceira).
- Parceiros: destacar comissao em faixa e regras; evitar simulacao sensacionalista.
- UX: manter responsivo mobile/tablet/desktop, CTA principal acima da dobra e formulario curto.
- Tema: preservar claro/escuro automatico + alternancia manual sem quebrar contraste.

## Pendencias por pagina (publicas)
- [x] app/education/page.tsx: reforcar papel institucional educacional e links para funis especificos.
- [x] app/education/pt/page.tsx: ajustar copy para trilha de projeto (escopo, MVP, reuniao inicial e proximos passos).
- [x] app/education/email/page.tsx: transformar em funil dedicado de e-mail/sustentacao com CTA unico.
- [x] app/education/traffic/page.tsx: alinhar promessa comercial e expectativa de reunioes de revisao.
- [x] app/education/en/page.tsx: sincronizar com modelo principal sem overpromise.
- [x] app/education/es/page.tsx: sincronizar com modelo principal sem overpromise.
- [x] app/indicacao-vip/page.tsx: revisar clareza da oferta indicada, termos de desconto e proximo passo.
- [x] app/criar-conta-parceiro/page.tsx: reforcar contexto B2B e expectativa do processo de aprovacao.
- [x] app/partners/kit-comercial/page.tsx: padronizar narrativa com nova pagina de parcerias.
- [x] app/sign-in/page.tsx: revisar copy de entrada para cada perfil (cliente, parceiro, admin).
- [x] app/sign-up/page.tsx: padronizar onboarding para evitar friccao inicial.

## Pendencias por area autenticada
- [x] app/dashboard/partner/page.tsx: alinhar texto de boas-vindas com o modelo de governanca e previsibilidade.
- [x] app/dashboard/partner/referrals/page.tsx: revisar comunicacao de desconto e limites de comissao.
- [x] app/dashboard/partner/settings/page.tsx: adicionar orientacoes de uso para configuracoes sensiveis.
- [x] app/dashboard/partner/commissions/page.tsx: padronizar labels e explicacoes de calculo.
- [x] app/dashboard/client/page.tsx: alinhar com narrativa de acompanhamento e maturidade operacional.
- [x] app/dashboard/client/settings/page.tsx: simplificar textos e alertas de configuracao.
- [x] app/dashboard/client/payments/page.tsx: padronizar transparencia de cobrancas.
- [x] app/admin/dashboard/page.tsx: harmonizar linguagem de governanca administrativa.
- [x] app/dashboard/admin/leads|contracts|projects|partners|payments|settings: rotas mantidas como redirecionamentos intencionais para /admin/dashboard.
- [x] app/loading.tsx + components/layout/AccountLauncher.tsx + formularios de dashboard: ajuste de microcopy e acessibilidade (status, aria-live, aria-expanded, navegacao por teclado).

## Pendencias tecnicas e de conteudo
- [x] Criar pagina de blog dedicada (rota publica) com estrutura de categorias e SEO basico.
- [ ] Definir matriz de CTA por origem de trafego (Google Ads, organico, parceiro).
- [ ] Revisar acentuacao e ortografia em todas as paginas publicas.
- [ ] Validar acessibilidade (contraste, foco visivel, labels de formulario, navegacao por teclado).
- [ ] Rodar revisao de performance de LCP e CLS nas paginas publicas prioritarias.

## Criterio de pronto por pagina
- [ ] Mensagem principal em uma frase clara.
- [ ] Um CTA principal e um CTA secundario bem definidos.
- [ ] Prova de confianca (cases, metodo ou indicadores) sem exagero.
- [ ] Versao mobile revisada manualmente.
- [ ] Ortografia e acentuacao revisadas.
