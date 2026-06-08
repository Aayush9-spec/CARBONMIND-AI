// =============================================================================
// CARBONMIND AI — Core Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export type CarbonCategory = 'transport' | 'food' | 'energy' | 'shopping';

export type TransportSubcategory =
  | 'car_gasoline'
  | 'car_diesel'
  | 'car_electric'
  | 'bus'
  | 'train'
  | 'flight_domestic'
  | 'flight_international'
  | 'bicycle'
  | 'walking'
  | 'motorcycle';

export type FoodSubcategory =
  | 'beef'
  | 'chicken'
  | 'pork'
  | 'fish'
  | 'dairy'
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'processed_food';

export type EnergySubcategory =
  | 'electricity'
  | 'natural_gas'
  | 'heating_oil'
  | 'solar'
  | 'lpg';

export type ShoppingSubcategory =
  | 'clothing'
  | 'electronics'
  | 'furniture'
  | 'general'
  | 'books'
  | 'personal_care';

export type Subcategory =
  | TransportSubcategory
  | FoodSubcategory
  | EnergySubcategory
  | ShoppingSubcategory;

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export type UserLevel =
  | 'green_starter'
  | 'eco_explorer'
  | 'climate_warrior'
  | 'planet_guardian'
  | 'net_zero_hero';

export type BadgeType =
  | 'energy_saver'
  | 'transport_hero'
  | 'plastic_free'
  | 'eco_champion'
  | 'streak_master'
  | 'team_player'
  | 'first_scan'
  | 'week_warrior'
  | 'month_master'
  | 'reduction_hero';

export type DocumentType = 'electricity_bill' | 'fuel_receipt' | 'shopping_invoice' | 'unknown';

export type InsightType = 'recommendation' | 'warning' | 'achievement' | 'trend';

export type ForecastPeriod = 30 | 60 | 90;

// -----------------------------------------------------------------------------
// Carbon Activity
// -----------------------------------------------------------------------------

export interface CarbonActivity {
  id: string;
  userId: string;
  category: CarbonCategory;
  subcategory: Subcategory;
  value: number;
  unit: string;
  emissionKg: number;
  source: 'manual' | 'ocr' | 'ai_estimated';
  confidence: number;
  metadata: Record<string, unknown>;
  activityDate: Date;
  createdAt: Date;
}

export interface CarbonActivityInput {
  category: CarbonCategory;
  subcategory: Subcategory;
  value: number;
  unit: string;
  activityDate: string;
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Carbon Profile (DNA)
// -----------------------------------------------------------------------------

export interface CarbonProfile {
  id: string;
  userId: string;
  totalEmissions: number;
  transportPct: number;
  foodPct: number;
  shoppingPct: number;
  energyPct: number;
  monthlyAverage: number;
  updatedAt: Date;
}

export interface CarbonDNA {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
  total: number;
  dominantCategory: CarbonCategory;
  aiExplanation: string;
}

// -----------------------------------------------------------------------------
// Forecasting
// -----------------------------------------------------------------------------

export interface ForecastPoint {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface ForecastResult {
  period: ForecastPeriod;
  data: ForecastPoint[];
  totalPredicted: number;
  changePercent: number;
  confidence: number;
  aiExplanation: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// -----------------------------------------------------------------------------
// Simulator
// -----------------------------------------------------------------------------

export interface SimulationScenario {
  id: string;
  name: string;
  changes: ScenarioChange[];
}

export interface ScenarioChange {
  category: CarbonCategory;
  subcategory: Subcategory;
  currentValue: number;
  newValue: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface SimulationResult {
  currentMonthly: number;
  projectedMonthly: number;
  savingsMonthly: number;
  savingsYearly: number;
  savingsPercent: number;
  categoryBreakdown: {
    category: CarbonCategory;
    current: number;
    projected: number;
    savings: number;
  }[];
  aiExplanation: string;
}

// -----------------------------------------------------------------------------
// AI Coach
// -----------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  recommendations?: AIRecommendation[];
}

export interface AIRecommendation {
  action: string;
  impactKg: number;
  confidence: number;
  reason: string;
  difficulty: Difficulty;
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  impactKg: number;
  confidence: number;
  difficulty: Difficulty;
  dismissed: boolean;
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Challenges & Gamification
// -----------------------------------------------------------------------------

export interface Challenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: CarbonCategory;
  targetReduction: number;
  points: number;
  status: ChallengeStatus;
  progress: number;
  startDate: Date;
  endDate: Date;
}

export interface Achievement {
  id: string;
  badge: BadgeType;
  title: string;
  description: string;
  pointsAwarded: number;
  earnedAt: Date;
  icon: string;
}

export interface GamificationState {
  level: UserLevel;
  levelName: string;
  totalPoints: number;
  pointsToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  activeChallenges: Challenge[];
}

export interface LevelConfig {
  level: UserLevel;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

// -----------------------------------------------------------------------------
// OCR / Scan
// -----------------------------------------------------------------------------

export interface ScanResult {
  id: string;
  documentType: DocumentType;
  rawText: string;
  extractedData: ExtractedBillData;
  confidence: number;
  estimatedEmissions: number;
  createdAt: Date;
}

export interface ExtractedBillData {
  amount?: number;
  unit?: string;
  date?: string;
  provider?: string;
  items?: { name: string; quantity: number; unit: string }[];
}

// -----------------------------------------------------------------------------
// Community / Teams
// -----------------------------------------------------------------------------

export interface Team {
  id: string;
  name: string;
  code: string;
  creatorId: string;
  memberCount: number;
  totalReduction: number;
  members: TeamMember[];
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  image?: string;
  reduction: number;
  challengesCompleted: number;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image?: string;
  co2Reduced: number;
  challengesCompleted: number;
  streak: number;
  level: UserLevel;
}

// -----------------------------------------------------------------------------
// Weekly Report
// -----------------------------------------------------------------------------

export interface WeeklyReport {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  totalEmissions: number;
  previousWeekEmissions: number;
  changePercent: number;
  categoryBreakdown: {
    category: CarbonCategory;
    emissions: number;
    percentage: number;
    change: number;
  }[];
  trends: string[];
  predictions: string[];
  achievements: string[];
  recommendations: AIRecommendation[];
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Roadmap
// -----------------------------------------------------------------------------

export interface RoadmapAction {
  id: string;
  title: string;
  description: string;
  category: CarbonCategory;
  difficulty: Difficulty;
  impactKg: number;
  costLevel: 'free' | 'low' | 'medium' | 'high';
  timeframe: 'immediate' | 'week' | 'month' | 'quarter';
  tier: 'easy_win' | 'medium_effort' | 'high_impact';
  isCompleted: boolean;
}

// -----------------------------------------------------------------------------
// Dashboard
// -----------------------------------------------------------------------------

export interface DashboardData {
  carbonScore: number;
  carbonDNA: CarbonDNA;
  recentActivities: CarbonActivity[];
  forecast: ForecastResult;
  insights: AIInsight[];
  activeChallenges: Challenge[];
  gamification: GamificationState;
  leaderboard: LeaderboardEntry[];
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
