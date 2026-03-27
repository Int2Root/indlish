'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Share2, Copy, Check } from 'lucide-react';
import UpiTipButton from './UpiTipButton';

function XBrandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  );
}

export interface ArticleReaderData {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string | null;
  coverImage?: string | null;
  readingTime?: number | null;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image?: string | null;
    upiId?: string | null;
  };
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
  _count: { likes: number };
}

export default function ArticleReader({ article }: { article: ArticleReaderData }) {
  const [copied, setCopied] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');

  useEffect(() => {
    setArticleUrl(window.location.href);
  }, []);

  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(articleUrl);

  const copyLink = async () => {
    if (!articleUrl) return;
    await navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Normalize excerpt — strip raw Tiptap JSON from old data
  const excerpt = article.excerpt && !article.excerpt.startsWith('{') ? article.excerpt : '';

  return (
    <>
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full max-h-96 object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-text-primary mb-3">
        {article.title}
      </h1>

      {excerpt && (
        <p className="font-serif text-xl text-text-muted mb-5 leading-relaxed">{excerpt}</p>
      )}

      <div className="flex items-center gap-2 text-text-muted text-sm mb-10 pb-8 border-b border-neutral-800">
        {article.author?.image ? (
          <img src={article.author.image} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-medium text-white">
            {article.author?.name?.[0] || 'U'}
          </div>
        )}
        <Link
          href={`/profile/${article.author?.username}`}
          className="hover:text-brand-400 transition-colors font-medium text-text-secondary"
        >
          {article.author?.name}
        </Link>
        <span>·</span>
        <span>{article.readingTime || 1} min read</span>
        <span>·</span>
        <span>{article.views.toLocaleString()} views</span>
      </div>

      <TiptapEditor content={article.content} editable={false} />

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-neutral-800">
          {article.tags.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/discover?tag=${tag.slug}`}
              className="text-xs bg-surface-lighter px-3 py-1.5 rounded-full text-text-muted hover:text-brand-400 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* UPI Tip */}
      {article.author?.upiId && (
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-medium text-sm">Like this article?</p>
              <p className="text-text-muted text-xs mt-0.5">Support {article.author.name?.split(' ')[0]} directly with a UPI tip 🙏</p>
            </div>
            <UpiTipButton
              authorName={article.author.name || 'Creator'}
              authorUpiId={article.author.upiId}
              authorId={article.author.id}
              articleId={article.id}
            />
          </div>
        </div>
      )}

      {/* Share buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-neutral-800">
        <span className="text-text-muted text-sm flex items-center gap-1.5">
          <Share2 size={14} /> Share
        </span>
        <a
          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-sm hover:bg-[#25D366]/20 transition-colors"
        >
          <WhatsAppIcon /> WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-text-secondary text-sm hover:bg-neutral-700 transition-colors"
        >
          <XBrandIcon /> X / Twitter
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-text-secondary text-sm hover:bg-neutral-700 transition-colors"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </>
  );
}
