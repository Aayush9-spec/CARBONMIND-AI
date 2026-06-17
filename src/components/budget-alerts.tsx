'use client';

import { useState } from 'react';
import { AlertCircle, Zap, Leaf } from 'lucide-react';

interface BudgetAlertsProps {
  currentMonthly: number;
  budgetLimit?: number;
}

export default function BudgetAlerts({ currentMonthly, budgetLimit = 400 }: BudgetAlertsProps) {
  const [activeTab, setActiveTab] = useState<'budget' | 'grid'>('budget');

  const pct = Math.min(100, Math.round((currentMonthly / budgetLimit) * 100));
  const isOver = currentMonthly > budgetLimit;

  // Mock grid optimization windows
  const gridWindows = [
    { time: '11:00 AM - 2:00 PM', status: 'optimal', desc: 'Solar generation peak. Ideal window to run high-load appliances.', offset: '-1.4 kg' },
    { time: '3:00 PM - 5:00 PM', status: 'fair', desc: 'Wind supply stable. Normal grid load.', offset: '-0.3 kg' },
    { time: '6:00 PM - 9:00 PM', status: 'critical', desc: 'High grid demand. Dirty fossil-fuel generators are active. Postpone energy tasks.', offset: '+0.8 kg' },
  ];

  return (
    <div className="glass-card border border-white/5 bg-gradient-to-b from-white/4 to-white/1 overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === 'budget' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-white/2' : 'text-gray-400 hover:text-white'
          }`}
        >
          Carbon Budget Gauge
        </button>
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === 'grid' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-white/2' : 'text-gray-400 hover:text-white'
          }`}
        >
          Proactive Grid Slots
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'budget' && (
          <div className="space-y-5">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Active Allowance</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-heading text-2xl font-extrabold text-white">{Math.round(currentMonthly)}</span>
                  <span className="text-xs text-gray-400">/ {budgetLimit} kg CO₂e</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${isOver ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {pct}% Used
              </span>
            </div>

            {/* Gauge progress bar */}
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  pct > 90 ? 'bg-gradient-to-r from-red-500 to-rose-600' : pct > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Status alert text */}
            <div className="flex items-start gap-3 rounded-lg bg-black/20 p-4 border border-white/5">
              {isOver ? (
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <Leaf className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs text-gray-300 leading-relaxed">
                {isOver ? (
                  <>
                    <span className="font-bold text-white">Carbon budget exceeded.</span> Your projected output exceeds the target allowance. Use the What-If Simulator to find offsets.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-white">Budget is stable.</span> You are currently maintaining a sustainable emission rate. Keep it up to secure your Net Zero badge streak!
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grid' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Green Grid Forecast</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="h-3 w-3 animate-pulse" /> Grid Connected
              </span>
            </div>

            <div className="space-y-3">
              {gridWindows.map((win, idx) => (
                <div key={idx} className="flex justify-between items-start p-3 bg-black/30 rounded-lg border border-white/5 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        win.status === 'optimal' ? 'bg-emerald-400' : win.status === 'fair' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      <span className="font-bold text-white">{win.time}</span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        win.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-400' : win.status === 'fair' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {win.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-snug">{win.desc}</p>
                  </div>
                  <span className={`font-bold whitespace-nowrap text-[11px] ${
                    win.status === 'critical' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {win.offset}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
