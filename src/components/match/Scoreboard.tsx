import React from 'react';
import { Link } from 'react-router-dom';
import { Match } from '../../types';
import { Crest } from '../ui/Crest';
import { StatusBadge } from '../ui/StatusBadge';
import { formatKickoffFull } from '../../lib/timezone';
import { MapPin, User, Users } from 'lucide-react';

interface ScoreboardProps {
  match: Match;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ match }) => {
  const isFinished = match.status === 'FULL_TIME';

  return (
    <div className="rounded-2xl bg-[#0E1633] border border-[#26346B] p-6 lg:p-8 shadow-xl relative overflow-hidden">
      {/* Background ambient match illumination */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: match.homeTeam.colors.primary }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: match.awayTeam.colors.primary }}
      />

      {/* Top Header metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#26346B]/60 text-xs text-[#9AA7D6]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">
            Matchday {match.matchday}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatKickoffFull(match.date)}</span>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Main Scoreboard Layout */}
      <div className="py-8 grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-3">
          <Link
            to={`/clubs/${match.homeTeam.id}`}
            className="group flex flex-col items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] rounded-lg p-2"
          >
            <Crest club={match.homeTeam} size="xl" />
            <h2 className="font-display text-2xl lg:text-3xl font-black text-white group-hover:text-[#3D7BFF] transition-colors">
              {match.homeTeam.name}
            </h2>
          </Link>
          <span className="text-xs text-[#9AA7D6]">{match.homeTeam.country}</span>
        </div>

        {/* Center Score / Versus / Time */}
        <div className="flex flex-col items-center justify-center">
          {isFinished ? (
            <div className="flex items-center gap-4">
              <span className="font-display text-5xl lg:text-7xl font-black text-white font-mono-numbers">
                {match.homeScore}
              </span>
              <span className="font-display text-3xl font-semibold text-[#9AA7D6]">-</span>
              <span className="font-display text-5xl lg:text-7xl font-black text-white font-mono-numbers">
                {match.awayScore}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="font-display text-4xl lg:text-5xl font-black text-[#F0BE4D] tracking-wider uppercase">
                VS
              </span>
              <span className="text-xs text-[#9AA7D6]">Kickoff Approaching</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-3">
          <Link
            to={`/clubs/${match.awayTeam.id}`}
            className="group flex flex-col items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] rounded-lg p-2"
          >
            <Crest club={match.awayTeam} size="xl" />
            <h2 className="font-display text-2xl lg:text-3xl font-black text-white group-hover:text-[#3D7BFF] transition-colors">
              {match.awayTeam.name}
            </h2>
          </Link>
          <span className="text-xs text-[#9AA7D6]">{match.awayTeam.country}</span>
        </div>
      </div>

      {/* Match Details Strip */}
      <div className="pt-6 border-t border-[#26346B]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#9AA7D6]">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#3D7BFF] shrink-0" />
          <span className="truncate">{match.venue}, {match.city}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <User className="w-3.5 h-3.5 text-[#F0BE4D] shrink-0" />
          <span className="truncate">Referee: {match.referee}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <Users className="w-3.5 h-3.5 text-[#2FB67C] shrink-0" />
          <span>{match.attendance ? `${match.attendance.toLocaleString()} spectators` : 'Capacity ' + match.homeTeam.capacity.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
