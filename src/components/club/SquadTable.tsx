import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../../types';
import { PlayerAvatar } from '../player/PlayerAvatar';

interface SquadTableProps {
  players: Player[];
}

export const SquadTable: React.FC<SquadTableProps> = ({ players }) => {
  const navigate = useNavigate();

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#9AA7D6]">
        No player squad records available for this club.
      </div>
    );
  }

  // Sort by shirt number
  const sorted = [...players].sort((a, b) => a.shirtNumber - b.shirtNumber);

  return (
    <div className="rounded-xl border border-[#26346B]/60 bg-[#0E1633] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#26346B] bg-[#16214A]/60 text-[#9AA7D6] uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 w-12 text-center">No.</th>
              <th className="py-2.5 px-4">Player</th>
              <th className="py-2.5 px-3">Pos</th>
              <th className="py-2.5 px-3">Age</th>
              <th className="py-2.5 px-3">Nationality</th>
              <th className="py-2.5 px-3 text-center">Apps</th>
              <th className="py-2.5 px-3 text-center font-bold text-[#EEF2FF]">Goals</th>
              <th className="py-2.5 px-3 text-center">Assists</th>
              <th className="py-2.5 px-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26346B]/40">
            {sorted.map((p) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/players/${p.id}`)}
                className="hover:bg-[#16214A]/60 transition-colors group cursor-pointer"
              >
                <td className="py-2.5 px-3 text-center font-mono-numbers font-bold text-[#9AA7D6]">
                  {p.shirtNumber}
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <PlayerAvatar player={p} size="sm" />
                    <span className="font-semibold text-white group-hover:text-[#3D7BFF] transition-colors truncate">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#16214A] text-[#9AA7D6]">
                    {p.position}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono-numbers text-[#9AA7D6]">{p.age}</td>
                <td className="py-2.5 px-3 text-[#EEF2FF]">{p.nationality}</td>
                <td className="py-2.5 px-3 text-center font-mono-numbers text-[#9AA7D6]">
                  {p.seasonStats.appearances}
                </td>
                <td className="py-2.5 px-3 text-center font-mono-numbers font-bold text-[#EEF2FF]">
                  {p.seasonStats.goals}
                </td>
                <td className="py-2.5 px-3 text-center font-mono-numbers text-[#9AA7D6]">
                  {p.seasonStats.assists}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <span className="text-[#3D7BFF] text-xs font-medium group-hover:underline">
                    View →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
