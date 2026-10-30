import React, { useState } from 'react';
import { Table, BarChart2, Info } from 'lucide-react';

interface ChartCardProps {
  title: string;
  summary: string;
  insight?: string;
  children: React.ReactNode;
  tableData?: {
    columns: string[];
    rows: (string | number)[][];
  };
  className?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  summary,
  insight,
  children,
  tableData,
  className = '',
  isEmpty = false,
  emptyMessage = 'No chart data available for current selection.',
}) => {
  const [viewTable, setViewTable] = useState(false);

  return (
    <div
      className={`rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-5 lg:p-6 shadow-sm flex flex-col justify-between transition-colors ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Header zone with Title, Summary, and Table View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#EEF2FF] tracking-tight">{title}</h3>
          <p className="text-xs text-[#9AA7D6] mt-0.5 max-w-xl">{summary}</p>
        </div>

        {tableData && !isEmpty && (
          <button
            onClick={() => setViewTable(!viewTable)}
            aria-pressed={viewTable}
            aria-label={viewTable ? `Show visual chart for ${title}` : `View ${title} as tabular data`}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EEF2FF] bg-[#16214A] hover:bg-[#26346B] border border-[#26346B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF]"
          >
            {viewTable ? (
              <>
                <BarChart2 className="w-3.5 h-3.5 text-[#3D7BFF]" />
                <span>Show chart</span>
              </>
            ) : (
              <>
                <Table className="w-3.5 h-3.5 text-[#F0BE4D]" />
                <span>View as table</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main content body */}
      <div className="flex-1 min-h-[260px] flex flex-col justify-center">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-[#9AA7D6]">
            <Info className="w-6 h-6 text-[#9AA7D6]/60 mb-2" />
            <span>{emptyMessage}</span>
          </div>
        ) : viewTable && tableData ? (
          <div className="overflow-x-auto max-h-[340px] my-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#26346B] text-[#9AA7D6]">
                  {tableData.columns.map((col, idx) => (
                    <th key={idx} className="py-2 px-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26346B]/40 text-[#EEF2FF]">
                {tableData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-[#16214A]/50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`py-2 px-3 ${
                          typeof cell === 'number' ? 'font-mono-numbers tabular-nums' : ''
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-full min-h-[260px] flex items-center justify-center">
            {children}
          </div>
        )}
      </div>

      {/* Insight footer */}
      {insight && !isEmpty && (
        <div className="mt-4 pt-3 border-t border-[#26346B]/40 flex items-start gap-2 text-xs text-[#9AA7D6]">
          <span className="font-bold text-[#3D7BFF] uppercase tracking-wider text-[10px] shrink-0 mt-0.5">
            Key Insight:
          </span>
          <p className="italic text-[#EEF2FF]/90">{insight}</p>
        </div>
      )}
    </div>
  );
};
