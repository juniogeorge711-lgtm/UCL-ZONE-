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

export interface CompetitionHighlights {
  topScorer: {
    player: Player;
    goals: number;
    club: Club;
  };
  bestAttack: {
    club: Club;
    goals: number;
    perMatch: number;
  };
  bestDefence: {
    club: Club;
    conceded: number;
    cleanSheets: number;
  };
  biggestWin: {
    match: Match;
    score: string;
    differential: number;
  };
  currentPhase: {
    name: string;
    matchday: number;
    totalMatchdays: number;
    completedMatches: number;
    totalMatches: number;
  };
}

export interface DataProvider {
  name: string;
  isSample: boolean;

  getMatches(filters?: MatchFilters): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  getStandings(season?: string): Promise<StandingRow[]>;
  getClubs(): Promise<Club[]>;
  getClub(id: string): Promise<Club | undefined>;
  getPlayers(filters?: PlayerFilters): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  getLeaders(
    stat: 'goals' | 'assists' | 'cleanSheets' | 'appearances' | 'goalContributions',
    filters?: { clubId?: string; season?: string; position?: string }
  ): Promise<LeaderRankItem[]>;
  getArticles(filters?: ArticleFilters): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | undefined>;
  getCompetitionHighlights(): Promise<CompetitionHighlights>;
}
