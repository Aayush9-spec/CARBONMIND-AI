// =============================================================================
// CARBONMIND AI — Carbon Mission Control
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  HelpCircle,
  CheckCircle,
  Activity,
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';
import {
  predictFutureEmissions,
  generateExplainableRecommendations,
  calculateCarbonRiskScore
} from '@/services/prediction-engine';
import type { DashboardData } from '@/types';
import type { ForecastPoint, ExplainableRecommendation, RiskScoreResult } from '@/services/prediction-engine';

export default function MissionControlPage() {
  const [dbData, setDbData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRecommendationTab, setActiveRecommendationTab] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        setLoading(true);
        const res = await getDashboardData();
        if (active && res.success && res.data) {
          setDbData(res.data);
        }
      } catch (err) {
        console.error('Failed to load mission control data:', err);
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

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-gray-400 font-medium">Booting Carbon Mission Control...</p>
      </div>
    );
  }

  // Calculate prediction and scoring models dynamically using client-side engine with DB data
  const activities = dbData?.recentActivities || [];

  const forecast: ForecastPoint[] = predictFutureEmissions(activities, 14);
  const recommendations: ExplainableRecommendation[] = generateExplainableRecommendations(activities);
  const riskResult: RiskScoreResult = calculateCarbonRiskScore(activities, 250);

  // Compute stats
  const totalForecastedEmissions = forecast.reduce((sum, f) => sum + f.predicted, 0);
  const averageConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / Math.max(recommendations.length, 1);
  const forecastRange = forecast.length > 0
    ? Math.max(...forecast.map((point) => point.highBound)) - Math.min(...forecast.map((point) => point.lowBound))
    : 0;
  const highestImpactRecommendation = recommendations.reduce<ExplainableRecommendation | null>(
    (best, recommendation) => {
      if (!best) return recommendation;
      return Math.abs(recommendation.impact) > Math.abs(best.impact) ? recommendation : best;
    },
    null
  );

  return (
    <div className="space-y-6">
      {/* ── Title Header ── */}
      <div>
        <h1 id="mission-control-title" className="font-heading text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-8 w-8 text-emerald-400" aria-hidden="true" />
          Carbon Mission Control
        </h1>
        <p className="text-gray-400">
          Advanced climate forecasting, risk assessments, and explainable intelligence action plans.
        </p>
      </div>

      {/* ── Dashboard Grid ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* ── CARD 1: Risk score ── */}
        <section
          aria-labelledby="risk-score-heading"
          className="border-glow bg-card-dark rounded-xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 id="risk-score-heading" className="text-lg font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                Carbon Risk Assessment
              </h2>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${riskResult.riskLevel === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/35' :
                  riskResult.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                }`}>
                {riskResult.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            {/* Dial visual */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-4 border-gray-800">
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500 animate-spin-slow"
                  style={{ transform: `rotate(${riskResult.riskScore * 3.6}deg)` }}
                />
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-white">{riskResult.riskScore}</span>
                  <span className="text-xs block text-gray-500">of 100</span>
                </div>
              </div>
            </div>

            {/* Risk factors list */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Primary Risk Triggers</h3>
              {riskResult.factors.map((f, i) => (
                <div key={i} className="bg-gray-950/45 p-3 rounded-lg border border-gray-800 flex items-start gap-2.5">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-gray-200">{f.title}</h4>
                    <p className="text-xs text-gray-400">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARD 2: Forecast Projection twin ── */}
        <section
          aria-labelledby="projection-heading"
          className="border-glow bg-card-dark rounded-xl p-6 flex flex-col justify-between md:col-span-1"
        >
          <div>
            <h2 id="projection-heading" className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-emerald-400" />
              Digital Twin Projections
            </h2>

            <div className="bg-gray-950/45 p-4 rounded-lg border border-gray-800 space-y-4 mb-6">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-xs text-gray-400">14-Day Predicted Output:</span>
                <span className="text-sm font-bold text-white">{totalForecastedEmissions.toFixed(1)} kg CO₂e</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-xs text-gray-400">Target Monthly Limit:</span>
                <span className="text-sm font-semibold text-emerald-400">250.0 kg CO₂e</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Historical Activity Logs:</span>
                <span className="text-sm font-semibold text-white">{activities.length} logs recorded</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Forecast Notes</h3>
              <div className="flex items-center gap-3 bg-gray-950/45 p-3 rounded-lg border border-gray-800">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-gray-300">Forecasts are generated from your logged history and widen in range as the projection horizon extends.</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-950/45 p-3 rounded-lg border border-gray-800">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-gray-300">Current 14-day forecast band spans roughly {forecastRange.toFixed(1)} kg CO₂e between low and high estimates.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARD 3: Quick Stats and Target ── */}
        <section
          aria-labelledby="twin-summary-heading"
          className="border-glow bg-card-dark rounded-xl p-6 flex flex-col justify-between md:col-span-2 lg:col-span-1"
        >
          <div>
            <h2 id="twin-summary-heading" className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Climate Insights AI
            </h2>

            <div className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-indigo-300">Explainable Model Insights</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Recommendations are derived from your logged activity mix and include an audit trace so you can see which categories are driving each suggestion.
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4.5 w-4.5 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-emerald-300">Action Plan Target</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your highest-impact recommendation could reduce emissions by up to <strong className="text-emerald-400">{highestImpactRecommendation ? Math.abs(highestImpactRecommendation.impact).toFixed(1) : '0.0'} kg CO₂e</strong> per month based on your current data.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── Explainable AI Recommendations Section ── */}
      <section
        aria-labelledby="xai-recommendations-title"
        className="border-glow bg-card-dark rounded-xl p-6"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 id="xai-recommendations-title" className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              Explainable AI Recommendations
            </h2>
            <p className="text-sm text-gray-400">
              Each recommendation features a transparency audit trace detailing the reasoning math.
            </p>
          </div>
          <div className="text-xs text-gray-500 border border-gray-800 rounded-md px-3 py-1.5 bg-gray-950/35">
            Model Confidence: <span className="font-semibold text-emerald-400">{(averageConfidence * 100).toFixed(0)}% avg</span>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isExpanded = activeRecommendationTab === rec.id;
            return (
              <div
                key={rec.id}
                className="bg-gray-950/40 border border-gray-800 rounded-lg p-5 transition hover:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {rec.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {rec.difficulty} difficulty
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {(rec.confidence * 100).toFixed(0)}% AI confidence
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{rec.title}</h3>
                    <p className="text-sm text-gray-300">{rec.content}</p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <span className="text-xs text-gray-500 block">Est. Monthly Savings</span>
                    <span className="text-xl font-extrabold text-emerald-400">{Math.abs(rec.impact)} kg CO₂e</span>
                  </div>
                </div>

                {/* Explanation expander */}
                <div className="mt-4 pt-4 border-t border-gray-800/80">
                  <button
                    onClick={() => setActiveRecommendationTab(isExpanded ? null : rec.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`exp-${rec.id}`}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-0.5"
                  >
                    {isExpanded ? 'Hide AI Explanation' : 'View AI Explanation & Audit Trace'}
                    <ArrowRight className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div
                      id={`exp-${rec.id}`}
                      className="mt-3 bg-indigo-950/20 border border-indigo-950/60 rounded-md p-4 text-xs text-gray-300 space-y-2"
                    >
                      <div className="flex items-center gap-1 text-indigo-300 font-semibold mb-1">
                        <HelpCircle className="h-3.5 w-3.5" />
                        Explanation Trace:
                      </div>
                      <p>{rec.explanation}</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
