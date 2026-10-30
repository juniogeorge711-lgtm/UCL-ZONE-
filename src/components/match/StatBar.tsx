import React from 'react';

interface StatBarProps {
  label: string;
  homeVal: number;
  awayVal: number;
  homeColor?: string;
  awayColor?: string;
  isPercent?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  homeVal,
  awayVal,
  homeColor = '#3D7BFF',
  awayColor = '#F0BE4D',
  isPercent = false,
}) => {
  const total = homeVal + awayVal;
  const homePct = total > 0 ? (homeVal / total) * 100 : 50;
  const awayPct = total > 0 ? (awayVal / total) * 100 : 50;

  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between text-xs font-medium text-[#EEF2FF] mb-1.5">
        <span className="font-mono-numbers tabular-nums font-bold">
          {isPercent ? `${homeVal}%` : homeVal}
        </span>
        <span className="text-[#9AA7D6] text-center font-medium">{label}</span>
        <span className="font-mono-numbers tabular-nums font-bold">
          {isPercent ? `${awayVal}%` : awayVal}
        </span>
      </div>

      <div
        className="flex h-2 w-full rounded-full overflow-hidden bg-[#16214A] gap-0.5"
        role="progressbar"
        aria-label={`${label}: ${homeVal} to ${awayVal}`}
        aria-valuenow={homeVal}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          style={{ width: `${homePct}%`, backgroundColor: homeColor }}
          className="h-full rounded-l-full transition-all duration-500"
        />
        <div
          style={{ width: `${awayPct}%`, backgroundColor: awayColor }}
          className="h-full rounded-r-full transition-all duration-500"
        />
      </div>
    </div>
  );
};
