// =============================================================================
// CARBONMIND AI — Personalized Roadmap Page
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Circle,
  Loader2,
  TrendingDown
} from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';
import type { RoadmapAction, CarbonCategory, Difficulty } from '@/types';

const COST_LABELS = {
  free: 'Free',
  low: '$',
  medium: '$$',
  high: '$$$',
};

const INITIAL_ACTIONS: RoadmapAction[] = [
  {
    id: '1',
    title: 'Switch to LED Lightbulbs',
    description: 'Replace remaining incandescent bulbs in main living rooms with LEDs.',
    category: 'energy' as CarbonCategory,
    difficulty: 'easy' as Difficulty,
    impactKg: 15,
    costLevel: 'low' as const,
    timeframe: 'immediate' as const,
    tier: 'easy_win' as const,
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Carpool to Work/School',
    description: 'Organize a ride share schedule with a coworker to commute together once weekly.',
    category: 'transport' as CarbonCategory,
    difficulty: 'easy' as Difficulty,
    impactKg: 24,
    costLevel: 'free' as const,
    timeframe: 'week' as const,
    tier: 'easy_win' as const,
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Adopt Meatless Monday',
    description: 'Transition all meals on Mondays to be completely plant-based (vegetables, grains).',
    category: 'food' as CarbonCategory,
    difficulty: 'easy' as Difficulty,
    impactKg: 35,
    costLevel: 'free' as const,
    timeframe: 'week' as const,
    tier: 'easy_win' as const,
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Thermostat Adjustment',
    description: 'Set your home thermostat 2°C higher in summer or 2°C lower in winter.',
    category: 'energy' as CarbonCategory,
    difficulty: 'medium' as Difficulty,
    impactKg: 50,
    costLevel: 'free' as const,
    timeframe: 'immediate' as const,
    tier: 'medium_effort' as const,
    isCompleted: false,
  },
  {
    id: '5',
    title: 'Buy Secondhand Clothing',
    description: 'Commit to sourcing all new clothing additions from thrift or vintage shops this quarter.',
    category: 'shopping' as CarbonCategory,
    difficulty: 'medium' as Difficulty,
    impactKg: 20,
    costLevel: 'low' as const,
    timeframe: 'month' as const,
    tier: 'medium_effort' as const,
    isCompleted: false,
  },
  {
    id: '6',
    title: 'Solar Panel Evaluation',
    description: 'Contact a provider to assess solar feasibility, potential grid offsets and rebate plans.',
    category: 'energy' as CarbonCategory,
    difficulty: 'hard' as Difficulty,
    impactKg: 220,
    costLevel: 'high' as const,
    timeframe: 'quarter' as const,
    tier: 'high_impact' as const,
    isCompleted: false,
  },
  {
    id: '7',
    title: 'Transition Commute to E-Bike',
    description: 'Invest in an electric bicycle to replace short-distance vehicle trips (under 10km).',
    category: 'transport' as CarbonCategory,
    difficulty: 'hard' as Difficulty,
    impactKg: 180,
    costLevel: 'medium' as const,
    timeframe: 'quarter' as const,
    tier: 'high_impact' as const,
    isCompleted: false,
  },
];

export default function RoadmapPage() {
  const [actions, setActions] = useState<RoadmapAction[]>(INITIAL_ACTIONS);
  const [loading, setLoading] = useState(true);
  const [dominantSector, setDominantSector] = useState<string>('Transport');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(false);
        const res = await getDashboardData();
        if (res.success && res.data) {
          setDominantSector(res.data.carbonDNA.dominantCategory);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const toggleActionCompleted = (id: string) => {
    setActions(
      actions.map((act) =>
        act.id === id ? { ...act, isCompleted: !act.isCompleted } : act
      )
    );
  };

  const completedCount = actions.filter((a) => a.isCompleted).length;
  const totalImpact = actions
    .filter((a) => a.isCompleted)
    .reduce((sum, a) => sum + a.impactKg, 0);

  // Group actions by tier
  const tiers = {
    easy_win: {
      name: 'Easy Wins',
      desc: 'Immediate, low-cost modifications requiring minimal lifestyle adjustments.',
      items: actions.filter((a) => a.tier === 'easy_win'),
    },
    medium_effort: {
      name: 'Medium Effort',
      desc: 'Actions requiring conscious behavioral adjustments or small investments.',
      items: actions.filter((a) => a.tier === 'medium_effort'),
    },
    high_impact: {
      name: 'High Impact',
      desc: 'Structural transformations offering significant, long-term carbon offsets.',
      items: actions.filter((a) => a.tier === 'high_impact'),
    },
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Personalized Roadmap</h1>
          <p className="text-gray-400">Step-by-step reduction strategy generated dynamically based on your dominant emissions.</p>
        </div>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && (
        <div className="space-y-6 animate-fade-in">
          {/* ── Twin Analysis Prompt ── */}
          <div className="glass-card border border-emerald-500/10 bg-emerald-500/5 p-5 flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 mb-1">Climate Digital Twin Recommendation</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Your highest emission category is <span className="text-emerald-400 font-bold capitalize">{dominantSector}</span>. We&apos;ve prioritized actionable steps in this sector to maximize your potential carbon reduction. Track completed actions to see your estimated monthly savings increase!
              </p>
            </div>
          </div>

          {/* ── Roadmap Progress summary ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass-card p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Roadmap Progress</span>
              <h3 className="font-heading text-2xl font-bold text-white mt-1">
                {completedCount} / {actions.length} <span className="text-xs font-normal text-gray-400">completed</span>
              </h3>
            </div>

            <div className="glass-card p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Estimated CO₂ Reduced</span>
              <h3 className="font-heading text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                {totalImpact} kg <span className="text-xs font-normal text-gray-400">saved / month</span>
              </h3>
            </div>

            <div className="glass-card p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Yearly Target Rate</span>
              <h3 className="font-heading text-2xl font-bold text-white mt-1">
                {Math.round(totalImpact * 12).toLocaleString()} kg <span className="text-xs font-normal text-gray-400">saved / year</span>
              </h3>
            </div>
          </div>

          {/* ── Tiers Grid ── */}
          <div className="space-y-8">
            {(Object.keys(tiers) as ('easy_win' | 'medium_effort' | 'high_impact')[]).map((tierKey) => {
              const tier = tiers[tierKey];

              return (
                <div key={tierKey} className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-white">{tier.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{tier.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tier.items.map((act) => (
                      <div 
                        key={act.id} 
                        onClick={() => toggleActionCompleted(act.id)}
                        className={`glass-card p-5 cursor-pointer select-none border transition-all duration-300 relative ${
                          act.isCompleted 
                            ? 'border-emerald-500/30 bg-emerald-500/5' 
                            : 'border-white/5 bg-white/2'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className={`text-sm font-semibold transition ${act.isCompleted ? 'text-emerald-400 line-through' : 'text-white'}`}>
                            {act.title}
                          </h3>
                          <button 
                            className={`rounded-full p-0.5 shrink-0 ${act.isCompleted ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}
                            aria-label={act.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {act.isCompleted ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className={`text-xs leading-snug mb-4 ${act.isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                          {act.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-gray-500 font-semibold uppercase">
                          <span>Cost: {COST_LABELS[act.costLevel]}</span>
                          <span>Time: {act.timeframe}</span>
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                            <TrendingDown className="h-3 w-3" />
                            -{act.impactKg} kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
