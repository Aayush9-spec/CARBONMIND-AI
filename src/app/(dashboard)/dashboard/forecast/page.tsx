// =============================================================================
// CARBONMIND AI — Forecasting Page
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, Loader2, Info, Calendar, ShieldCheck } from 'lucide-react';
import { addActivity, getActivities } from '@/actions/carbon-actions';
import { generateForecast } from '@/services/forecasting-engine';
import type { ForecastResult, ForecastPeriod, Subcategory } from '@/types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';

export default function ForecastPage() {
  const [period, setPeriod] = useState<ForecastPeriod>(30);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
    let active = true;
    const load = async () => {
      try {
        const res = await getActivities();
        if (active && res.success && res.data) {
          const forecastResult = generateForecast(res.data, period);
          
          if (res.data.length >= 7) {
            const trendLabel = forecastResult.trend === 'increasing' ? 'upward' : forecastResult.trend === 'decreasing' ? 'downward' : 'stable';
            forecastResult.aiExplanation = `Based on your recent logging history, your carbon footprint is projected to trend ${trendLabel} over the next ${period} days. We estimate your total emissions will reach ${forecastResult.totalPredicted.toFixed(1)} kg CO₂e, representing a ${Math.abs(forecastResult.changePercent)}% ${forecastResult.changePercent >= 0 ? 'increase' : 'decrease'} compared to your historical average. Keep logging to improve confidence!`;
          }
          
          setForecast(forecastResult);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [period, reloadTrigger]);

  // Handle mock generation for demo if insufficient data
  const handleGenerateMockData = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      // Insert 10 mock activities across past 14 days
      const categories = ['transport', 'food', 'energy', 'shopping'];
      const subcategories = ['car_gasoline', 'beef', 'electricity', 'clothing'];
      const values = [15, 0.5, 12, 1];
      const units = ['km', 'kg', 'kWh', 'item'];

      for (let i = 0; i < 12; i++) {
        const activityDate = new Date(now);
        activityDate.setDate(now.getDate() - i - 1);
        const idx = i % 4;

        await addActivity({
          category: categories[idx],
          subcategory: subcategories[idx] as Subcategory,
          value: values[idx],
          unit: units[idx],
          activityDate: activityDate.toISOString().split('T')[0],
        });
      }

      setReloadTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const TrendIcon = forecast?.trend === 'increasing' 
    ? TrendingUp 
    : forecast?.trend === 'decreasing' 
      ? TrendingDown 
      : Minus;

  const trendColor = forecast?.trend === 'increasing'
    ? 'text-red-400 border-red-500/20 bg-red-500/5'
    : forecast?.trend === 'decreasing'
      ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
      : 'text-gray-400 border-white/5 bg-white/5';

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Carbon Forecast</h1>
          <p className="text-gray-400">Predict future emissions and identify long-term climate trends.</p>
        </div>
        <div className="flex rounded-lg border border-white/10 bg-black/40 p-1" role="group" aria-label="Forecast timeframe">
          {([30, 60, 90] as ForecastPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
                period === p 
                  ? 'bg-emerald-500 text-white shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-current={period === p ? 'true' : undefined}
            >
              {p} Days
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && forecast && (
        <div className="space-y-6 animate-fade-in">
          {forecast.data.length === 0 ? (
            /* ── Insufficient Data State ── */
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Info className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-xl font-bold">More Logging Required</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                The Forecasting Engine utilizes a seasonal decomposition algorithm which requires at least 7 unique days of activity entries. Currently, you have insufficient data.
              </p>
              <button
                onClick={handleGenerateMockData}
                className="gradient-primary rounded-lg px-6 py-2.5 font-semibold text-white transition duration-300 hover:opacity-90 active:scale-95"
              >
                Auto-Seed Sample Log History
              </button>
            </div>
          ) : (
            /* ── Forecast Dashboard ── */
            <>
              {/* ── Stats Summary Row ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="glass-card p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Estimated Emissions</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-white">
                      {Math.round(forecast.totalPredicted).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">kg CO₂e</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Cumulative forecast for the next {period} days.</p>
                </div>

                <div className="glass-card p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Trend Direction</span>
                  <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold capitalize ${trendColor}`}>
                    <TrendIcon className="h-4 w-4" />
                    {forecast.trend}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {forecast.changePercent >= 0 ? 'Increase' : 'Decrease'} of {Math.abs(forecast.changePercent)}% vs baseline.
                  </p>
                </div>

                <div className="glass-card p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Forecast Confidence</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-emerald-400">
                      {Math.round(forecast.confidence * 100)}%
                    </span>
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Based on historical data completeness.</p>
                </div>
              </div>

              {/* ── Forecast Area Chart ── */}
              <div className="glass-card p-6">
                <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-400" /> Emisson Prediction Curve
                </h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={forecast.data}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.4)" 
                        style={{ fontSize: '12px' }}
                        tickFormatter={(str) => {
                          const date = new Date(str);
                          return mounted ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : str;
                        }}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.4)" 
                        style={{ fontSize: '12px' }}
                        unit="kg"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a0f', 
                          borderColor: 'rgba(255,255,255,0.08)',
                          borderRadius: '8px'
                        }}
                        labelFormatter={(str) => mounted ? new Date(str).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : str}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="predicted" 
                        name="Projected CO₂"
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPredicted)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="upperBound" 
                        name="Upper Limit"
                        stroke="rgba(255,255,255,0.1)" 
                        fill="rgba(255,255,255,0.02)" 
                        strokeDasharray="4 4"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lowerBound" 
                        name="Lower Limit"
                        stroke="rgba(255,255,255,0.1)" 
                        fill="rgba(255,255,255,0.02)" 
                        strokeDasharray="4 4"
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── AI twin insight card ── */}
              <div className="glass-card border border-emerald-500/10 bg-emerald-500/5 p-5 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 mb-1">Digital Twin Trend Report</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    {forecast.aiExplanation}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
