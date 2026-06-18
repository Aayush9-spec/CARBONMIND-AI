// =============================================================================
// CARBONMIND AI — Carbon Footprint Server Actions
// =============================================================================
/**
 * @file carbon-actions.ts
 * @description Serves as the routing controller/orchestration layer. Instantiates
 * and delegates business calculations and data retrieval to Repositories and Services.
 */

'use server';

import { auth } from '@/lib/auth';
import { carbonActivitySchema } from '@/lib/validators/carbon';
import { CarbonRepository } from '@/repositories/carbon-repository';
import { UserRepository } from '@/repositories/user-repository';
import { CarbonService } from '@/services/carbon-service';
import { ForecastService } from '@/services/forecast-service';
import { QuizService } from '@/services/quiz-service';
import { runSimulation } from '@/services/simulator-engine';
import { calculateNewStreak, getLevelDetails } from '@/services/gamification';
import type { 
  CarbonActivity, 
  DashboardData, 
  SimulationResult, 
  ScenarioChange,
  ApiResponse,
  CarbonCategory,
  Subcategory,
  UserLevel,
  BadgeType,
  ChallengeStatus
} from '@/types';
import { revalidatePath } from 'next/cache';

// Instantiate singletons/instances
const carbonRepo = new CarbonRepository();
const userRepo = new UserRepository();
const carbonService = new CarbonService();
const forecastService = new ForecastService();
const quizService = new QuizService();

/**
 * Helper to check authentication and return user ID.
 * @private
 */
async function requireAuth(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

/**
 * Log a new carbon activity entry.
 * Delegates storage and calculations.
 * @param formData Raw input fields from logger form.
 */
export async function addActivity(formData: {
  category: string;
  subcategory: string;
  value: number;
  unit: string;
  activityDate: string;
}): Promise<ApiResponse<CarbonActivity>> {
  try {
    const userId = await requireAuth();

    // Validate using Zod schema
    const validated = carbonActivitySchema.safeParse(formData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? 'Invalid input data',
      };
    }

    const { category, subcategory, value, unit, activityDate } = validated.data;

    // Calculate emissions via Service
    const { emissionKg } = carbonService.calculateEmissions(subcategory, value);

    // Save activity log via Repository
    const activity = await carbonRepo.createActivity({
      userId,
      category,
      subcategory,
      value,
      unit,
      emissionKg,
      activityDate: new Date(activityDate),
      source: 'manual',
      confidence: 1.0,
      metadata: {},
    });

    // Update streak and points via User Repository
    const user = await userRepo.findUserWithGamification(userId);
    if (user) {
      const streakResult = calculateNewStreak(
        user.lastActiveDate,
        user.currentStreak,
        user.longestStreak
      );

      const pointsEarned = 10 + (streakResult.updated ? 5 : 0);
      const newPoints = user.totalPoints + pointsEarned;
      const levelDetails = getLevelDetails(newPoints);

      await userRepo.updateUserMetrics(userId, {
        totalPoints: newPoints,
        level: levelDetails.level,
        currentStreak: streakResult.streak,
        longestStreak: streakResult.longest,
        lastActiveDate: new Date(),
      });
    }

    // Recalculate carbon profile
    await updateCarbonProfile(userId);

    revalidatePath('/dashboard');
    return {
      success: true,
      data: {
        ...activity,
        category: activity.category as CarbonCategory,
        subcategory: activity.subcategory as Subcategory,
        source: activity.source as 'manual' | 'ocr' | 'ai_estimated',
        metadata: (activity.metadata ?? {}) as Record<string, unknown>,
      },
    };
  } catch (error) {
    console.error('Error adding activity:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to log activity' };
  }
}

/**
 * Delete a logged carbon activity.
 * @param activityId The activity CUID.
 */
export async function deleteActivity(activityId: string): Promise<ApiResponse<void>> {
  try {
    const userId = await requireAuth();

    // Verify ownership before deleting via Repository
    const existing = await carbonRepo.findActivityById(activityId);
    if (!existing || existing.userId !== userId) {
      return { success: false, error: 'Activity not found or unauthorized' };
    }

    await carbonRepo.deleteActivity(activityId);

    // Update profile totals
    await updateCarbonProfile(userId);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete activity' };
  }
}

/**
 * Get all carbon activities for the logged-in user.
 */
export async function getActivities(): Promise<ApiResponse<CarbonActivity[]>> {
  try {
    const userId = await requireAuth();
    const activities = await carbonRepo.findAllActivities(userId);

    return {
      success: true,
      data: activities.map((a) => ({
        ...a,
        category: a.category as CarbonCategory,
        subcategory: a.subcategory as Subcategory,
        source: a.source as 'manual' | 'ocr' | 'ai_estimated',
        metadata: (a.metadata ?? {}) as Record<string, unknown>,
      })),
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch activities' };
  }
}

/**
 * Run what-if simulations dynamically using the database profile.
 * @param changes Selected scenario modifiers.
 */
export async function simulateScenario(
  changes: ScenarioChange[]
): Promise<ApiResponse<SimulationResult>> {
  try {
    const userId = await requireAuth();
    const profile = await carbonRepo.findProfileByUserId(userId);

    const currentEmissions = {
      transport: (profile?.totalEmissions ?? 0) * ((profile?.transportPct ?? 0) / 100),
      food: (profile?.totalEmissions ?? 0) * ((profile?.foodPct ?? 0) / 100),
      energy: (profile?.totalEmissions ?? 0) * ((profile?.energyPct ?? 0) / 100),
      shopping: (profile?.totalEmissions ?? 0) * ((profile?.shoppingPct ?? 0) / 100),
    };

    const simulation = runSimulation(currentEmissions, changes);
    simulation.aiExplanation = `By implementing this scenario, you reduce your carbon output by ${simulation.savingsPercent}% (${simulation.savingsMonthly.toFixed(1)} kg CO₂e/month). This is equivalent to planting ${Math.round(simulation.savingsYearly / 22)} trees annually!`;

    return { success: true, data: simulation };
  } catch (error) {
    console.error('Error simulating scenario:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to run simulation' };
  }
}

/**
 * Fetch complete dashboard data in a single transactional query.
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  try {
    const userId = await requireAuth();

    // 1. Fetch user info via Repository
    const user = await userRepo.findUserWithGamification(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // 2. Fetch recent activities
    const activities = await carbonRepo.findRecentActivities(userId, 20);
    const typedActivities = activities.map((a) => ({
      ...a,
      category: a.category as CarbonCategory,
      subcategory: a.subcategory as Subcategory,
      source: a.source as 'manual' | 'ocr' | 'ai_estimated',
      metadata: (a.metadata ?? {}) as Record<string, unknown>,
    }));

    // 3. Calculate DNA profile via Service
    const dna = carbonService.calculateDNA(typedActivities);

    // 4. Generate forecast via Service
    const forecast = forecastService.getWeightedForecast(typedActivities, 30);

    // 5. Fetch leaderboard
    const topUsers = await userRepo.findTopUsersForLeaderboard(5);
    const leaderboard = topUsers.map((u, i) => ({
      rank: i + 1,
      userId: u.id,
      name: u.name ?? 'Eco Citizen',
      image: u.image ?? undefined,
      co2Reduced: Math.round(u.totalPoints * 0.2 * 10) / 10,
      challengesCompleted: Math.round(u.totalPoints / 50),
      streak: u.currentStreak,
      level: u.level as UserLevel,
    }));

    // 6. Generate insights
    const insights = [
      {
        id: '1',
        type: 'recommendation' as const,
        title: 'Optimize Energy Usage',
        content: dna.energy > 30 
          ? 'Energy is your largest emission sector. Switching to smart power strips and washing clothes in cold water can save up to 45kg CO₂e monthly.'
          : 'Great job keeping energy emissions low! To optimize further, consider LED bulb retrofits.',
        impactKg: 45,
        confidence: 0.95,
        difficulty: 'easy' as const,
        dismissed: false,
        createdAt: new Date(),
      },
      {
        id: '2',
        type: 'warning' as const,
        title: 'Weekly Travel Threshold Exceeded',
        content: dna.transport > 40
          ? 'Your transportation emissions have increased by 15% this week. Consider pooling or working from home 1 day/week.'
          : 'Your transport emissions are well-managed. Continue active transit where possible!',
        impactKg: 35,
        confidence: 0.88,
        difficulty: 'medium' as const,
        dismissed: false,
        createdAt: new Date(),
      },
    ];

    const score = carbonService.calculateScore(dna.total);

    const gamification = {
      level: user.level as UserLevel,
      levelName: getLevelDetails(user.totalPoints).name,
      totalPoints: user.totalPoints,
      pointsToNextLevel: Math.max(0, getLevelDetails(user.totalPoints).maxPoints + 1 - user.totalPoints),
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      achievements: user.achievements.map((ach) => ({
        id: ach.id,
        badge: ach.badge as BadgeType,
        title: ach.title,
        description: ach.description,
        pointsAwarded: ach.pointsAwarded,
        earnedAt: ach.earnedAt,
        icon: '🏆',
      })),
      activeChallenges: user.challenges.map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        description: c.description,
        category: c.category as CarbonCategory,
        targetReduction: c.targetReduction,
        points: c.points,
        status: c.status as ChallengeStatus,
        progress: c.progress,
        startDate: c.startDate,
        endDate: c.endDate,
      })),
    };

    return {
      success: true,
      data: {
        carbonScore: score,
        carbonDNA: dna,
        recentActivities: typedActivities,
        forecast,
        insights,
        activeChallenges: gamification.activeChallenges,
        gamification,
        leaderboard,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' };
  }
}

/**
 * Grade the literacy quiz.
 * @param answers Array of indices of selected quiz answers.
 */
export async function gradeLiteracyQuiz(answers: number[]) {
  try {
    const result = quizService.gradeQuiz(answers);
    
    // Award 50 bonus points if they pass the quiz
    if (result.passed) {
      const userId = await requireAuth();
      const user = await userRepo.findUserWithGamification(userId);
      if (user) {
        const newPoints = user.totalPoints + 50;
        const levelDetails = getLevelDetails(newPoints);
        await userRepo.updateUserMetrics(userId, {
          totalPoints: newPoints,
          level: levelDetails.level,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          lastActiveDate: new Date(),
        });
      }
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error grading quiz:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to grade quiz' };
  }
}

/**
 * Update aggregate carbon profile for user.
 * @private
 */
async function updateCarbonProfile(userId: string) {
  const activities = await carbonRepo.findAllActivities(userId);
  const typedActivities = activities.map((a) => ({
    ...a,
    category: a.category as CarbonCategory,
    subcategory: a.subcategory as Subcategory,
    source: a.source as 'manual' | 'ocr' | 'ai_estimated',
    metadata: (a.metadata ?? {}) as Record<string, unknown>,
  }));

  const dna = carbonService.calculateDNA(typedActivities);

  await carbonRepo.upsertProfile(userId, {
    totalEmissions: dna.total,
    transportPct: dna.transport,
    foodPct: dna.food,
    energyPct: dna.energy,
    shoppingPct: dna.shopping,
    monthlyAverage: dna.total,
  });
}
