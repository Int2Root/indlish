/**
 * One-time cleanup script to remove test/draft data from the database.
 * Run with: DATABASE_URL="..." npx ts-node --project tsconfig.json scripts/cleanup-test-data.ts
 *
 * This removes:
 *   - All articles titled "Untitled Article" or with empty titles (any user)
 *   - All articles authored by the user with username "test"
 *   - All boards titled "test" (case-insensitive, any user)
 *   - All boards (and their pins) owned by the test user
 *   - The test user account itself
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- 1. Delete "Untitled Article" drafts and empty-title articles ---
  const untitledArticles = await prisma.article.findMany({
    where: {
      OR: [
        { title: 'Untitled Article' },
        { title: '' },
      ],
    },
    select: { id: true, title: true, status: true, author: { select: { username: true } } },
  });

  if (untitledArticles.length > 0) {
    console.log(`Found ${untitledArticles.length} untitled/empty article(s):`);
    untitledArticles.forEach(a =>
      console.log(`  [${a.status}] "${a.title}" by @${a.author.username} (${a.id})`)
    );
    await prisma.article.deleteMany({
      where: { id: { in: untitledArticles.map(a => a.id) } },
    });
    console.log('Untitled articles deleted.\n');
  } else {
    console.log('No untitled articles found.\n');
  }

  // --- 2. Delete boards titled "test" (case-insensitive) ---
  const testBoards = await prisma.board.findMany({
    where: { title: { contains: 'test', mode: 'insensitive' } },
    select: { id: true, title: true, user: { select: { username: true } } },
  });

  if (testBoards.length > 0) {
    console.log(`Found ${testBoards.length} test board(s):`);
    testBoards.forEach(b => console.log(`  "${b.title}" by @${b.user.username} (${b.id})`));
    await prisma.board.deleteMany({
      where: { id: { in: testBoards.map(b => b.id) } },
    });
    console.log('Test boards deleted.\n');
  } else {
    console.log('No test boards found.\n');
  }

  // --- 3. Remove test user and all their content ---
  const testUser = await prisma.user.findFirst({
    where: { username: 'test' },
    select: { id: true, name: true, email: true },
  });

  if (!testUser) {
    console.log('No test user found. Nothing more to clean up.');
    return;
  }

  console.log(`Found test user: ${testUser.name} (${testUser.email})`);

  const articleCount = await prisma.article.count({ where: { authorId: testUser.id } });
  console.log(`Deleting ${articleCount} article(s) by test user...`);
  await prisma.article.deleteMany({ where: { authorId: testUser.id } });
  console.log('Articles deleted.');

  const boards = await prisma.board.findMany({
    where: { userId: testUser.id },
    select: { id: true },
  });
  if (boards.length > 0) {
    console.log(`Deleting ${boards.length} board(s) by test user...`);
    await prisma.board.deleteMany({ where: { userId: testUser.id } });
    console.log('Boards deleted.');
  }

  await prisma.user.delete({ where: { id: testUser.id } });
  console.log('Test user deleted.');

  console.log('\nCleanup complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
