// =============================================================================
// CARBONMIND AI — Gamification Engine
// =============================================================================
// Handles user level progression, points, streaks, and badge awards.
// =============================================================================

import type { UserLevel } from '@/types';

export interface LevelConfig {
  level: UserLevel;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export const LEVELS: LevelConfig[] = [
  {
    level: 'green_starter',
    name: 'Green Starter',
    minPoints: 0,
    maxPoints: 99,
    icon: '🌱',
    color: '#10b981', // emerald
  },
  {
    level: 'eco_explorer',
    name: 'Eco Explorer',
    minPoints: 100,
    maxPoints: 299,
    icon: '🧭',
    color: '#14b8a6', // teal
  },
  {
    level: 'climate_warrior',
    name: 'Climate Warrior',
    minPoints: 300,
    maxPoints: 599,
    icon: '⚔️',
    color: '#3b82f6', // blue
  },
  {
    level: 'planet_guardian',
    name: 'Planet Guardian',
    minPoints: 600,
    maxPoints: 999,
    icon: '🛡️',
    color: '#8b5cf6', // purple
  },
  {
    level: 'net_zero_hero',
    name: 'Net Zero Hero',
    minPoints: 1000,
    maxPoints: Infinity,
    icon: '👑',
    color: '#22c55e', // green
  },
];

/**
 * Get the level details for a given point count.
 */
export function getLevelDetails(points: number): LevelConfig {
  return (
    LEVELS.find((l) => points >= l.minPoints && points <= l.maxPoints) ??
    LEVELS[LEVELS.length - 1]
  );
}

/**
 * Determine if a streak should be incremented or reset.
 * Returns the new streak count and whether it's changed.
 */
export function calculateNewStreak(
  lastActiveDate: Date | null,
  currentStreak: number,
  longestStreak: number
): { streak: number; longest: number; updated: boolean } {
  if (!lastActiveDate) {
    return { streak: 1, longest: Math.max(1, longestStreak), updated: true };
  }

  const now = new Date();
  const lastActive = new Date(lastActiveDate);

  // Normalize dates to midnight for date-difference calculation
  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d2 = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

  const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already active today
    return { streak: currentStreak, longest: longestStreak, updated: false };
  } else if (diffDays === 1) {
    // Active yesterday, increment streak
    const newStreak = currentStreak + 1;
    return {
      streak: newStreak,
      longest: Math.max(newStreak, longestStreak),
      updated: true,
    };
  } else {
    // Streak broken
    return { streak: 1, longest: longestStreak, updated: true };
  }
}
