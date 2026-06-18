import { describe, it, expect } from 'vitest';
import { generateForecast } from '@/services/forecasting-engine';
import { getLevelDetails, calculateNewStreak } from '@/services/gamification';
import { runSimulation } from '@/services/simulator-engine';
import { predictFutureEmissions, generateExplainableRecommendations, calculateCarbonRiskScore } from '@/services/prediction-engine';
import { QuizService } from '@/services/quiz-service';
import type { CarbonActivity, CarbonCategory, ScenarioChange } from '@/types';

describe('Forecasting Engine Tests', () => {
  it('should return empty forecast if less than 7 days of activities', () => {
    const mockActivities: CarbonActivity[] = [
      {
        id: '1',
        userId: 'user-1',
        category: 'transport',
        subcategory: 'car_gasoline',
        value: 100,
        unit: 'km',
        emissionKg: 21,
        source: 'manual',
        confidence: 1.0,
        metadata: {},
        activityDate: new Date('2026-06-01'),
        createdAt: new Date(),
      }
    ];

    const result = generateForecast(mockActivities, 30);
    expect(result.totalPredicted).toBe(0);
    expect(result.data.length).toBe(0);
    expect(result.aiExplanation).toContain('Insufficient data');
  });

  it('should generate forecast points when at least 7 days of activities exist', () => {
    const mockActivities: CarbonActivity[] = [];
    for (let i = 0; i < 10; i++) {
      mockActivities.push({
        id: `act-${i}`,
        userId: 'user-1',
        category: 'transport',
        subcategory: 'car_gasoline',
        value: 10,
        unit: 'km',
        emissionKg: 2.1,
        source: 'manual',
        confidence: 1.0,
        metadata: {},
        activityDate: new Date(new Date('2026-06-01').getTime() + i * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      });
    }

    const result = generateForecast(mockActivities, 30);
    expect(result.totalPredicted).toBeGreaterThan(0);
    expect(result.data.length).toBe(30);
    expect(result.changePercent).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    expect(['increasing', 'decreasing', 'stable']).toContain(result.trend);
  });
});

describe('Gamification Engine Tests', () => {
  describe('getLevelDetails', () => {
    it('should map points to green starter level', () => {
      const level = getLevelDetails(50);
      expect(level.level).toBe('green_starter');
      expect(level.name).toBe('Green Starter');
    });

    it('should map points to net zero hero level', () => {
      const level = getLevelDetails(1500);
      expect(level.level).toBe('net_zero_hero');
      expect(level.name).toBe('Net Zero Hero');
    });
  });

  describe('calculateNewStreak', () => {
    it('should initialize streak if lastActiveDate is null', () => {
      const result = calculateNewStreak(null, 0, 0);
      expect(result.streak).toBe(1);
      expect(result.longest).toBe(1);
      expect(result.updated).toBe(true);
    });

    it('should not update streak if active today', () => {
      const today = new Date();
      const result = calculateNewStreak(today, 3, 5);
      expect(result.streak).toBe(3);
      expect(result.updated).toBe(false);
    });

    it('should increment streak if active yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = calculateNewStreak(yesterday, 3, 3);
      expect(result.streak).toBe(4);
      expect(result.longest).toBe(4);
      expect(result.updated).toBe(true);
    });

    it('should reset streak if active more than 1 day ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const result = calculateNewStreak(twoDaysAgo, 3, 5);
      expect(result.streak).toBe(1);
      expect(result.longest).toBe(5);
      expect(result.updated).toBe(true);
    });
  });
});

describe('Simulator Engine Tests', () => {
  it('should run simulation and return projected reductions and savings', () => {
    const currentMonthly: Record<CarbonCategory, number> = {
      transport: 100,
      food: 50,
      energy: 200,
      shopping: 40,
    };

    const changes: ScenarioChange[] = [
      {
        category: 'transport',
        subcategory: 'car_gasoline',
        currentValue: 50,
        newValue: 10,
        unit: 'km',
        frequency: 'daily',
      }
    ];

    const result = runSimulation(currentMonthly, changes);
    expect(result.currentMonthly).toBe(390);
    expect(result.projectedMonthly).toBeLessThan(390);
    expect(result.savingsMonthly).toBeGreaterThan(0);
    expect(result.savingsPercent).toBeGreaterThan(0);
    expect(result.categoryBreakdown.length).toBe(4);
  });
});

describe('Carbon AI Prediction & Risk Analytics Engine Tests', () => {
  const mockActivities: CarbonActivity[] = [];
  for (let i = 0; i < 10; i++) {
    mockActivities.push({
      id: `act-${i}`,
      userId: 'user-1',
      category: i % 2 === 0 ? 'transport' : 'energy',
      subcategory: i % 2 === 0 ? 'car_gasoline' : 'electricity',
      value: 10 + i,
      unit: i % 2 === 0 ? 'km' : 'kWh',
      emissionKg: 20 + i,
      source: 'manual',
      confidence: 1.0,
      metadata: {},
      activityDate: new Date(new Date('2026-06-01').getTime() + i * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });
  }

  it('should predict future emissions with confidence bounds', () => {
    const forecast = predictFutureEmissions(mockActivities, 7);
    expect(forecast.length).toBe(7);
    expect(forecast[0].predicted).toBeGreaterThan(0);
    expect(forecast[0].lowBound).toBeLessThanOrEqual(forecast[0].predicted);
    expect(forecast[0].highBound).toBeGreaterThanOrEqual(forecast[0].predicted);
  });

  it('should generate explainable recommendations with reasoning trace', () => {
    const recs = generateExplainableRecommendations(mockActivities);
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(recs[0].explanation).toBeDefined();
    expect(recs[0].impact).toBeLessThan(0);
    expect(recs[0].confidence).toBeGreaterThan(0);
  });

  it('should calculate Carbon Risk Score and flag triggers', () => {
    const risk = calculateCarbonRiskScore(mockActivities, 150);
    expect(risk.riskScore).toBeGreaterThanOrEqual(0);
    expect(risk.riskScore).toBeLessThanOrEqual(100);
    expect(['low', 'medium', 'high']).toContain(risk.riskLevel);
    expect(risk.factors.length).toBeGreaterThan(0);
  });
});

describe('Quiz & Education Service Tests', () => {
  const service = new QuizService();

  it('should return questions and modules', () => {
    const questions = service.getQuizQuestions();
    const modules = service.getEducationalModules();
    expect(questions.length).toBe(4);
    expect(modules.length).toBe(3);
  });

  it('should grade quiz answers correctly', () => {
    // 100% correct answers
    const grading = service.gradeQuiz([1, 0, 1, 1]);
    expect(grading.score).toBe(100);
    expect(grading.passed).toBe(true);
    expect(grading.feedback).toContain('Excellent');

    // 0% correct answers
    const badGrading = service.gradeQuiz([0, 1, 0, 0]);
    expect(badGrading.score).toBe(0);
    expect(badGrading.passed).toBe(false);
    expect(badGrading.feedback).toContain('effort');
  });
});
