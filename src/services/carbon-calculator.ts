// =============================================================================
// CARBONMIND AI — Carbon Calculator Service
// =============================================================================
// Core calculation engine using EPA emission factors.
// =============================================================================

import {
  calculateEmission,
  getEmissionFactor,
} from '@/lib/constants/emission-factors';
import type {
  CarbonCategory,
  CarbonDNA,
  Subcategory,
  CarbonActivity,
} from '@/types';

/**
 * Calculate emissions for a single activity.
 */
export function calculateActivityEmission(
  subcategory: Subcategory,
  value: number
): { emissionKg: number; factor: number; unit: string; source: string } {
  const factorInfo = getEmissionFactor(subcategory);
  const emissionKg = calculateEmission(subcategory, value);

  return {
    emissionKg: Math.round(emissionKg * 100) / 100,
    factor: factorInfo.factor,
    unit: factorInfo.unit,
    source: factorInfo.source,
  };
}

/**
 * Aggregate activities into a Carbon DNA profile.
 */
export function calculateCarbonDNA(activities: CarbonActivity[]): CarbonDNA {
  const categoryTotals: Record<CarbonCategory, number> = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0,
  };

  let total = 0;

  for (const activity of activities) {
    const category = activity.category as CarbonCategory;
    if (category in categoryTotals) {
      categoryTotals[category] += activity.emissionKg;
      total += activity.emissionKg;
    }
  }

  // Avoid division by zero
  const safeTotal = total || 1;

  const dna: CarbonDNA = {
    transport: Math.round((categoryTotals.transport / safeTotal) * 100),
    food: Math.round((categoryTotals.food / safeTotal) * 100),
    energy: Math.round((categoryTotals.energy / safeTotal) * 100),
    shopping: Math.round((categoryTotals.shopping / safeTotal) * 100),
    total: Math.round(total * 100) / 100,
    dominantCategory: getDominantCategory(categoryTotals),
    aiExplanation: '',
  };

  // Ensure percentages add to 100
  const percentSum = dna.transport + dna.food + dna.energy + dna.shopping;
  if (percentSum !== 100 && total > 0) {
    const diff = 100 - percentSum;
    // Add the difference to the largest category
    const dominant = dna.dominantCategory;
    dna[dominant] += diff;
  }

  return dna;
}

/**
 * Calculate the category with the highest emissions.
 */
function getDominantCategory(
  totals: Record<CarbonCategory, number>
): CarbonCategory {
  let max = -1;
  let dominant: CarbonCategory = 'transport';

  for (const [category, value] of Object.entries(totals)) {
    if (value > max) {
      max = value;
      dominant = category as CarbonCategory;
    }
  }

  return dominant;
}

/**
 * Calculate daily average emissions from activities.
 */
export function calculateDailyAverage(
  activities: CarbonActivity[],
  days: number
): number {
  const total = activities.reduce((sum, a) => sum + a.emissionKg, 0);
  return days > 0 ? Math.round((total / days) * 100) / 100 : 0;
}

/**
 * Calculate a carbon score (0-100, higher = better/lower emissions).
 * Based on comparison to average person's carbon footprint.
 * Global average: ~4,700 kg CO₂e/year ≈ 391 kg/month
 */
export function calculateCarbonScore(monthlyEmissions: number): number {
  const AVERAGE_MONTHLY = 391; // kg CO₂e (global average)
  const ratio = monthlyEmissions / AVERAGE_MONTHLY;

  // Score formula: 100 at 0 emissions, 0 at 2x average
  const score = Math.round(Math.max(0, Math.min(100, (1 - ratio / 2) * 100)));
  return score;
}

/**
 * Get comparison text for carbon score.
 */
export function getCarbonScoreLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: 'Excellent', color: '#22c55e' };
  if (score >= 60) return { label: 'Good', color: '#10b981' };
  if (score >= 40) return { label: 'Average', color: '#f59e0b' };
  if (score >= 20) return { label: 'Below Average', color: '#f97316' };
  return { label: 'Needs Improvement', color: '#ef4444' };
}

/**
 * Generate a human-readable explanation for Carbon DNA.
 */
export function generateDNAExplanation(dna: CarbonDNA): string {
  const categories: { name: string; pct: number }[] = [
    { name: 'Transportation', pct: dna.transport },
    { name: 'Food', pct: dna.food },
    { name: 'Energy', pct: dna.energy },
    { name: 'Shopping', pct: dna.shopping },
  ].sort((a, b) => b.pct - a.pct);

  const top = categories[0];
  const second = categories[1];
  const ratio = second.pct > 0 ? (top.pct / second.pct).toFixed(1) : 'N/A';

  return `${top.name} is your largest emission source at ${top.pct}%, contributing ${ratio}x more than ${second.name.toLowerCase()} (${second.pct}%). Your total monthly footprint is ${dna.total.toFixed(1)} kg CO₂e.`;
}
