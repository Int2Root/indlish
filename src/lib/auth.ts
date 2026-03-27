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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
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
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { password: true },
        });
        if (!dbUser?.password) {
          sendWelcomeEmail(user.email, user.name).catch(console.error);
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google sign-in: clean up any stale/mismatched Google account
      // records created by previous buggy code, so the callbackHandler's
      // allowDangerousEmailAccountLinking flow works correctly.
      if (account?.provider === 'google' && profile?.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (existingUser) {
            const matchingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            if (!matchingAccount) {
              // Delete stale Google account records for this user
              // so callbackHandler can create a fresh one via linkAccount
              const deleted = await prisma.account.deleteMany({
                where: {
                  userId: existingUser.id,
                  provider: 'google',
                },
              });
              if (deleted.count > 0) {
                console.log('[AUTH] Cleaned up', deleted.count, 'stale Google account(s) for user', existingUser.id);
              }
            }
          }
        } catch (err: any) {
          console.error('[AUTH] Error in signIn cleanup:', err.message);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
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
