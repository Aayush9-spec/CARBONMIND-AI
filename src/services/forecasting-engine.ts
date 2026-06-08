// =============================================================================
// CARBONMIND AI — Forecasting Engine
// =============================================================================
// Weighted Moving Average + Seasonal Decomposition for emission prediction.
// =============================================================================

import type { CarbonActivity, ForecastPoint, ForecastResult, ForecastPeriod } from '@/types';

/**
 * Generate emission forecast for 30, 60, or 90 days.
 */
export function generateForecast(
  activities: CarbonActivity[],
  period: ForecastPeriod = 30
): ForecastResult {
  const dailyEmissions = aggregateDailyEmissions(activities);

  if (dailyEmissions.length < 7) {
    return createEmptyForecast(period);
  }

  // Calculate weighted moving average
  const wma = calculateWeightedMovingAverage(dailyEmissions, 7);
  const trend = calculateTrend(dailyEmissions);
  const seasonalFactors = calculateSeasonalFactors(dailyEmissions);

  // Generate forecast points
  const forecastData: ForecastPoint[] = [];
  const now = new Date();
  let totalPredicted = 0;

  for (let i = 0; i < period; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i + 1);

    const dayOfWeek = date.getDay();
    const seasonalFactor = seasonalFactors[dayOfWeek] ?? 1;

    // Base prediction = WMA + trend adjustment + seasonal factor
    const basePrediction = wma * seasonalFactor;
    const trendAdjustment = trend * (i + 1);
    const predicted = Math.max(0, basePrediction + trendAdjustment);

    // Confidence interval widens with distance
    const uncertaintyFactor = 1 + (i / period) * 0.5;
    const margin = predicted * 0.15 * uncertaintyFactor;

    forecastData.push({
      date: date.toISOString().split('T')[0],
      predicted: Math.round(predicted * 100) / 100,
      lowerBound: Math.round(Math.max(0, predicted - margin) * 100) / 100,
      upperBound: Math.round((predicted + margin) * 100) / 100,
    });

    totalPredicted += predicted;
  }

  // Calculate change vs current average
  const currentAvg = dailyEmissions.reduce((s, v) => s + v, 0) / dailyEmissions.length;
  const forecastAvg = totalPredicted / period;
  const changePercent =
    currentAvg > 0
      ? Math.round(((forecastAvg - currentAvg) / currentAvg) * 1000) / 10
      : 0;

  // Determine confidence based on data quality
  const confidence = calculateConfidence(dailyEmissions.length, period);

  return {
    period,
    data: forecastData,
    totalPredicted: Math.round(totalPredicted * 100) / 100,
    changePercent,
    confidence,
    aiExplanation: '', // Filled by AI service
    trend: changePercent > 2 ? 'increasing' : changePercent < -2 ? 'decreasing' : 'stable',
  };
}

/**
 * Aggregate activities into daily emission totals.
 */
function aggregateDailyEmissions(activities: CarbonActivity[]): number[] {
  if (activities.length === 0) return [];

  // Sort by date
  const sorted = [...activities].sort(
    (a, b) => new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime()
  );

  const dailyMap = new Map<string, number>();

  for (const activity of sorted) {
    const dateKey = new Date(activity.activityDate).toISOString().split('T')[0];
    dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + activity.emissionKg);
  }

  return Array.from(dailyMap.values());
}

/**
 * Calculate Weighted Moving Average with recent data weighted higher.
 */
function calculateWeightedMovingAverage(
  data: number[],
  windowSize: number
): number {
  const recentData = data.slice(-windowSize);
  let weightedSum = 0;
  let weightTotal = 0;

  for (let i = 0; i < recentData.length; i++) {
    const weight = i + 1; // More recent = higher weight
    weightedSum += recentData[i] * weight;
    weightTotal += weight;
  }

  return weightTotal > 0 ? weightedSum / weightTotal : 0;
}

/**
 * Calculate linear trend (slope) from daily data.
 */
function calculateTrend(data: number[]): number {
  if (data.length < 2) return 0;

  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return 0;

  return (n * sumXY - sumX * sumY) / denominator;
}

/**
 * Calculate day-of-week seasonal factors.
 */
function calculateSeasonalFactors(data: number[]): number[] {
  if (data.length < 14) return Array(7).fill(1);

  const dayTotals: number[] = Array(7).fill(0);
  const dayCounts: number[] = Array(7).fill(0);

  for (let i = 0; i < data.length; i++) {
    const dayIndex = i % 7;
    dayTotals[dayIndex] += data[i];
    dayCounts[dayIndex]++;
  }

  const overallAvg = data.reduce((s, v) => s + v, 0) / data.length;
  if (overallAvg === 0) return Array(7).fill(1);

  return dayTotals.map((total, i) => {
    const dayAvg = dayCounts[i] > 0 ? total / dayCounts[i] : overallAvg;
    return dayAvg / overallAvg;
  });
}

/**
 * Calculate forecast confidence (0-1).
 */
function calculateConfidence(dataPoints: number, period: ForecastPeriod): number {
  // More data = higher confidence; longer forecast = lower confidence
  const dataFactor = Math.min(1, dataPoints / 90); // Max at 90 days of data
  const periodFactor = 1 - (period - 30) / 120; // 30d=1, 90d=0.5

  return Math.round(dataFactor * periodFactor * 100) / 100;
}

/**
 * Create an empty forecast when insufficient data.
 */
function createEmptyForecast(period: ForecastPeriod): ForecastResult {
  return {
    period,
    data: [],
    totalPredicted: 0,
    changePercent: 0,
    confidence: 0,
    aiExplanation: 'Insufficient data for accurate forecasting. Log at least 7 days of activities.',
    trend: 'stable',
  };
}
