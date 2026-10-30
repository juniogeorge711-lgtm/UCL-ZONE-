import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Empty state notice"
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl bg-[#0E1633]/50 border border-[#26346B]/40 max-w-md mx-auto my-6 ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#16214A] flex items-center justify-center text-[#9AA7D6] mb-3">
        <AlertCircle className="w-5 h-5 text-[#3D7BFF]" />
      </div>
      <h3 className="text-base font-semibold text-[#EEF2FF] mb-1">{title}</h3>
      <p className="text-sm text-[#9AA7D6] max-w-sm mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-[#EEF2FF] bg-[#16214A] hover:bg-[#26346B] border border-[#26346B] rounded-lg transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
