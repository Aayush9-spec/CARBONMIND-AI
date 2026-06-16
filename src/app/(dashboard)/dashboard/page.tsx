'use client';

import { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Flame,
  Trophy,
  Target,
  Zap,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DigitalTwinViewport from '@/components/digital-twin-viewport';
import BudgetAlerts from '@/components/budget-alerts';
import AutomationSync from '@/components/automation-sync';
import { getDashboardData } from '@/actions/carbon-actions';
import type { DashboardData } from '@/types';

// ── Mock Data (replaced by real data in Phase 4) ────────────────────────────

const defaultDNA = {
  transport: 42,
  food: 18,
  shopping: 25,
  energy: 15,
  total: 245.8,
  dominantCategory: 'transport' as const,
};

const dnaData = [
  { name: 'Transport', value: 42, color: '#3b82f6', icon: Car },
  { name: 'Food', value: 18, color: '#f59e0b', icon: UtensilsCrossed },
  { name: 'Shopping', value: 25, color: '#8b5cf6', icon: ShoppingBag },
  { name: 'Energy', value: 15, color: '#ef4444', icon: Zap },
];

const forecastData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  actual: i < 15 ? Math.round(6 + Math.random() * 4) : undefined,
  predicted: Math.round(7 + Math.sin(i / 5) * 2 + Math.random() * 2),
}));

const insights = [
  {
    id: '1',
    title: 'Reduce car commute',
    content: 'Switching to bus twice a week could save 18 kg CO₂/month.',
    impact: -18,
    confidence: 0.92,
    difficulty: 'easy' as const,
  },
  {
    id: '2',
    title: 'Optimize energy usage',
    content: 'Your electricity usage peaked last week. Consider LED upgrades.',
    impact: -12,
    confidence: 0.85,
    difficulty: 'medium' as const,
  },
  {
    id: '3',
    title: 'Meatless Mondays',
    content: 'Replacing beef once a week reduces food emissions by 15%.',
    impact: -8.5,
    confidence: 0.88,
    difficulty: 'easy' as const,
  },
];

// ── Dashboard Page ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await getDashboardData();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const carbonScore = data?.carbonScore ?? 72;
  const monthlyEmissions = data?.carbonDNA.total ?? 245.8;
  const changePercent = -8.3;
  const activeStreak = data?.gamification.currentStreak ?? 12;
  const activeLevel = data?.gamification.level ?? 'Eco Explorer';

  const carbonDNAParam = data?.carbonDNA
    ? {
        transport: data.carbonDNA.transport,
        food: data.carbonDNA.food,
        energy: data.carbonDNA.energy,
        shopping: data.carbonDNA.shopping,
        total: data.carbonDNA.total,
        dominantCategory: data.carbonDNA.dominantCategory as 'transport' | 'food' | 'energy' | 'shopping',
      }
    : defaultDNA;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Your climate intelligence overview
          </p>
        </div>
        <Link
          href="/dashboard/marketplace"
          className="gradient-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition hover:opacity-90 active:scale-95 text-sm"
        >
          <Award className="h-4 w-4" /> Offset Marketplace
        </Link>
      </div>

      {/* ── Top Row: Score + Stats ──────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Carbon Score */}
        <div className="glass-card col-span-1 flex items-center gap-4 p-5 md:col-span-2 lg:col-span-1">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(carbonScore / 100) * 175.9} 175.9`}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-lg font-bold text-white">
              {carbonScore}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Carbon Score</p>
            <p className="text-xl font-bold text-white">{carbonScore}/100</p>
            <p className="text-xs text-emerald-400">Good</p>
          </div>
        </div>

        {/* Monthly Emissions */}
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            {changePercent < 0 ? (
              <TrendingDown className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            ) : (
              <TrendingUp className="h-5 w-5 text-red-400" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400">Monthly Emissions</p>
            <p className="text-xl font-bold text-white">
              {monthlyEmissions.toFixed(1)} kg
            </p>
            <p
              className={`text-xs ${changePercent < 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {changePercent > 0 ? '+' : ''}
              {changePercent}% vs last month
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Current Streak</p>
            <p className="text-xl font-bold text-white">{activeStreak} days</p>
            <p className="text-xs text-orange-400">Personal best!</p>
          </div>
        </div>

        {/* Level */}
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Trophy className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-xl font-bold text-white capitalize">{activeLevel.replace('_', ' ')}</p>
            <p className="text-xs text-gray-500">{data?.gamification.totalPoints ?? 450} pts</p>
          </div>
        </div>
      </div>

      {/* ── Advanced Twin, Budget, and Automation Rows ────────────────── */}
      <DigitalTwinViewport carbonDNA={carbonDNAParam} />

      <div className="grid gap-6 md:grid-cols-2">
        <BudgetAlerts currentMonthly={monthlyEmissions} />
        <AutomationSync onActivitySynced={loadDashboard} />
      </div>

      {/* ── Middle Row: Forecast ──────────────────────────────── */}
      <div>

        {/* Forecast Chart */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              30-Day Forecast
            </h2>
            <Link
              href="/dashboard/forecast"
              className="flex items-center gap-1 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Full Forecast{' '}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="h-48" aria-label="30-day emission forecast chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient
                    id="forecastGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#forecastGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Insights + Challenges + Leaderboard ──────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Insights */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              {insights.length} new
            </span>
          </div>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">
                    {insight.title}
                  </h3>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      insight.difficulty === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : insight.difficulty === 'medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {insight.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{insight.content}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-500">
                  <span className="text-emerald-400">
                    {insight.impact} kg CO₂/mo
                  </span>
                  <span>•</span>
                  <span>{Math.round(insight.confidence * 100)}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Active Challenges
            </h2>
            <Link
              href="/dashboard/challenges"
              className="flex items-center gap-1 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            >
              View All{' '}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">
                    {challenge.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Target className="h-3 w-3" aria-hidden="true" />
                    {challenge.points} pts
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full gradient-primary transition-all duration-500"
                    style={{ width: `${challenge.progress}%` }}
                    role="progressbar"
                    aria-valuenow={challenge.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${challenge.title} progress`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{challenge.progress}% complete</span>
                  <span>{challenge.daysLeft} days left</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
            <Link
              href="/dashboard/community"
              className="flex items-center gap-1 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Full Board{' '}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 rounded-lg p-2.5 ${
                  entry.isCurrentUser
                    ? 'border border-emerald-500/20 bg-emerald-500/5'
                    : ''
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    entry.rank === 1
                      ? 'bg-amber-500/20 text-amber-400'
                      : entry.rank === 2
                        ? 'bg-gray-400/20 text-gray-300'
                        : entry.rank === 3
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {entry.rank}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${entry.isCurrentUser ? 'text-emerald-400' : 'text-white'}`}
                  >
                    {entry.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    🔥 {entry.streak} day streak
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-400">
                  -{entry.reduction} kg
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
