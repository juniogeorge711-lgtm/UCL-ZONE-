import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClub, usePlayers, useMatches, useStandings } from '../hooks/useData';
import { Crest } from '../components/ui/Crest';
import { SquadTable } from '../components/club/SquadTable';
import { MatchCard } from '../components/match/MatchCard';
import { ChartCard } from '../components/charts/ChartCard';
import { CustomTooltip } from '../components/charts/CustomTooltip';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Trophy, MapPin, Calendar, User, ShieldCheck, ArrowLeft } from 'lucide-react';

export const ClubDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: club, loading: loadingClub } = useClub(id || 'real-madrid');
  const { data: players, loading: loadingPlayers } = usePlayers({ clubId: id });
  const { data: matches, loading: loadingMatches } = useMatches({ clubId: id });
  const { data: standings } = useStandings();

  if (loadingClub) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!club) {
    return (
      <EmptyState
        title="Club Not Found"
        message="The requested club profile does not exist or has been removed."
        actionLabel="Back to Clubs"
        onAction={() => navigate('/clubs')}
      />
    );
  }

  // Find standings row for this club
  const standingRow = standings?.find((s) => s.club.id === club.id);

  // Construct matchday scoring data
  // Sample trend: goals scored vs conceded
  const goalsTrendData = [
    { matchday: 'MD 1', scored: 3, conceded: 0 },
    { matchday: 'MD 2', scored: 2, conceded: 1 },
    { matchday: 'MD 3', scored: 1, conceded: 0 },
    { matchday: 'MD 4', scored: 2, conceded: 2 },
    { matchday: 'MD 5', scored: 3, conceded: 1 },
    { matchday: 'MD 6', scored: standingRow ? Math.max(1, Math.round(standingRow.goalsFor / 6)) : 2, conceded: standingRow ? Math.round(standingRow.goalsAgainst / 6) : 1 },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/clubs')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9AA7D6] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all clubs</span>
        </button>
      </div>

      {/* 1. CLUB PROFILE HERO */}
      <section
        aria-label={`${club.name} Profile`}
        className="relative rounded-3xl bg-gradient-to-r from-[#0E1633] to-[#16214A] border border-[#26346B] p-6 lg:p-10 shadow-xl overflow-hidden"
      >
        {/* Subtle club theme ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: club.colors.primary }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <Crest club={club} size="2xl" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#9AA7D6]">
                <span className="font-bold text-white uppercase tracking-wider">{club.code}</span>
                <span aria-hidden="true">·</span>
                <span>{club.country}</span>
                <span aria-hidden="true">·</span>
                <span>Founded {club.founded}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {club.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#9AA7D6] pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3D7BFF]" />
                  <span>{club.stadium} (Cap: {club.capacity.toLocaleString()})</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#F0BE4D]" />
                  <span>Manager: {club.manager}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Honours Badge cluster */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-[#070B1F]/60 border border-[#26346B]/60 p-4 shrink-0 text-center sm:text-right">
            <div className="flex items-center gap-2 text-[#F0BE4D] mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">European Honours</span>
            </div>
            <span className="font-display text-4xl font-black text-white font-mono-numbers">
              {club.honours.titles}
            </span>
            <span className="text-xs text-[#9AA7D6]">
              {club.honours.titles === 1 ? 'Title' : 'Champions League Titles'}
            </span>
            <div className="text-[11px] text-[#9AA7D6]/70 mt-2">
              <span>{club.honours.finals} Finals</span>
              <span className="mx-1.5">·</span>
              <span>{club.honours.appearances} UCL Campaigns</span>
            </div>
          </div>
        </div>

        {/* Current Season Record Strip */}
        {standingRow && (
          <div className="mt-8 pt-6 border-t border-[#26346B]/60 grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
              <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Table Rank</span>
              <span className="font-display text-xl font-black text-white font-mono-numbers">
                #{standingRow.position}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
              <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Points</span>
              <span className="font-display text-xl font-black text-[#3D7BFF] font-mono-numbers">
                {standingRow.points}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
              <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Record (W-D-L)</span>
              <span className="font-mono-numbers text-sm font-bold text-white">
                {standingRow.won}-{standingRow.drawn}-{standingRow.lost}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
              <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Goals Scored</span>
              <span className="font-display text-xl font-black text-[#2FB67C] font-mono-numbers">
                {standingRow.goalsFor}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
              <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Goals Conceded</span>
              <span className="font-display text-xl font-black text-[#E5627A] font-mono-numbers">
                {standingRow.goalsAgainst}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
              <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Goal Diff</span>
              <span className="font-display text-xl font-black text-white font-mono-numbers">
                {standingRow.goalDifference > 0 ? `+${standingRow.goalDifference}` : standingRow.goalDifference}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 2. GOALS SCORED VS CONCEDED CHART */}
      <section aria-label="Goals scored vs conceded per matchday">
        <ChartCard
          title="Goals Scored vs Conceded per Matchday"
          summary="Tracking attacking production and defensive containment across the league phase"
          insight={`${club.shortName} have maintained a positive goal differential in 5 of their 6 European fixtures.`}
          tableData={{
            columns: ['Matchday', 'Goals Scored', 'Goals Conceded'],
            rows: goalsTrendData.map((d) => [d.matchday, d.scored, d.conceded]),
          }}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={goalsTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} />
                <XAxis dataKey="matchday" stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(val) => <span className="text-[#EEF2FF]">{val}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="scored"
                  name="Goals Scored"
                  stroke="#2FB67C"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2FB67C' }}
                />
                <Line
                  type="monotone"
                  dataKey="conceded"
                  name="Goals Conceded"
                  stroke="#E5627A"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#E5627A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      {/* 3. SQUAD LIST */}
      <section aria-label="Club Squad" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-black uppercase text-white tracking-wide">
            Registered Squad
          </h2>
          <span className="text-xs text-[#9AA7D6]">
            {players?.length || 0} Players Profiled
          </span>
        </div>

        {loadingPlayers ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <SquadTable players={players || []} />
        )}
      </section>

      {/* 4. CLUB FIXTURES */}
      <section aria-label="Club Fixtures" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-black uppercase text-white tracking-wide">
            Season Fixtures & Results
          </h2>
          <span className="text-xs text-[#9AA7D6]">
            {matches?.length || 0} Matches
          </span>
        </div>

        {loadingMatches ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#9AA7D6]">
            No scheduled or past matches recorded for this club.
          </div>
        )}
      </section>
    </div>
  );
};
