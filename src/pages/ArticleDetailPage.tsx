import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle, useArticles } from '../hooks/useData';
import { ArticleCard } from '../components/news/ArticleCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { formatKickoffDate } from '../../src/lib/timezone';
import { ArrowLeft, Clock, User, Share2, Tag, Info } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: article, loading: loadingArticle } = useArticle(slug || '');
  const { data: allArticles } = useArticles();

  if (loadingArticle) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <EmptyState
        title="Article Not Found"
        message="The requested story could not be found or has been moved."
        actionLabel="Back to News"
        onAction={() => navigate('/news')}
      />
    );
  }

  // Related articles (same category or general)
  const related = allArticles
    ?.filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3) || allArticles?.filter((a) => a.id !== article.id).slice(0, 3) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9AA7D6] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all stories</span>
        </button>
      </div>

      {/* Sample Content Disclosure Callout */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#16214A]/60 border border-[#26346B] text-xs text-[#9AA7D6]">
        <Info className="w-4 h-4 text-[#3D7BFF] shrink-0 mt-0.5" />
        <span>
          <strong className="text-white">Sample Content Disclosure:</strong> This article is demonstration fiction created for the UCL ZONE platform. Names, quotes, and scenarios are sample data.
        </span>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        {/* Unboxed metadata */}
        <div className="flex items-center gap-2 text-xs text-[#9AA7D6]">
          <span className="font-bold text-[#3D7BFF]">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatKickoffDate(article.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-[#9AA7D6] leading-relaxed">
          {article.subtitle}
        </p>

        {/* Byline */}
        <div className="flex items-center justify-between pt-4 border-t border-[#26346B]/50 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#16214A] border border-[#26346B] flex items-center justify-center font-bold text-[#3D7BFF]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">{article.author}</span>
              <span className="text-[11px] text-[#9AA7D6]">{article.authorRole}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            title="Copy link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16214A] hover:bg-[#26346B] text-[#9AA7D6] hover:text-white text-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Featured Header Visual */}
      <div className="relative aspect-[16/9] max-h-[380px] w-full rounded-2xl bg-gradient-to-br from-[#16214A] to-[#0E1633] border border-[#26346B] overflow-hidden flex items-center justify-center p-8">
        <div className="text-center p-6 bg-[#070B1F]/70 backdrop-blur-sm rounded-xl border border-[#26346B]/60 max-w-lg">
          <span className="font-display text-2xl font-black text-[#F0BE4D] uppercase tracking-wider block mb-1">
            UCL ZONE SPECIAL REPORT
          </span>
          <span className="text-xs text-[#9AA7D6]">
            European Football Analytics & In-Depth Tactical Coverage
          </span>
        </div>
      </div>

      {/* Article Body Prose (Line length kept under 75ch) */}
      <div className="prose prose-invert max-w-[70ch] mx-auto space-y-6 text-sm sm:text-base text-[#EEF2FF]/90 leading-relaxed">
        {article.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Article Tags */}
      <div className="pt-6 border-t border-[#26346B]/50 flex flex-wrap items-center gap-2">
        <Tag className="w-4 h-4 text-[#9AA7D6] mr-1" />
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#16214A] text-[#9AA7D6] border border-[#26346B]"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section aria-label="Related Stories" className="pt-8 border-t border-[#26346B]/60 space-y-4">
          <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide">
            Related Stories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
