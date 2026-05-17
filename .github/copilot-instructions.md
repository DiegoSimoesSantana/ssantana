# Copilot Instructions for Studio Santana AI Project

## Project Overview
This is a complete Next.js 14 application for a software engineering business with AI focus. It includes:
- Marketing funnel with lead capture
- AI diagnostic calculator
- Partner program with commission tracking
- Project management with digital contracts
- Payment processing
- Client/Partner/Admin dashboards

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL
- Clerk Authentication
- Stripe Payments
- Vercel Hosting

## Key Business Rules (from lib/business-rules.ts)

### Pricing
- Base rate: R$ 200/hour
- With source code: R$ 600/hour (3x multiplier)
- Simple projects: R$ 2,000 / 5 business days
- Consultation: R$ 100 (50% discount promo)

### Commissions
- 5% for projects up to R$ 5,000
- 10% for R$ 5,001 - R$ 15,000
- 15% for R$ 15,001 - R$ 30,000
- 20% for R$ 30,001 - R$ 50,000
- 25% for projects above R$ 50,000

### Cancellation Policy
- Not started: 30% retention + token costs
- Started: Deduct hours worked + tokens
- Maximum refund: 70% (if not started)

### Timelines
- Standard delivery: 5 business days
- Contract expiry: 30 days without signature
- Client acceptance: 7 days to review and accept

## Database Schema (Prisma)

Main models:
- User (CLIENT, PARTNER, ADMIN roles)
- Lead (captured leads with diagnostic data)
- Project (with status workflow)
- Contract (digital signature integration)
- Payment (installments tracking)
- Partner (commission tracking)
- Commission (payment rules)
- AIUsageLog (token tracking)
- ProjectAcceptance (client approval)

## Project Workflow

1. **Lead Capture**: Client fills form or uses AI calculator
2. **Analysis**: Admin reviews and approves
3. **Contract**: Generated and sent for digital signature
4. **Payment**: First installment triggers project start
5. **Development**: 5-day delivery with AI assistance
6. **Review**: Client has 7 days to accept or request changes
7. **Acceptance**: Final approval releases partner commissions

## File Organization

- `/app` - Next.js 14 App Router pages and API routes
- `/components` - React components (layout, marketing, dashboard, ui)
- `/lib` - Utilities, business rules, database client
- `/prisma` - Database schema and migrations
- `/public` - Static assets, robots.txt
- `/types` - TypeScript type definitions

## Development Guidelines

### API Routes
- Always validate with Zod schemas
- Use Prisma for database operations
- Return proper HTTP status codes
- Handle errors gracefully
- Log important operations

### Components
- Use 'use client' directive for interactive components
- Keep components focused and reusable
- Use Tailwind CSS for styling
- Follow accessibility best practices
- Implement proper loading and error states

### Business Logic
- Always import from `lib/business-rules.ts`
- Use helper functions for calculations
- Never hardcode prices or rates
- Validate against business rules
- Track AI token usage

### Database Operations
- Use Prisma client from `lib/db.ts`
- Always handle relations properly
- Use transactions for multi-step operations
- Index frequently queried fields
- Soft delete when appropriate

## Common Tasks

### Creating a New API Route
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ ... })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    // ... database operations
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 400 })
  }
}
```

### Creating a New Page
```typescript
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = { ... }

export default function Page() {
  return (
    <>
      <Header />
      <main>...</main>
      <Footer />
    </>
  )
}
```

### Commission Calculation
```typescript
import { calculateCommissionAmount, BUSINESS_RULES } from '@/lib/business-rules'

const projectValue = 10000
const commission = calculateCommissionAmount(projectValue) // Returns 1000 (10%)
```

## SEO Requirements

- All pages must have proper metadata
- Include JSON-LD structured data
- Generate sitemap dynamically
- Use proper heading hierarchy
- Optimize images with Next.js Image component
- Implement OpenGraph tags

## Testing Checklist

- [ ] Lead form submission works
- [ ] AI calculator shows correct results
- [ ] Commission calculator is accurate
- [ ] All business rules are enforced
- [ ] Prisma migrations run successfully
- [ ] API routes return proper responses
- [ ] Authentication flow works
- [ ] Mobile responsive design
- [ ] SEO metadata present
- [ ] Accessibility standards met

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy to production
5. Run database migrations: `npm run db:push`

## Support

For questions about this codebase:
- Check `/lib/business-rules.ts` for business logic
- Review Prisma schema for data structure
- See README.md for setup instructions
- Contact: contato@ssantana.com.br
