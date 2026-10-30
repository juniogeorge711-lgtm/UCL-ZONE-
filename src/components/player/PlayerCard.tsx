import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../../types';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const navigate = useNavigate();

  // Get initials for avatar
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <article
      onClick={() => navigate(`/players/${player.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/players/${player.id}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View stats for ${player.name}, ${player.position} for ${player.clubName}`}
      className="group relative rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 transition-all duration-200 hover:border-[#3D7BFF]/70 hover:bg-[#16214A]/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] flex flex-col justify-between"
    >
      <div>
        {/* Top header: Initials avatar + Shirt number & Position */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#16214A] border border-[#26346B] flex items-center justify-center font-display text-lg font-black text-[#3D7BFF] group-hover:border-[#3D7BFF]/50 transition-colors shadow-inner">
            {initials}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono-numbers font-black text-sm text-white">
              #{player.shirtNumber}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA7D6]">
              {player.position}
            </span>
          </div>
        </div>

        {/* Player Name and Club */}
        <h3 className="font-display text-xl font-bold text-[#EEF2FF] group-hover:text-white transition-colors truncate">
          {player.name}
        </h3>
        <p className="text-xs text-[#9AA7D6] truncate mt-0.5">{player.clubName}</p>
        <p className="text-[11px] text-[#9AA7D6]/70 mt-1">
          {player.nationality} · Age {player.age}
        </p>
      </div>

      {/* Season metrics preview */}
      <div className="mt-4 pt-3 border-t border-[#26346B]/40 grid grid-cols-3 gap-2 text-center">
        <div className="p-1.5 rounded bg-[#16214A]/40">
          <span className="text-[10px] text-[#9AA7D6] block">Apps</span>
          <span className="font-mono-numbers font-bold text-xs text-[#EEF2FF]">
            {player.seasonStats.appearances}
          </span>
        </div>
        <div className="p-1.5 rounded bg-[#16214A]/40">
          <span className="text-[10px] text-[#9AA7D6] block">Goals</span>
          <span className="font-mono-numbers font-black text-xs text-[#2FB67C]">
            {player.seasonStats.goals}
          </span>
        </div>
        <div className="p-1.5 rounded bg-[#16214A]/40">
          <span className="text-[10px] text-[#9AA7D6] block">Assists</span>
          <span className="font-mono-numbers font-black text-xs text-[#3D7BFF]">
            {player.seasonStats.assists}
          </span>
        </div>
      </div>
    </article>
  );
};
