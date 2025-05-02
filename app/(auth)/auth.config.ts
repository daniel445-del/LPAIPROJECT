import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [],
  callbacks: {
    authorized() {
      return true; // permite acesso a tudo
    },
  },
} satisfies NextAuthConfig;
