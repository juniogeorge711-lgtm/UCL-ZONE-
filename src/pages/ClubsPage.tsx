import React, { useState, useMemo } from 'react';
import { useClubs } from '../hooks/useData';
import { ClubTile } from '../components/club/ClubTile';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Search } from 'lucide-react';

export const ClubsPage: React.FC = () => {
  const { data: clubs, loading } = useClubs();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  const countries = useMemo(() => {
    if (!clubs) return [];
    return Array.from(new Set(clubs.map((c) => c.country))).sort();
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    if (!clubs) return [];
    return clubs.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = countryFilter === 'all' || c.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [clubs, search, countryFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
          European Clubs
        </h1>
        <p className="text-sm text-[#9AA7D6] mt-1">
          Explore all 36 clubs competing in the UEFA Champions League league phase
        </p>
      </div>

      {/* Search & Country Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-[#9AA7D6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs or code..."
            aria-label="Search clubs"
            className="w-full bg-[#16214A] border border-[#26346B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#9AA7D6]/60 focus:outline-none focus:border-[#3D7BFF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-[#9AA7D6] whitespace-nowrap">Filter country:</label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            aria-label="Filter clubs by country"
            className="bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D7BFF] w-full sm:w-auto"
          >
            <option value="all">All Countries ({clubs?.length || 36})</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClubs.map((club) => (
            <ClubTile key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No clubs match your criteria"
          message="Try resetting your search query or country filter to view clubs."
          actionLabel="Reset filters"
          onAction={() => {
            setSearch('');
            setCountryFilter('all');
          }}
        />
      )}
    </div>
  );
};
