import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaders, useClubs, usePlayers } from '../hooks/useData';
import { PlayerPosition } from '../types';
import { PlayerAvatar } from '../components/player/PlayerAvatar';
import { PlayerAttributesRadar } from '../components/player/PlayerAttributesRadar';
import { StatBar } from '../components/match/StatBar';
import { Crest } from '../components/ui/Crest';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, ArrowUpDown, Scale, X } from 'lucide-react';

type LeaderboardTab = 'goals' | 'assists' | 'cleanSheets' | 'appearances' | 'goalContributions';

export const PlayersPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<LeaderboardTab>('goals');
  const [selectedClubId, setSelectedClubId] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Comparison state: pick two players
  const [compareIds, setCompareIds] = useState<[string, string]>(['mbappe-k', 'haaland-e']);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const { data: clubs } = useClubs();
  const { data: allPlayers } = usePlayers();
  const { data: leaders, loading } = useLeaders(activeTab, {
    clubId: selectedClubId === 'all' ? undefined : selectedClubId,
    position: positionFilter === 'all' ? undefined : (positionFilter as PlayerPosition),
  });

  const filteredLeaders = useMemo(() => {
    if (!leaders) return [];
    if (!search.trim()) return leaders;
    const q = search.toLowerCase();
    return leaders.filter(
      (item) =>
        item.player.name.toLowerCase().includes(q) ||
        item.club.name.toLowerCase().includes(q) ||
        item.player.nationality.toLowerCase().includes(q)
    );
  }, [leaders, search]);

  // Selected comparison players
  const playerA = allPlayers?.find((p) => p.id === compareIds[0]) || allPlayers?.[0];
  const playerB = allPlayers?.find((p) => p.id === compareIds[1]) || allPlayers?.[1];

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Comparison Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
            Player Statistics & Leaderboards
          </h1>
          <p className="text-sm text-[#9AA7D6] mt-1">
            Official individual metrics, attacking contributions and historical comparisons
          </p>
        </div>

        <button
          onClick={() => setShowCompareModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#16214A] hover:bg-[#26346B] border border-[#26346B] rounded-xl transition-colors cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF]"
        >
          <Scale className="w-4 h-4 text-[#3D7BFF]" />
          <span>Compare 2 Players</span>
        </button>
      </div>

      {/* Leaderboard Category Tabs */}
      <div className="border-b border-[#26346B]/60 overflow-x-auto pb-0.5">
        <nav aria-label="Leaderboard Categories" className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { id: 'goals', label: 'Top Scorers' },
            { id: 'assists', label: 'Top Assists' },
            { id: 'goalContributions', label: 'Goals + Assists' },
            { id: 'cleanSheets', label: 'Clean Sheets (GK)' },
            { id: 'appearances', label: 'Most Appearances' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LeaderboardTab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#3D7BFF] text-white shadow-sm'
                  : 'text-[#9AA7D6] hover:text-white bg-[#0E1633] border border-[#26346B]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#9AA7D6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by player or club..."
            aria-label="Search players"
            className="w-full bg-[#16214A] border border-[#26346B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#9AA7D6]/60 focus:outline-none focus:border-[#3D7BFF]"
          />
        </div>

        {/* Club filter */}
        <div>
          <select
            value={selectedClubId}
            onChange={(e) => setSelectedClubId(e.target.value)}
            aria-label="Filter by club"
            className="w-full bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D7BFF]"
          >
            <option value="all">All Clubs</option>
            {clubs?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Position filter */}
        <div>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            aria-label="Filter by position"
            className="w-full bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D7BFF]"
          >
            <option value="all">All Positions</option>
            <option value="FW">Forwards (FW)</option>
            <option value="MF">Midfielders (MF)</option>
            <option value="DF">Defenders (DF)</option>
            <option value="GK">Goalkeepers (GK)</option>
          </select>
        </div>
      </div>

      {/* Rankings Leaderboard Table */}
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : filteredLeaders.length > 0 ? (
        <div className="rounded-xl border border-[#26346B]/60 bg-[#0E1633] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#26346B] bg-[#16214A]/60 text-[#9AA7D6] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 text-center w-14">Rank</th>
                  <th className="py-3 px-4 min-w-[200px]">Player</th>
                  <th className="py-3 px-4 min-w-[160px]">Club</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3 text-center">Nationality</th>
                  <th className="py-3 px-3 text-center">Apps</th>
                  <th className="py-3 px-4 text-center font-bold text-white bg-[#16214A]/40 min-w-[100px]">
                    {filteredLeaders[0]?.metricLabel}
                  </th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26346B]/40">
                {filteredLeaders.map((item) => (
                  <tr
                    key={item.player.id}
                    onClick={() => navigate(`/players/${item.player.id}`)}
                    className="hover:bg-[#16214A]/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-3 text-center font-mono-numbers font-bold text-white">
                      {item.rank <= 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F0BE4D]/20 text-[#F0BE4D] border border-[#F0BE4D]/40 text-xs">
                          {item.rank}
                        </span>
                      ) : (
                        item.rank
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar player={item.player} size="sm" />
                        <div>
                          <span className="font-semibold text-white group-hover:text-[#3D7BFF] transition-colors block">
                            {item.player.name}
                          </span>
                          <span className="text-[10px] text-[#9AA7D6]">
                            #{item.player.shirtNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Crest club={item.club} size="sm" />
                        <span className="text-[#EEF2FF] truncate">{item.club.shortName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#16214A] text-[#9AA7D6]">
                        {item.player.position}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-[#9AA7D6]">
                      {item.player.nationality}
                    </td>
                    <td className="py-3 px-3 text-center font-mono-numbers text-[#9AA7D6]">
                      {item.player.seasonStats.appearances}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-numbers font-black text-base text-white bg-[#16214A]/30">
                      {item.value}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[#3D7BFF] text-xs font-semibold group-hover:underline">
                        View →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No players found"
          message="No player matches the current filters. Clear your search or club filters to view leaders."
          actionLabel="Reset filters"
          onAction={() => {
            setSearch('');
            setSelectedClubId('all');
            setPositionFilter('all');
          }}
        />
      )}

      {/* 2-PLAYER COMPARISON MODAL */}
      {showCompareModal && playerA && playerB && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Player comparison"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-[#0E1633] border border-[#26346B] rounded-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#26346B]/60">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#3D7BFF]" />
                <h3 className="font-display text-2xl font-black uppercase text-white">
                  Head-to-Head Player Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-[#9AA7D6] hover:text-white p-1 rounded-lg cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selectors for 2 players */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-[#16214A]/40 p-3 rounded-xl border border-[#26346B]/50">
                <PlayerAvatar player={playerA} size="lg" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-bold text-[#3D7BFF] mb-1">
                    Player A (Blue)
                  </label>
                  <select
                    value={compareIds[0]}
                    onChange={(e) => setCompareIds([e.target.value, compareIds[1]])}
                    className="w-full bg-[#16214A] border border-[#26346B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#3D7BFF]"
                  >
                    {allPlayers?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.clubName} - {p.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#16214A]/40 p-3 rounded-xl border border-[#26346B]/50">
                <PlayerAvatar player={playerB} size="lg" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-bold text-[#F0BE4D] mb-1">
                    Player B (Gold)
                  </label>
                  <select
                    value={compareIds[1]}
                    onChange={(e) => setCompareIds([compareIds[0], e.target.value])}
                    className="w-full bg-[#16214A] border border-[#26346B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#F0BE4D]"
                  >
                    {allPlayers?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.clubName} - {p.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Radar Comparison */}
            <div className="p-4 rounded-xl bg-[#070B1F] border border-[#26346B]/60">
              <PlayerAttributesRadar
                attributes={playerA.attributes}
                secondAttributes={playerB.attributes}
                firstPlayerName={playerA.name}
                secondPlayerName={playerB.name}
                height={280}
              />
            </div>

            {/* Paired Stats Comparison Bars */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Season Comparison Metrics
              </h4>
              <StatBar
                label="Goals"
                homeVal={playerA.seasonStats.goals}
                awayVal={playerB.seasonStats.goals}
                homeColor="#3D7BFF"
                awayColor="#F0BE4D"
              />
              <StatBar
                label="Assists"
                homeVal={playerA.seasonStats.assists}
                awayVal={playerB.seasonStats.assists}
                homeColor="#3D7BFF"
                awayColor="#F0BE4D"
              />
              <StatBar
                label="Shots on Target"
                homeVal={playerA.seasonStats.shotsOnTarget}
                awayVal={playerB.seasonStats.shotsOnTarget}
                homeColor="#3D7BFF"
                awayColor="#F0BE4D"
              />
              <StatBar
                label="Pass Accuracy"
                homeVal={playerA.seasonStats.passAccuracy}
                awayVal={playerB.seasonStats.passAccuracy}
                homeColor="#3D7BFF"
                awayColor="#F0BE4D"
                isPercent
              />
              <StatBar
                label="Minutes Played"
                homeVal={playerA.seasonStats.minutesPlayed}
                awayVal={playerB.seasonStats.minutesPlayed}
                homeColor="#3D7BFF"
                awayColor="#F0BE4D"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#26346B]/60">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#16214A] hover:bg-[#26346B] rounded-lg transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
