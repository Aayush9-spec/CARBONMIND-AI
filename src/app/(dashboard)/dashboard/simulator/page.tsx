// =============================================================================
// CARBONMIND AI — What-If Simulator Page
// =============================================================================

'use client';

import { useState, useTransition } from 'react';
import { 
  FlaskConical, 
  Play, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2, 
  Check,
  TrendingDown
} from 'lucide-react';
import { simulateScenario } from '@/actions/carbon-actions';
import { PRESET_SCENARIOS } from '@/services/simulator-engine';
import type { ScenarioChange, SimulationResult, CarbonCategory, Subcategory } from '@/types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

const CATEGORY_COLORS = {
  transport: '#3b82f6', // blue
  food: '#f59e0b',      // amber
  energy: '#ef4444',     // red
  shopping: '#8b5cf6',   // purple
};

const SUBCATEGORIES = {
  transport: [
    { value: 'car_gasoline', label: 'Car (Gasoline) - km' },
    { value: 'car_diesel', label: 'Car (Diesel) - km' },
    { value: 'car_electric', label: 'Car (Electric) - km' },
    { value: 'bus', label: 'Bus - km' },
    { value: 'train', label: 'Train - km' },
    { value: 'flight_domestic', label: 'Domestic Flight - km' },
    { value: 'flight_international', label: 'Intl Flight - km' },
    { value: 'bicycle', label: 'Bicycle - km' },
    { value: 'walking', label: 'Walking - km' },
    { value: 'motorcycle', label: 'Motorcycle - km' },
  ],
  food: [
    { value: 'beef', label: 'Beef - kg' },
    { value: 'chicken', label: 'Chicken - kg' },
    { value: 'pork', label: 'Pork - kg' },
    { value: 'fish', label: 'Fish - kg' },
    { value: 'dairy', label: 'Dairy - kg' },
    { value: 'vegetables', label: 'Vegetables - kg' },
    { value: 'fruits', label: 'Fruits - kg' },
    { value: 'grains', label: 'Grains/Bread - kg' },
    { value: 'processed_food', label: 'Processed Food - kg' },
  ],
  energy: [
    { value: 'electricity', label: 'Electricity - kWh' },
    { value: 'natural_gas', label: 'Natural Gas - m³' },
    { value: 'heating_oil', label: 'Heating Oil - liter' },
    { value: 'solar', label: 'Solar Generation - kWh' },
    { value: 'lpg', label: 'LPG - kg' },
  ],
  shopping: [
    { value: 'clothing', label: 'Clothing - item' },
    { value: 'electronics', label: 'Electronics - item' },
    { value: 'furniture', label: 'Furniture - item' },
    { value: 'general', label: 'General Goods - USD' },
    { value: 'books', label: 'Books/Paper - item' },
    { value: 'personal_care', label: 'Personal Care - item' },
  ],
};

export default function SimulatorPage() {
  const [changes, setChanges] = useState<ScenarioChange[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Builder row states
  const [category, setCategory] = useState<CarbonCategory>('transport');
  const [subcategory, setSubcategory] = useState<string>('car_gasoline');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Load preset scenario
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (preset) {
      const typedChanges = preset.changes.map((c) => ({
        ...c,
        category: c.category as any,
        subcategory: c.subcategory as any,
      }));
      setChanges(typedChanges);
      setResult(null);
      setError(null);
    }
  };

  const handleAddChange = () => {
    setError(null);
    const curr = parseFloat(currentValue);
    const n = parseFloat(newValue);

    if (Number.isNaN(curr) || curr < 0 || Number.isNaN(n) || n < 0) {
      setError('Please enter valid, positive numeric values for current and new usage.');
      return;
    }

    const sub = SUBCATEGORIES[category].find((s) => s.value === subcategory);
    const unit = sub ? sub.label.split(' - ')[1] : 'units';

    const newChange: ScenarioChange = {
      category,
      subcategory: subcategory as Subcategory,
      currentValue: curr,
      newValue: n,
      unit,
      frequency,
    };

    setChanges([...changes, newChange]);
    setCurrentValue('');
    setNewValue('');
    setResult(null);
  };

  const handleRemoveChange = (idx: number) => {
    setChanges(changes.filter((_, i) => i !== idx));
    setResult(null);
  };

  const handleRunSimulation = () => {
    if (changes.length === 0) {
      setError('Please add at least one lifestyle modification change before simulating.');
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await simulateScenario(changes);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error ?? 'Simulation calculation failed.');
      }
    });
  };

  // Format Recharts data
  const chartData = result
    ? result.categoryBreakdown.map((c) => ({
        name: c.category.toUpperCase(),
        Current: c.current,
        Projected: c.projected,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">What-If Simulator</h1>
        <p className="text-gray-400">Simulate changes to your lifestyle and see the immediate impact on your footprint.</p>
      </div>

      {/* ── Presets row ── */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preset Scenarios</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.id)}
              className="glass rounded-lg p-3 text-left transition hover:bg-white/5 hover:border-white/20 active:scale-98"
            >
              <h3 className="text-sm font-semibold text-white mb-1">{preset.name}</h3>
              <p className="text-xs text-gray-400 leading-tight line-clamp-2">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Builder grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ── Modification inputs ── */}
        <div className="glass-card p-6 lg:col-span-7 space-y-6">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-emerald-400" /> Modify Scenario Settings
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sim-category" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                id="sim-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CarbonCategory)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="transport">Transportation</option>
                <option value="food">Food & Diet</option>
                <option value="energy">Home Energy</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>

            <div>
              <label htmlFor="sim-subcategory" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Action / Fuel Type
              </label>
              <select
                id="sim-subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {SUBCATEGORIES[category].map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label.split(' - ')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="sim-current" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Current Usage
                </label>
                <input
                  id="sim-current"
                  type="number"
                  placeholder="e.g. 20"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="sim-new" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  New Usage
                </label>
                <input
                  id="sim-new"
                  type="number"
                  placeholder="e.g. 0"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sim-frequency" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Frequency
              </label>
              <select
                id="sim-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end border-b border-white/5 pb-4">
            <button
              onClick={handleAddChange}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" /> Add Modification
            </button>
          </div>

          {/* ── Active Changes List ── */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modifications inside this Scenario</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {changes.length > 0 ? (
                changes.map((change, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 animate-fade-in">
                    <div>
                      <h4 className="text-sm font-semibold capitalize text-white">
                        {change.subcategory.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Reduce from {change.currentValue} to {change.newValue} {change.unit} ({change.frequency})
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveChange(idx)}
                      className="rounded p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      aria-label="Remove modification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">No modifications added yet. Create custom changes or select a preset above.</div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          {changes.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleRunSimulation}
                disabled={isPending}
                className="gradient-primary flex items-center gap-2 rounded-lg px-6 py-2.5 font-semibold text-white shadow hover:opacity-90 disabled:opacity-50 transition active:scale-95"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-white" />
                )}
                Run Simulation
              </button>
            </div>
          )}
        </div>

        {/* ── Comparative Results ── */}
        <div className="lg:col-span-5 space-y-6">
          {!result ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <FlaskConical className="h-10 w-10 text-gray-500 mb-3 animate-pulse" />
              <h3 className="font-heading text-lg font-bold text-gray-300">Ready to Simulate</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                Add modifications or load a preset, then click "Run Simulation" to see projected calculations.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* ── Result Cards ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 col-span-2 flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Total Projected Savings</span>
                    <h3 className="font-heading text-2xl font-bold text-white mt-1">
                      {result.savingsPercent}% <span className="text-xs font-normal text-gray-400">reduction</span>
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Monthly Savings</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-heading text-xl font-bold text-white">{Math.round(result.savingsMonthly)}</span>
                    <span className="text-[10px] text-gray-500 font-medium">kg CO₂e</span>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Yearly Projections</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-heading text-xl font-bold text-emerald-400">{Math.round(result.savingsYearly)}</span>
                    <span className="text-[10px] text-gray-500 font-medium">kg CO₂e</span>
                  </div>
                </div>
              </div>

              {/* ── Comparison Chart ── */}
              <div className="glass-card p-4">
                <h3 className="font-heading text-sm font-semibold text-white mb-4">Emissions Scenario Comparison</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }} />
                      <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a0f', 
                          borderColor: 'rgba(255,255,255,0.08)',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend verticalAlign="bottom" height={24} style={{ fontSize: '11px' }} />
                      <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Projected" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── AI Explanation ── */}
              <div className="glass-card border border-emerald-500/10 bg-emerald-500/5 p-4 flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 mb-0.5">Simulation Feasibility</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    {result.aiExplanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
