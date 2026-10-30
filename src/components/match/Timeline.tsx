import React from 'react';
import { MatchEvent } from '../../types';

interface TimelineProps {
  events: MatchEvent[];
  homeClubName: string;
  awayClubName: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, homeClubName, awayClubName }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[#9AA7D6]">
        No match timeline events recorded for this fixture.
      </div>
    );
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  const getEventBadge = (type: MatchEvent['type']) => {
    switch (type) {
      case 'GOAL':
        return <span className="text-xs font-bold text-[#2FB67C] px-1.5 py-0.5 rounded bg-[#2FB67C]/10 border border-[#2FB67C]/30">GOAL</span>;
      case 'PENALTY_GOAL':
        return <span className="text-xs font-bold text-[#2FB67C] px-1.5 py-0.5 rounded bg-[#2FB67C]/10 border border-[#2FB67C]/30">PEN</span>;
      case 'YELLOW_CARD':
        return <span className="text-xs font-bold text-[#F0BE4D] px-1.5 py-0.5 rounded bg-[#F0BE4D]/10 border border-[#F0BE4D]/30">YC</span>;
      case 'RED_CARD':
        return <span className="text-xs font-bold text-[#E5627A] px-1.5 py-0.5 rounded bg-[#E5627A]/10 border border-[#E5627A]/30">RC</span>;
      case 'SUBSTITUTION':
        return <span className="text-xs font-bold text-[#3D7BFF] px-1.5 py-0.5 rounded bg-[#3D7BFF]/10 border border-[#3D7BFF]/30">SUB</span>;
      default:
        return <span className="text-xs font-bold text-[#9AA7D6] px-1.5 py-0.5 rounded bg-[#16214A]">VAR</span>;
    }
  };

  return (
    <div className="relative py-6 max-w-2xl mx-auto">
      {/* Central vertical match line */}
      <div className="absolute left-1/2 -ml-[1px] top-0 bottom-0 w-[2px] bg-[#26346B]/60" />

      <div className="space-y-6 relative">
        {sorted.map((ev) => {
          const isHome = ev.team === 'home';

          return (
            <div key={ev.id} className="flex items-center justify-between w-full">
              {/* Left Column (Home events) */}
              <div className="w-[44%] pr-4 text-right">
                {isHome && (
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="font-bold text-sm text-[#EEF2FF]">{ev.playerName}</span>
                      {getEventBadge(ev.type)}
                    </div>
                    {ev.secondaryPlayerName && (
                      <p className="text-xs text-[#9AA7D6]">Assist: {ev.secondaryPlayerName}</p>
                    )}
                    <p className="text-[11px] text-[#9AA7D6]/80 mt-0.5">{ev.description}</p>
                  </div>
                )}
              </div>

              {/* Center Minute Bubble */}
              <div className="z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#16214A] border-2 border-[#3D7BFF] shadow-md font-mono-numbers text-xs font-bold text-white shrink-0">
                {ev.minute}'
              </div>

              {/* Right Column (Away events) */}
              <div className="w-[44%] pl-4 text-left">
                {!isHome && (
                  <div>
                    <div className="flex items-center justify-start gap-2 mb-1">
                      {getEventBadge(ev.type)}
                      <span className="font-bold text-sm text-[#EEF2FF]">{ev.playerName}</span>
                    </div>
                    {ev.secondaryPlayerName && (
                      <p className="text-xs text-[#9AA7D6]">Assist: {ev.secondaryPlayerName}</p>
                    )}
                    <p className="text-[11px] text-[#9AA7D6]/80 mt-0.5">{ev.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
