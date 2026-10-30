import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useHighlights,
  useMatches,
  useClubs,
  usePlayers,
  useArticles,
} from '../hooks/useData';
import { MatchCard } from '../components/match/MatchCard';
import { ClubTile } from '../components/club/ClubTile';
import { PlayerCard } from '../components/player/PlayerCard';
import { ArticleCard } from '../components/news/ArticleCard';
import { Crest } from '../components/ui/Crest';
import { Skeleton } from '../components/ui/Skeleton';
import { getTimeRemaining } from '../lib/timezone';
import { ArrowRight, Trophy, ShieldAlert, Flame, Target, Calendar } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { data: highlights, loading: loadingHighlights } = useHighlights();
  const { data: upcomingMatches, loading: loadingMatches } = useMatches({ tab: 'upcoming' });
  const { data: clubs, loading: loadingClubs } = useClubs();
  const { data: players, loading: loadingPlayers } = usePlayers();
  const { data: articles, loading: loadingArticles } = useArticles();

  // Featured match is Real Madrid vs Man City
  const featuredMatch = upcomingMatches?.find((m) => m.id === 'm-2026-07-rma-mci') || upcomingMatches?.[0];

  // Live countdown state
  const [countdown, setCountdown] = useState(() =>
    featuredMatch ? getTimeRemaining(featuredMatch.date) : { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false }
  );

  useEffect(() => {
    if (!featuredMatch) return;
    const interval = setInterval(() => {
      setCountdown(getTimeRemaining(featuredMatch.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [featuredMatch]);

  const featuredClubs = clubs?.slice(0, 8) || [];
  const topPlayers = players?.slice(0, 6) || [];
  const leadArticle = articles?.[0];
  const gridArticles = articles?.slice(1, 4) || [];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION (Boldness allocated here) */}
      <section
        aria-label="Champions League Hero"
        className="relative rounded-3xl bg-gradient-to-b from-[#0E1633] via-[#0E1633]/90 to-[#070B1F] border border-[#26346B]/80 p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl"
      >
        {/* Overhead floodlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#3D7BFF]/20 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F0BE4D] bg-[#F0BE4D]/10 border border-[#F0BE4D]/30 px-3 py-1 rounded-full">
              <span>UEFA Champions League 2026/27</span>
              <span aria-hidden="true">·</span>
              <span>Matchday 7</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
              EUROPEAN NIGHTS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D7BFF] via-[#EEF2FF] to-[#F0BE4D]">
                REDEFINED
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#9AA7D6] max-w-xl leading-relaxed">
              Experience the 36-team single-table drama. In-depth match analytics, live tactical profiles, player scouting leaderboards, and pure football intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/match/m-2026-07-rma-mci')}
                className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-white bg-[#3D7BFF] hover:bg-[#3D7BFF]/90 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Open Match Centre</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/fixtures')}
                className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#EEF2FF] bg-[#16214A] hover:bg-[#26346B] border border-[#26346B] rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF]"
              >
                View all fixtures
              </button>
            </div>
          </div>

          {/* Right Column: Featured Match Scoreboard Card with Live Countdown */}
          <div className="lg:col-span-5">
            {loadingMatches || !featuredMatch ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="rounded-2xl bg-[#070B1F]/90 border border-[#3D7BFF]/40 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-[#9AA7D6] pb-3 border-b border-[#26346B]/60">
                  <span className="font-bold text-[#F0BE4D] uppercase tracking-wider">
                    Next Big Match
                  </span>
                  <span>Bernabéu · 20:00 CET</span>
                </div>

                {/* Scoreboard layout */}
                <div className="py-6 flex items-center justify-around text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Crest club={featuredMatch.homeTeam} size="xl" />
                    <span className="font-display text-lg font-bold text-white">
                      {featuredMatch.homeTeam.shortName}
                    </span>
                    <span className="text-[11px] text-[#9AA7D6]">Home</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-display text-3xl font-black text-[#F0BE4D]">VS</span>
                    <span className="text-[11px] text-[#9AA7D6] uppercase tracking-widest mt-1">
                      Matchday 7
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Crest club={featuredMatch.awayTeam} size="xl" />
                    <span className="font-display text-lg font-bold text-white">
                      {featuredMatch.awayTeam.shortName}
                    </span>
                    <span className="text-[11px] text-[#9AA7D6]">Away</span>
                  </div>
                </div>

                {/* Countdown Timer Strip */}
                <div className="pt-4 border-t border-[#26346B]/60">
                  <span className="text-[11px] text-[#9AA7D6] block text-center mb-2 font-medium">
                    Kickoff Countdown (Local Time)
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[#16214A]/80 border border-[#26346B]/50">
                      <span className="font-mono-numbers font-black text-lg text-white block">
                        {countdown.days}
                      </span>
                      <span className="text-[9px] text-[#9AA7D6] uppercase">Days</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#16214A]/80 border border-[#26346B]/50">
                      <span className="font-mono-numbers font-black text-lg text-white block">
                        {countdown.hours}
                      </span>
                      <span className="text-[9px] text-[#9AA7D6] uppercase">Hours</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#16214A]/80 border border-[#26346B]/50">
                      <span className="font-mono-numbers font-black text-lg text-white block">
                        {countdown.minutes}
                      </span>
                      <span className="text-[9px] text-[#9AA7D6] uppercase">Mins</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#16214A]/80 border border-[#26346B]/50">
                      <span className="font-mono-numbers font-black text-lg text-[#3D7BFF] block">
                        {countdown.seconds}
                      </span>
                      <span className="text-[9px] text-[#9AA7D6] uppercase">Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. UPCOMING BIG MATCHES (Horizontal Scroller) */}
      <section aria-label="Upcoming Champions League Fixtures" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Matchday 7 Highlights
            </h2>
            <p className="text-xs text-[#9AA7D6]">Upcoming marquee European fixtures</p>
          </div>
          <button
            onClick={() => navigate('/fixtures')}
            className="text-xs font-bold text-[#3D7BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All fixtures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingMatches ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches?.slice(0, 6).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* 3. COMPETITION HIGHLIGHTS PANEL */}
      <section aria-label="Competition Highlights" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Competition Pulse
            </h2>
            <p className="text-xs text-[#9AA7D6]">Key performance benchmarks across the 2026/27 campaign</p>
          </div>
        </div>

        {loadingHighlights || !highlights ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Top Scorer */}
            <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#F0BE4D] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Top Scorer</span>
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display text-3xl font-black text-white font-mono-numbers">
                  {highlights.topScorer.goals}
                </span>
                <p className="text-xs font-bold text-[#EEF2FF] mt-1 truncate">
                  {highlights.topScorer.player.name}
                </p>
                <p className="text-[11px] text-[#9AA7D6] truncate">
                  {highlights.topScorer.club.shortName}
                </p>
              </div>
            </div>

            {/* Best Attack */}
            <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#3D7BFF] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Best Attack</span>
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display text-3xl font-black text-white font-mono-numbers">
                  {highlights.bestAttack.goals}
                </span>
                <p className="text-xs font-bold text-[#EEF2FF] mt-1 truncate">
                  {highlights.bestAttack.club.name}
                </p>
                <p className="text-[11px] text-[#9AA7D6]">
                  {highlights.bestAttack.perMatch} goals / match
                </p>
              </div>
            </div>

            {/* Best Defence */}
            <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#2FB67C] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Best Defence</span>
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display text-3xl font-black text-white font-mono-numbers">
                  {highlights.bestDefence.conceded}
                </span>
                <p className="text-xs font-bold text-[#EEF2FF] mt-1 truncate">
                  {highlights.bestDefence.club.name}
                </p>
                <p className="text-[11px] text-[#9AA7D6]">
                  {highlights.bestDefence.cleanSheets} clean sheets
                </p>
              </div>
            </div>

            {/* Phase info */}
            <div className="rounded-xl bg-[#0E1633] border border-[#26346B]/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#9AA7D6] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Phase</span>
                <Trophy className="w-4 h-4 text-[#F0BE4D]" />
              </div>
              <div>
                <span className="font-display text-2xl font-black text-white">
                  MD {highlights.currentPhase.matchday} of {highlights.currentPhase.totalMatchdays}
                </span>
                <p className="text-xs font-semibold text-[#EEF2FF] mt-1">
                  {highlights.currentPhase.name}
                </p>
                <p className="text-[11px] text-[#9AA7D6]">
                  {highlights.currentPhase.completedMatches} matches played
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. FEATURED CLUBS */}
      <section aria-label="Featured Champions League Clubs" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Featured European Clubs
            </h2>
            <p className="text-xs text-[#9AA7D6]">Explore club profiles, honours, and squad records</p>
          </div>
          <button
            onClick={() => navigate('/clubs')}
            className="text-xs font-bold text-[#3D7BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All 36 clubs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingClubs ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredClubs.map((club) => (
              <ClubTile key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>

      {/* 5. FEATURED PLAYERS */}
      <section aria-label="Featured Star Players" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Continental Stars
            </h2>
            <p className="text-xs text-[#9AA7D6]">Track Europe's top individual performers</p>
          </div>
          <button
            onClick={() => navigate('/players')}
            className="text-xs font-bold text-[#3D7BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Player leaderboards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingPlayers ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </section>

      {/* 6. LATEST FOOTBALL NEWS */}
      <section aria-label="Latest European Football Stories" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              UEFA Editorial & Match Reports
            </h2>
            <p className="text-xs text-[#9AA7D6]">Tactical analysis, previews, and European dispatches (Sample content)</p>
          </div>
          <button
            onClick={() => navigate('/news')}
            className="text-xs font-bold text-[#3D7BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingArticles ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <div className="space-y-6">
            {leadArticle && <ArticleCard article={leadArticle} lead={true} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
