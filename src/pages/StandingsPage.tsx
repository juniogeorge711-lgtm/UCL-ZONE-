import React, { useState } from 'react';
import { useStandings } from '../hooks/useData';
import { StandingsTable } from '../components/standings/StandingsTable';
import { ChartCard } from '../components/charts/ChartCard';
import { CustomTooltip } from '../components/charts/CustomTooltip';
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

export const StandingsPage: React.FC = () => {
  const { data: standings, loading } = useStandings();

  // Allow selecting up to 5 clubs for points progression comparison
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([
    'liverpool',
    'inter-milan',
    'barcelona',
    'real-madrid',
    'manchester-city',
  ]);

  const toggleClubSelect = (clubId: string) => {
    setSelectedClubIds((prev) => {
      if (prev.includes(clubId)) {
        return prev.filter((id) => id !== clubId);
      }
      if (prev.length >= 5) {
        // replace the oldest selection
        return [...prev.slice(1), clubId];
      }
      return [...prev, clubId];
    });
  };

  // Build points progression chart data for matchdays 1 through 6
  const matchdays = [1, 2, 3, 4, 5, 6];
  const chartData = matchdays.map((md) => {
    const point: Record<string, number | string> = { matchday: `MD ${md}` };
    selectedClubIds.forEach((id) => {
      const row = standings?.find((s) => s.club.id === id);
      if (row) {
        point[row.club.shortName] = row.pointsProgression[md - 1] ?? 0;
      }
    });
    return point;
  });

  const clubPalette = ['#3D7BFF', '#2FB67C', '#F0BE4D', '#E5627A', '#9AA7D6'];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
          League Phase Standings
        </h1>
        <p className="text-sm text-[#9AA7D6] mt-1">
          Complete 36-team UEFA Champions League table and matchday point trajectory
        </p>
      </div>

      {/* Points Progression Line Chart Card */}
      <ChartCard
        title="Points Progression by Matchday"
        summary="Compare the trajectory of selected clubs across Matchdays 1 through 6. Select up to 5 clubs using the checkboxes in the table below."
        insight="Liverpool remain on a flawless 18-point trajectory through Matchday 6, while Inter Milan's draw with Man City on MD 5 was their only dropped points."
        tableData={{
          columns: ['Matchday', ...selectedClubIds.map((id) => standings?.find((s) => s.club.id === id)?.club.shortName || id)],
          rows: chartData.map((d) => [
            String(d.matchday),
            ...selectedClubIds.map((id) => {
              const name = standings?.find((s) => s.club.id === id)?.club.shortName || id;
              return Number(d[name] ?? 0);
            }),
          ]),
        }}
        isEmpty={selectedClubIds.length === 0}
        emptyMessage="Select at least one club from the table below to view points progression."
      >
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26346B" strokeOpacity={0.4} />
              <XAxis dataKey="matchday" stroke="#9AA7D6" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9AA7D6" tick={{ fontSize: 11 }} domain={[0, 18]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                formatter={(val) => <span className="text-[#EEF2FF]">{val}</span>}
              />
              {selectedClubIds.map((id, idx) => {
                const club = standings?.find((s) => s.club.id === id)?.club;
                if (!club) return null;
                return (
                  <Line
                    key={id}
                    type="monotone"
                    dataKey={club.shortName}
                    stroke={clubPalette[idx % clubPalette.length]}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: clubPalette[idx % clubPalette.length] }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 36-team Standings Table */}
      {loading || !standings ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <StandingsTable
          standings={standings}
          selectedClubIds={selectedClubIds}
          onToggleClubSelect={toggleClubSelect}
          maxSelectable={5}
        />
      )}
    </div>
  );
};
