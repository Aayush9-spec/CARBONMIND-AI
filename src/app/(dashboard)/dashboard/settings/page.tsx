// =============================================================================
// CARBONMIND AI — User Settings & Preferences Page
// =============================================================================

'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  User, 
  Check, 
  Loader2,
  Sliders,
  Eye
} from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';

export default function SettingsPage() {
  const [name, setName] = useState('Eco Citizen');
  const [email, setEmail] = useState('citizen@carbonmind.ai');
  const [currency, setCurrency] = useState('kg');
  const [limit, setLimit] = useState('300');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await getDashboardData();
      if (res.success && res.data) {
        // Mock data or load from active db user session
      }
    };
    loadData();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Update locally
      setSuccess('Profile settings and carbon preferences updated successfully!');
      setTimeout(() => setSuccess(null), 4000);
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Configuration Settings</h1>
        <p className="text-gray-400">Manage your profile, target emission thresholds, and accessibility options.</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-400 animate-fade-in" role="alert">
          <Check className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* ── Settings Form Grid ── */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start animate-fade-in">
        {/* Personal Details */}
        <div className="glass-card p-6 lg:col-span-6 space-y-4">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-400" /> Personal Profile
          </h2>

          <div className="space-y-3">
            <div>
              <label htmlFor="settings-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                id="settings-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="settings-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Carbon Preferences */}
        <div className="glass-card p-6 lg:col-span-6 space-y-4">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-400" /> Carbon Preferences
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-currency" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Emissions Metric
              </label>
              <select
                id="settings-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="kg">Kilograms (kg CO₂e)</option>
                <option value="ton">Tons (t CO₂e)</option>
              </select>
            </div>

            <div>
              <label htmlFor="settings-limit" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Monthly CO₂ Target Limit
              </label>
              <input
                id="settings-limit"
                type="number"
                required
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Panel */}
        <div className="glass-card p-6 lg:col-span-12 space-y-4">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-400" /> Accessibility Options
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-white">Reduced Motion</h3>
                <p className="text-xs text-gray-400 mt-1">Disables interface transitional micro-animations.</p>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="h-5 w-5 rounded border-white/10 bg-black/40 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                aria-label="Toggle Reduced Motion"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-white">High Contrast</h3>
                <p className="text-xs text-gray-400 mt-1">Enhances text accessibility with stark color contrast.</p>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="h-5 w-5 rounded border-white/10 bg-black/40 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                aria-label="Toggle High Contrast"
              />
            </div>
          </div>
        </div>

        {/* Submit row */}
        <div className="lg:col-span-12 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="gradient-primary flex items-center gap-2 rounded-lg px-8 py-2.5 font-semibold text-white shadow hover:opacity-90 active:scale-95 transition"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Settings Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
