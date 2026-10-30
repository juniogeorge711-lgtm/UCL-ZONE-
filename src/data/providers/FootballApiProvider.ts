/**
 * Stub FootballApiProvider for football-data.org or API-Football integration.
 * 
 * ARCHITECTURE & SECURITY NOTICE:
 * Client-side applications must NEVER expose secret API keys in browser bundles.
 * To use a real football data provider:
 * 1. Deploy a lightweight serverless backend or proxy route (e.g. `/api/football/*`).
 * 2. Store the API secret (e.g. FOOTBALL_DATA_API_KEY) in secure server environment variables.
 * 3. Have this provider fetch data from the backend proxy endpoint, transforming the external
 *    JSON payload into the typed UCL ZONE models defined in `/src/types`.
 */

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
import { CompetitionHighlights, DataProvider } from './DataProvider';
import { SampleDataProvider } from './SampleDataProvider';

export class FootballApiProvider implements DataProvider {
  name = 'Real Football API (via Server Proxy)';
  isSample = false;

  private fallback = new SampleDataProvider();
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_FOOTBALL_API_BASE_URL || '/api/football';
  }

  async getMatches(filters?: MatchFilters): Promise<Match[]> {
    try {
      // TODO: Fetch from `${this.baseUrl}/competitions/CL/matches`
      // Transform external JSON into UCL ZONE Match[]
      return await this.fallback.getMatches(filters);
    } catch (err) {
      console.warn('FootballApiProvider getMatches failed, falling back to sample data:', err);
      return this.fallback.getMatches(filters);
    }
  }

  async getMatch(id: string): Promise<Match | undefined> {
    try {
      // TODO: Fetch from `${this.baseUrl}/matches/${id}`
      return await this.fallback.getMatch(id);
    } catch {
      return this.fallback.getMatch(id);
    }
  }

  async getStandings(season?: string): Promise<StandingRow[]> {
    try {
      // TODO: Fetch from `${this.baseUrl}/competitions/CL/standings`
      return await this.fallback.getStandings(season);
    } catch {
      return this.fallback.getStandings(season);
    }
  }

  async getClubs(): Promise<Club[]> {
    try {
      // TODO: Fetch from `${this.baseUrl}/competitions/CL/teams`
      return await this.fallback.getClubs();
    } catch {
      return this.fallback.getClubs();
    }
  }

  async getClub(id: string): Promise<Club | undefined> {
    try {
      // TODO: Fetch from `${this.baseUrl}/teams/${id}`
      return await this.fallback.getClub(id);
    } catch {
      return this.fallback.getClub(id);
    }
  }

  async getPlayers(filters?: PlayerFilters): Promise<Player[]> {
    try {
      // TODO: Fetch from `${this.baseUrl}/teams/${filters?.clubId}/players`
      return await this.fallback.getPlayers(filters);
    } catch {
      return this.fallback.getPlayers(filters);
    }
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    try {
      // TODO: Fetch from `${this.baseUrl}/persons/${id}`
      return await this.fallback.getPlayer(id);
    } catch {
      return this.fallback.getPlayer(id);
    }
  }

  async getLeaders(
    stat: 'goals' | 'assists' | 'cleanSheets' | 'appearances' | 'goalContributions',
    filters?: { clubId?: string; season?: string; position?: string }
  ): Promise<LeaderRankItem[]> {
    try {
      // TODO: Fetch scorers from `${this.baseUrl}/competitions/CL/scorers`
      return await this.fallback.getLeaders(stat, filters);
    } catch {
      return this.fallback.getLeaders(stat, filters);
    }
  }

  async getArticles(filters?: ArticleFilters): Promise<Article[]> {
    // News articles are typically sourced from an editorial CMS, RSS or sports wire
    return this.fallback.getArticles(filters);
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    return this.fallback.getArticle(slug);
  }

  async getCompetitionHighlights(): Promise<CompetitionHighlights> {
    return this.fallback.getCompetitionHighlights();
  }
}
