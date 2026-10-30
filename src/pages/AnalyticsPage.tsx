import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStandings, usePlayers, useClubs } from '../hooks/useData';
import { ChartCard } from '../components/charts/ChartCard';
import { CustomTooltip } from '../components/charts/CustomTooltip';
import { Skeleton } from '../components/ui/Skeleton';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  Target,
  Shield,
  Percent,
  Flame,
  RotateCcw,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters stored in URL query string for shareability
  const season = searchParams.get('season') || '2026/27';
  const selectedClub = searchParams.get('club') || 'all';
  const selectedPlayer = searchParams.get('player') || 'all';

  const updateFilter = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'all') {
      params.delete(key);
    } else {
      params.set(key, val);
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const { data: standings, loading: loadingStandings } = useStandings(season);
  const { data: allPlayers, loading: loadingPlayers } = usePlayers();
  const { data: allClubs } = useClubs();

  // Goals per matchday view toggle: total, home, away
  const [goalsToggle, setGoalsToggle] = useState<'total' | 'home' | 'away'>('total');

  // Club goals chart sort direction
  const [teamGoalsSort, setTeamGoalsSort] = useState<'desc' | 'asc'>('desc');
  const [teamConcededSort, setTeamConcededSort] = useState<'asc' | 'desc'>('asc');

  // Multi-player comparison selection (2-4 players)
  const [comparePlayerIds, setComparePlayerIds] = useState<string[]>([
    'mbappe-k',
    'haaland-e',
    'kane-h',
    'vinicius-jr',
  ]);

  // Multi-club comparison selection (2-4 clubs)
  const [compareClubIds, setCompareClubIds] = useState<string[]>([
    'liverpool',
    'barcelona',
    'real-madrid',
    'inter-milan',
  ]);

  // 1. KPI Statistics summary
  const totalGoals = useMemo(() => {
    if (!standings) return 0;
    return standings.reduce((acc, row) => acc + row.goalsFor, 0);
  }, [standings]);

  const totalMatches = 108; // 6 matchdays * 18 matches
  const goalsPerMatch = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : '0';
  const totalCleanSheets = 54;
  const avgPossession = 50.0;
  const shotsOnTargetPct = 38.6;

  // 2. Top Goalscorers horizontal bar chart data
  const topScorersData = useMemo(() => {
    if (!allPlayers) return [];
    let list = [...allPlayers];
    if (selectedClub !== 'all') {
      list = list.filter((p) => p.clubId === selectedClub);
    }
    return list
      .sort((a, b) => b.seasonStats.goals - a.seasonStats.goals)
      .slice(0, 8)
      .map((p) => ({
        name: p.shortName,
        goals: p.seasonStats.goals,
        club: p.clubName,
      }));
  }, [allPlayers, selectedClub]);

  // 3. Top Assist Providers horizontal bar chart data
  const topAssistsData = useMemo(() => {
    if (!allPlayers) return [];
    let list = [...allPlayers];
    if (selectedClub !== 'all') {
      list = list.filter((p) => p.clubId === selectedClub);
    }
    return list
      .sort((a, b) => b.seasonStats.assists - a.seasonStats.assists)
      .slice(0, 8)
      .map((p) => ({
        name: p.shortName,
        assists: p.seasonStats.assists,
        club: p.clubName,
      }));
  }, [allPlayers, selectedClub]);

  // 4. Most Clean Sheets
  const cleanSheetsData = useMemo(() => {
    if (!allPlayers) return [];
    return allPlayers
      .filter((p) => p.position === 'GK')
      .sort((a, b) => b.seasonStats.cleanSheets - a.seasonStats.cleanSheets)
      .slice(0, 7)
      .map((p) => ({
        name: p.shortName,
        cleanSheets: p.seasonStats.cleanSheets,
        club: p.clubName,
      }));
  }, [allPlayers]);

  // 5. Team Goals Scored
  const teamScoredData = useMemo(() => {
    if (!standings) return [];
    const list = [...standings].map((s) => ({
      club: s.club.shortName,
      goals: s.goalsFor,
    }));
    list.sort((a, b) => (teamGoalsSort === 'desc' ? b.goals - a.goals : a.goals - b.goals));
    return list.slice(0, 10);
  }, [standings, teamGoalsSort]);

  // 6. Team Goals Conceded
  const teamConcededData = useMemo(() => {
    if (!standings) return [];
    const list = [...standings].map((s) => ({
      club: s.club.shortName,
      conceded: s.goalsAgainst,
    }));
    list.sort((a, b) => (teamConcededSort === 'asc' ? a.conceded - b.conceded : b.conceded - a.conceded));
    return list.slice(0, 10);
  }, [standings, teamConcededSort]);

  // 7. Goals Per Matchday
  const matchdayGoalsData = [
    { matchday: 'MD 1', total: 58, home: 35, away: 23 },
    { matchday: 'MD 2', total: 52, home: 29, away: 23 },
    { matchday: 'MD 3', total: 61, home: 34, away: 27 },
    { matchday: 'MD 4', total: 49, home: 26, away: 23 },
    { matchday: 'MD 5', total: 54, home: 31, away: 23 },
    { matchday: 'MD 6', total: 56, home: 33, away: 23 },
  ];

  // 8. Player comparison grouped bar + radar data
  const comparePlayersList = useMemo(() => {
    if (!allPlayers) return [];
    return comparePlayerIds
      .map((id) => allPlayers.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [allPlayers, comparePlayerIds]);

  const playerGroupedStats: Array<{ metric: string } & Record<string, string | number>> = [
    {
      metric: 'Goals',
      ...Object.fromEntries(comparePlayersList.map((p) => [p.shortName, p.seasonStats.goals])),
    },
    {
      metric: 'Assists',
      ...Object.fromEntries(comparePlayersList.map((p) => [p.shortName, p.seasonStats.assists])),
    },
    {
      metric: 'Shots on Target',
      ...Object.fromEntries(comparePlayersList.map((p) => [p.shortName, p.seasonStats.shotsOnTarget])),
    },
    {
      metric: 'xG',
      ...Object.fromEntries(comparePlayersList.map((p) => [p.shortName, p.seasonStats.xG])),
    },
  ];

  // 9. Club multi-radar (Attack, Defence, Possession, Passing, Discipline)
  const clubRadarDimensions = [
    { dimension: 'Attack Threat', liverpool: 94, barcelona: 96, 'real-madrid': 91, 'inter-milan': 82 },
    { dimension: 'Defensive Resilience', liverpool: 92, barcelona: 80, 'real-madrid': 83, 'inter-milan': 97 },
    { dimension: 'Territorial Possession', liverpool: 88, barcelona: 91, 'real-madrid': 86, 'inter-milan': 78 },
    { dimension: 'Passing Accuracy', liverpool: 90, barcelona: 93, 'real-madrid': 92, 'inter-milan': 86 },
    { dimension: 'Discipline', liverpool: 85, barcelona: 82, 'real-madrid': 81, 'inter-milan': 89 },
  ];

  const palette = ['#3D7BFF', '#2FB67C', '#F0BE4D', '#E5627A'];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header & Global Filters */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
            Football Analytics & Advanced Metrics
          </h1>
          <p className="text-sm text-[#9AA7D6] mt-1">
            Global performance intelligence driving club and player evaluations across the competition
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="rounded-2xl bg-[#0E1633] border border-[#26346B]/60 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto">
            {/* Season */}
            <div>
              <label className="text-[#9AA7D6] mr-2 font-medium">Season:</label>
              <select
                value={season}
                onChange={(e) => updateFilter('season', e.target.value)}
                className="bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#3D7BFF]"
              >
                <option value="2026/27">2026/27 (Current)</option>
                <option value="2025/26">2025/26</option>
                <option value="2024/25">2024/25</option>
                <option value="2023/24">2023/24</option>
                <option value="2022/23">2022/23</option>
              </select>
            </div>

            {/* Club */}
            <div>
              <label className="text-[#9AA7D6] mr-2 font-medium">Club:</label>
              <select
                value={selectedClub}
                onChange={(e) => updateFilter('club', e.target.value)}
                className="bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#3D7BFF]"
              >
                <option value="all">All Clubs</option>
                {allClubs?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Player */}
            <div>
              <label className="text-[#9AA7D6] mr-2 font-medium">Player:</label>
              <select
                value={selectedPlayer}
                onChange={(e) => updateFilter('player', e.target.value)}
                className="bg-[#16214A] border border-[#26346B] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#3D7BFF]"
              >
                <option value="all">All Players</option>
                {allPlayers?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.clubName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(selectedClub !== 'all' || selectedPlayer !== 'all' || season !== '2026/27') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#F0BE4D] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards Row */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
          <div className="flex items-center justify-between text-[#3D7BFF] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Goals</span>
            <Flame className="w-4 h-4" />
          </div>
          <span className="font-display text-3xl font-black text-white font-mono-numbers">
            {totalGoals}
          </span>
          <span className="text-[11px] text-[#9AA7D6] block mt-1">108 matches played</span>
        </div>

        <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
          <div className="flex items-center justify-between text-[#2FB67C] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Goals / Match</span>
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-display text-3xl font-black text-white font-mono-numbers">
            {goalsPerMatch}
          </span>
          <span className="text-[11px] text-[#9AA7D6] block mt-1">Tournament average</span>
        </div>

        <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
          <div className="flex items-center justify-between text-[#F0BE4D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Clean Sheets</span>
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-display text-3xl font-black text-white font-mono-numbers">
            {totalCleanSheets}
          </span>
          <span className="text-[11px] text-[#9AA7D6] block mt-1">Led by Inter Milan (5)</span>
        </div>

        <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4">
          <div className="flex items-center justify-between text-[#9AA7D6] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Possession</span>
            <Percent className="w-4 h-4 text-[#3D7BFF]" />
          </div>
          <span className="font-display text-3xl font-black text-white font-mono-numbers">
            {avgPossession}%
          </span>
          <span className="text-[11px] text-[#9AA7D6] block mt-1">Man City peak at 66%</span>
        </div>

        <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[#E5627A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shot Accuracy</span>
            <Target className="w-4 h-4" />
          </div>
          <span className="font-display text-3xl font-black text-white font-mono-numbers">
            {shotsOnTargetPct}%
          </span>
          <span className="text-[11px] text-[#9AA7D6] block mt-1">On-target conversion</span>
        </div>
      </section>

      {/* 3. Top Scorers & Top Assists Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers */}
        <ChartCard
          title="Top Goalscorers"
          summary="Highest individual goal tallies in the 2026/27 UEFA Champions League"
          insight={topScorersData.length > 0 ? `${topScorersData[0]?.name} leads Europe with ${topScorersData[0]?.goals} goals.` : 'No scorers data available.'}
          tableData={{
            columns: ['Player', 'Club', 'Goals'],
            rows: topScorersData.map((d) => [d.name, d.club, d.goals]),
          }}
        >
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topScorersData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} horizontal={false} />
                <XAxis type="number" stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#EEF2FF" tick={{ fontSize: 11 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="goals" name="Goals" fill="#3D7BFF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Top Assists */}
        <ChartCard
          title="Top Assist Providers"
          summary="Players with the most direct assists in the competition"
          insight={topAssistsData.length > 0 ? `${topAssistsData[0]?.name} has registered the most decisive final passes (${topAssistsData[0]?.assists} assists).` : 'No assists data available.'}
          tableData={{
            columns: ['Player', 'Club', 'Assists'],
            rows: topAssistsData.map((d) => [d.name, d.club, d.assists]),
          }}
        >
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topAssistsData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} horizontal={false} />
                <XAxis type="number" stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#EEF2FF" tick={{ fontSize: 11 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="assists" name="Assists" fill="#F0BE4D" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. Team Goals Scored vs Conceded (Sortable Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Scored */}
        <ChartCard
          title="Team Goals Scored"
          summary="Top 10 most prolific attacks in the competition"
          insight="Barcelona and Liverpool boast Europe's most destructive attacks, scoring over 2.5 goals per match."
          tableData={{
            columns: ['Club', 'Goals Scored'],
            rows: teamScoredData.map((d) => [d.club, d.goals]),
          }}
        >
          <div className="w-full space-y-2">
            <div className="flex justify-end text-xs text-[#9AA7D6]">
              <button
                onClick={() => setTeamGoalsSort(teamGoalsSort === 'desc' ? 'asc' : 'desc')}
                className="hover:text-white underline cursor-pointer"
              >
                Sort: {teamGoalsSort === 'desc' ? 'Highest first' : 'Lowest first'}
              </button>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamScoredData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="club" stroke="#9AA7D6" tick={{ fontSize: 10, angle: -30, textAnchor: 'end' }} />
                  <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="goals" name="Goals Scored" fill="#2FB67C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        {/* Goals Conceded */}
        <ChartCard
          title="Team Goals Conceded"
          summary="Top 10 strongest defences in the competition"
          insight="Inter Milan have conceded just 1 goal across 540 minutes of football."
          tableData={{
            columns: ['Club', 'Goals Conceded'],
            rows: teamConcededData.map((d) => [d.club, d.conceded]),
          }}
        >
          <div className="w-full space-y-2">
            <div className="flex justify-end text-xs text-[#9AA7D6]">
              <button
                onClick={() => setTeamConcededSort(teamConcededSort === 'asc' ? 'desc' : 'asc')}
                className="hover:text-white underline cursor-pointer"
              >
                Sort: {teamConcededSort === 'asc' ? 'Fewest first' : 'Most first'}
              </button>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamConcededData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="club" stroke="#9AA7D6" tick={{ fontSize: 10, angle: -30, textAnchor: 'end' }} />
                  <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="conceded" name="Goals Conceded" fill="#E5627A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* 5. Goals Per Matchday Line Chart with Home/Away/Total Toggle */}
      <ChartCard
        title="Goals Produced per Matchday"
        summary="Scoring output trends across matchdays with venue breakdown"
        insight="Matchday 3 saw the season's scoring peak with 61 goals scored across 18 matches (3.39 per match)."
        tableData={{
          columns: ['Matchday', 'Total Goals', 'Home Goals', 'Away Goals'],
          rows: matchdayGoalsData.map((d) => [d.matchday, d.total, d.home, d.away]),
        }}
      >
        <div className="w-full space-y-3">
          {/* Toggle buttons */}
          <div className="flex justify-end">
            <div className="inline-flex p-1 bg-[#16214A] rounded-lg border border-[#26346B] text-xs">
              <button
                onClick={() => setGoalsToggle('total')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  goalsToggle === 'total' ? 'bg-[#3D7BFF] text-white' : 'text-[#9AA7D6] hover:text-white'
                }`}
              >
                Total Goals
              </button>
              <button
                onClick={() => setGoalsToggle('home')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  goalsToggle === 'home' ? 'bg-[#3D7BFF] text-white' : 'text-[#9AA7D6] hover:text-white'
                }`}
              >
                Home Goals
              </button>
              <button
                onClick={() => setGoalsToggle('away')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  goalsToggle === 'away' ? 'bg-[#3D7BFF] text-white' : 'text-[#9AA7D6] hover:text-white'
                }`}
              >
                Away Goals
              </button>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={matchdayGoalsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} />
                <XAxis dataKey="matchday" stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(val) => <span className="text-[#EEF2FF]">{val}</span>}
                />
                {(goalsToggle === 'total' || goalsToggle === 'home') && (
                  <Line
                    type="monotone"
                    dataKey="home"
                    name="Home Goals"
                    stroke="#3D7BFF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
                {(goalsToggle === 'total' || goalsToggle === 'away') && (
                  <Line
                    type="monotone"
                    dataKey="away"
                    name="Away Goals"
                    stroke="#F0BE4D"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
                {goalsToggle === 'total' && (
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Matchday Goals"
                    stroke="#2FB67C"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ChartCard>

      {/* 6. Multi-Player Performance Comparison (2-4 players) */}
      <ChartCard
        title="Player Performance Comparison (2–4 Players)"
        summary="Grouped bar analysis comparing attacking output and underlying expected goals (xG)"
        insight="Erling Haaland leads in raw shot conversion efficiency, whereas Vinícius Júnior and Kylian Mbappé create higher combinative volume."
        tableData={{
          columns: ['Metric', ...comparePlayersList.map((p) => p.shortName)],
          rows: playerGroupedStats.map((st) => [
            st.metric,
            ...comparePlayersList.map((p) => Number(st[p.shortName] ?? 0)),
          ]),
        }}
      >
        <div className="w-full space-y-4">
          {/* Player selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#9AA7D6] font-medium">Select 2 to 4 Players:</span>
            {allPlayers?.slice(0, 10).map((p) => {
              const isSelected = comparePlayerIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (isSelected) {
                      if (comparePlayerIds.length > 2) {
                        setComparePlayerIds(comparePlayerIds.filter((id) => id !== p.id));
                      }
                    } else {
                      if (comparePlayerIds.length < 4) {
                        setComparePlayerIds([...comparePlayerIds, p.id]);
                      } else {
                        setComparePlayerIds([...comparePlayerIds.slice(1), p.id]);
                      }
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D7BFF] text-white'
                      : 'bg-[#16214A] text-[#9AA7D6] hover:text-white border border-[#26346B]'
                  }`}
                >
                  {p.shortName}
                </button>
              );
            })}
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playerGroupedStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="metric" stroke="#EEF2FF" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(val) => <span className="text-[#EEF2FF]">{val}</span>}
                />
                {comparePlayersList.map((player, idx) => (
                  <Bar
                    key={player.id}
                    dataKey={player.shortName}
                    name={player.name}
                    fill={palette[idx % palette.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ChartCard>

      {/* 7. Multi-Club Radar Comparison (Attack, Defence, Possession, Passing, Discipline) */}
      <ChartCard
        title="Elite Club Profiles Radar"
        summary="Comprehensive radar comparison across attack threat, defensive resilience, possession, passing and discipline"
        insight="Inter Milan command Europe's strongest defensive index (97), while Barcelona pace the continent in passing precision and attacking threat."
        tableData={{
          columns: ['Dimension', 'Liverpool', 'Barcelona', 'Real Madrid', 'Inter Milan'],
          rows: clubRadarDimensions.map((d) => [
            d.dimension,
            d.liverpool,
            d.barcelona,
            d['real-madrid'],
            d['inter-milan'],
          ]),
        }}
      >
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={clubRadarDimensions}>
              <PolarGrid stroke="#26346B" strokeOpacity={0.6} />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#9AA7D6', fontSize: 10, fontWeight: 600 }}
              />
              <PolarRadiusAxis angle={30} domain={[60, 100]} stroke="#26346B" tick={false} />
              <Radar
                name="Liverpool"
                dataKey="liverpool"
                stroke="#E5627A"
                fill="#E5627A"
                fillOpacity={0.25}
              />
              <Radar
                name="Barcelona"
                dataKey="barcelona"
                stroke="#3D7BFF"
                fill="#3D7BFF"
                fillOpacity={0.25}
              />
              <Radar
                name="Real Madrid"
                dataKey="real-madrid"
                stroke="#F0BE4D"
                fill="#F0BE4D"
                fillOpacity={0.25}
              />
              <Radar
                name="Inter Milan"
                dataKey="inter-milan"
                stroke="#2FB67C"
                fill="#2FB67C"
                fillOpacity={0.25}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                formatter={(val) => <span className="text-[#EEF2FF]">{val}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};
