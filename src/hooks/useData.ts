import { useEffect, useState, useCallback } from 'react';
import { dataProvider } from '../data';
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
} from '../types';
import { CompetitionHighlights } from '../data/providers/DataProvider';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export function useMatches(filters?: MatchFilters) {
  return useAsync(
    () => dataProvider.getMatches(filters),
    [filters?.tab, filters?.matchday, filters?.clubId, filters?.dateFrom, filters?.dateTo]
  );
}

export function useMatch(id: string) {
  return useAsync(() => dataProvider.getMatch(id), [id]);
}

export function useStandings(season?: string) {
  return useAsync(() => dataProvider.getStandings(season), [season]);
}

export function useClubs() {
  return useAsync(() => dataProvider.getClubs(), []);
}

export function useClub(id: string) {
  return useAsync(() => dataProvider.getClub(id), [id]);
}

export function usePlayers(filters?: PlayerFilters) {
  return useAsync(
    () => dataProvider.getPlayers(filters),
    [filters?.clubId, filters?.position, filters?.season, filters?.query]
  );
}

export function usePlayer(id: string) {
  return useAsync(() => dataProvider.getPlayer(id), [id]);
}

export function useLeaders(
  stat: 'goals' | 'assists' | 'cleanSheets' | 'appearances' | 'goalContributions',
  filters?: { clubId?: string; season?: string; position?: string }
) {
  return useAsync(
    () => dataProvider.getLeaders(stat, filters),
    [stat, filters?.clubId, filters?.season, filters?.position]
  );
}

export function useArticles(filters?: ArticleFilters) {
  return useAsync(
    () => dataProvider.getArticles(filters),
    [filters?.category, filters?.query]
  );
}

export function useArticle(slug: string) {
  return useAsync(() => dataProvider.getArticle(slug), [slug]);
}

export function useHighlights() {
  return useAsync(() => dataProvider.getCompetitionHighlights(), []);
}
