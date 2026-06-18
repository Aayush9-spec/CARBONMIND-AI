// =============================================================================
// CARBONMIND AI — User Repository
// =============================================================================
/**
 * @file UserRepository.ts
 * @description Manages database interactions for user entities, streaks, levels, challenges, and badges.
 */

import { prisma } from '@/lib/prisma';

export class UserRepository {
  /**
   * Find a user and include their profiles and gamification records.
   * @param id The User CUID.
   */
  async findUserWithGamification(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        carbonProfile: true,
        challenges: { where: { status: 'active' } },
        achievements: true,
      },
    });
  }

  /**
   * Update user gamification metrics.
   * @param id The User CUID.
   * @param data Streak, points, and level updates.
   */
  async updateUserMetrics(
    id: string,
    data: {
      totalPoints: number;
      level: string;
      currentStreak: number;
      longestStreak: number;
      lastActiveDate: Date;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Fetch top users for the standings leaderboard.
   * @param limit Maximum number of users to retrieve.
   */
  async findTopUsersForLeaderboard(limit: number = 5) {
    return prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        image: true,
        totalPoints: true,
        currentStreak: true,
        level: true,
      },
    });
  }

  /**
   * Award a new badge achievement to a user.
   * @param userId The User CUID.
   * @param badge Unique identifier of the badge.
   * @param title Title of the achievement.
   * @param description Brief text description.
   * @param pointsAwarded Extra points added.
   */
  async createAchievement(
    userId: string,
    badge: string,
    title: string,
    description: string,
    pointsAwarded: number
  ) {
    return prisma.achievement.create({
      data: {
        userId,
        badge,
        title,
        description,
        pointsAwarded,
      },
    });
  }
}
