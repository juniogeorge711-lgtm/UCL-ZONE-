import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch } from '../hooks/useData';
import { Scoreboard } from '../components/match/Scoreboard';
import { StatBar } from '../components/match/StatBar';
import { Timeline } from '../components/match/Timeline';
import { PitchLineup } from '../components/match/PitchLineup';
import { ChartCard } from '../components/charts/ChartCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

export const MatchCentrePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'lineups' | 'timeline'>('overview');

  const { data: match, loading } = useMatch(id || 'm-2026-07-rma-mci');

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!match) {
    return (
      <EmptyState
        title="Match Not Found"
        message="The requested Champions League match record could not be loaded."
        actionLabel="Back to Fixtures"
        onAction={() => navigate('/fixtures')}
      />
    );
  }

  // Tactical Radar profile data
  const radarCategories = match.radarProfile?.categories || [
    'Attacking Threat',
    'Pressing & Recovery',
    'Possession Control',
    'Box Dominance',
    'Set Piece Danger',
  ];
  const radarData = radarCategories.map((cat, idx) => ({
    metric: cat,
    home: match.radarProfile?.home[idx] ?? 80,
    away: match.radarProfile?.away[idx] ?? 75,
  }));

  const stats = match.stats;

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/fixtures')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9AA7D6] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to fixtures</span>
        </button>
      </div>

      {/* Prominent Scoreboard Header */}
      <Scoreboard match={match} />

      {/* Match Centre Navigation Tabs */}
      <div className="flex border-b border-[#26346B]/60">
        <nav aria-label="Match Centre Tabs" className="flex space-x-6 text-sm font-semibold">
          {(['overview', 'stats', 'lineups', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize transition-colors relative cursor-pointer ${
                activeTab === tab
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'text-[#9AA7D6] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Quick Stats Snapshot */}
          <div className="lg:col-span-7 space-y-6">
            {stats ? (
              <div className="rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-6">
                <h3 className="text-base font-bold text-white mb-4">Key Match Statistics</h3>
                <div className="space-y-3">
                  <StatBar
                    label="Possession"
                    homeVal={stats.possession[0]}
                    awayVal={stats.possession[1]}
                    isPercent
                  />
                  <StatBar
                    label="Expected Goals (xG)"
                    homeVal={stats.xG[0]}
                    awayVal={stats.xG[1]}
                  />
                  <StatBar
                    label="Total Shots"
                    homeVal={stats.shots[0]}
                    awayVal={stats.shots[1]}
                  />
                  <StatBar
                    label="Shots on Target"
                    homeVal={stats.shotsOnTarget[0]}
                    awayVal={stats.shotsOnTarget[1]}
                  />
                  <StatBar
                    label="Pass Accuracy"
                    homeVal={stats.passAccuracy[0]}
                    awayVal={stats.passAccuracy[1]}
                    isPercent
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-6 text-center text-xs text-[#9AA7D6]">
                Detailed statistics will be published upon kickoff.
              </div>
            )}

            {/* Match Preview context note */}
            <div className="rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-6 space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Tactical Preview
              </h4>
              <p className="text-xs text-[#9AA7D6] leading-relaxed">
                Both clubs enter Matchday {match.matchday} vying for direct qualification to the Round of 16. With 36 clubs ranked across a single table, goal differential and away tactical efficiency will be paramount.
              </p>
            </div>
          </div>

          {/* Right Column: Recharts Radar Comparison */}
          <div className="lg:col-span-5">
            <ChartCard
              title="Team Profile Comparison"
              summary="Tactical and physical radar comparing offensive threat, recovery and control"
              insight={`${match.homeTeam.shortName} exhibit higher box penetration while ${match.awayTeam.shortName} excel in territorial control.`}
              tableData={{
                columns: ['Dimension', match.homeTeam.shortName, match.awayTeam.shortName],
                rows: radarData.map((d) => [d.metric, d.home, d.away]),
              }}
            >
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                    <PolarGrid stroke="#26346B" strokeOpacity={0.6} />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: '#9AA7D6', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#26346B" tick={false} />
                    <Radar
                      name={match.homeTeam.shortName}
                      dataKey="home"
                      stroke="#3D7BFF"
                      fill="#3D7BFF"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name={match.awayTeam.shortName}
                      dataKey="away"
                      stroke="#F0BE4D"
                      fill="#F0BE4D"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 text-xs mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#3D7BFF]" />
                    <span className="font-semibold text-white">{match.homeTeam.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F0BE4D]" />
                    <span className="font-semibold text-white">{match.awayTeam.shortName}</span>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Complete Match Statistics</h3>
          {stats ? (
            <div className="space-y-4 divide-y divide-[#26346B]/30">
              <StatBar
                label="Possession"
                homeVal={stats.possession[0]}
                awayVal={stats.possession[1]}
                isPercent
              />
              <StatBar
                label="Expected Goals (xG)"
                homeVal={stats.xG[0]}
                awayVal={stats.xG[1]}
              />
              <StatBar
                label="Total Shots"
                homeVal={stats.shots[0]}
                awayVal={stats.shots[1]}
              />
              <StatBar
                label="Shots on Target"
                homeVal={stats.shotsOnTarget[0]}
                awayVal={stats.shotsOnTarget[1]}
              />
              <StatBar
                label="Total Passes"
                homeVal={stats.passes[0]}
                awayVal={stats.passes[1]}
              />
              <StatBar
                label="Pass Accuracy"
                homeVal={stats.passAccuracy[0]}
                awayVal={stats.passAccuracy[1]}
                isPercent
              />
              <StatBar
                label="Corners"
                homeVal={stats.corners[0]}
                awayVal={stats.corners[1]}
              />
              <StatBar
                label="Fouls Committed"
                homeVal={stats.fouls[0]}
                awayVal={stats.fouls[1]}
              />
              <StatBar
                label="Yellow Cards"
                homeVal={stats.yellowCards[0]}
                awayVal={stats.yellowCards[1]}
              />
              <StatBar
                label="Goalkeeper Saves"
                homeVal={stats.saves[0]}
                awayVal={stats.saves[1]}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-[#9AA7D6]">
              Detailed statistics are not yet available for this fixture.
            </div>
          )}
        </div>
      )}

      {activeTab === 'lineups' && (
        <PitchLineup
          homeLineup={match.lineups?.home}
          awayLineup={match.lineups?.away}
          homeClubName={match.homeTeam.name}
          awayClubName={match.awayTeam.name}
        />
      )}

      {activeTab === 'timeline' && (
        <div className="rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-6">
          <h3 className="text-base font-bold text-white mb-6 text-center">
            Match Timeline & Key Incidents
          </h3>
          <Timeline
            events={match.events || []}
            homeClubName={match.homeTeam.name}
            awayClubName={match.awayTeam.name}
          />
        </div>
      )}
    </div>
  );
};
