// =============================================================================
// CARBONMIND AI — Carbon Utilities
// =============================================================================

import type { CarbonActivity } from '@/types';

/**
 * Sorts activities chronologically by activityDate.
 */
export function sortActivitiesChronologically(activities: CarbonActivity[]): CarbonActivity[] {
  return [...activities].sort(
    (a, b) => new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime()
  );
}

/**
 * Aggregates activities into daily emission totals, ordered chronologically.
 * Returns an array of daily emissions in kg.
 */
export function aggregateDailyEmissions(activities: CarbonActivity[]): number[] {
  if (activities.length === 0) return [];

  const sorted = sortActivitiesChronologically(activities);
  const dailyMap = new Map<string, number>();

  for (const activity of sorted) {
    const dateKey = new Date(activity.activityDate).toISOString().split('T')[0];
    dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + activity.emissionKg);
  }

  return Array.from(dailyMap.values());
}
