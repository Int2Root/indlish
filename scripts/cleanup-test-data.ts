/**
 * One-time cleanup script to remove test user data from the database.
 * Run with: npx ts-node --project tsconfig.json scripts/cleanup-test-data.ts
 *
 * This removes:
 *   - All articles authored by the user with username "test"
 *   - The test user account itself
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testUser = await prisma.user.findFirst({
    where: { username: 'test' },
    select: { id: true, name: true, email: true },
  });

  if (!testUser) {
    console.log('No test user found. Nothing to clean up.');
    return;
  }

  console.log(`Found test user: ${testUser.name} (${testUser.email})`);

  const articleCount = await prisma.article.count({
    where: { authorId: testUser.id },
  });
  console.log(`Deleting ${articleCount} article(s) by test user...`);

  // Delete articles (cascade handles TagOnArticle, ArticleLike, Tips, etc.)
  await prisma.article.deleteMany({ where: { authorId: testUser.id } });
  console.log('Articles deleted.');

  // Delete the user (cascade handles sessions, accounts, etc.)
  await prisma.user.delete({ where: { id: testUser.id } });
  console.log('Test user deleted.');

  console.log('Cleanup complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
