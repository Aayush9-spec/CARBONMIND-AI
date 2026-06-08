// =============================================================================
// CARBONMIND AI — What-If Simulator Engine
// =============================================================================

import {
  calculateEmission,
  getEmissionFactor,
} from '@/lib/constants/emission-factors';
import type {
  CarbonCategory,
  ScenarioChange,
  SimulationResult,
  Subcategory,
} from '@/types';

/**
 * Run a what-if simulation to compare current vs projected emissions.
 */
export function runSimulation(
  currentMonthlyEmissions: Record<CarbonCategory, number>,
  changes: ScenarioChange[]
): SimulationResult {
  const projected: Record<CarbonCategory, number> = { ...currentMonthlyEmissions };

  for (const change of changes) {
    const category = getEmissionFactor(change.subcategory).category;
    const currentEmission = calculateMonthlyEmission(
      change.subcategory,
      change.currentValue,
      change.frequency
    );
    const newEmission = calculateMonthlyEmission(
      change.subcategory,
      change.newValue,
      change.frequency
    );

    // Adjust projected emissions
    projected[category] =
      projected[category] - currentEmission + newEmission;
  }

  // Ensure no negative values
  for (const key of Object.keys(projected) as CarbonCategory[]) {
    projected[key] = Math.max(0, projected[key]);
  }

  const currentTotal = Object.values(currentMonthlyEmissions).reduce(
    (s, v) => s + v,
    0
  );
  const projectedTotal = Object.values(projected).reduce((s, v) => s + v, 0);
  const savings = currentTotal - projectedTotal;

  const categoryBreakdown = (
    Object.keys(currentMonthlyEmissions) as CarbonCategory[]
  ).map((category) => ({
    category,
    current: Math.round(currentMonthlyEmissions[category] * 100) / 100,
    projected: Math.round(projected[category] * 100) / 100,
    savings: Math.round(
      (currentMonthlyEmissions[category] - projected[category]) * 100
    ) / 100,
  }));

  return {
    currentMonthly: Math.round(currentTotal * 100) / 100,
    projectedMonthly: Math.round(projectedTotal * 100) / 100,
    savingsMonthly: Math.round(savings * 100) / 100,
    savingsYearly: Math.round(savings * 12 * 100) / 100,
    savingsPercent:
      currentTotal > 0
        ? Math.round((savings / currentTotal) * 1000) / 10
        : 0,
    categoryBreakdown,
    aiExplanation: '', // Filled by AI service
  };
}

/**
 * Convert an activity value + frequency to monthly emission.
 */
function calculateMonthlyEmission(
  subcategory: Subcategory,
  value: number,
  frequency: 'daily' | 'weekly' | 'monthly'
): number {
  const emission = calculateEmission(subcategory, value);

  switch (frequency) {
    case 'daily':
      return emission * 30;
    case 'weekly':
      return emission * 4.33;
    case 'monthly':
      return emission;
    default:
      return emission;
  }
}

/**
 * Predefined simulation scenarios for quick access.
 */
export const PRESET_SCENARIOS = [
  {
    id: 'bike-commute',
    name: 'Cycle to work/college',
    description: 'Replace car commute with cycling',
    changes: [
      {
        category: 'transport' as CarbonCategory,
        subcategory: 'car_gasoline' as Subcategory,
        currentValue: 20,
        newValue: 0,
        unit: 'km',
        frequency: 'daily' as const,
      },
      {
        category: 'transport' as CarbonCategory,
        subcategory: 'bicycle' as Subcategory,
        currentValue: 0,
        newValue: 20,
        unit: 'km',
        frequency: 'daily' as const,
      },
    ],
  },
  {
    id: 'public-transport',
    name: 'Use public transport',
    description: 'Switch from car to bus for daily commute',
    changes: [
      {
        category: 'transport' as CarbonCategory,
        subcategory: 'car_gasoline' as Subcategory,
        currentValue: 20,
        newValue: 0,
        unit: 'km',
        frequency: 'daily' as const,
      },
      {
        category: 'transport' as CarbonCategory,
        subcategory: 'bus' as Subcategory,
        currentValue: 0,
        newValue: 20,
        unit: 'km',
        frequency: 'daily' as const,
      },
    ],
  },
  {
    id: 'meatless-days',
    name: 'Reduce meat consumption',
    description: 'Replace beef with vegetables 3 days a week',
    changes: [
      {
        category: 'food' as CarbonCategory,
        subcategory: 'beef' as Subcategory,
        currentValue: 0.3,
        newValue: 0,
        unit: 'kg',
        frequency: 'daily' as const,
      },
      {
        category: 'food' as CarbonCategory,
        subcategory: 'vegetables' as Subcategory,
        currentValue: 0,
        newValue: 0.5,
        unit: 'kg',
        frequency: 'daily' as const,
      },
    ],
  },
  {
    id: 'energy-saving',
    name: 'Lower electricity usage',
    description: 'Reduce electricity consumption by 30%',
    changes: [
      {
        category: 'energy' as CarbonCategory,
        subcategory: 'electricity' as Subcategory,
        currentValue: 15,
        newValue: 10.5,
        unit: 'kWh',
        frequency: 'daily' as const,
      },
    ],
  },
];
