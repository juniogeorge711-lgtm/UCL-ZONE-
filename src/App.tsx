/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Skeleton } from './components/ui/Skeleton';

// Lazy-load routes for fast initial bundle paint
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const FixturesPage = lazy(() =>
  import('./pages/FixturesPage').then((m) => ({ default: m.FixturesPage }))
);
const MatchCentrePage = lazy(() =>
  import('./pages/MatchCentrePage').then((m) => ({ default: m.MatchCentrePage }))
);
const StandingsPage = lazy(() =>
  import('./pages/StandingsPage').then((m) => ({ default: m.StandingsPage }))
);
const ClubsPage = lazy(() =>
  import('./pages/ClubsPage').then((m) => ({ default: m.ClubsPage }))
);
const ClubDetailPage = lazy(() =>
  import('./pages/ClubDetailPage').then((m) => ({ default: m.ClubDetailPage }))
);
const PlayersPage = lazy(() =>
  import('./pages/PlayersPage').then((m) => ({ default: m.PlayersPage }))
);
const PlayerDetailPage = lazy(() =>
  import('./pages/PlayerDetailPage').then((m) => ({ default: m.PlayerDetailPage }))
);
const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((m) => ({ default: m.NewsPage }))
);
const ArticleDetailPage = lazy(() =>
  import('./pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage }))
);

const PageLoader: React.FC = () => (
  <div className="space-y-6 max-w-7xl mx-auto py-8">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="fixtures"
            element={
              <Suspense fallback={<PageLoader />}>
                <FixturesPage />
              </Suspense>
            }
          />
          <Route
            path="match/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <MatchCentrePage />
              </Suspense>
            }
          />
          <Route
            path="standings"
            element={
              <Suspense fallback={<PageLoader />}>
                <StandingsPage />
              </Suspense>
            }
          />
          <Route
            path="clubs"
            element={
              <Suspense fallback={<PageLoader />}>
                <ClubsPage />
              </Suspense>
            }
          />
          <Route
            path="clubs/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ClubDetailPage />
              </Suspense>
            }
          />
          <Route
            path="players"
            element={
              <Suspense fallback={<PageLoader />}>
                <PlayersPage />
              </Suspense>
            }
          />
          <Route
            path="players/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <PlayerDetailPage />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<PageLoader />}>
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="news"
            element={
              <Suspense fallback={<PageLoader />}>
                <NewsPage />
              </Suspense>
            }
          />
          <Route
            path="news/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <ArticleDetailPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
