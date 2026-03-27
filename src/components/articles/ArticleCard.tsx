import Link from 'next/link';
import { Heart, Eye, Clock } from 'lucide-react';
import { formatDate, formatNumber, truncate } from '@/lib/utils';
import type { ArticleWithAuthor } from '@/types';

export default function ArticleCard({ article }: { article: ArticleWithAuthor }) {
  return (
    <article className="card hover:border-neutral-600 transition-colors group">
      {article.coverImage && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        {article.author.image && (
          <img src={article.author.image} alt={article.author.name || ''} className="w-6 h-6 rounded-full" />
        )}
        <Link href={`/profile/${article.author.username}`} className="text-sm text-text-secondary hover:text-brand-400">
          {article.author.name}
        </Link>
        <span className="text-text-muted text-xs">·</span>
        <span className="text-text-muted text-xs">{formatDate(article.publishedAt || article.createdAt)}</span>
      </div>
      <Link href={`/write/${article.slug}`}>
        <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">
          {article.title}
        </h2>
      </Link>

      {article.excerpt && (
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">{truncate(article.excerpt, 200)}</p>
      )}

      <div className="flex items-center gap-4 text-text-muted text-sm">
        <span className="flex items-center gap-1"><Clock size={14} />{article.readingTime} min</span>
        <span className="flex items-center gap-1"><Eye size={14} />{formatNumber(article.views)}</span>
        <span className="flex items-center gap-1"><Heart size={14} />{formatNumber(article._count.likes)}</span>
      </div>

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {article.tags.map(({ tag }) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="text-xs bg-surface-lighter px-2 py-1 rounded-full text-text-muted hover:text-brand-400 border border-neutral-800 hover:border-neutral-700 transition-colors">
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}