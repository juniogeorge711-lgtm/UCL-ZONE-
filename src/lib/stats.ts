import { StandingRow } from '../types';

export function getTopScoringTeamInsight(standings: StandingRow[]): string {
  if (!standings.length) return '';
  const sorted = [...standings].sort((a, b) => b.goalsFor - a.goalsFor);
  const leader = sorted[0];
  return `${leader.club.name} lead the competition in firepower with ${leader.goalsFor} goals scored (${(leader.goalsFor / leader.played).toFixed(1)} per match).`;
}

export function getBestDefensiveTeamInsight(standings: StandingRow[]): string {
  if (!standings.length) return '';
  const sorted = [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst);
  const leader = sorted[0];
  return `${leader.club.name} boast Europe's stingiest backline, conceding only ${leader.goalsAgainst} goals across ${leader.played} matches.`;
}

export function getTopScorerInsight(playerName: string, goals: number, clubName: string): string {
  return `${playerName} (${clubName}) sets the European scoring pace with ${goals} goals.`;
}
