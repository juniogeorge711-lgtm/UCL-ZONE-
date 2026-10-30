import React, { useState } from 'react';
import { useMatches, useClubs } from '../hooks/useData';
import { MatchCard } from '../components/match/MatchCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Filter, RotateCcw } from 'lucide-react';

export const FixturesPage: React.FC = () => {
  const [tab, setTab] = useState<'upcoming' | 'results' | 'all'>('all');
  const [matchday, setMatchday] = useState<string>('all');
  const [clubId, setClubId] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { data: clubs } = useClubs();

  const filters = {
    tab: tab === 'all' ? undefined : tab,
    matchday: matchday === 'all' ? undefined : parseInt(matchday, 10),
    clubId: clubId === 'all' ? undefined : clubId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };

  const { data: matches, loading, refetch } = useMatches(filters);

  const resetFilters = () => {
    setTab('all');
    setMatchday('all');
    setClubId('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = matchday !== 'all' || clubId !== 'all' || dateFrom !== '' || dateTo !== '';

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
          Fixtures & Results
        </h1>
        <p className="text-sm text-[#9AA7D6] mt-1">
          Complete UEFA Champions League league phase calendar with local kickoff times
        </p>
      </div>

      {/* Primary Tabs + Filter Bar */}
      <div className="space-y-4 rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-4 sm:p-5">
        {/* Segmented Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-[#070B1F] rounded-xl border border-[#26346B]/60 self-start">
            <button
              onClick={() => setTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                tab === 'all' ? 'bg-[#3D7BFF] text-white shadow-sm' : 'text-[#9AA7D6] hover:text-white'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setTab('upcoming')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                tab === 'upcoming' ? 'bg-[#3D7BFF] text-white shadow-sm' : 'text-[#9AA7D6] hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab('results')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                tab === 'results' ? 'bg-[#3D7BFF] text-white shadow-sm' : 'text-[#9AA7D6] hover:text-white'
              }`}
            >
              Results
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#F0BE4D] hover:underline cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Filter dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#26346B]/40 text-xs">
          {/* Matchday Select */}
          <div>
            <label className="block text-[#9AA7D6] mb-1 font-medium">Matchday</label>
            <select
              value={matchday}
              onChange={(e) => setMatchday(e.target.value)}
              aria-label="Filter by Matchday"
              className="w-full bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-[#EEF2FF] focus:outline-none focus:border-[#3D7BFF]"
            >
              <option value="all">All Matchdays</option>
              <option value="1">Matchday 1</option>
              <option value="2">Matchday 2</option>
              <option value="3">Matchday 3</option>
              <option value="4">Matchday 4</option>
              <option value="5">Matchday 5</option>
              <option value="6">Matchday 6</option>
              <option value="7">Matchday 7 (Current)</option>
              <option value="8">Matchday 8</option>
            </select>
          </div>

          {/* Club Select */}
          <div>
            <label className="block text-[#9AA7D6] mb-1 font-medium">Club</label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              aria-label="Filter by Club"
              className="w-full bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-[#EEF2FF] focus:outline-none focus:border-[#3D7BFF]"
            >
              <option value="all">All Clubs</option>
              {clubs?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-[#9AA7D6] mb-1 font-medium">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="Filter start date"
              className="w-full bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-[#EEF2FF] focus:outline-none focus:border-[#3D7BFF]"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[#9AA7D6] mb-1 font-medium">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="Filter end date"
              className="w-full bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-[#EEF2FF] focus:outline-none focus:border-[#3D7BFF]"
            />
          </div>
        </div>
      </div>

      {/* Matches Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matches found"
          message={
            dateFrom || dateTo
              ? 'No matches scheduled on these dates. Clear the date filter to see scheduled fixtures.'
              : 'No matches found matching the selected filter criteria. Try resetting your club or matchday filter.'
          }
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
};
