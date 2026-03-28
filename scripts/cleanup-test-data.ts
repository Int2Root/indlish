/**
 * One-time cleanup script to remove test user data from the database.
 * Run with: npx ts-node --project tsconfig.json scripts/cleanup-test-data.ts
 *
 * This removes:
 *   - All articles authored by the user with username "test"
 *   - All boards (and their pins) owned by the test user
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

  // Delete boards and their pins
  const boards = await prisma.board.findMany({
    where: { userId: testUser.id },
    select: { id: true },
  });
  const boardIds = boards.map((b) => b.id);
  if (boardIds.length > 0) {
    console.log(`Deleting pins from ${boardIds.length} board(s)...`);
    await prisma.pin.deleteMany({ where: { boardId: { in: boardIds } } });
    await prisma.board.deleteMany({ where: { userId: testUser.id } });
    console.log('Boards deleted.');
  }

  // Delete the user (cascade handles sessions, accounts, etc.)
  await prisma.user.delete({ where: { id: testUser.id } });
  console.log('Test user deleted.');

  console.log('Cleanup complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
