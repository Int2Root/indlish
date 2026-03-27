import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { sendWelcomeEmail } from './email';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    newUser: '/settings',
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } });
        if (!dbUser?.password) {
          sendWelcomeEmail(user.email, user.name).catch(console.error);
        }
      }
    },
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { accounts: { where: { provider: 'google' } } },
          });

          if (existingUser && existingUser.accounts.length === 0) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token ?? undefined,
                access_token: account.access_token ?? undefined,
                expires_at: account.expires_at ?? undefined,
                token_type: account.token_type ?? undefined,
                scope: account.scope ?? undefined,
                id_token: account.id_token ?? undefined,
                session_state: account.session_state ?? undefined,
              },
            });
          }
        } catch (err: any) {
          console.error('[auth] Error linking Google account:', err.message);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.plan = dbUser.plan;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).plan = token.plan;
      }
      return session;
    },
  },
};
