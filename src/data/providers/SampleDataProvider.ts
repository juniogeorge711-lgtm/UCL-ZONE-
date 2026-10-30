import {
  Article,
  ArticleFilters,
  Club,
  LeaderRankItem,
  Match,
  MatchFilters,
  Player,
  PlayerFilters,
  StandingRow,
} from '../../types';
import { ARTICLES } from '../sample/articles';
import { CLUBS, CLUBS_MAP } from '../sample/clubs';
import { MATCHES } from '../sample/matches';
import { PLAYERS, PLAYERS_MAP } from '../sample/players';
import { STANDINGS_2026 } from '../sample/standings';
import { CompetitionHighlights, DataProvider } from './DataProvider';

export class SampleDataProvider implements DataProvider {
  name = 'SampleDataProvider (Offline / Demo)';
  isSample = true;

  // Add realistic micro-delay so loading states and skeletons test cleanly
  private async delay(ms: number = 60): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getMatches(filters?: MatchFilters): Promise<Match[]> {
    await this.delay();
    let result = [...MATCHES];

    if (filters?.tab === 'upcoming') {
      result = result.filter((m) => m.status === 'SCHEDULED');
    } else if (filters?.tab === 'results') {
      result = result.filter((m) => m.status === 'FULL_TIME');
    }

    if (filters?.matchday) {
      result = result.filter((m) => m.matchday === filters.matchday);
    }

    if (filters?.clubId) {
      result = result.filter(
        (m) => m.homeTeam.id === filters.clubId || m.awayTeam.id === filters.clubId
      );
    }

    if (filters?.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      result = result.filter((m) => new Date(m.date).getTime() >= from);
    }

    if (filters?.dateTo) {
      const to = new Date(filters.dateTo).getTime();
      result = result.filter((m) => new Date(m.date).getTime() <= to);
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getMatch(id: string): Promise<Match | undefined> {
    await this.delay();
    return MATCHES.find((m) => m.id === id);
  }

  async getStandings(_season?: string): Promise<StandingRow[]> {
    await this.delay();
    return [...STANDINGS_2026];
  }

  async getClubs(): Promise<Club[]> {
    await this.delay();
    return [...CLUBS];
  }

  async getClub(id: string): Promise<Club | undefined> {
    await this.delay();
    return CLUBS_MAP.get(id);
  }

  async getPlayers(filters?: PlayerFilters): Promise<Player[]> {
    await this.delay();
    let result = [...PLAYERS];

    if (filters?.clubId) {
      result = result.filter((p) => p.clubId === filters.clubId);
    }
    if (filters?.position) {
      result = result.filter((p) => p.position === filters.position);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.clubName.toLowerCase().includes(q) ||
          p.nationality.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    await this.delay();
    return PLAYERS_MAP.get(id);
  }

  async getLeaders(
    stat: 'goals' | 'assists' | 'cleanSheets' | 'appearances' | 'goalContributions',
    filters?: { clubId?: string; season?: string; position?: string }
  ): Promise<LeaderRankItem[]> {
    await this.delay();
    let players = [...PLAYERS];

    if (filters?.clubId) {
      players = players.filter((p) => p.clubId === filters.clubId);
    }
    if (filters?.position) {
      players = players.filter((p) => p.position === filters.position);
    }

    let metricLabel = 'Goals';
    const scoredPlayers = players.map((p) => {
      let val = 0;
      switch (stat) {
        case 'goals':
          val = p.seasonStats.goals;
          metricLabel = 'Goals';
          break;
        case 'assists':
          val = p.seasonStats.assists;
          metricLabel = 'Assists';
          break;
        case 'cleanSheets':
          val = p.seasonStats.cleanSheets;
          metricLabel = 'Clean sheets';
          break;
        case 'appearances':
          val = p.seasonStats.appearances;
          metricLabel = 'Matches';
          break;
        case 'goalContributions':
          val = p.seasonStats.goals + p.seasonStats.assists;
          metricLabel = 'Goals + Assists';
          break;
      }
      const club = CLUBS_MAP.get(p.clubId) || CLUBS[0];
      return { player: p, club, value: val, metricLabel };
    });

    scoredPlayers.sort((a, b) => b.value - a.value || a.player.name.localeCompare(b.player.name));

    return scoredPlayers.slice(0, 20).map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
  }

  async getArticles(filters?: ArticleFilters): Promise<Article[]> {
    await this.delay();
    let list = [...ARTICLES];

    if (filters?.category && filters.category !== 'all') {
      list = list.filter((a) => a.category === filters.category);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    await this.delay();
    return ARTICLES.find((a) => a.slug === slug || a.id === slug);
  }

  async getCompetitionHighlights(): Promise<CompetitionHighlights> {
    await this.delay();
    const sortedScorers = [...PLAYERS].sort((a, b) => b.seasonStats.goals - a.seasonStats.goals);
    const topScorerPlayer = sortedScorers[0];
    const topScorerClub = CLUBS_MAP.get(topScorerPlayer.clubId) || CLUBS[0];

    const sortedStandingsGoals = [...STANDINGS_2026].sort((a, b) => b.goalsFor - a.goalsFor);
    const bestAttack = sortedStandingsGoals[0];

    const sortedStandingsDef = [...STANDINGS_2026].sort((a, b) => a.goalsAgainst - b.goalsAgainst);
    const bestDefence = sortedStandingsDef[0];

    const finishedMatches = MATCHES.filter(
      (m) => m.status === 'FULL_TIME' && m.homeScore !== undefined && m.awayScore !== undefined
    );
    const biggestWinMatch = finishedMatches.reduce((max, curr) => {
      const diff = Math.abs((curr.homeScore ?? 0) - (curr.awayScore ?? 0));
      const maxDiff = Math.abs((max.homeScore ?? 0) - (max.awayScore ?? 0));
      return diff > maxDiff ? curr : max;
    }, finishedMatches[0]);

    return {
      topScorer: {
        player: topScorerPlayer,
        goals: topScorerPlayer.seasonStats.goals,
        club: topScorerClub,
      },
      bestAttack: {
        club: bestAttack.club,
        goals: bestAttack.goalsFor,
        perMatch: +(bestAttack.goalsFor / bestAttack.played).toFixed(2),
      },
      bestDefence: {
        club: bestDefence.club,
        conceded: bestDefence.goalsAgainst,
        cleanSheets: 5,
      },
      biggestWin: {
        match: biggestWinMatch,
        score: `${biggestWinMatch.homeScore} - ${biggestWinMatch.awayScore}`,
        differential: Math.abs((biggestWinMatch.homeScore ?? 0) - (biggestWinMatch.awayScore ?? 0)),
      },
      currentPhase: {
        name: 'League Phase',
        matchday: 7,
        totalMatchdays: 8,
        completedMatches: 108,
        totalMatches: 144,
      },
    };
  }
}
