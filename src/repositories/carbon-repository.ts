// =============================================================================
// CARBONMIND AI — Carbon Repository
// =============================================================================
/**
 * @file CarbonRepository.ts
 * @description Encapsulates all database operations for carbon activities and profiles.
 * Implements the Repository Pattern to decouple data storage from business logic.
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class CarbonRepository {
  /**
   * Find a carbon activity entry by ID.
   * @param id The activity CUID.
   */
  async findActivityById(id: string) {
    return prisma.carbonActivity.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch recent activity logs for a user.
   * @param userId The User CUID.
   * @param limit Maximum number of records to return.
   */
  async findRecentActivities(userId: string, limit: number = 20) {
    return prisma.carbonActivity.findMany({
      where: { userId },
      orderBy: { activityDate: 'desc' },
      take: limit,
    });
  }

  /**
   * Fetch all activities logged by a user.
   * @param userId The User CUID.
   */
  async findAllActivities(userId: string) {
    return prisma.carbonActivity.findMany({
      where: { userId },
      orderBy: { activityDate: 'desc' },
    });
  }

  /**
   * Insert a new carbon activity entry.
   * @param data Activity creation payload.
   */
  async createActivity(data: {
    userId: string;
    category: string;
    subcategory: string;
    value: number;
    unit: string;
    emissionKg: number;
    activityDate: Date;
    source?: string;
    confidence?: number;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.carbonActivity.create({
      data: {
        ...data,
        source: data.source || 'manual',
        confidence: data.confidence !== undefined ? data.confidence : 1.0,
        metadata: data.metadata || {},
      },
    });
  }

  /**
   * Remove a logged carbon activity.
   * @param id The activity CUID.
   */
  async deleteActivity(id: string) {
    return prisma.carbonActivity.delete({
      where: { id },
    });
  }

  /**
   * Find a user's carbon profile aggregates.
   * @param userId The User CUID.
   */
  async findProfileByUserId(userId: string) {
    return prisma.carbonProfile.findUnique({
      where: { userId },
    });
  }

  /**
   * Upsert the carbon profile totals for a user.
   * @param userId The User CUID.
   * @param profile The updated averages and percentages.
   */
  async upsertProfile(
    userId: string,
    profile: {
      totalEmissions: number;
      transportPct: number;
      foodPct: number;
      energyPct: number;
      shoppingPct: number;
      monthlyAverage: number;
    }
  ) {
    return prisma.carbonProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profile,
      },
      update: {
        ...profile,
      },
    });
  }
}
