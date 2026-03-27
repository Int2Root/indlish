import type { Metadata } from 'next';
import ArticleEditorClient from './ArticleEditorClient';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3002';
    const res = await fetch(`${base}/api/articles/slug/${params.slug}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (!data.success) return { title: 'Article | indlish' };
    const a = data.data;
    const desc = a.excerpt && !a.excerpt.startsWith('{') ? a.excerpt : `Read "${a.title}" on indlish`;
    return {
      title: a.title,
      description: desc,
      openGraph: {
        title: a.title,
        description: desc,
        images: a.coverImage ? [{ url: a.coverImage }] : [],
        type: 'article',
        authors: [a.author?.name || 'indlish creator'],
      },
      twitter: {
        card: 'summary_large_image',
        title: a.title,
        description: desc,
        images: a.coverImage ? [a.coverImage] : [],
      },
    };
  } catch {
    return { title: 'Article | indlish' };
  }
}

export default function Page() {
  return <ArticleEditorClient />;
}
