import React, { useState } from 'react';
import { Club } from '../../types';

interface CrestProps {
  club: Club;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showName?: boolean;
}

export const Crest: React.FC<CrestProps> = ({
  club,
  size = 'md',
  className = '',
  showName = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { container: 'w-6 h-6', img: 'w-6 h-6', text: 'text-[9px]', stroke: 1.5 },
    md: { container: 'w-9 h-9', img: 'w-8 h-8', text: 'text-xs', stroke: 2 },
    lg: { container: 'w-12 h-12', img: 'w-11 h-11', text: 'text-sm font-bold', stroke: 2.5 },
    xl: { container: 'w-16 h-16', img: 'w-15 h-15', text: 'text-lg font-bold', stroke: 3 },
    '2xl': { container: 'w-24 h-24', img: 'w-22 h-22', text: 'text-2xl font-black', stroke: 3.5 },
  };

  const config = sizeMap[size];
  const { primary, secondary, text } = club.colors;

  const renderMonogramFallback = () => (
    <div
      className={`relative flex items-center justify-center rounded-lg shadow-sm shrink-0 overflow-hidden ${config.container}`}
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        boxShadow: `0 2px 8px ${primary}25`,
        border: `1px solid rgba(255, 255, 255, 0.15)`,
      }}
      aria-label={`${club.name} crest`}
      role="img"
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
        fill="none"
      >
        <path
          d="M20 2L36 10V22C36 30 20 38 20 38C20 38 4 30 4 22V10L20 2Z"
          stroke="white"
          strokeWidth={config.stroke}
        />
        <path d="M20 2V38" stroke="white" strokeWidth="0.75" strokeDasharray="2 2" />
        <path d="M4 14H36" stroke="white" strokeWidth="0.75" strokeDasharray="2 2" />
      </svg>
      <span
        className={`relative z-10 font-display uppercase tracking-wider font-extrabold select-none ${config.text}`}
        style={{ color: text }}
      >
        {club.code}
      </span>
    </div>
  );

  return (
    <div className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      {club.crestUrl && !imgError ? (
        <div
          className={`relative flex items-center justify-center shrink-0 ${config.container}`}
        >
          <img
            src={club.crestUrl}
            alt={`${club.name} badge`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={`${config.img} object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105`}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        renderMonogramFallback()
      )}

      {showName && (
        <span className="text-sm font-semibold text-[#EEF2FF] truncate">
          {club.shortName}
        </span>
      )}
    </div>
  );
};
