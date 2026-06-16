'use client';

import { useState } from 'react';
import { RefreshCw, Check, AlertCircle, Database, Shield, Zap, ShoppingCart } from 'lucide-react';
import { addActivity } from '@/actions/carbon-actions';

interface AutomationSyncProps {
  onActivitySynced: () => void;
}

export default function AutomationSync({ onActivitySynced }: AutomationSyncProps) {
  const [syncingFinance, setSyncingFinance] = useState(false);
  const [syncingIoT, setSyncingIoT] = useState(false);
  const [financeStatus, setFinanceStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [iotStatus, setIotStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSyncText, setLastSyncText] = useState('Never synced');

  // Trigger Mock Plaid Financial Transaction parsing
  const handleFinanceSync = async () => {
    setSyncingFinance(true);
    setFinanceStatus('idle');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Seed a few mock carbon transactions
      const mockTransactions = [
        { category: 'transport', subcategory: 'car_gasoline', value: 45, unit: 'km' },
        { category: 'shopping', subcategory: 'clothing', value: 2, unit: 'item' }
      ];

      for (const t of mockTransactions) {
        await addActivity({
          category: t.category,
          subcategory: t.subcategory,
          value: t.value,
          unit: t.unit,
          activityDate: new Date().toISOString(),
          metadata: { source: 'Plaid Sync API' }
        });
      }

      setFinanceStatus('success');
      setLastSyncText(`Today at ${new Date().toLocaleTimeString()}`);
      onActivitySynced();
    } catch (err) {
      console.error(err);
      setFinanceStatus('error');
    } finally {
      setSyncingFinance(false);
    }
  };

  // Trigger Mock IoT Smart Meter parsing
  const handleIoTSync = async () => {
    setSyncingIoT(true);
    setIotStatus('idle');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add a simulated smart home electricity log
      await addActivity({
        category: 'energy',
        subcategory: 'electricity',
        value: 12.5,
        unit: 'kWh',
        activityDate: new Date().toISOString(),
        metadata: { source: 'Nest Smart Meter API' }
      });

      setIotStatus('success');
      setLastSyncText(`Today at ${new Date().toLocaleTimeString()}`);
      onActivitySynced();
    } catch (err) {
      console.error(err);
      setIotStatus('error');
    } finally {
      setSyncingIoT(false);
    }
  };

  return (
    <div className="glass-card p-6 border border-white/5 bg-gradient-to-b from-white/4 to-white/1 space-y-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-emerald-400" /> Automated Trackers
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Secure, automated integrations. Connect financial APIs or household smart meters to pull emissions hands-free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plaid Panel */}
        <div className="bg-black/20 rounded-lg p-4 border border-white/5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-400" /> Plaid Financial Sync
              </span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">API Active</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Parses merchant tags (gas stations, airlines, grocery) to calculate carbon footprints automatically.
            </p>
          </div>

          <button
            onClick={handleFinanceSync}
            disabled={syncingFinance}
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-medium text-xs text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {syncingFinance ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : financeStatus === 'success' ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
            {syncingFinance ? 'Syncing accounts...' : financeStatus === 'success' ? 'Linked & Synced!' : 'Sync Credit Transactions'}
          </button>
        </div>

        {/* Smart Meter Panel */}
        <div className="bg-black/20 rounded-lg p-4 border border-white/5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-emerald-400 animate-pulse" /> Smart Meter Grid Sync
              </span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Nest/Ecobee</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Pulls daily home heating and electricity logs dynamically using utility grid connection.
            </p>
          </div>

          <button
            onClick={handleIoTSync}
            disabled={syncingIoT}
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-medium text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {syncingIoT ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : iotStatus === 'success' ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {syncingIoT ? 'Polling smart grid...' : iotStatus === 'success' ? 'Smart Meter Active' : 'Pull IoT Energy Data'}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold uppercase border-t border-white/5 pt-3">
        <span>Last synchronization: {lastSyncText}</span>
        {financeStatus === 'success' && <span className="text-emerald-400 flex items-center gap-0.5"><Check className="h-3 w-3" /> Ledger Synced</span>}
      </div>
    </div>
  );
}
