import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // Adicione aqui os provedores no arquivo auth.ts
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const isAuthPage = path === '/login' || path === '/register';
      const isProtectedPath = path.startsWith('/admin') || path.startsWith('/dashboard');

      // Permitir sempre acesso às páginas públicas
      if (!isProtectedPath) {
        return true;
      }

      // Se for uma rota protegida, exige login
      if (isProtectedPath) {
        return isLoggedIn;
      }

      // Redirecionar usuários já logados que tentam acessar login/register
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
