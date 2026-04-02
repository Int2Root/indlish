import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getAuthSession } from '@/lib/api-helpers';
import { articleSchema } from '@/lib/validations';
import { generateSlug, getReadingTime, PLAN_LIMITS } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const tag = searchParams.get('tag');
    const authorId = searchParams.get('authorId');
    const status = searchParams.get('status');

    const session = await getAuthSession();
    const where: any = {};

    if (!authorId) {
      // Public feeds default to PUBLISHED only
      where.status = 'PUBLISHED';
      where.author = { username: { not: 'test' } };
    } else {
      // authorId provided: show drafts only to the owner, others see PUBLISHED only
      if (!session?.user || session.user.id !== authorId) {
        where.status = 'PUBLISHED';
      }
    }
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (authorId) { where.authorId = authorId; delete where.author; }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true, tips: true, comments: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return successResponse({ articles, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return errorResponse('Failed to fetch articles', 500);
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = articleSchema.parse(body);

    // Check plan limits
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return errorResponse('User not found', 404);

    const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];
    const articleCount = await prisma.article.count({
      where: {
        authorId: session.user.id,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    });

    if (articleCount >= limits.articles) {
      return errorResponse(`Free plan limit reached (${limits.articles} articles/month). Upgrade to Pro!`, 403);
    }

    const contentText = typeof validated.content === 'string' ? validated.content : JSON.stringify(validated.content);

    const article = await prisma.article.create({
      data: {
        title: validated.title,
        slug: generateSlug(validated.title),
        content: validated.content,
        excerpt: validated.excerpt || contentText.slice(0, 200),
        coverImage: validated.coverImage || null,
        readingTime: getReadingTime(contentText),
        status: validated.status || 'DRAFT',
        publishedAt: validated.status === 'PUBLISHED' ? new Date() : null,
        authorId: session.user.id,
      },
    });
    // Handle tags
    if (validated.tags?.length) {
      for (const tagName of validated.tags) {
        const tag = await prisma.tag.upsert({
          where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
          create: { name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') },
          update: {},
        });
        await prisma.tagOnArticle.create({ data: { articleId: article.id, tagId: tag.id } });
      }
    }

    return successResponse(article, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error.name === 'ZodError') return errorResponse(error.errors[0].message, 422);
    return errorResponse('Failed to create article', 500);
  }
}