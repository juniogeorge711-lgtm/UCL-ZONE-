import React, { useState } from 'react';
import { useArticles } from '../hooks/useData';
import { ArticleCard } from '../components/news/ArticleCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { ArticleCategory } from '../types';
import { Search } from 'lucide-react';

const CATEGORIES: (ArticleCategory | 'all')[] = [
  'all',
  'Champions League news',
  'Match previews',
  'Match reports',
  'Transfer updates',
  'Editorial',
];

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data: articles, loading } = useArticles({
    category: selectedCategory,
    query: search || undefined,
  });

  const leadArticle = articles?.[0];
  const gridArticles = articles?.slice(1) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
            News & Editorial
          </h1>
          <span className="text-[11px] font-bold text-[#9AA7D6] bg-[#16214A] border border-[#26346B] px-2.5 py-0.5 rounded-md">
            Sample content
          </span>
        </div>
        <p className="text-sm text-[#9AA7D6] mt-1">
          European football previews, tactical reviews, and matchday reportage
        </p>
      </div>

      {/* Category Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#3D7BFF] text-white shadow-sm'
                  : 'bg-[#16214A] text-[#9AA7D6] hover:text-white border border-[#26346B]'
              }`}
            >
              {cat === 'all' ? 'All Stories' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-[#9AA7D6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search headlines or tags..."
            aria-label="Search articles"
            className="w-full bg-[#16214A] border border-[#26346B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#9AA7D6]/60 focus:outline-none focus:border-[#3D7BFF]"
          />
        </div>
      </div>

      {/* Articles Presentation */}
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-72 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="space-y-8">
          {leadArticle && <ArticleCard article={leadArticle} lead={true} />}

          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No stories found"
          message="No articles match your selected category or search terms."
          actionLabel="View all stories"
          onAction={() => {
            setSelectedCategory('all');
            setSearch('');
          }}
        />
      )}
    </div>
  );
};
