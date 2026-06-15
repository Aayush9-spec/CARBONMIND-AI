import { describe, it, expect } from 'vitest';
import {
  calculateActivityEmission,
  calculateCarbonScore,
  getCarbonScoreLabel,
  generateDNAExplanation,
  calculateCarbonDNA
} from '@/services/carbon-calculator';
import type { CarbonActivity } from '@/types';

describe('Carbon Calculator Service Tests', () => {
  
  describe('calculateActivityEmission', () => {
    it('should correctly calculate emissions for transport (gasoline car)', () => {
      const result = calculateActivityEmission('car_gasoline', 100); // 100 km
      expect(result.emissionKg).toBe(21); // 100 * 0.21
      expect(result.unit).toBe('km');
      expect(result.source).toBe('EPA Mobile Combustion');
    });

    it('should correctly calculate emissions for energy (electricity)', () => {
      const result = calculateActivityEmission('electricity', 200); // 200 kWh
      expect(result.emissionKg).toBe(84); // 200 * 0.42
      expect(result.unit).toBe('kWh');
    });
  });

  describe('calculateCarbonScore', () => {
    it('should return 100 for 0 emissions', () => {
      expect(calculateCarbonScore(0)).toBe(100);
    });

    it('should return 50 for average monthly emissions (391 kg)', () => {
      expect(calculateCarbonScore(391)).toBe(50);
    });

    it('should return 0 for double average emissions (782 kg)', () => {
      expect(calculateCarbonScore(782)).toBe(0);
    });
  });

  describe('getCarbonScoreLabel', () => {
    it('should return Excellent for scores >= 80', () => {
      const result = getCarbonScoreLabel(85);
      expect(result.label).toBe('Excellent');
      expect(result.color).toBe('#22c55e');
    });

    it('should return Needs Improvement for scores < 20', () => {
      const result = getCarbonScoreLabel(10);
      expect(result.label).toBe('Needs Improvement');
      expect(result.color).toBe('#ef4444');
    });
  });

  describe('calculateCarbonDNA', () => {
    it('should properly aggregate emissions and percentage distributions', () => {
      const mockActivities: CarbonActivity[] = [
        {
          id: '1',
          userId: 'user-1',
          category: 'transport',
          subcategory: 'car_gasoline',
          value: 100,
          unit: 'km',
          emissionKg: 20,
          source: 'manual',
          confidence: 1.0,
          metadata: {},
          activityDate: new Date(),
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: 'user-1',
          category: 'energy',
          subcategory: 'electricity',
          value: 200,
          unit: 'kWh',
          emissionKg: 80,
          source: 'manual',
          confidence: 1.0,
          metadata: {},
          activityDate: new Date(),
          createdAt: new Date(),
        }
      ];

      const dna = calculateCarbonDNA(mockActivities);
      expect(dna.total).toBe(100);
      expect(dna.transport).toBe(20);
      expect(dna.energy).toBe(80);
      expect(dna.dominantCategory).toBe('energy');
    });
  });

  describe('generateDNAExplanation', () => {
    it('should generate a correct and logical human-readable explanation', () => {
      const mockDNA = {
        transport: 30,
        food: 10,
        energy: 50,
        shopping: 10,
        total: 500,
        dominantCategory: 'energy' as const,
        aiExplanation: '',
      };

      const explanation = generateDNAExplanation(mockDNA);
      expect(explanation).toContain('Energy is your largest emission source at 50%');
      expect(explanation).toContain('monthly footprint is 500.0 kg');
    });
  });

});
