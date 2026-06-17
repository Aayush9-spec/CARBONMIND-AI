// =============================================================================
// CARBONMIND AI — Challenges & Achievements Page
// =============================================================================

'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  Target, 
  Trophy, 
  Flame, 
  CheckCircle, 
  Loader2, 
  Plus
} from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';
import type { DashboardData, Achievement } from '@/types';

const LEVEL_NAMES = {
  green_starter: 'Green Starter 🌱',
  eco_explorer: 'Eco Explorer 🧭',
  climate_warrior: 'Climate Warrior ⚔️',
  planet_guardian: 'Planet Guardian 🛡️',
  net_zero_hero: 'Net Zero Hero 👑',
};

const BADGES = [
  { type: 'energy_saver', title: 'Energy Saver', desc: 'Log home energy actions for 3 days', icon: '⚡' },
  { type: 'transport_hero', title: 'Transport Hero', desc: 'Reduce commute carbon emissions', icon: '🚲' },
  { type: 'plastic_free', title: 'Zero Waste Master', desc: 'Maintain shopping emissions under threshold', icon: '♻️' },
  { type: 'streak_master', title: 'Streak Master', desc: 'Record active logs for 7 consecutive days', icon: '🔥' },
  { type: 'reduction_hero', title: 'Reduction Hero', desc: 'Save a cumulative 100 kg CO₂e', icon: '📉' },
  { type: 'first_scan', title: 'Digital Adopter', desc: 'Scan your first bill receipt with OCR', icon: '📸' },
];

function calculateDaysRemaining(endDateStr: Date | string): number {
  return Math.max(1, Math.round((new Date(endDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default function ChallengesPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await getDashboardData();
        if (res.success && res.data && active) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleCompleteChallenge = async (id: string) => {
    startTransition(async () => {
      // Simulate completing a challenge and awarding points
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Update state locally to give responsive feedback
      if (data) {
        const challengeToComplete = data.activeChallenges.find(c => c.id === id);
        if (challengeToComplete) {
          const updatedChallenges = data.activeChallenges.filter(c => c.id !== id);
          const pointsEarned = challengeToComplete.points;
          
          const newTotalPoints = data.gamification.totalPoints + pointsEarned;
          
          // Add a new completed badge
          const newBadge: Achievement = {
            id: Math.random().toString(),
            badge: 'reduction_hero',
            title: challengeToComplete.title,
            description: `Successfully completed: ${challengeToComplete.description}`,
            pointsAwarded: pointsEarned,
            earnedAt: new Date(),
            icon: '🏆',
          };

          setData({
            ...data,
            activeChallenges: updatedChallenges,
            gamification: {
              ...data.gamification,
              totalPoints: newTotalPoints,
              pointsToNextLevel: Math.max(0, data.gamification.pointsToNextLevel - pointsEarned),
              achievements: [...data.gamification.achievements, newBadge],
            }
          });
        }
      }
    });
  };

  const handleJoinChallenge = () => {
    if (!data) return;
    
    const sampleChallenges = [
      {
        id: Math.random().toString(),
        userId: '',
        title: 'Meat-Free Week',
        description: 'Replace meat with plant-based alternatives for 7 days.',
        category: 'food' as const,
        targetReduction: 25,
        points: 80,
        status: 'active' as const,
        progress: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: Math.random().toString(),
        userId: '',
        title: 'Light Out',
        description: 'Turn off standby appliances at night for 5 consecutive days.',
        category: 'energy' as const,
        targetReduction: 15,
        points: 40,
        status: 'active' as const,
        progress: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      }
    ];

    // Pick one that is not already in active list
    const filterNew = sampleChallenges.filter(sc => !data.activeChallenges.some(ac => ac.title === sc.title));
    if (filterNew.length > 0) {
      setData({
        ...data,
        activeChallenges: [...data.activeChallenges, filterNew[0]],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Gamified Challenges</h1>
          <p className="text-gray-400">Complete climate action challenges, build streaks, and unlock achievements.</p>
        </div>
        <button
          onClick={handleJoinChallenge}
          className="gradient-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          <Plus className="h-5 w-5" /> Join Next Challenge
        </button>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && data && (
        <div className="space-y-6 animate-fade-in">
          {/* ── Level Progress & Streak Row ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Level Card */}
            <div className="glass-card p-6 md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Current Progress Tier</span>
                  <span className="text-xs text-gray-400">{data.gamification.pointsToNextLevel} pts to next rank</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mb-2">
                  Rank: {LEVEL_NAMES[data.gamification.level] ?? data.gamification.levelName}
                </h2>
              </div>
              
              <div className="space-y-1">
                <div className="h-3.5 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (data.gamification.totalPoints / (data.gamification.totalPoints + data.gamification.pointsToNextLevel)) * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-semibold px-0.5">
                  <span>{data.gamification.totalPoints} points accumulated</span>
                  <span>Goal: {data.gamification.totalPoints + data.gamification.pointsToNextLevel}</span>
                </div>
              </div>
            </div>

            {/* Streak Card */}
            <div className="glass-card p-6 md:col-span-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Activity Streak</span>
                <h3 className="font-heading text-3xl font-extrabold text-white mt-1 flex items-center gap-1.5">
                  {data.gamification.currentStreak} Days <Flame className="h-8 w-8 text-orange-500 animate-bounce fill-orange-500" />
                </h3>
                <p className="text-xs text-gray-500 mt-2">Longest streak recorded: {data.gamification.longestStreak} days.</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Flame className="h-9 w-9 fill-orange-500/20" />
              </div>
            </div>
          </div>

          {/* ── Challenges Section ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Active Challenges */}
            <div className="glass-card p-6 lg:col-span-7 flex flex-col">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2 shrink-0">
                <Target className="h-5 w-5 text-emerald-400" /> Active Reduction Challenges
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-1">
                {data.activeChallenges.length > 0 ? (
                  data.activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="rounded-lg border border-white/5 bg-white/5 p-4 space-y-3 animate-fade-in">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-white leading-tight">{challenge.title}</h3>
                          <p className="text-xs text-gray-400 mt-1 leading-snug">{challenge.description}</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 shrink-0">
                          +{challenge.points} pts
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-gray-400">Reduction target progress</span>
                          <span className="text-white">{challenge.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">
                          Time remaining: {calculateDaysRemaining(challenge.endDate)} days
                        </span>
                        <button
                          onClick={() => handleCompleteChallenge(challenge.id)}
                          disabled={isPending}
                          className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 active:scale-95 transition"
                        >
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Complete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full py-12 text-gray-500 space-y-2">
                    <Target className="h-10 w-10 text-gray-600 animate-pulse" />
                    <h3 className="font-heading font-bold text-gray-400">All caught up!</h3>
                    <p className="text-xs max-w-xs leading-normal">You have completed all active challenges. Join a new one by clicking &apos;Join Next Challenge&apos; above.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements / Badge Locker */}
            <div className="glass-card p-6 lg:col-span-5 flex flex-col">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2 shrink-0">
                <Trophy className="h-5 w-5 text-emerald-400" /> Badge Locker Achievements
              </h2>

              <div className="flex-1 overflow-y-auto max-h-[400px] pr-1">
                <div className="grid grid-cols-2 gap-3">
                  {BADGES.map((badge) => {
                    const isEarned = data.gamification.achievements.some(
                      (ach) => ach.title.toLowerCase().includes(badge.title.toLowerCase()) || ach.badge === badge.type
                    );

                    return (
                      <div 
                        key={badge.type} 
                        className={`rounded-lg border p-3.5 flex flex-col items-center text-center justify-between transition-all ${
                          isEarned 
                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 animate-fade-in' 
                            : 'border-white/5 bg-white/2 text-gray-600'
                        }`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/5 text-2xl mb-2">
                          {badge.icon}
                        </div>
                        <h4 className={`text-xs font-bold ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                          {badge.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-snug line-clamp-2">
                          {badge.desc}
                        </p>
                        {isEarned && (
                          <span className="text-[9px] font-bold text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Unlocked
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
