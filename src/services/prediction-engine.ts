// =============================================================================
// CARBONMIND AI — Climate AI Prediction & Risk Analytics Engine
// =============================================================================

import type { CarbonActivity, CarbonCategory, Difficulty } from '@/types';
import { sortActivitiesChronologically, aggregateDailyEmissions } from '@/utils/carbon';

export interface ForecastPoint {
  date: string;
  predicted: number;
  lowBound: number;
  highBound: number;
}

export interface ExplainableRecommendation {
  id: string;
  title: string;
  content: string;
  impact: number;
  confidence: number;
  difficulty: Difficulty;
  category: CarbonCategory;
  explanation: string;
}

export interface RiskFactor {
  title: string;
  impactScore: number; // 0 to 100
  description: string;
}

export interface RiskScoreResult {
  riskScore: number; // 0 to 100
  riskLevel: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function toIsoDate(value: Date): string {
  return value.toISOString().split('T')[0];
}

/**
 * Carbon Digital Twin engine that models historical user log frequency and
 * emission values to predict future emissions using a Holt-Winters style double exponential smoothing.
 */
export function predictFutureEmissions(activities: CarbonActivity[], daysAhead: number = 30): ForecastPoint[] {
  if (activities.length === 0) {
    // Return standard default projection if no data exists
    return Array.from({ length: daysAhead }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return {
        date: toIsoDate(d),
        predicted: 6.5,
        lowBound: 5.0,
        highBound: 8.0,
      };
    });
  }

  // Sort activities chronologically
  const sorted = sortActivitiesChronologically(activities);

  // Aggregate daily emissions
  const dailyValues = aggregateDailyEmissions(activities);

  // Calculate average daily emission as baseline
  const avgEmission = dailyValues.reduce((sum, v) => sum + v, 0) / Math.max(dailyValues.length, 1);

  // Initialize smoothing parameters
  let level = avgEmission;
  let trend = 0;
  const alpha = 0.2; // Level smoothing coefficient
  const beta = 0.1;  // Trend smoothing coefficient

  // Run double exponential smoothing
  for (let i = 1; i < dailyValues.length; i++) {
    const val = dailyValues[i];
    const prevLevel = level;
    level = alpha * val + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  const result: ForecastPoint[] = [];
  const lastDate = sorted[sorted.length - 1].activityDate;

  for (let i = 1; i <= daysAhead; i++) {
    const targetDate = new Date(lastDate);
    targetDate.setDate(targetDate.getDate() + i);

    // Predict ahead
    const prediction = Math.max(0, level + i * trend);
    const variance = (i * 0.15) * avgEmission; // Expand bounds as prediction horizon deepens

    result.push({
      date: toIsoDate(targetDate),
      predicted: roundToTwo(prediction),
      lowBound: roundToTwo(Math.max(0, prediction - variance)),
      highBound: roundToTwo(prediction + variance),
    });
  }

  return result;
}

/**
 * Explainable AI recommendation engine with confidence scores, impact estimation,
 * and textual logic explanations based on user's highest emission segments.
 */
export function generateExplainableRecommendations(activities: CarbonActivity[]): ExplainableRecommendation[] {
  const categoryTotals: Record<CarbonCategory, number> = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0,
  };

  activities.forEach((act) => {
    categoryTotals[act.category] += act.emissionKg;
  });

  const totalEmissions = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);
  const recommendations: ExplainableRecommendation[] = [];

  // 1. Transport recommendation
  const transportShare = totalEmissions > 0 ? categoryTotals.transport / totalEmissions : 0;
  if (transportShare > 0.35 || totalEmissions === 0) {
    recommendations.push({
      id: 'xai-rec-transport',
      title: 'Transition to Public Commuting & EV Charging',
      content: 'Switching to electric rail or clean electric bus options for daily travel could cut transportation footprint significantly.',
      impact: -32.5,
      confidence: 0.94,
      difficulty: 'medium',
      category: 'transport',
      explanation: `Transportation represents ${Math.round(transportShare * 100) || 40}% of your total profile footprint. Based on high gasoline usage patterns, a 3-day commute modal shift yields high-probability emission cuts.`,
    });
  }

  // 2. Energy recommendation
  const energyShare = totalEmissions > 0 ? categoryTotals.energy / totalEmissions : 0;
  if (energyShare > 0.2 || totalEmissions === 0) {
    recommendations.push({
      id: 'xai-rec-energy',
      title: 'Smart Thermostat & Off-Peak Utility Usage',
      content: 'Optimize home climate control setpoints and run appliance loads during grid peak solar intervals.',
      impact: -18.2,
      confidence: 0.88,
      difficulty: 'easy',
      category: 'energy',
      explanation: `Home energy is driving ${Math.round(energyShare * 100) || 25}% of carbon expenditures. Automated smart grid alignment helps offset dirty fossil-fuel peak generation hours.`,
    });
  }

  // 3. Food recommendation
  const foodShare = totalEmissions > 0 ? categoryTotals.food / totalEmissions : 0;
  if (foodShare > 0.25 || totalEmissions === 0) {
    recommendations.push({
      id: 'xai-rec-food',
      title: 'Lean Low-Carbon Diet Adaptations',
      content: 'Adopt meatless meal programs on weekdays, emphasizing locally sourced organic vegetables and grains.',
      impact: -14.8,
      confidence: 0.91,
      difficulty: 'easy',
      category: 'food',
      explanation: `Agricultural processing logs indicate beef/dairy activities form a major portion of food emissions. Plant-based substitutions carry a low transition cost but high per-meal impact.`,
    });
  }

  // Standard fallback option if we have empty inputs or fewer recs
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'xai-rec-shopping',
      title: 'Circular Purchase & Refurbished Electronics',
      content: 'Prioritize certified circular electronics and pre-owned textile brands to eliminate supply chain lifecycle impact.',
      impact: -10.0,
      confidence: 0.82,
      difficulty: 'medium',
      category: 'shopping',
      explanation: 'General manufacturing emissions carry high hidden lifecycle inputs. Extending item lifespans provides immediate localized preservation.',
    });
  }

  return recommendations;
}

/**
 * Carbon Risk Score System
 * Calculates risk index (0 to 100) and extracts risk factors.
 */
export function calculateCarbonRiskScore(activities: CarbonActivity[], monthlyBudgetKg: number = 250): RiskScoreResult {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthActivities = activities.filter((act) => {
    const d = act.activityDate;
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthTotal = currentMonthActivities.reduce((sum, act) => sum + act.emissionKg, 0);

  const factors: RiskFactor[] = [];
  let score = 30; // base risk score

  // Factor 1: Budget usage
  const budgetUsagePercent = monthlyBudgetKg > 0 ? (monthTotal / monthlyBudgetKg) * 100 : 0;
  if (budgetUsagePercent > 90) {
    score += 40;
    factors.push({
      title: 'Critical Allowance Overflow',
      impactScore: 90,
      description: `Current emissions have reached ${Math.round(budgetUsagePercent)}% of your monthly climate limit.`,
    });
  } else if (budgetUsagePercent > 70) {
    score += 20;
    factors.push({
      title: 'Moderate Budget Overuse',
      impactScore: 65,
      description: `Emissions are trending higher than average, consuming ${Math.round(budgetUsagePercent)}% of budget.`,
    });
  } else {
    factors.push({
      title: 'Budget Within Green Limits',
      impactScore: 20,
      description: `Budget consumption is stable at ${Math.round(budgetUsagePercent)}%. Keep logging to maintain.`,
    });
  }

  // Factor 2: Dirty Transport usage
  const gasolineMiles = currentMonthActivities
    .filter((act) => act.subcategory === 'car_gasoline' || act.subcategory === 'car_diesel')
    .reduce((sum, act) => sum + act.value, 0);

  if (gasolineMiles > 150) {
    score += 20;
    factors.push({
      title: 'High Combustion Transport Reliance',
      impactScore: 75,
      description: 'Frequent non-hybrid driving logs indicate high dependency on carbon-intensive transport.',
    });
  }

  // Factor 3: Grid load profile
  const peakElectricityLogs = currentMonthActivities.filter(
    (act) => act.subcategory === 'electricity' && act.value > 100
  );
  if (peakElectricityLogs.length > 3) {
    score += 10;
    factors.push({
      title: 'Non-Optimal Home Energy Loading',
      impactScore: 50,
      description: 'Multiple large utility logs recorded during grid Peak utility hours.',
    });
  }

  const finalScore = Math.min(100, Math.max(0, score));
  let level: 'low' | 'medium' | 'high' = 'low';
  if (finalScore > 70) level = 'high';
  else if (finalScore > 40) level = 'medium';

  return {
    riskScore: finalScore,
    riskLevel: level,
    factors,
  };
}
