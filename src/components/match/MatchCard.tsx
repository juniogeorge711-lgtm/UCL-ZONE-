import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../../types';
import { Crest } from '../ui/Crest';
import { StatusBadge } from '../ui/StatusBadge';
import { formatKickoffDate, formatKickoffTime } from '../../lib/timezone';

interface MatchCardProps {
  match: Match;
  featured?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, featured = false }) => {
  const navigate = useNavigate();
  const isFinished = match.status === 'FULL_TIME';

  return (
    <article
      onClick={() => navigate(`/match/${match.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/match/${match.id}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Match: ${match.homeTeam.name} versus ${match.awayTeam.name}, status ${match.status}`}
      className={`group relative rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 transition-all duration-200 hover:border-[#3D7BFF]/70 hover:bg-[#16214A]/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] ${
        featured ? 'ring-1 ring-[#3D7BFF]/40' : ''
      }`}
    >
      {/* Top row: Matchday + Date & Time + Status */}
      <div className="flex items-center justify-between text-xs text-[#9AA7D6] mb-3 pb-2 border-b border-[#26346B]/40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#EEF2FF]">MD {match.matchday}</span>
          <span aria-hidden="true">·</span>
          <span>{formatKickoffDate(match.date)}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-numbers">{formatKickoffTime(match.date)}</span>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Main teams & score container */}
      <div className="space-y-3">
        {/* Home Team */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Crest club={match.homeTeam} size="md" />
            <span className="font-semibold text-sm text-[#EEF2FF] truncate group-hover:text-white transition-colors">
              {match.homeTeam.name}
            </span>
          </div>
          {isFinished && (
            <span className="font-display text-2xl font-black text-white font-mono-numbers tabular-nums">
              {match.homeScore}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Crest club={match.awayTeam} size="md" />
            <span className="font-semibold text-sm text-[#EEF2FF] truncate group-hover:text-white transition-colors">
              {match.awayTeam.name}
            </span>
          </div>
          {isFinished && (
            <span className="font-display text-2xl font-black text-white font-mono-numbers tabular-nums">
              {match.awayScore}
            </span>
          )}
        </div>
      </div>

      {/* Win probability bar if scheduled */}
      {!isFinished && match.winProbability && (
        <div className="mt-4 pt-3 border-t border-[#26346B]/40">
          <div className="flex items-center justify-between text-[11px] text-[#9AA7D6] mb-1">
            <span>{match.homeTeam.code} {match.winProbability.home}%</span>
            <span>Draw {match.winProbability.draw}%</span>
            <span>{match.awayTeam.code} {match.winProbability.away}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#16214A] rounded-full overflow-hidden flex">
            <div
              style={{ width: `${match.winProbability.home}%` }}
              className="bg-[#3D7BFF] h-full"
              title={`${match.homeTeam.shortName} win: ${match.winProbability.home}%`}
            />
            <div
              style={{ width: `${match.winProbability.draw}%` }}
              className="bg-[#9AA7D6]/40 h-full"
              title={`Draw: ${match.winProbability.draw}%`}
            />
            <div
              style={{ width: `${match.winProbability.away}%` }}
              className="bg-[#F0BE4D] h-full"
              title={`${match.awayTeam.shortName} win: ${match.winProbability.away}%`}
            />
          </div>
        </div>
      )}

      {/* Finished match footer venue info */}
      {isFinished && match.venue && (
        <div className="mt-3 pt-2 text-[11px] text-[#9AA7D6] flex items-center justify-between border-t border-[#26346B]/30">
          <span className="truncate">{match.venue}</span>
          <span className="text-[#3D7BFF] group-hover:translate-x-0.5 transition-transform font-medium">
            Match Centre →
          </span>
        </div>
      )}
    </article>
  );
};
