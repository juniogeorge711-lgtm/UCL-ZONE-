import React from 'react';
import { Database } from 'lucide-react';
import { dataProvider } from '../../data';

export const SampleDataBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  if (!dataProvider.isSample) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[#9AA7D6] bg-[#0E1633] border border-[#26346B]/60 rounded-md select-none ${className}`}
      title="Currently displaying demonstration sample data. Plug in real football API via VITE_DATA_SOURCE=api."
    >
      <Database className="w-3 h-3 text-[#3D7BFF]" />
      <span>Sample data mode</span>
    </div>
  );
};
