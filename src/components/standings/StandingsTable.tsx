import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormResult, StandingRow } from '../../types';
import { Crest } from '../ui/Crest';
import { ArrowUpDown, Search } from 'lucide-react';

interface StandingsTableProps {
  standings: StandingRow[];
  selectedClubIds?: string[];
  onToggleClubSelect?: (clubId: string) => void;
  maxSelectable?: number;
}

type SortField = 'position' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDifference' | 'points';
type SortDirection = 'asc' | 'desc';

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  selectedClubIds = [],
  onToggleClubSelect,
  maxSelectable = 5,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // default points, wins, goals to desc; position to asc
      setSortDirection(field === 'position' ? 'asc' : 'desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...standings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.club.name.toLowerCase().includes(q) ||
          row.club.shortName.toLowerCase().includes(q) ||
          row.club.country.toLowerCase().includes(q) ||
          row.club.code.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'position') {
        aVal = a.position;
        bVal = b.position;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [standings, search, sortField, sortDirection]);

  const renderFormBadge = (result: FormResult, idx: number) => {
    const config = {
      W: { bg: 'bg-[#2FB67C]', text: 'text-white', label: 'Win' },
      D: { bg: 'bg-[#9AA7D6]/40', text: 'text-white', label: 'Draw' },
      L: { bg: 'bg-[#E5627A]', text: 'text-white', label: 'Loss' },
    }[result];

    return (
      <span
        key={idx}
        title={config.label}
        className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${config.bg} ${config.text} select-none`}
      >
        {result}
      </span>
    );
  };

  const getZoneBorderClass = (pos: number) => {
    if (pos <= 8) return 'border-l-4 border-l-[#3D7BFF]';
    if (pos <= 24) return 'border-l-4 border-l-[#F0BE4D]';
    return 'border-l-4 border-l-transparent';
  };

  return (
    <div className="space-y-4">
      {/* Top search & legend row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#9AA7D6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 36 clubs..."
            aria-label="Search clubs in standings"
            className="w-full bg-[#0E1633] border border-[#26346B] rounded-lg pl-9 pr-3 py-2 text-xs text-[#EEF2FF] placeholder-[#9AA7D6]/60 focus:outline-none focus:border-[#3D7BFF]"
          />
        </div>

        {/* Qualification Zones Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#9AA7D6]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#3D7BFF]" />
            <span>1–8: Round of 16 (Direct)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#F0BE4D]" />
            <span>9–24: Knockout Play-offs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#26346B]" />
            <span>25–36: Eliminated</span>
          </div>
        </div>
      </div>

      {onToggleClubSelect && (
        <div className="text-xs text-[#9AA7D6]">
          Click the checkbox next to any club to compare points progression above (up to {maxSelectable} clubs selected).
        </div>
      )}

      {/* Standings Table container */}
      <div className="rounded-xl border border-[#26346B]/60 bg-[#0E1633] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#26346B] bg-[#16214A]/60 text-[#9AA7D6] uppercase tracking-wider text-[11px]">
                {onToggleClubSelect && <th className="py-3 px-3 w-8">Compare</th>}
                <th
                  onClick={() => handleSort('position')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-center w-12"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Pos</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[200px]">Club</th>
                <th
                  onClick={() => handleSort('played')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors"
                >
                  P
                </th>
                <th
                  onClick={() => handleSort('won')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors"
                >
                  W
                </th>
                <th
                  onClick={() => handleSort('drawn')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors"
                >
                  D
                </th>
                <th
                  onClick={() => handleSort('lost')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors"
                >
                  L
                </th>
                <th
                  onClick={() => handleSort('goalsFor')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
                >
                  GF
                </th>
                <th
                  onClick={() => handleSort('goalsAgainst')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
                >
                  GA
                </th>
                <th
                  onClick={() => handleSort('goalDifference')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-white transition-colors"
                >
                  GD
                </th>
                <th
                  onClick={() => handleSort('points')}
                  className="py-3 px-3 text-center cursor-pointer hover:text-white transition-colors font-bold text-[#EEF2FF]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Pts</span>
                    <ArrowUpDown className="w-3 h-3 text-[#3D7BFF]" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26346B]/40">
              {filteredAndSorted.map((row) => {
                const isSelected = selectedClubIds.includes(row.club.id);

                return (
                  <tr
                    key={row.club.id}
                    className={`hover:bg-[#16214A]/70 transition-colors group cursor-pointer ${getZoneBorderClass(
                      row.position
                    )} ${isSelected ? 'bg-[#16214A]/50' : ''}`}
                    onClick={() => navigate(`/clubs/${row.club.id}`)}
                  >
                    {onToggleClubSelect && (
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleClubSelect(row.club.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleClubSelect(row.club.id)}
                          aria-label={`Select ${row.club.name} for points comparison`}
                          className="rounded border-[#26346B] text-[#3D7BFF] focus:ring-0 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="py-3 px-3 text-center font-mono-numbers font-bold text-[#EEF2FF]">
                      {row.position}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Crest club={row.club} size="sm" />
                        <span className="font-semibold text-white group-hover:text-[#3D7BFF] transition-colors truncate">
                          {row.club.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers text-[#9AA7D6]">
                      {row.played}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers text-[#EEF2FF]">
                      {row.won}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers text-[#9AA7D6]">
                      {row.drawn}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers text-[#9AA7D6]">
                      {row.lost}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers text-[#9AA7D6] hidden sm:table-cell">
                      {row.goalsFor}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers text-[#9AA7D6] hidden sm:table-cell">
                      {row.goalsAgainst}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono-numbers font-semibold text-[#EEF2FF]">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-3 px-3 text-center font-mono-numbers font-black text-sm text-white bg-[#16214A]/30">
                      {row.points}
                    </td>
                    <td className="py-3 px-4 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.map((f, i) => renderFormBadge(f, i))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
