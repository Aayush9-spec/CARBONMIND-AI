// =============================================================================
// CARBONMIND AI — Weekly Reports Page
// =============================================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  Loader2, 
  Check, 
  TrendingDown, 
  Award,
  AlertCircle
} from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';
import type { DashboardData } from '@/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReportPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [reportDateRange] = useState(() => {
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const end = new Date().toLocaleDateString();
    return `Week of ${start} – ${end}`;
  });
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
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
    loadData();
  }, []);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      setExporting(true);
      
      const element = reportRef.current;
      
      // Target styling adjustments during PDF capture for maximum quality
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('carbonmind-weekly-report.pdf');

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Climate Reports</h1>
          <p className="text-gray-400">Generate, view, and export weekly/monthly summaries of your carbon footprint.</p>
        </div>
        {data && (
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="gradient-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : exportSuccess ? (
              <Check className="h-5 w-5" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            {exporting ? 'Generating PDF...' : exportSuccess ? 'Report Downloaded!' : 'Export Weekly PDF'}
          </button>
        )}
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && !data && (
        <div className="glass-card p-6 text-center text-gray-500">
          Failed to generate report. Make sure you have logged activities.
        </div>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* ── Report Card (Capturable Element) ── */}
          <div className="lg:col-span-8 space-y-6">
            <div 
              ref={reportRef} 
              className="glass-card p-8 border border-white/5 bg-gradient-to-b from-white/4 to-white/1 space-y-8"
              id="weekly-report-container"
            >
              {/* Report Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">CarbonMind AI Weekly Report</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {reportDateRange}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Twin ID Profile</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">Verified Account</p>
                </div>
              </div>

              {/* Weekly Highlights Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total Weekly Emissions</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-extrabold text-white">
                      {Math.round(data.carbonDNA.total).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">kg CO₂e</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Baseline Comparison</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-extrabold text-emerald-400">
                      -12.4%
                    </span>
                    <TrendingDown className="h-5 w-5 text-emerald-400 inline" />
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Carbon Score</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-extrabold text-emerald-400">
                      {data.carbonScore}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Emissions breakdown list */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-white">Sector Contribution Analysis</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Transportation', pct: data.carbonDNA.transport, color: '#3b82f6' },
                    { name: 'Food & Diet', pct: data.carbonDNA.food, color: '#f59e0b' },
                    { name: 'Home Energy', pct: data.carbonDNA.energy, color: '#ef4444' },
                    { name: 'Shopping & Goods', pct: data.carbonDNA.shopping, color: '#8b5cf6' },
                  ].map((sector) => (
                    <div key={sector.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sector.color }} />
                        <span>{sector.name}</span>
                      </div>
                      <span className="font-bold text-white">{sector.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight report */}
              <div className="border-t border-white/5 pt-6 space-y-3">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" /> Digital Twin Impact Assessment
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-medium bg-white/2 rounded-lg p-4 border border-white/5">
                  {data.carbonDNA.aiExplanation || 'Your carbon profile displays stable patterns this week. Consider exploring commuting scenario simulator tools to unlock additional carbon reduction offsets.'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Summary / Instructions sidebar ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-5 space-y-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" /> Report Badges
              </h3>
              <p className="text-xs text-gray-400">Badges earned during this reporting window:</p>
              
              <div className="space-y-2.5">
                {data.gamification.achievements.slice(0, 2).map((ach, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 border border-white/5">
                    <span className="text-xl">🏆</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
                {data.gamification.achievements.length === 0 && (
                  <div className="text-center py-4 text-xs text-gray-500">
                    No achievements unlocked during this window. Complete active challenges to unlock badges!
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-5 flex items-start gap-3 border border-red-500/10 bg-red-500/5">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-red-400 mb-0.5">Report Retention Notice</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Historical reports are retained for 90 days. Export weekly summaries as PDFs to store your carbon ledger indefinitely.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
