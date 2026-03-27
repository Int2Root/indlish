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
          select: { password: true, username: true },
        });
        if (!dbUser?.password) {
          sendWelcomeEmail(user.email, user.name).catch(console.error);
        }
        // Generate username for OAuth users who don't have one set
        if (!dbUser?.username) {
          const base = (
            user.name
              ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '')
              : user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
          ).slice(0, 20) || 'user';
          let username = base;
          let suffix = 1;
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${base.slice(0, 17)}${suffix++}`;
          }
          await prisma.user.update({ where: { id: user.id }, data: { username } });
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Find the user that SHOULD own this Google account (by email)
          const correctUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (correctUser) {
            // Check if the correct Account link already exists
            const correctLink = await prisma.account.findFirst({
              where: {
                provider: 'google',
                providerAccountId: account.providerAccountId,
                userId: correctUser.id,
              },
            });

            if (!correctLink) {
              // Account is missing or linked to wrong user.
              // Delete ALL Google accounts with this providerAccountId
              // (could be linked to an orphan user from a previous bug)
              await prisma.account.deleteMany({
                where: {
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                },
              });
              // Also delete any stale Google accounts for the correct user
              await prisma.account.deleteMany({
                where: {
                  userId: correctUser.id,
                  provider: 'google',
                },
              });
              // Create the correct link so callbackHandler finds it
              await prisma.account.create({
                data: {
                  userId: correctUser.id,
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
              console.log('[AUTH] Fixed Google account link for user', correctUser.id);
            }
          }
        } catch (err: any) {
          console.error('[AUTH] Error in signIn callback:', err.message);
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

