import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Club } from '../../types';
import { Crest } from '../ui/Crest';
import { Trophy, MapPin } from 'lucide-react';

interface ClubTileProps {
  club: Club;
}

export const ClubTile: React.FC<ClubTileProps> = ({ club }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/clubs/${club.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/clubs/${club.id}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${club.name}`}
      className="group relative rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 transition-all duration-200 hover:border-[#3D7BFF]/70 hover:bg-[#16214A]/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] flex flex-col justify-between"
    >
      {/* Top club insignia + titles badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Crest club={club} size="lg" />
          {club.honours.titles > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#F0BE4D] bg-[#F0BE4D]/10 px-2 py-0.5 rounded border border-[#F0BE4D]/30">
              <Trophy className="w-3 h-3" />
              <span>{club.honours.titles} {club.honours.titles === 1 ? 'Title' : 'Titles'}</span>
            </div>
          )}
        </div>

        <h3 className="font-display text-lg font-bold text-[#EEF2FF] group-hover:text-white transition-colors truncate">
          {club.name}
        </h3>
        <p className="text-xs text-[#9AA7D6] flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-[#3D7BFF]" />
          <span className="truncate">{club.stadium} · {club.country}</span>
        </p>
      </div>

      {/* Bottom quick stats */}
      <div className="mt-4 pt-3 border-t border-[#26346B]/40 flex items-center justify-between text-[11px] text-[#9AA7D6]">
        <span>Founded {club.founded}</span>
        <span className="text-[#3D7BFF] font-medium group-hover:translate-x-0.5 transition-transform">
          Club Profile →
        </span>
      </div>
    </div>
  );
};
