// =============================================================================
// CARBONMIND AI — Carbon Service
// =============================================================================
/**
 * @file CarbonService.ts
 * @description Provides business logic for carbon emissions, Carbon DNA summaries,
 * and Carbon Risk Scores based on standard EPA factors.
 */

import type { CarbonActivity, Subcategory } from '@/types';
import { 
  generateExplainableRecommendations, 
  calculateCarbonRiskScore 
} from '@/services/prediction-engine';
import { calculateActivityEmission, calculateCarbonDNA, calculateCarbonScore } from '@/services/carbon-calculator';

export class CarbonService {
  /**
   * Calculate emissions for a specific subcategory and raw logging value.
   * @param subcategory The activity subcategory.
   * @param value Raw numerical value.
   */
  calculateEmissions(subcategory: string, value: number): { emissionKg: number } {
    return calculateActivityEmission(subcategory as Subcategory, value);
  }

  /**
   * Compute the user's Carbon DNA breakdown.
   * @param activities Collection of activity logs.
   */
  calculateDNA(activities: CarbonActivity[]) {
    return calculateCarbonDNA(activities);
  }

  /**
   * Map carbon emissions to a relative Carbon Score (0 to 100).
   * @param totalEmissions Sum of emissions.
   */
  calculateScore(totalEmissions: number): number {
    return calculateCarbonScore(totalEmissions);
  }

  /**
   * Assess carbon risk score and primary triggers.
   * @param activities User activity logs.
   * @param monthlyBudgetKg Monthly limit in kg CO₂.
   */
  calculateRisk(activities: CarbonActivity[], monthlyBudgetKg: number = 250) {
    return calculateCarbonRiskScore(activities, monthlyBudgetKg);
  }

  /**
   * Generate recommendations with transparency traces.
   * @param activities User activity logs.
   */
  generateRecommendations(activities: CarbonActivity[]) {
    return generateExplainableRecommendations(activities);
  }
}
