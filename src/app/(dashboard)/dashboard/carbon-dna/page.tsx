// =============================================================================
// CARBONMIND AI — Carbon DNA Page
// =============================================================================

'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Dna,
  Plus,
  Trash2,
  Calendar,
  Leaf,
  Car,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { addActivity, deleteActivity, getActivities } from '@/actions/carbon-actions';
import { calculateCarbonDNA, generateDNAExplanation } from '@/services/carbon-calculator';
import type { CarbonActivity, CarbonDNA, CarbonCategory, Subcategory } from '@/types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const CATEGORY_COLORS = {
  transport: '#3b82f6', // blue
  food: '#f59e0b',      // amber
  energy: '#ef4444',     // red
  shopping: '#8b5cf6',   // purple
};

const CATEGORY_ICONS = {
  transport: Car,
  food: UtensilsCrossed,
  energy: Zap,
  shopping: ShoppingBag,
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
    { value: 'dairy', label: 'Dairy (Milk/Cheese) - kg' },
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

export default function CarbonDNAPage() {
  const [activities, setActivities] = useState<CarbonActivity[]>([]);
  const [dna, setDna] = useState<CarbonDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<CarbonCategory>('transport');
  const [subcategory, setSubcategory] = useState<string>('car_gasoline');
  const [value, setValue] = useState<string>('');
  const [activityDate, setActivityDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getActivities();
      if (res.success && res.data) {
        setActivities(res.data);
        const computedDna = calculateCarbonDNA(res.data);
        computedDna.aiExplanation = generateDNAExplanation(computedDna);
        setDna(computedDna);
      } else {
        setError(res.error ?? 'Failed to load carbon activities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        setError(null);
        const res = await getActivities();
        if (!active) return;

        if (res.success && res.data) {
          setActivities(res.data);
          const computedDna = calculateCarbonDNA(res.data);
          computedDna.aiExplanation = generateDNAExplanation(computedDna);
          setDna(computedDna);
        } else {
          setError(res.error ?? 'Failed to load carbon activities');
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numValue = parseFloat(value);
    if (Number.isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid numeric value greater than 0');
      return;
    }

    startTransition(async () => {
      // Find unit from selection
      const sub = SUBCATEGORIES[category].find((s) => s.value === subcategory);
      const unit = sub ? sub.label.split(' - ')[1] : 'units';

      const res = await addActivity({
        category,
        subcategory: subcategory as Subcategory,
        value: numValue,
        unit,
        activityDate,
      });

      if (res.success) {
        setValue('');
        setShowForm(false);
        await loadData();
      } else {
        setError(res.error ?? 'Failed to log activity');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity entry?')) return;

    try {
      const res = await deleteActivity(id);
      if (res.success) {
        await loadData();
      } else {
        setError(res.error ?? 'Failed to delete activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
    }
  };

  const chartData = dna ? [
    { name: 'Transport', value: dna.transport, color: CATEGORY_COLORS.transport },
    { name: 'Food', value: dna.food, color: CATEGORY_COLORS.food },
    { name: 'Energy', value: dna.energy, color: CATEGORY_COLORS.energy },
    { name: 'Shopping', value: dna.shopping, color: CATEGORY_COLORS.shopping },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Carbon DNA</h1>
          <p className="text-gray-400">Analyze your personalized carbon emission categories and log daily activities.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="gradient-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition-all duration-300 hover:opacity-90 active:scale-95"
          aria-expanded={showForm ? 'true' : 'false'}
          aria-controls="activity-form-container"
        >
          {showForm ? 'Cancel Entry' : 'Log New Activity'}
          <Plus className={`h-5 w-5 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-red-400 animate-fade-in" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* ── Form Container ── */}
      {showForm && (
        <div
          id="activity-form-container"
          className="glass-card p-6 animate-fade-in"
        >
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-400" /> Log Daily Activity
          </h2>
          <form onSubmit={handleAddActivity} className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
            <div>
              <label htmlFor="form-category" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                id="form-category"
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as CarbonCategory;
                  setCategory(newCat);
                  if (SUBCATEGORIES[newCat].length > 0) {
                    setSubcategory(SUBCATEGORIES[newCat][0].value);
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="transport">Transportation</option>
                <option value="food">Food & Diet</option>
                <option value="energy">Home Energy</option>
                <option value="shopping">Shopping & Consumables</option>
              </select>
            </div>

            <div>
              <label htmlFor="form-subcategory" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Subcategory
              </label>
              <select
                id="form-subcategory"
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
                <label htmlFor="form-value" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Amount
                </label>
                <input
                  id="form-value"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 15"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Unit
                </label>
                <div className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-gray-400 text-sm h-[38px] flex items-center">
                  {SUBCATEGORIES[category].find((s) => s.value === subcategory)?.label.split(' - ')[1] ?? ''}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="form-date" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                id="form-date"
                type="date"
                required
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-white/5 px-4 py-2 font-medium text-gray-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="gradient-primary flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Log Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && dna && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-fade-in">
          {/* ── Pie Chart Visualization ── */}
          <div className="glass-card p-6 lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold flex items-center gap-2 mb-2">
                <Dna className="h-5 w-5 text-emerald-400" /> DNA Distribution
              </h2>
              <p className="text-sm text-gray-400 mb-4">Visual representation of your greenhouse gas footprint by category.</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'DNA Contribution']}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 text-sm">No emissions logged yet.</div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 mt-4 bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
              <h3 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-4 w-4" /> AI Digital Twin Insights
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                {dna.aiExplanation || 'No AI insights available. Log some activities to trigger analysis.'}
              </p>
            </div>
          </div>

          {/* ── Category Breakdown Stats ── */}
          <div className="glass-card p-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-400" /> Category Breakdown
              </h2>
              <div className="space-y-4">
                {(Object.keys(CATEGORY_COLORS) as CarbonCategory[]).map((cat) => {
                  const Icon = CATEGORY_ICONS[cat];
                  const percentage = dna[cat] ?? 0;
                  const color = CATEGORY_COLORS[cat];

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-300 capitalize">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-md text-white"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span>{cat}</span>
                        </div>
                        <span className="font-bold text-white">{percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Footprint:</span>
              <span className="font-heading text-2xl font-bold text-white">
                {dna.total.toLocaleString()} <span className="text-xs font-normal text-gray-400">kg CO₂e</span>
              </span>
            </div>
          </div>

          {/* ── Activity History Log ── */}
          <div className="glass-card p-6 lg:col-span-12">
            <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" /> Emission History Log
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse" role="table">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Subcategory</th>
                    <th className="py-3 px-4 text-right">Value logged</th>
                    <th className="py-3 px-4 text-right">Emissions</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {activities.length > 0 ? (
                    activities.map((act) => {
                      const Icon = CATEGORY_ICONS[act.category as CarbonCategory] ?? Leaf;
                      const color = CATEGORY_COLORS[act.category as CarbonCategory] ?? '#10b981';

                      return (
                        <tr
                          key={act.id}
                          className="border-b border-white/5 hover:bg-white/5 transition duration-150"
                          role="row"
                        >
                          <td className="py-3.5 px-4 text-gray-300 font-medium">
                            {mounted ? new Date(act.activityDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : new Date(act.activityDate).toISOString().split('T')[0]}
                          </td>
                          <td className="py-3.5 px-4 capitalize">
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                              style={{ backgroundColor: `${color}15`, color }}
                            >
                              <Icon className="h-3 w-3" />
                              {act.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-400">
                            {act.subcategory.replace(/_/g, ' ')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-gray-300">
                            {act.value.toLocaleString()} <span className="text-xs text-gray-500 font-normal">{act.unit}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-white">
                            {act.emissionKg.toFixed(1)} <span className="text-xs text-gray-400 font-normal">kg</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDelete(act.id)}
                              className="rounded p-1 text-gray-500 hover:bg-red-500/15 hover:text-red-400 transition"
                              title="Delete entry"
                              aria-label={mounted ? `Delete ${act.subcategory} log on ${new Date(act.activityDate).toLocaleDateString()}` : `Delete ${act.subcategory} log`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No activities logged yet. Get started by clicking &quot;Log New Activity&quot; above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
