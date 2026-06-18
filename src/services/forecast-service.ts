// =============================================================================
// CARBONMIND AI — Forecast Service
// =============================================================================
/**
 * @file ForecastService.ts
 * @description Provides climate forecasting and digital twin simulation logic.
 */

import { generateForecast } from '@/services/forecasting-engine';
import { predictFutureEmissions } from '@/services/prediction-engine';
import type { CarbonActivity, ForecastPeriod } from '@/types';

export class ForecastService {
  /**
   * Run seasonal moving average forecast.
   * @param activities User logged activities.
   * @param period Projection horizon (30, 60, or 90 days).
   */
  getWeightedForecast(activities: CarbonActivity[], period: ForecastPeriod = 30) {
    return generateForecast(activities, period);
  }

  /**
   * Run double exponential smoothing (Carbon Digital Twin).
   * @param activities User logged activities.
   * @param daysAhead Forecast length.
   */
  getTwinProjection(activities: CarbonActivity[], daysAhead: number = 30) {
    return predictFutureEmissions(activities, daysAhead);
  }
}
