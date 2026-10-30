import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer, useClub } from '../hooks/useData';
import { Crest } from '../components/ui/Crest';
import { PlayerAvatar } from '../components/player/PlayerAvatar';
import { PlayerAttributesRadar } from '../components/player/PlayerAttributesRadar';
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
import { Trophy, ArrowLeft, Award, Activity, ShieldCheck } from 'lucide-react';

export const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: player, loading: loadingPlayer } = usePlayer(id || 'mbappe-k');
  const { data: club } = useClub(player?.clubId || '');

  if (loadingPlayer) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!player) {
    return (
      <EmptyState
        title="Player Profile Not Found"
        message="The requested European player record could not be loaded."
        actionLabel="Back to Players"
        onAction={() => navigate('/players')}
      />
    );
  }

  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  // Recharts historical goals/assists trajectory data
  const historyData = [...player.history].reverse().map((h) => ({
    season: h.season,
    goals: h.goals,
    assists: h.assists,
    appearances: h.appearances,
  }));

  return (
    <div className="space-y-10 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/players')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9AA7D6] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to player leaderboards</span>
        </button>
      </div>

      {/* 1. PLAYER HERO CARD */}
      <section
        aria-label={`${player.name} Profile`}
        className="relative rounded-3xl bg-gradient-to-r from-[#0E1633] via-[#0E1633] to-[#16214A] border border-[#26346B] p-6 lg:p-10 shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Official face portrait avatar badge */}
            <PlayerAvatar player={player} size="2xl" className="border-2 border-[#3D7BFF]/50 shadow-xl" />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#9AA7D6]">
                <span className="font-mono-numbers font-black text-white">#{player.shirtNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold text-[#3D7BFF] uppercase">{player.position}</span>
                <span aria-hidden="true">·</span>
                <span>{player.nationality}</span>
                <span aria-hidden="true">·</span>
                <span>Age {player.age}</span>
                <span aria-hidden="true">·</span>
                <span>{player.heightCm} cm</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {player.name}
              </h1>

              {club && (
                <div
                  onClick={() => navigate(`/clubs/${club.id}`)}
                  className="inline-flex items-center gap-2 text-xs text-[#EEF2FF] hover:text-[#3D7BFF] transition-colors cursor-pointer mt-1"
                >
                  <Crest club={club} size="sm" />
                  <span className="font-semibold">{club.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Career Totals Card */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-[#070B1F]/60 border border-[#26346B]/60 p-5 shrink-0 text-center sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F0BE4D] mb-1">
              UCL Career Totals
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-black text-white font-mono-numbers">
                {player.careerStats.uclGoals}
              </span>
              <span className="text-xs text-[#9AA7D6]">Goals</span>
              <span className="font-display text-2xl font-bold text-[#9AA7D6] font-mono-numbers ml-2">
                / {player.careerStats.uclAppearances}
              </span>
              <span className="text-xs text-[#9AA7D6]">Apps</span>
            </div>
            <div className="text-[11px] text-[#9AA7D6]/70 mt-2">
              <span>{player.careerStats.uclAssists} Assists</span>
              <span className="mx-1.5">·</span>
              <span>{player.careerStats.uclTitles} Titles</span>
            </div>
          </div>
        </div>

        {/* 2026/27 Season Stats Strip */}
        <div className="mt-8 pt-6 border-t border-[#26346B]/60 grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
            <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Appearances</span>
            <span className="font-display text-xl font-black text-white font-mono-numbers">
              {player.seasonStats.appearances}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
            <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Goals</span>
            <span className="font-display text-xl font-black text-[#2FB67C] font-mono-numbers">
              {player.seasonStats.goals}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
            <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Assists</span>
            <span className="font-display text-xl font-black text-[#3D7BFF] font-mono-numbers">
              {player.seasonStats.assists}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
            <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Minutes</span>
            <span className="font-mono-numbers text-sm font-bold text-white">
              {player.seasonStats.minutesPlayed}'
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
            <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Pass Accuracy</span>
            <span className="font-mono-numbers text-sm font-bold text-white">
              {player.seasonStats.passAccuracy}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#070B1F]/40 border border-[#26346B]/40">
            <span className="text-[10px] text-[#9AA7D6] uppercase tracking-wider block">Expected Goals (xG)</span>
            <span className="font-display text-xl font-black text-[#F0BE4D] font-mono-numbers">
              {player.seasonStats.xG}
            </span>
          </div>
        </div>
      </section>

      {/* 2. CHARTS: RADAR ATTRIBUTES + CAREER SEASON TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar attributes */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Skill Attributes Radar"
            summary="Assessment across pace, shooting, passing, dribbling, defending, and physicality"
            insight={`${player.name} ranks in the top percentiles for technical execution and match influence.`}
            tableData={{
              columns: ['Attribute', 'Rating (0-100)'],
              rows: Object.entries(player.attributes).map(([key, val]) => [
                key.charAt(0).toUpperCase() + key.slice(1),
                val,
              ]),
            }}
          >
            <PlayerAttributesRadar attributes={player.attributes} firstPlayerName={player.name} />
          </ChartCard>
        </div>

        {/* Season Goals & Assists Line Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="UCL Performance by Season"
            summary="Year-on-year tracking of Champions League goals and assists"
            insight={`Averaging ${(player.careerStats.uclGoals / Math.max(1, player.history.length)).toFixed(1)} European goals per recorded season.`}
            tableData={{
              columns: ['Season', 'Goals', 'Assists', 'Appearances'],
              rows: historyData.map((d) => [d.season, d.goals, d.assists, d.appearances]),
            }}
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} />
                  <XAxis dataKey="season" stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                    formatter={(val) => <span className="text-[#EEF2FF]">{val}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="goals"
                    name="Goals"
                    stroke="#2FB67C"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2FB67C' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="assists"
                    name="Assists"
                    stroke="#3D7BFF"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3D7BFF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* 3. ACHIEVEMENTS & CAREER MILESTONES (Clearly labeled sample data) */}
      <section aria-label="Player achievements" className="rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F0BE4D]" />
            <h3 className="text-base font-bold text-white">Honours & Career Highlights</h3>
          </div>
          <span className="text-[11px] text-[#9AA7D6] bg-[#16214A] px-2 py-0.5 rounded border border-[#26346B]">
            Sample demonstration data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {player.achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#16214A]/40 border border-[#26346B]/50 flex items-start gap-2.5 text-xs text-[#EEF2FF]"
            >
              <Trophy className="w-4 h-4 text-[#F0BE4D] shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
