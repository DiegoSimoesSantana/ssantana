# 🎨 DESIGN SYSTEM - Studio Santana AI

## Cores

### Primárias
```css
primary-50:  #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9  /* COR PRINCIPAL */
primary-600: #0284c7  /* BOTÕES */
primary-700: #0369a1  /* HOVER */
primary-800: #075985
primary-900: #0c4a6e
```

### Secundárias (Roxo/Púrpura)
```css
secondary-50:  #faf5ff
secondary-100: #f3e8ff
secondary-200: #e9d5ff
secondary-300: #d8b4fe
secondary-400: #c084fc
secondary-500: #a855f7
secondary-600: #9333ea  /* ACCENT */
secondary-700: #7e22ce
secondary-800: #6b21a8
secondary-900: #581c87
```

### Status
```css
success: #10b981  (verde)
warning: #f59e0b  (laranja)
error:   #ef4444  (vermelho)
info:    #3b82f6  (azul)
```

---

## Tipografia

### Fontes
- **Body:** Inter (Google Fonts)
- **Headings:** Clash Display (opcional) ou Inter Bold

### Tamanhos
```css
/* Headings */
h1: text-5xl md:text-6xl (48-60px)
h2: text-4xl md:text-5xl (36-48px)
h3: text-2xl md:text-3xl (24-30px)
h4: text-xl (20px)

/* Body */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)
```

---

## Componentes

### Botões

#### Primary (CTA Principal)
```tsx
<button className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg hover:shadow-xl">
  Texto do Botão
</button>
```

#### Secondary
```tsx
<button className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold text-lg border-2 border-primary-600">
  Texto do Botão
</button>
```

#### Outline
```tsx
<button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-primary-600 hover:text-primary-600 transition">
  Texto do Botão
</button>
```

### Cards

```tsx
<div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
  {/* Conteúdo */}
</div>
```

### Inputs

```tsx
<input 
  type="text"
  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  placeholder="Placeholder"
/>
```

### Badges

#### Success
```tsx
<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
  Ativo
</span>
```

#### Warning
```tsx
<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
  Pendente
</span>
```

#### Info
```tsx
<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
  Em Análise
</span>
```

---

## Espaçamento

### Padding/Margin
```css
p-4:  1rem   (16px)
p-6:  1.5rem (24px)
p-8:  2rem   (32px)
p-12: 3rem   (48px)
p-20: 5rem   (80px) /* Seções */
```

### Gaps
```css
gap-4: 1rem   (16px)
gap-6: 1.5rem (24px)
gap-8: 2rem   (32px)
```

---

## Layouts

### Container
```tsx
<div className="container mx-auto max-w-6xl px-4">
  {/* Conteúdo */}
</div>
```

### Grid Responsivo
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

### Seção com Background
```tsx
<section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
  <div className="container mx-auto">
    {/* Conteúdo */}
  </div>
</section>
```

---

## Animações

### Fade In
```tsx
<div className="animate-fade-in">
  {/* Conteúdo */}
</div>
```

### Slide Up
```tsx
<div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
  {/* Conteúdo */}
</div>
```

### Hover Transform
```tsx
<div className="transform hover:scale-105 transition duration-300">
  {/* Conteúdo */}
</div>
```

---

## Ícones

Use **Lucide React** para todos os ícones:

```tsx
import { Check, X, AlertCircle, Info, TrendingUp } from 'lucide-react'

<Check size={20} className="text-green-500" />
```

### Ícones Comuns
- ✅ Check - Sucesso
- ❌ X - Erro/Fechar
- ⚠️ AlertCircle - Aviso
- ℹ️ Info - Informação
- 📈 TrendingUp - Crescimento
- 💰 DollarSign - Dinheiro
- 📱 Smartphone - Mobile
- 💻 Code - Desenvolvimento
- 🚀 Rocket - Lançamento
- ⚡ Zap - Velocidade

---

## Estados de Status (Projetos)

### Cores por Status
```tsx
const statusColors = {
  ANALYSIS: 'yellow',
  AWAITING_SIGNATURE: 'blue',
  AWAITING_PAYMENT: 'orange',
  IN_PROGRESS: 'green',
  REVIEW: 'purple',
  COMPLETED: 'green',
  CANCELLED: 'red'
}
```

### Badge de Status
```tsx
const getStatusBadge = (status: ProjectStatus) => {
  const colors = {
    ANALYSIS: 'bg-yellow-100 text-yellow-700',
    AWAITING_SIGNATURE: 'bg-blue-100 text-blue-700',
    AWAITING_PAYMENT: 'bg-orange-100 text-orange-700',
    IN_PROGRESS: 'bg-green-100 text-green-700',
    REVIEW: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }
  
  return (
    <span className={`${colors[status]} px-3 py-1 rounded-full text-sm font-semibold`}>
      {status}
    </span>
  )
}
```

---

## Responsividade

### Breakpoints
```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Exemplo
```tsx
<div className="
  text-center        /* Mobile */
  md:text-left       /* Tablet+ */
  lg:text-center     /* Desktop+ */
">
  {/* Conteúdo */}
</div>
```

---

## Acessibilidade

### Checklist
- [ ] Contraste de cores (WCAG AA)
- [ ] Labels em inputs
- [ ] Alt text em imagens
- [ ] Foco visível em elementos interativos
- [ ] Navegação por teclado
- [ ] ARIA labels quando necessário

### Exemplo de Input Acessível
```tsx
<div>
  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
    E-mail *
  </label>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-required="true"
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
  />
</div>
```

---

## Dark Mode (Futuro)

Prepare componentes para dark mode:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Conteúdo */}
</div>
```

---

## Imagens & Assets

### Otimização com Next.js Image
```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Studio Santana"
  width={200}
  height={60}
  priority
/>
```

### Placeholder para Imagens
```tsx
<div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
```

---

## Loading States

### Skeleton
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

### Spinner
```tsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
```

---

## Formulários

### Layout Padrão
```tsx
<form className="space-y-6">
  <div>
    <label className="block text-gray-700 font-semibold mb-2">
      Campo *
    </label>
    <input
      type="text"
      required
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
    />
  </div>
  
  <button
    type="submit"
    className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition font-semibold"
  >
    Enviar
  </button>
</form>
```

---

## Toasts/Notificações

Use **sonner**:

```tsx
import { toast } from 'sonner'

// Success
toast.success('Projeto criado com sucesso!')

// Error
toast.error('Erro ao criar projeto')

// Info
toast.info('Análise em andamento...')

// Custom
toast.custom(
  <div className="bg-white p-4 rounded-lg shadow-lg">
    Conteúdo personalizado
  </div>
)
```

---

## Shadows

```css
shadow-sm:   Sutil
shadow:      Padrão
shadow-lg:   Cards
shadow-xl:   Destaque
shadow-2xl:  Modal
```

---

**Mantenha a consistência!** Use sempre estes padrões em todos os novos componentes.
