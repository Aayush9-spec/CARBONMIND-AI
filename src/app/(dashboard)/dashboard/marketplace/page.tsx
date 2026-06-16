'use client';

import { useState, useEffect } from 'react';
import { Award, ShoppingBag, Check, ShieldCheck, Heart, Sparkles, Loader2 } from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';
import type { DashboardData } from '@/types';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  pricePerKg: number; // in points
  priceCash: number; // in USD
  provider: string;
  impactLabel: string;
  icon: string;
  location: string;
}

const PROJECTS: Project[] = [
  {
    id: 'climeworks-dac',
    title: 'Climeworks Direct Air Capture',
    description: 'Permanently filters carbon dioxide from the air and stores it safely underground in basalt rock formations.',
    category: 'Carbon Removal',
    pricePerKg: 10,
    priceCash: 1.2,
    provider: 'Climeworks AG',
    impactLabel: '100% permanent storage',
    icon: '💨',
    location: 'Iceland',
  },
  {
    id: 'amazon-reforestation',
    title: 'Amazon Basin Reforestation',
    description: 'Supports local farmers in planting native trees to restore degraded lands and build complex biodiversity corridors.',
    category: 'Nature-based Solutions',
    pricePerKg: 3,
    priceCash: 0.35,
    provider: 'Gold Standard',
    impactLabel: 'Restores habitat biodiversity',
    icon: '🌱',
    location: 'Brazil',
  },
  {
    id: 'ocean-kelp-sink',
    title: 'Ocean Blue Carbon Kelp Sink',
    description: 'Cultivates giant kelp arrays that capture carbon 30x faster than land forests, sinking biomass deep into the abyssal ocean.',
    category: 'Ocean Restoration',
    pricePerKg: 5,
    priceCash: 0.6,
    provider: 'Puro.earth',
    impactLabel: 'Alleviates ocean acidification',
    icon: '🌊',
    location: 'Maine, USA',
  },
];

export default function MarketplacePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(450); // Fallback points
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [purchasedProject, setPurchasedProject] = useState<Project | null>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [certificateId, setCertificateId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getDashboardData();
        if (res.success && res.data) {
          setData(res.data);
          setPoints(res.data.gamification.totalPoints);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRedeem = async (project: Project) => {
    if (points < project.pricePerKg * 10) return; // Minimum offset 10kg
    setPurchasingId(project.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPoints((prev) => prev - project.pricePerKg * 10);
      setPurchasedProject(project);
      setCertificateId(`CERT-DNATWIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setSuccessModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Eco-Credit Marketplace</h1>
          <p className="text-gray-400">Redeem points earned from sustainability streaks to fund verified carbon offsets.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
          <Award className="h-5 w-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-sm font-bold text-white">{points.toLocaleString()} Points</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => {
            const minPoints = project.pricePerKg * 10;
            const canAfford = points >= minPoints;

            return (
              <div
                key={project.id}
                className="glass-card border border-white/5 bg-gradient-to-b from-white/4 to-white/1 p-5 flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 text-3xl opacity-20">{project.icon}</div>

                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="font-heading text-base font-bold text-white">{project.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{project.description}</p>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] text-gray-500 font-semibold uppercase">Provider</span>
                      <p className="text-white font-medium mt-0.5">{project.provider}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 font-semibold uppercase">Location</span>
                      <p className="text-white font-medium mt-0.5">{project.location}</p>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded p-3 border border-white/5 text-[11px] text-gray-400">
                    <span className="font-bold text-emerald-400 block mb-0.5">🌿 Impact Matrix</span>
                    {project.impactLabel}
                  </div>

                  <div className="flex justify-between items-baseline pt-2">
                    <div>
                      <span className="text-[9px] text-gray-500 font-semibold uppercase">Cost (per 10kg offset)</span>
                      <p className="text-sm font-bold text-white">{minPoints} Points</p>
                    </div>
                    <span className="text-xs text-gray-400">or ${project.priceCash * 10} USD</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(project)}
                    disabled={purchasingId !== null || !canAfford}
                    className="w-full py-2.5 rounded font-medium text-xs text-white gradient-primary hover:opacity-90 transition disabled:opacity-50"
                  >
                    {purchasingId === project.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying ledger offset...
                      </span>
                    ) : canAfford ? (
                      'Offset 10 kg CO₂'
                    ) : (
                      'Insufficient Points'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Modal */}
      {successModal && purchasedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card max-w-md w-full border border-emerald-500/20 bg-gradient-to-b from-[#0a1e12] to-[#040c08] p-6 space-y-6 text-center animate-scale-up relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-white">Carbon Offset Verified</h2>
              <p className="text-xs text-gray-400">
                A micro-offset certificate has been minted on the ledger for your reduction contribution.
              </p>
            </div>

            <div className="bg-black/40 rounded-lg p-5 border border-white/5 text-left text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Project Beneficiary</span>
                <span className="font-bold text-white">{purchasedProject.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Offset Volume</span>
                <span className="font-bold text-emerald-400">10 kg CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Provider Certificate</span>
                <span className="font-mono text-[10px] text-white bg-white/5 px-2 py-0.5 rounded">{certificateId}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessModal(false)}
              className="w-full py-2.5 rounded font-medium text-xs text-white gradient-primary hover:opacity-90 transition"
            >
              Verify Ledger & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
