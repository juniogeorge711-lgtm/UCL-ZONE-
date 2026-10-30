# UCL ZONE

**UCL ZONE** is a dark, premium UEFA Champions League fan hub and football analytics dashboard built with React 18, TypeScript, Vite, Tailwind CSS, and Recharts.

---

## Features

- **Home (`/`)**: Strike matchday hero with next big fixture countdown (Madrid vs City), upcoming horizontal match cards, competition benchmarks, featured clubs, and latest editorial stories.
- **Fixtures & Results (`/fixtures`)**: Filter by tab (Upcoming, Results, All), matchday (MD 1–8), club, and date range. Kickoff times converted to the viewer's local timezone via `Intl.DateTimeFormat`.
- **Match Centre (`/match/:id`)**: Comprehensive scoreboard, tactical radar comparisons, paired horizontal comparison stat bars (possession, xG, shots, passes, corners, cards), formation pitch diagram with subs, and vertical match timeline.
- **Standings (`/standings`)**: Full 36-team single-table league phase with qualification boundary zones (1–8 Round of 16, 9–24 Play-offs, 25–36 Eliminated), last-5 form chips, search, column sorting, and dynamic points progression line chart for up to 5 clubs.
- **Clubs (`/clubs`, `/clubs/:id`)**: Searchable index of all 36 clubs (including Real Madrid, Man City, Bayern, Barcelona, Arsenal, Liverpool, Inter, PSG, etc.), club profiles with European honours, current record, squad tables, fixtures, and goals scored vs conceded chart.
- **Player Statistics (`/players`, `/players/:id`)**: Leaderboards for top scorers, assists, clean sheets, and appearances. Player profiles with attribute radar charts and career season trajectory. Head-to-head 2-player comparison modal.
- **Analytics Dashboard (`/analytics`)**: Professional analytics cockpit driven by URL query string filters. Recharts horizontal bar charts, grouped bars, line graphs, team attack/defence rankings, and multi-club radar comparison with data-driven insights.
- **Editorial News (`/news`, `/news/:slug`)**: Categorized football reportage labeled as demonstration sample content.

---

## Design Tokens & Palette

- **Ink (Canvas)**: `#070B1F`
- **Surface**: `#0E1633`
- **Surface-2**: `#16214A`
- **Line / Border**: `#26346B`
- **Text**: `#EEF2FF`
- **Muted**: `#9AA7D6`
- **Electric Blue**: `#3D7BFF`
- **Gold**: `#F0BE4D`
- **Win Green**: `#2FB67C`
- **Loss Rose**: `#E5627A`
- **Typography**: `Big Shoulders Display` (Headlines, scores, big metrics) and `Figtree` (Body prose).

---

## Data Architecture & Swapping to a Live Football API

All data is accessed via the typed `DataProvider` interface located at `/src/data/providers/DataProvider.ts`.

### Sample Data
The current active provider is `SampleDataProvider` (`/src/data/providers/SampleDataProvider.ts`), which serves realistic demonstration data from:
- `/src/data/sample/clubs.ts` (36 UEFA clubs)
- `/src/data/sample/players.ts` (Detailed squad and star profiles)
- `/src/data/sample/matches.ts` (Results and upcoming fixtures)
- `/src/data/sample/standings.ts` (36-team league table)
- `/src/data/sample/articles.ts` (Editorial articles)

### Switching to Live API (`football-data.org` or `API-Football`)
1. Set the environment variable:
   ```env
   VITE_DATA_SOURCE=api
   VITE_FOOTBALL_API_BASE_URL=/api/football
   ```
2. **Security Note**: Never expose external third-party API keys in client-side code bundles. Set up a lightweight server proxy endpoint (e.g., Express or Cloud Function at `/api/football/*`) that injects the secret server-side.
3. The stub provider is prepared in `/src/data/providers/FootballApiProvider.ts`. Update the JSON transformers to map external API responses into UCL ZONE types.

---

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
