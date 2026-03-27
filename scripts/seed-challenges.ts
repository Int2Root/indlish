import prisma from '../src/lib/prisma';

async function main() {
  const challenges = [
    {
      title: '30-Day Writing Streak Challenge',
      description: 'Write and publish one article every day for 30 days. Topics can be anything — personal stories, technical deep-dives, poetry, opinions. Consistency is the key! Share your journey, your struggles, and your wins. The Indian creator community is watching.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tagSlug: 'writing-streak',
      prize: '3 Months Pro Free',
      status: 'active',
    },
    {
      title: 'Desi Kahani — Tell Your Story',
      description: 'Write an original story or essay about growing up in India. Could be about your town, your family, your first phone, your school, your friends. Hinglish is totally welcome — in fact, encouraged! Share the India only you know.',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      tagSlug: 'desi-kahani',
      prize: '1 Month Pro Free',
      status: 'active',
    },
    {
      title: 'Tech for Bharat',
      description: 'Write about how technology is changing India at the grassroots level. Stories from tier-2/3 cities, farmers using apps, digital payments revolution, AI in regional languages — show the real digital India.',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      tagSlug: 'tech-for-bharat',
      prize: 'Pro Badge + Feature',
      status: 'active',
    },
  ];

  for (const c of challenges) {
    await prisma.challenge.upsert({
      where: { id: `seed-${c.tagSlug}` },
      update: {},
      create: { ...c, id: `seed-${c.tagSlug}` },
    });
    console.log(`Created: ${c.title}`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
