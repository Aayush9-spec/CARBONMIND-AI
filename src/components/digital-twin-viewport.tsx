'use client';

import { useState, useEffect } from 'react';
import { Home, ShieldAlert, Award } from 'lucide-react';

interface DigitalTwinProps {
  carbonDNA: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
    total: number;
    dominantCategory: 'transport' | 'food' | 'energy' | 'shopping';
  };
}

export default function DigitalTwinViewport({ carbonDNA }: DigitalTwinProps) {
  const [helixOffset, setHelixOffset] = useState(0);

  // Animate the DNA rotating helix effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHelixOffset((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (percentage: number) => {
    if (percentage > 40) return 'text-red-400';
    if (percentage > 20) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStatusBorder = (percentage: number) => {
    if (percentage > 40) return 'border-red-500/20 bg-red-500/5';
    if (percentage > 20) return 'border-amber-500/20 bg-amber-500/5';
    return 'border-emerald-500/20 bg-emerald-500/5';
  };

  const dominant = carbonDNA.dominantCategory;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ── 3D Home Twin Panel ── */}
      <div className="glass-card p-6 border border-white/5 bg-gradient-to-b from-white/4 to-white/1 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Home className="h-24 w-24 text-white" />
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-400" /> Climate Home Twin
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Dynamic virtualization of your household carbon footprint and active energy grid offsets.
          </p>
        </div>

        {/* Mutating SVG House Illustration */}
        <div className="flex justify-center py-4 relative">
          <svg viewBox="0 0 240 180" className="w-full max-w-[280px] drop-shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            {/* Background Sky Grid */}
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#080810" />
                <stop offset="100%" stopColor="#121225" />
              </linearGradient>
              <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect width="240" height="180" rx="12" fill="url(#skyGrad)" />
            <grid />

            {/* Sun / Sky Solar status */}
            <circle cx="190" cy="40" r="18" fill="url(#sunGrad)" className="animate-pulse" />

            {/* House Foundation */}
            <rect x="60" y="80" width="120" height="70" rx="4" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />

            {/* Door */}
            <rect x="105" y="110" width="30" height="40" rx="2" fill="#311042" stroke="#4a1d6d" strokeWidth="1.5" />
            <circle cx="112" cy="130" r="2" fill="#fbbf24" />

            {/* Windows (Glow depends on energy emissions) */}
            <rect
              x="75"
              y="95"
              width="20"
              height="20"
              rx="2"
              fill={carbonDNA.energy > 40 ? '#f87171' : carbonDNA.energy > 20 ? '#fbbf24' : '#34d399'}
              opacity={carbonDNA.energy > 40 ? '0.8' : '0.9'}
              className="transition-all duration-500"
            />
            <rect
              x="145"
              y="95"
              width="20"
              height="20"
              rx="2"
              fill={carbonDNA.energy > 40 ? '#f87171' : carbonDNA.energy > 20 ? '#fbbf24' : '#34d399'}
              opacity={carbonDNA.energy > 40 ? '0.8' : '0.9'}
              className="transition-all duration-500"
            />

            {/* Roof (Changes if Solar/Eco is active) */}
            <polygon points="50,80 190,80 120,40" fill="#312e81" stroke="#4338ca" strokeWidth="2" />

            {/* Interactive Solar Panels (Rendered if energy emissions are low) */}
            {carbonDNA.energy < 25 && (
              <g className="transition-all duration-500 opacity-100 scale-100">
                <polygon points="70,75 110,75 120,53 85,53" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <polygon points="120,75 160,75 150,53 115,53" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <line x1="90" y1="75" x2="102" y2="53" stroke="#e0f2fe" strokeWidth="0.5" />
                <line x1="140" y1="75" x2="132" y2="53" stroke="#e0f2fe" strokeWidth="0.5" />
              </g>
            )}

            {/* Garage / Vehicle (Visual changes based on Transport emissions) */}
            <g className="transition-all duration-500">
              {carbonDNA.transport > 35 ? (
                // Gas Guzzler SUV (Red Glow)
                <g>
                  <rect x="15" y="125" width="35" height="15" rx="3" fill="#ef4444" opacity="0.8" />
                  <rect x="23" y="115" width="22" height="11" rx="2" fill="#b91c1c" />
                  <circle cx="23" cy="140" r="5" fill="#1f2937" />
                  <circle cx="42" cy="140" r="5" fill="#1f2937" />
                  {/* Smoke exhaust */}
                  <circle cx="10" cy="132" r="3" fill="#9ca3af" className="animate-ping" />
                </g>
              ) : carbonDNA.transport > 15 ? (
                // Standard Hybrid Sedan (Amber Glow)
                <g>
                  <rect x="15" y="127" width="32" height="13" rx="3" fill="#f59e0b" opacity="0.8" />
                  <rect x="22" y="118" width="18" height="10" rx="2" fill="#d97706" />
                  <circle cx="22" cy="140" r="4.5" fill="#1f2937" />
                  <circle cx="40" cy="140" r="4.5" fill="#1f2937" />
                </g>
              ) : (
                // EV / Bicycle (Green Glow)
                <g>
                  <rect x="15" y="128" width="30" height="12" rx="3" fill="#10b981" opacity="0.8" />
                  <rect x="21" y="120" width="16" height="9" rx="2" fill="#047857" />
                  <circle cx="21" cy="140" r="4" fill="#1f2937" />
                  <circle cx="39" cy="140" r="4" fill="#1f2937" />
                  <path d="M 12 138 A 4 4 0 0 1 12 128" stroke="#34d399" strokeWidth="1.5" fill="none" />
                </g>
              )}
            </g>

            {/* Eco Reforestation Tree (Grows if Food/Shopping is Low) */}
            {(carbonDNA.food < 25 || carbonDNA.shopping < 20) && (
              <g className="transition-all duration-500 opacity-100">
                <rect x="205" y="110" width="6" height="40" fill="#78350f" />
                <circle cx="208" cy="100" r="15" fill="#10b981" opacity="0.9" />
                <circle cx="198" cy="95" r="12" fill="#059669" opacity="0.95" />
                <circle cx="218" cy="95" r="12" fill="#047857" opacity="0.95" />
              </g>
            )}
          </svg>
        </div>

        {/* Quick status report */}
        <div className={`p-4 rounded-lg border ${getStatusBorder(carbonDNA[dominant])}`}>
          <div className="flex gap-2">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Twin System Analysis</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed mt-1">
                Your Digital Twin is showing {dominant} emissions at <span className={`font-bold ${getStatusColor(carbonDNA[dominant])}`}>{carbonDNA[dominant]}%</span>.
                {carbonDNA[dominant] > 35 
                  ? ` Immediate reduction in ${dominant} is critical to stabilizing your twin's micro-climate.` 
                  : ` Excellent mitigation in other categories. Complete active goals to plant a virtual tree.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Carbon DNA Panel ── */}
      <div className="glass-card p-6 border border-white/5 bg-gradient-to-b from-white/4 to-white/1 space-y-6 relative overflow-hidden flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" /> Carbon DNA Double-Helix
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Visualizing the genetic makeup of your footprint. Sector nodes mutate colors based on daily changes.
          </p>
        </div>

        {/* Dynamic Double-Helix animation */}
        <div className="flex items-center justify-center py-6 h-48 relative bg-black/20 rounded-lg border border-white/5 overflow-hidden">
          <div className="w-full max-w-[320px] flex justify-between px-6">
            {Array.from({ length: 9 }).map((_, idx) => {
              const angle = (helixOffset + idx * 40) * (Math.PI / 180);
              const sinVal = Math.sin(angle);
              const cosVal = Math.cos(angle);
              
              // Map nodes to our carbon categories based on index
              let categoryColor = '#3b82f6'; // Transport
              if (idx % 4 === 1) categoryColor = '#f59e0b'; // Food
              if (idx % 4 === 2) categoryColor = '#ef4444'; // Energy
              if (idx % 4 === 3) categoryColor = '#8b5cf6'; // Shopping

              return (
                <div key={idx} className="flex flex-col items-center justify-center relative h-32" style={{ width: '24px' }}>
                  {/* Top Node */}
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-300"
                    style={{
                      transform: `translateY(${sinVal * 40}px) scale(${1 + cosVal * 0.3})`,
                      backgroundColor: categoryColor,
                      zIndex: cosVal > 0 ? 10 : 1,
                      opacity: 0.4 + (cosVal + 1) * 0.3,
                    }}
                  />
                  {/* Connecting Bar */}
                  <div
                    className="absolute w-[1.5px] bg-white/20"
                    style={{
                      height: `${Math.abs(sinVal * 80)}px`,
                      transform: `scaleY(1)`,
                      opacity: 0.15,
                    }}
                  />
                  {/* Bottom Node */}
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-300"
                    style={{
                      transform: `translateY(${-sinVal * 40}px) scale(${1 - cosVal * 0.3})`,
                      backgroundColor: categoryColor,
                      zIndex: cosVal < 0 ? 10 : 1,
                      opacity: 0.4 + (-cosVal + 1) * 0.3,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold uppercase tracking-wider mt-4">
          <div className="flex flex-col items-center p-2 rounded bg-blue-500/5 border border-blue-500/10">
            <span className="text-blue-400 font-bold">Transport</span>
            <span className="text-white mt-0.5">{carbonDNA.transport}%</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-amber-500/5 border border-amber-500/10">
            <span className="text-amber-400 font-bold">Food</span>
            <span className="text-white mt-0.5">{carbonDNA.food}%</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-red-500/5 border border-red-500/10">
            <span className="text-red-400 font-bold">Energy</span>
            <span className="text-white mt-0.5">{carbonDNA.energy}%</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-purple-500/5 border border-purple-500/10">
            <span className="text-purple-400 font-bold">Shopping</span>
            <span className="text-white mt-0.5">{carbonDNA.shopping}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
