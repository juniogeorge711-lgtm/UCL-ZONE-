import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../types';
import { Clock } from 'lucide-react';
import { formatKickoffDate } from '../../lib/timezone';

interface ArticleCardProps {
  article: Article;
  lead?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, lead = false }) => {
  const navigate = useNavigate();

  if (lead) {
    return (
      <article
        onClick={() => navigate(`/news/${article.slug}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/news/${article.slug}`);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Lead story: ${article.title}`}
        className="group relative rounded-2xl bg-[#0E1633] border border-[#26346B]/60 overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#3D7BFF]/70 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Visual banner container */}
          <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-[360px] bg-gradient-to-br from-[#16214A] via-[#0E1633] to-[#070B1F] flex items-center justify-center p-8 overflow-hidden">
            {/* Subtle atmospheric European floodlit pitch graphic */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3D7BFF] via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col items-center text-center p-6 border border-[#26346B]/60 rounded-xl bg-[#070B1F]/60 backdrop-blur-sm max-w-md">
              <span className="font-display text-2xl font-black text-[#F0BE4D] tracking-wider uppercase mb-1">
                UCL MATCHDAY FOCUS
              </span>
              <p className="text-xs text-[#9AA7D6]">
                Tactical Breakdown · Advanced Performance Data
              </p>
            </div>
          </div>

          {/* Lead content */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              {/* Unboxed metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs text-[#9AA7D6] mb-3">
                <span className="font-bold text-[#3D7BFF]">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{formatKickoffDate(article.publishedAt)}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#9AA7D6]" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h2 className="font-display text-2xl lg:text-3xl font-black text-white group-hover:text-[#3D7BFF] transition-colors leading-tight">
                {article.title}
              </h2>
              <p className="text-sm text-[#9AA7D6] mt-3 line-clamp-3 leading-relaxed">
                {article.subtitle}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#26346B]/40 flex items-center justify-between text-xs">
              <span className="text-[#EEF2FF] font-medium">{article.author}</span>
              <span className="text-[#3D7BFF] font-bold group-hover:translate-x-1 transition-transform">
                Read story →
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => navigate(`/news/${article.slug}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/news/${article.slug}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${article.title}`}
      className="group rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-5 transition-all duration-200 hover:border-[#3D7BFF]/70 hover:bg-[#16214A]/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] flex flex-col justify-between"
    >
      <div>
        {/* Unboxed metadata with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-[#9AA7D6] mb-2">
          <span className="font-semibold text-[#3D7BFF]">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>

        <h3 className="font-display text-lg font-bold text-[#EEF2FF] group-hover:text-white transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-[#9AA7D6] mt-2 line-clamp-2">
          {article.subtitle}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#26346B]/40 flex items-center justify-between text-[11px] text-[#9AA7D6]">
        <span>{formatKickoffDate(article.publishedAt)}</span>
        <span className="text-[#3D7BFF] font-medium group-hover:translate-x-0.5 transition-transform">
          Read →
        </span>
      </div>
    </article>
  );
};
