import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color?: string;
    fill?: string;
  }>;
  label?: string;
  valueFormatter?: (v: number) => string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  valueFormatter,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-[#070B1F]/95 border border-[#26346B] p-3 shadow-xl backdrop-blur-md text-xs z-50">
        {label && <p className="font-bold text-white mb-1.5 pb-1 border-b border-[#26346B]/50">{label}</p>}
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#9AA7D6]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill || '#3D7BFF' }}
                />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono-numbers font-bold text-white">
                {typeof entry.value === 'number' && valueFormatter
                  ? valueFormatter(entry.value)
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
