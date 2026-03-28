import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { sendWelcomeEmail } from './email';

async function generateUniqueUsername(name: string | null | undefined, email: string): Promise<string> {
  const base = (
    name
      ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
      : email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  ).slice(0, 20) || 'user';
  let username = base;
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${base.slice(0, 17)}${suffix++}`;
  }
  return username;
}

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
          const username = await generateUniqueUsername(user.name, user.email);
          await prisma.user.update({ where: { id: user.id }, data: { username } });
        }
      }
    },
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Safety net: clean up any mislinked Google accounts from previous bugs.
      // If an Account record for this Google providerAccountId is linked to a
      // user that doesn't match the Google email, delete it so that
      // callbackHandler + allowDangerousEmailAccountLinking can re-link correctly.
      if (account?.provider === 'google' && profile?.email) {
        try {
          const correctUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });
          if (correctUser) {
            const deleted = await prisma.account.deleteMany({
              where: {
                provider: 'google',
                providerAccountId: account.providerAccountId,
                userId: { not: correctUser.id },
              },
            });
            if (deleted.count > 0) {
              console.log('[AUTH] Cleaned up', deleted.count, 'mislinked Google account(s)');
            }
            // Generate username for existing users who somehow ended up without one
            if (!correctUser.username) {
              const username = await generateUniqueUsername((profile as any).name, profile.email);
              await prisma.user.update({ where: { id: correctUser.id }, data: { username } });
              console.log('[AUTH] Generated username for existing user:', username);
            }
          }
        } catch (err: any) {
          console.error('[AUTH] signIn cleanup error:', err.message);
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
