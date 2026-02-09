# 📊 ESTRUTURA DO FUNIL DE VENDAS

## Visão Geral do Funil

```
TOPO DO FUNIL (TOFU) - Awareness
├─ Tráfego Orgânico (SEO)
├─ Tráfego Pago (Google Ads, Meta Ads)
├─ Redes Sociais (LinkedIn, Instagram)
└─ Indicações de Parceiros

          ↓

HOMEPAGE - Primeira Impressão
├─ Hero Section (3 segundos para convencer)
├─ Calculadora de IA (Engajamento)
└─ Prova Social (Depoimentos)

          ↓

MEIO DO FUNIL (MOFU) - Consideração
├─ Serviços Detalhados
├─ Preços Transparentes
├─ Processo de 5 Dias
└─ Casos de Sucesso

          ↓

FUNDO DO FUNIL (BOFU) - Conversão
├─ Formulário de Contato
├─ Agendamento de Consultoria
└─ WhatsApp Direto

          ↓

PÓS-VENDA
├─ Dashboard do Cliente
├─ Acompanhamento do Projeto
├─ Programa de Indicação
└─ Upsell de Serviços
```

---

## 🎯 JORNADA DO CLIENTE

### Etapa 1: Descoberta (Homepage)

**Objetivo:** Capturar atenção em 3 segundos

**Elementos:**
1. **Hero com Proposta de Valor Clara**
   - Título: "Engenharia de Software com IA"
   - Subtítulo: "Entrega em 5 dias úteis"
   - CTA Principal: "Descobrir Potencial de IA"

2. **Value Props Visuais**
   - ✅ Entrega Rápida
   - ✅ Planejamento Preciso
   - ✅ Sem Enrolação

3. **Prova Social Imediata**
   - Logos de tecnologias
   - "Mais de X projetos entregues"

---

### Etapa 2: Engajamento (Calculadora de IA)

**Objetivo:** Qualificar o lead e mostrar valor

**Fluxo:**
```
1. Cliente preenche 3 perguntas rápidas
   ├─ Tipo de negócio
   ├─ Principal desafio
   └─ Orçamento aproximado

2. Sistema processa (front-end)

3. Mostra resultado personalizado:
   ├─ Solução recomendada
   ├─ Potencial de economia
   ├─ Tempo liberado
   ├─ Investimento estimado
   └─ Prazo de entrega

4. CTAs:
   ├─ "Quero Implementar"
   └─ "Falar no WhatsApp"
```

**Vantagens:**
- ✅ Lead qualificado (know orçamento)
- ✅ Expectativa alinhada
- ✅ Diagnóstico personalizado
- ✅ Sentimento de urgência

---

### Etapa 3: Educação (Serviços & Preços)

**Objetivo:** Transparência e confiança

**Seção de Serviços:**
- Cards visuais com ícones
- Preço médio visível
- Features principais
- CTA em cada card

**Seção de Preços:**
- 3 tiers claros:
  1. Consultoria (R$ 100)
  2. Projeto Simples (R$ 2.000)
  3. Projeto Completo (Sob consulta)
  
- ✅ Destaque no "Mais Popular"
- ✅ Comparação clara de features
- ✅ Sem surpresas

---

### Etapa 4: Confiança (Processo & Depoimentos)

**Objetivo:** Eliminar objeções

**Processo de 5 Dias:**
```
1. Descoberta        → 30-60min
2. Aprovação         → 24h
3. Contrato          → 1-2 dias
4. Desenvolvimento   → 5 dias úteis
5. Entrega & Revisão → 7 dias
6. Aceite Final      → Conclusão
```

**Depoimentos:**
- Carrossel com 3-5 casos
- Foco em resultados mensuráveis
- Avatar + Nome + Cargo + Empresa

---

### Etapa 5: Conversão (CTA Section)

**Objetivo:** Capturar o lead

**Formulário Otimizado:**
```
Campos Obrigatórios:
├─ Nome Completo
├─ E-mail
├─ Celular/WhatsApp
└─ Tipo de Serviço (dropdown)

Campos Opcionais:
└─ Mensagem
```

**CTAs Alternativos:**
- Botão primário: "Enviar Mensagem"
- Link secundário: "Falar pelo WhatsApp"
- Badge: "Resposta em até 24h"

---

## 🔄 FLUXO DE QUALIFICAÇÃO

### Lead Scoring Automático

```javascript
const calculateLeadScore = (lead) => {
  let score = 0
  
  // Orçamento indicado
  if (lead.budget > 5000) score += 30
  else if (lead.budget > 2000) score += 20
  else score += 10
  
  // Tipo de serviço
  if (lead.serviceType === 'system') score += 25
  else if (lead.serviceType === 'automation') score += 30
  else score += 15
  
  // Fonte
  if (lead.source === 'partner') score += 20
  else if (lead.source === 'direct') score += 15
  
  // Completude do formulário
  if (lead.company) score += 10
  if (lead.message && lead.message.length > 50) score += 10
  
  return score // 0-100
}
```

**Categorias:**
- 🔥 HOT (80-100): Ligar imediatamente
- 🌟 WARM (50-79): Responder em 1h
- ❄️ COLD (0-49): Email automático

---

## 📈 MÉTRICAS DO FUNIL

### KPIs Principais

**Topo do Funil:**
- Visitantes únicos/mês
- Taxa de rejeição
- Tempo médio na página

**Meio do Funil:**
- Interações com calculadora
- Scroll depth
- Downloads de materiais

**Fundo do Funil:**
- Leads capturados
- Taxa de conversão (visitante → lead)
- Custo por lead

**Pós-Conversão:**
- Taxa de aprovação (lead → projeto)
- Ticket médio
- LTV (Lifetime Value)

---

## 🎨 OTIMIZAÇÕES DE CONVERSÃO

### Testes A/B Sugeridos

1. **Hero Section:**
   - Variante A: "Engenharia de Software com IA"
   - Variante B: "Entrega seu Sistema em 5 Dias"

2. **CTA Principal:**
   - Variante A: "Descobrir Potencial de IA"
   - Variante B: "Ver Quanto Posso Economizar"

3. **Prova Social:**
   - Variante A: Logos de tecnologias
   - Variante B: "500+ projetos entregues"

4. **Preço da Consultoria:**
   - Variante A: Destacar desconto 50%
   - Variante B: Destacar valor final R$ 100

---

## 🚀 AUTOMAÇÕES DO FUNIL

### Email Sequences

**Sequência 1: Lead não qualificado**
```
Dia 0: Email de boas-vindas
Dia 2: Case de sucesso relevante
Dia 5: Oferta de consultoria gratuita
Dia 10: Último contato (urgência)
```

**Sequência 2: Lead qualificado (não respondeu)**
```
Hora 0: Confirmação de recebimento
Hora 1: SMS com WhatsApp
Hora 24: Follow-up por email
Dia 3: Ligação telefônica
```

**Sequência 3: Consultoria agendada**
```
Dia -1: Lembrete da reunião
Hora -2h: Lembrete final
Hora 0: Link da reunião
Hora +1: Follow-up + proposta
```

---

## 📱 PONTOS DE CONTATO

### Canais de Conversão

**Primários:**
1. Formulário da homepage
2. Calculadora de IA
3. WhatsApp (botão flutuante)

**Secundários:**
4. Chat bot (futuro)
5. LinkedIn InMail
6. Email marketing

**Parceiros:**
7. Link único de indicação
8. Dashboard de parceiros

---

## 🎯 PROGRAMA DE PARCEIROS NO FUNIL

### Jornada do Parceiro

```
1. Cadastro no programa
   └─ Recebe link único

2. Compartilha link
   └─ Cliente clica

3. Cliente preenche formulário
   └─ Sistema detecta partnerId

4. Lead vira projeto
   └─ Parceiro vê no dashboard

5. Projeto é pago
   └─ Comissão calculada

6. Projeto finalizado e aceito
   └─ Comissão liberada
```

### Incentivos para Indicação

**Gamificação:**
- 🥉 Bronze: 0-5 indicações → 5%
- 🥈 Prata: 6-15 indicações → 10%
- 🥇 Ouro: 16-30 indicações → 15%
- 💎 Diamante: 31+ indicações → 20%

**Bônus Especiais:**
- Primeira indicação: +R$ 100
- Indicação acima de R$ 10k: +5%
- Indicação fechada em 7 dias: +R$ 50

---

## 📊 DASHBOARD DE CONVERSÃO (Admin)

### Visão do Funil em Tempo Real

```
HOJE:
├─ 234 visitantes
├─ 45 interações com calculadora (19%)
├─ 12 leads capturados (5%)
├─ 3 projetos aprovados (25%)
└─ R$ 8.500 em vendas

ESTE MÊS:
├─ 3.450 visitantes
├─ 678 leads (19.6%)
├─ 89 projetos (13%)
└─ R$ 178.000 em vendas
```

### Alertas Automáticos

- 🔔 Lead HOT capturado
- 🔔 Projeto prestes a expirar
- 🔔 Pagamento confirmado
- 🔔 Cliente solicitou revisão
- 🔔 Parceiro atingiu nova tier

---

**Use este guia para otimizar cada etapa do funil e maximizar conversões!**
