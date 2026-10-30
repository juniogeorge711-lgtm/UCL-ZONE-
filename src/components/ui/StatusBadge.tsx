import React from 'react';
import { MatchStatus } from '../../types';

interface StatusBadgeProps {
  status: MatchStatus;
  minute?: number;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, minute, className = '' }) => {
  if (status === 'LIVE') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-[#2FB67C] tracking-wide ${className}`}>
        <span className="w-2 h-2 rounded-full bg-[#2FB67C] animate-pulse" aria-hidden="true" />
        <span>LIVE {minute ? `${minute}'` : ''}</span>
      </span>
    );
  }

  if (status === 'FULL_TIME') {
    return (
      <span className={`text-xs font-semibold text-[#9AA7D6] tracking-wide ${className}`}>
        FT
      </span>
    );
  }

  if (status === 'POSTPONED') {
    return (
      <span className={`text-xs font-semibold text-[#E5627A] tracking-wide ${className}`}>
        Postponed
      </span>
    );
  }

  return (
    <span className={`text-xs font-medium text-[#9AA7D6] tracking-wide ${className}`}>
      Scheduled
    </span>
  );
};
