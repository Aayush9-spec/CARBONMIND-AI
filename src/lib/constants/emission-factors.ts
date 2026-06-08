// =============================================================================
// CARBONMIND AI — EPA-Based Emission Factors
// =============================================================================
// Sources:
// - EPA GHG Emission Factors Hub (2024)
// - EPA eGRID (regional grid factors)
// - GHG Protocol Scope 3 Guidance
// - DEFRA Greenhouse Gas Conversion Factors
// =============================================================================

import type { CarbonCategory, Subcategory } from '@/types';

export interface EmissionFactor {
  category: CarbonCategory;
  subcategory: Subcategory;
  factor: number; // kg CO₂e per unit
  unit: string;
  source: string;
  description: string;
}

/**
 * Emission factors lookup table.
 * Factor = kg CO₂e per unit of activity.
 */
export const EMISSION_FACTORS: Record<Subcategory, EmissionFactor> = {
  // ── Transportation ──────────────────────────────────────────────────────
  car_gasoline: {
    category: 'transport',
    subcategory: 'car_gasoline',
    factor: 0.21,
    unit: 'km',
    source: 'EPA Mobile Combustion',
    description: 'Average gasoline passenger car, 8.89 kg CO₂/gallon',
  },
  car_diesel: {
    category: 'transport',
    subcategory: 'car_diesel',
    factor: 0.27,
    unit: 'km',
    source: 'EPA Mobile Combustion',
    description: 'Average diesel passenger car, 10.16 kg CO₂/gallon',
  },
  car_electric: {
    category: 'transport',
    subcategory: 'car_electric',
    factor: 0.053,
    unit: 'km',
    source: 'EPA eGRID + DOE',
    description: 'Electric vehicle using US average grid electricity',
  },
  bus: {
    category: 'transport',
    subcategory: 'bus',
    factor: 0.089,
    unit: 'km',
    source: 'EPA + DEFRA',
    description: 'Average local bus per passenger-km',
  },
  train: {
    category: 'transport',
    subcategory: 'train',
    factor: 0.041,
    unit: 'km',
    source: 'EPA + DEFRA',
    description: 'Average national rail per passenger-km',
  },
  flight_domestic: {
    category: 'transport',
    subcategory: 'flight_domestic',
    factor: 0.255,
    unit: 'km',
    source: 'EPA + DEFRA',
    description: 'Domestic flight per passenger-km (includes radiative forcing)',
  },
  flight_international: {
    category: 'transport',
    subcategory: 'flight_international',
    factor: 0.195,
    unit: 'km',
    source: 'EPA + DEFRA',
    description: 'International economy flight per passenger-km',
  },
  bicycle: {
    category: 'transport',
    subcategory: 'bicycle',
    factor: 0.0,
    unit: 'km',
    source: 'N/A',
    description: 'Zero direct emissions',
  },
  walking: {
    category: 'transport',
    subcategory: 'walking',
    factor: 0.0,
    unit: 'km',
    source: 'N/A',
    description: 'Zero direct emissions',
  },
  motorcycle: {
    category: 'transport',
    subcategory: 'motorcycle',
    factor: 0.113,
    unit: 'km',
    source: 'EPA Mobile Combustion',
    description: 'Average motorcycle per km',
  },

  // ── Food & Diet ─────────────────────────────────────────────────────────
  beef: {
    category: 'food',
    subcategory: 'beef',
    factor: 27.0,
    unit: 'kg',
    source: 'Poore & Nemecek (2018) + EPA Supply Chain',
    description: 'Beef per kg (includes land use, processing, transport)',
  },
  chicken: {
    category: 'food',
    subcategory: 'chicken',
    factor: 6.9,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Chicken per kg of product',
  },
  pork: {
    category: 'food',
    subcategory: 'pork',
    factor: 12.1,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Pork per kg of product',
  },
  fish: {
    category: 'food',
    subcategory: 'fish',
    factor: 6.1,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Average farmed fish per kg',
  },
  dairy: {
    category: 'food',
    subcategory: 'dairy',
    factor: 3.2,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Average dairy product per kg (milk, cheese, yogurt)',
  },
  vegetables: {
    category: 'food',
    subcategory: 'vegetables',
    factor: 2.0,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Average vegetables per kg',
  },
  fruits: {
    category: 'food',
    subcategory: 'fruits',
    factor: 1.1,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Average fruits per kg',
  },
  grains: {
    category: 'food',
    subcategory: 'grains',
    factor: 1.4,
    unit: 'kg',
    source: 'Poore & Nemecek (2018)',
    description: 'Rice, wheat, cereals per kg',
  },
  processed_food: {
    category: 'food',
    subcategory: 'processed_food',
    factor: 5.0,
    unit: 'kg',
    source: 'EPA Supply Chain Factors',
    description: 'Average processed/packaged food per kg',
  },

  // ── Energy ──────────────────────────────────────────────────────────────
  electricity: {
    category: 'energy',
    subcategory: 'electricity',
    factor: 0.42,
    unit: 'kWh',
    source: 'EPA eGRID US Average (2023)',
    description: 'US average grid electricity emission factor',
  },
  natural_gas: {
    category: 'energy',
    subcategory: 'natural_gas',
    factor: 2.0,
    unit: 'm³',
    source: 'EPA Stationary Combustion',
    description: 'Natural gas per cubic meter',
  },
  heating_oil: {
    category: 'energy',
    subcategory: 'heating_oil',
    factor: 2.68,
    unit: 'liter',
    source: 'EPA Stationary Combustion',
    description: 'Heating oil / kerosene per liter',
  },
  solar: {
    category: 'energy',
    subcategory: 'solar',
    factor: 0.0,
    unit: 'kWh',
    source: 'N/A',
    description: 'Solar energy has zero operational emissions',
  },
  lpg: {
    category: 'energy',
    subcategory: 'lpg',
    factor: 1.51,
    unit: 'liter',
    source: 'EPA Stationary Combustion',
    description: 'Liquefied petroleum gas per liter',
  },

  // ── Shopping / Consumption ──────────────────────────────────────────────
  clothing: {
    category: 'shopping',
    subcategory: 'clothing',
    factor: 10.0,
    unit: 'item',
    source: 'EPA Supply Chain Factors (EEIO)',
    description: 'Average clothing item (production + transport)',
  },
  electronics: {
    category: 'shopping',
    subcategory: 'electronics',
    factor: 50.0,
    unit: 'item',
    source: 'EPA Supply Chain Factors (EEIO)',
    description: 'Average electronic device (smartphone, laptop)',
  },
  furniture: {
    category: 'shopping',
    subcategory: 'furniture',
    factor: 40.0,
    unit: 'item',
    source: 'EPA Supply Chain Factors (EEIO)',
    description: 'Average furniture item',
  },
  general: {
    category: 'shopping',
    subcategory: 'general',
    factor: 0.5,
    unit: 'USD',
    source: 'EPA Supply Chain EEIO Factors',
    description: 'General spending per dollar (spend-based method)',
  },
  books: {
    category: 'shopping',
    subcategory: 'books',
    factor: 2.71,
    unit: 'item',
    source: 'EPA Supply Chain Factors',
    description: 'Average book (paper production + printing)',
  },
  personal_care: {
    category: 'shopping',
    subcategory: 'personal_care',
    factor: 5.0,
    unit: 'item',
    source: 'EPA Supply Chain Factors',
    description: 'Average personal care product',
  },
} as const;

/**
 * Get emission factor for a specific subcategory.
 */
export function getEmissionFactor(subcategory: Subcategory): EmissionFactor {
  return EMISSION_FACTORS[subcategory];
}

/**
 * Calculate emissions for an activity.
 * @returns emissions in kg CO₂e
 */
export function calculateEmission(subcategory: Subcategory, value: number): number {
  const factor = EMISSION_FACTORS[subcategory];
  if (!factor) return 0;
  return Math.max(0, value * factor.factor);
}

/**
 * Get all subcategories for a given category.
 */
export function getSubcategoriesForCategory(category: CarbonCategory): Subcategory[] {
  return Object.values(EMISSION_FACTORS)
    .filter((f) => f.category === category)
    .map((f) => f.subcategory);
}

/**
 * Get the unit label for a subcategory.
 */
export function getUnitForSubcategory(subcategory: Subcategory): string {
  return EMISSION_FACTORS[subcategory]?.unit ?? 'unit';
}

// ── Level Configuration ───────────────────────────────────────────────────

import type { LevelConfig, UserLevel } from '@/types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 'green_starter',
    name: 'Green Starter',
    minPoints: 0,
    maxPoints: 499,
    icon: '🌱',
    color: '#86efac',
  },
  {
    level: 'eco_explorer',
    name: 'Eco Explorer',
    minPoints: 500,
    maxPoints: 1499,
    icon: '🌿',
    color: '#4ade80',
  },
  {
    level: 'climate_warrior',
    name: 'Climate Warrior',
    minPoints: 1500,
    maxPoints: 3999,
    icon: '⚔️',
    color: '#22c55e',
  },
  {
    level: 'planet_guardian',
    name: 'Planet Guardian',
    minPoints: 4000,
    maxPoints: 7999,
    icon: '🛡️',
    color: '#16a34a',
  },
  {
    level: 'net_zero_hero',
    name: 'Net Zero Hero',
    minPoints: 8000,
    maxPoints: Infinity,
    icon: '🏆',
    color: '#15803d',
  },
];

/**
 * Get level config from points.
 */
export function getLevelFromPoints(points: number): LevelConfig {
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_CONFIGS[i].minPoints) {
      return LEVEL_CONFIGS[i];
    }
  }
  return LEVEL_CONFIGS[0];
}

/**
 * Get points needed for the next level.
 */
export function getPointsToNextLevel(points: number): number {
  const currentLevel = getLevelFromPoints(points);
  const currentIndex = LEVEL_CONFIGS.findIndex((l) => l.level === currentLevel.level);
  if (currentIndex >= LEVEL_CONFIGS.length - 1) return 0;
  return LEVEL_CONFIGS[currentIndex + 1].minPoints - points;
}

/**
 * Get the level name for display.
 */
export function getLevelName(level: UserLevel): string {
  return LEVEL_CONFIGS.find((l) => l.level === level)?.name ?? 'Green Starter';
}

// ── Badge Configuration ──────────────────────────────────────────────────

import type { BadgeType } from '@/types';

export interface BadgeConfig {
  badge: BadgeType;
  title: string;
  description: string;
  icon: string;
  points: number;
}

export const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  energy_saver: {
    badge: 'energy_saver',
    title: 'Energy Saver',
    description: 'Reduced energy consumption by 20%',
    icon: '⚡',
    points: 100,
  },
  transport_hero: {
    badge: 'transport_hero',
    title: 'Public Transport Hero',
    description: 'Used public transport 10 times',
    icon: '🚌',
    points: 150,
  },
  plastic_free: {
    badge: 'plastic_free',
    title: 'Plastic Free Week',
    description: 'Completed a plastic-free week challenge',
    icon: '♻️',
    points: 200,
  },
  eco_champion: {
    badge: 'eco_champion',
    title: 'Eco Champion',
    description: 'Completed 25 challenges',
    icon: '🏅',
    points: 500,
  },
  streak_master: {
    badge: 'streak_master',
    title: 'Streak Master',
    description: 'Maintained a 30-day logging streak',
    icon: '🔥',
    points: 300,
  },
  team_player: {
    badge: 'team_player',
    title: 'Team Player',
    description: 'Joined a team and completed a group challenge',
    icon: '🤝',
    points: 100,
  },
  first_scan: {
    badge: 'first_scan',
    title: 'First Scan',
    description: 'Scanned your first receipt or bill',
    icon: '📸',
    points: 50,
  },
  week_warrior: {
    badge: 'week_warrior',
    title: 'Week Warrior',
    description: 'Logged activities every day for a week',
    icon: '📅',
    points: 75,
  },
  month_master: {
    badge: 'month_master',
    title: 'Month Master',
    description: 'Logged activities every day for a month',
    icon: '🗓️',
    points: 250,
  },
  reduction_hero: {
    badge: 'reduction_hero',
    title: 'Reduction Hero',
    description: 'Reduced total emissions by 50 kg CO₂e',
    icon: '📉',
    points: 200,
  },
};
