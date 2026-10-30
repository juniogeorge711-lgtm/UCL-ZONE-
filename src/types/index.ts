export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FULL_TIME' | 'POSTPONED';

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export interface ClubColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface ClubHonours {
  titles: number;
  finals: number;
  appearances: number;
  lastTitleYear?: number;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  code: string;
  country: string;
  stadium: string;
  capacity: number;
  founded: number;
  manager: string;
  colors: ClubColors;
  honours: ClubHonours;
  crestUrl?: string; // Optional real crest URL for Football API integration
}

export interface PlayerStats {
  appearances: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shotsOnTarget: number;
  totalShots: number;
  passAccuracy: number;
  passesCompleted: number;
  totalPasses: number;
  tackles: number;
  cleanSheets: number; // for GK and defenders
  saves?: number; // for GK
  yellowCards: number;
  redCards: number;
  xG: number;
  xA: number;
}

export interface PlayerRadarAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerSeasonHistory {
  season: string;
  appearances: number;
  goals: number;
  assists: number;
  minutes: number;
  clubName: string;
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  clubId: string;
  clubName: string;
  shirtNumber: number;
  position: PlayerPosition;
  nationality: string;
  age: number;
  heightCm: number;
  photoUrl?: string;
  seasonStats: PlayerStats;
  careerStats: {
    uclAppearances: number;
    uclGoals: number;
    uclAssists: number;
    uclCleanSheets: number;
    uclTitles: number;
  };
  achievements: string[];
  attributes: PlayerRadarAttributes;
  history: PlayerSeasonHistory[];
}

export interface MatchStats {
  possession: [number, number]; // [home, away] in percentage
  shots: [number, number];
  shotsOnTarget: [number, number];
  xG: [number, number];
  passes: [number, number];
  passAccuracy: [number, number]; // percentage
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  saves: [number, number];
}

export type MatchEventType = 'GOAL' | 'PENALTY_GOAL' | 'OWN_GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR';

export interface MatchEvent {
  id: string;
  minute: number;
  addedMinute?: number;
  type: MatchEventType;
  team: 'home' | 'away';
  playerName: string;
  secondaryPlayerName?: string; // assist or replaced player
  description: string;
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  gridX: number; // 0 to 100 percentage for pitch layout
  gridY: number; // 0 to 100 percentage for pitch layout
  isCaptain?: boolean;
}

export interface TeamLineup {
  formation: string; // e.g. "4-3-3"
  starting: LineupPlayer[];
  bench: LineupPlayer[];
  coach: string;
}

export interface Match {
  id: string;
  season: string;
  matchday: number;
  homeTeam: Club;
  awayTeam: Club;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  date: string; // ISO 8601 string, e.g. 2026-11-04T20:00:00Z
  venue: string;
  city: string;
  referee: string;
  attendance?: number;
  winProbability?: {
    home: number;
    draw: number;
    away: number;
  };
  stats?: MatchStats;
  events?: MatchEvent[];
  lineups?: {
    home: TeamLineup;
    away: TeamLineup;
  };
  radarProfile?: {
    categories: string[];
    home: number[];
    away: number[];
  };
}

export type FormResult = 'W' | 'D' | 'L';

export interface StandingRow {
  position: number;
  club: Club;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: FormResult[];
  pointsProgression: number[]; // Points accumulated at Matchday 1, 2, 3...
}

export type ArticleCategory = 
  | 'Champions League news'
  | 'Match previews'
  | 'Match reports'
  | 'Transfer updates'
  | 'Editorial';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  leadImage: string;
  content: string[]; // array of paragraphs
  tags: string[];
  isFeatured?: boolean;
}

export interface MatchFilters {
  tab?: 'upcoming' | 'results' | 'all';
  matchday?: number;
  clubId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PlayerFilters {
  clubId?: string;
  position?: PlayerPosition;
  season?: string;
  query?: string;
}

export interface ArticleFilters {
  category?: ArticleCategory | 'all';
  query?: string;
}

export interface LeaderRankItem {
  rank: number;
  player: Player;
  club: Club;
  value: number;
  metricLabel: string;
}
