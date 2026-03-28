/**
 * One-time migration: generate usernames for any users that have null/empty username.
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/fix-usernames.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateUniqueUsername(name: string | null, email: string): Promise<string> {
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

async function main() {
  const users = await prisma.user.findMany({
    where: { OR: [{ username: null }, { username: '' }] },
    select: { id: true, name: true, email: true },
  });

  console.log(`Found ${users.length} user(s) without a username`);
  if (users.length === 0) { console.log('Nothing to do.'); return; }

  for (const user of users) {
    const username = await generateUniqueUsername(user.name, user.email);
    await prisma.user.update({ where: { id: user.id }, data: { username } });
    console.log(`  ${user.email} → @${username}`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
