// =============================================================================
// CARBONMIND AI — Carbon Activity Validators (Zod)
// =============================================================================

import { z } from 'zod';

const carbonCategories = ['transport', 'food', 'energy', 'shopping'] as const;

const transportSubcategories = [
  'car_gasoline', 'car_diesel', 'car_electric', 'bus', 'train',
  'flight_domestic', 'flight_international', 'bicycle', 'walking', 'motorcycle',
] as const;

const foodSubcategories = [
  'beef', 'chicken', 'pork', 'fish', 'dairy',
  'vegetables', 'fruits', 'grains', 'processed_food',
] as const;

const energySubcategories = [
  'electricity', 'natural_gas', 'heating_oil', 'solar', 'lpg',
] as const;

const shoppingSubcategories = [
  'clothing', 'electronics', 'furniture', 'general', 'books', 'personal_care',
] as const;

const allSubcategories = [
  ...transportSubcategories,
  ...foodSubcategories,
  ...energySubcategories,
  ...shoppingSubcategories,
] as const;

/**
 * Schema for creating a new carbon activity entry.
 */
export const carbonActivitySchema = z.object({
  category: z.enum(carbonCategories, {
    message: 'Please select a valid category',
  }),
  subcategory: z.enum(allSubcategories, {
    message: 'Please select a valid subcategory',
  }),
  value: z
    .number()
    .positive('Value must be greater than 0')
    .max(100_000, 'Value seems unrealistically high'),
  unit: z.string().min(1).max(20),
  activityDate: z
    .string()
    .min(1, 'Date is required')
    .refine((val) => !Number.isNaN(Date.parse(val)), 'Invalid date format')
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      // Allow dates up to 1 year in the past, not in the future
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return date >= oneYearAgo && date <= now;
    }, 'Date must be within the last year and not in the future'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Schema for querying activities with filters.
 */
export const activityFilterSchema = z.object({
  category: z.enum(carbonCategories).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

/**
 * Schema for the What-If Simulator scenario.
 */
export const scenarioChangeSchema = z.object({
  category: z.enum(carbonCategories),
  subcategory: z.enum(allSubcategories),
  currentValue: z.number().min(0),
  newValue: z.number().min(0),
  unit: z.string().min(1),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

export const simulationSchema = z.object({
  name: z.string().min(1).max(100),
  changes: z.array(scenarioChangeSchema).min(1).max(10),
});

/**
 * Schema for challenge creation.
 */
export const challengeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10).max(500),
  category: z.enum(carbonCategories),
  targetReduction: z.number().positive().max(1000),
  points: z.number().int().positive().max(500).default(50),
  durationDays: z.number().int().positive().max(90).default(7),
});

/**
 * Schema for team creation.
 */
export const teamSchema = z.object({
  name: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(50)
    .regex(/^[a-zA-Z0-9\s'-]+$/, 'Team name contains invalid characters'),
});

/**
 * Schema for joining a team.
 */
export const joinTeamSchema = z.object({
  code: z
    .string()
    .min(6, 'Team code must be 6 characters')
    .max(6)
    .regex(/^[A-Z0-9]+$/, 'Invalid team code'),
});

export type CarbonActivityInput = z.infer<typeof carbonActivitySchema>;
export type ActivityFilter = z.infer<typeof activityFilterSchema>;
export type ScenarioChangeInput = z.infer<typeof scenarioChangeSchema>;
export type SimulationInput = z.infer<typeof simulationSchema>;
export type ChallengeInput = z.infer<typeof challengeSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
