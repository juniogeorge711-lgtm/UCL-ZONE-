import React from 'react';
import { TeamLineup } from '../../types';

interface PitchLineupProps {
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  homeClubName: string;
  awayClubName: string;
}

export const PitchLineup: React.FC<PitchLineupProps> = ({
  homeLineup,
  awayLineup,
  homeClubName,
  awayClubName,
}) => {
  if (!homeLineup || !awayLineup) {
    return (
      <div className="text-center py-10 text-sm text-[#9AA7D6]">
        Lineup information not yet confirmed for this match.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Formation summary bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0E1633] rounded-lg border border-[#26346B]/60 text-xs font-semibold">
        <span className="text-[#3D7BFF]">
          {homeClubName} ({homeLineup.formation}) · Coach: {homeLineup.coach}
        </span>
        <span className="text-[#F0BE4D]">
          {awayClubName} ({awayLineup.formation}) · Coach: {awayLineup.coach}
        </span>
      </div>

      {/* Realistic football pitch visual */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] bg-[#0A1A2F] border-2 border-[#26346B] rounded-2xl overflow-hidden shadow-inner p-4 select-none">
        {/* Pitch grass subtle stripes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,22,51,0.6)_0%,rgba(6,12,33,0.8)_100%)]" />

        {/* Outer pitch boundary line */}
        <div className="absolute inset-4 border border-[#26346B]/80 rounded-lg pointer-events-none" />

        {/* Halfway line */}
        <div className="absolute top-4 bottom-4 left-1/2 -ml-[0.5px] w-[1px] bg-[#26346B]/80 pointer-events-none" />

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -mt-16 -ml-16 w-32 h-32 rounded-full border border-[#26346B]/80 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -mt-1 -ml-1 w-2 h-2 rounded-full bg-[#26346B] pointer-events-none" />

        {/* Left penalty box (Home) */}
        <div className="absolute left-4 top-1/2 -mt-28 w-28 h-56 border border-[#26346B]/80 pointer-events-none" />
        <div className="absolute left-4 top-1/2 -mt-14 w-12 h-28 border border-[#26346B]/80 pointer-events-none" />

        {/* Right penalty box (Away) */}
        <div className="absolute right-4 top-1/2 -mt-28 w-28 h-56 border border-[#26346B]/80 pointer-events-none" />
        <div className="absolute right-4 top-1/2 -mt-14 w-12 h-28 border border-[#26346B]/80 pointer-events-none" />

        {/* Home Players */}
        {homeLineup.starting.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.gridX * 0.45 + 3}%`,
              top: `${p.gridY}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-10 flex flex-col items-center group cursor-default"
          >
            <div className="w-8 h-8 rounded-full bg-[#3D7BFF] border-2 border-white flex items-center justify-center text-white font-mono-numbers text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
              {p.number}
            </div>
            <span className="mt-1 text-[11px] font-semibold text-white px-1.5 py-0.2 rounded bg-[#070B1F]/90 border border-[#26346B]/40 whitespace-nowrap">
              {p.name} {p.isCaptain && '(C)'}
            </span>
          </div>
        ))}

        {/* Away Players */}
        {awayLineup.starting.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${100 - (p.gridX * 0.45 + 3)}%`,
              top: `${p.gridY}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-10 flex flex-col items-center group cursor-default"
          >
            <div className="w-8 h-8 rounded-full bg-[#F0BE4D] border-2 border-[#070B1F] flex items-center justify-center text-[#070B1F] font-mono-numbers text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
              {p.number}
            </div>
            <span className="mt-1 text-[11px] font-semibold text-white px-1.5 py-0.2 rounded bg-[#070B1F]/90 border border-[#26346B]/40 whitespace-nowrap">
              {p.name} {p.isCaptain && '(C)'}
            </span>
          </div>
        ))}
      </div>

      {/* Bench list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Home Bench */}
        <div className="p-4 rounded-xl bg-[#0E1633] border border-[#26346B]/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D7BFF] mb-3">
            {homeClubName} Substitutes
          </h4>
          <ul className="space-y-2 text-xs">
            {homeLineup.bench.map((b) => (
              <li key={b.id} className="flex items-center justify-between text-[#EEF2FF]">
                <div className="flex items-center gap-2">
                  <span className="font-mono-numbers font-bold text-[#9AA7D6] w-5">
                    {b.number}
                  </span>
                  <span>{b.name}</span>
                </div>
                <span className="text-[#9AA7D6] text-[11px]">{b.position}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Away Bench */}
        <div className="p-4 rounded-xl bg-[#0E1633] border border-[#26346B]/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0BE4D] mb-3">
            {awayClubName} Substitutes
          </h4>
          <ul className="space-y-2 text-xs">
            {awayLineup.bench.map((b) => (
              <li key={b.id} className="flex items-center justify-between text-[#EEF2FF]">
                <div className="flex items-center gap-2">
                  <span className="font-mono-numbers font-bold text-[#9AA7D6] w-5">
                    {b.number}
                  </span>
                  <span>{b.name}</span>
                </div>
                <span className="text-[#9AA7D6] text-[11px]">{b.position}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
