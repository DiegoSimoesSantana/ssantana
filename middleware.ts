import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // Rotas públicas (não requerem autenticação)
  publicRoutes: [
    '/',
    '/partners',
    '/api/leads',
    '/api/webhooks/(.*)',
    '/sitemap.xml',
    '/robots.txt',
    '/opengraph-image',
  ],
  
  // Rotas que requerem autenticação mas não redirecionam
  ignoredRoutes: [
    '/api/webhooks/(.*)',
  ],

  // Rotas protegidas por role
  afterAuth(auth, req) {
    // Permitir webhooks sem autenticação
    if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
      return
    }

    // Redirecionar usuários não autenticados para sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return Response.redirect(signInUrl)
    }

    // Verificar acesso ao dashboard
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // Dashboard admin
      if (req.nextUrl.pathname.startsWith('/dashboard/admin')) {
        // TODO: Verificar se usuário tem role ADMIN no banco
        return
      }
      
      // Dashboard partner
      if (req.nextUrl.pathname.startsWith('/dashboard/partner')) {
        // TODO: Verificar se usuário tem role PARTNER no banco
        return
      }

      // Dashboard client é acessível a todos autenticados
      if (req.nextUrl.pathname.startsWith('/dashboard/client')) {
        return
      }
    }
  },
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
