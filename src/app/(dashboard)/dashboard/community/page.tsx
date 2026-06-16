// =============================================================================
// CARBONMIND AI — Community / Teams Leaderboard Page
// =============================================================================

'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  Users, 
  Trophy, 
  Plus, 
  Flame, 
  Check, 
  AlertCircle,
  Loader2,
  Lock,
  Compass
} from 'lucide-react';
import { getDashboardData } from '@/actions/carbon-actions';
import type { DashboardData, LeaderboardEntry } from '@/types';

export default function CommunityPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [leagueTab, setLeagueTab] = useState<'global' | 'corporate' | 'neighborhood'>('global');

  const [isPending, startTransition] = useTransition();

  // Team Form States
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  
  // Custom joined team simulation
  const [joinedTeam, setJoinedTeam] = useState<{
    name: string;
    code: string;
    members: { name: string; reduction: number; streak: number }[];
  } | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (teamName.trim().length < 3) {
      setError('Team name must be at least 3 characters long.');
      return;
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      setJoinedTeam({
        name: teamName,
        code,
        members: [
          { name: 'You (Eco Hero)', reduction: data ? data.gamification.totalPoints * 0.2 : 0, streak: data ? data.gamification.currentStreak : 1 },
          { name: 'Green_Explorer', reduction: 140, streak: 5 },
          { name: 'Zero_Commuter', reduction: 90, streak: 3 },
        ],
      });
      setSuccess(`Team "${teamName}" created successfully! Share code: ${code} with your friends.`);
      setTeamName('');
    });
  };

  const handleJoinTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (teamCode.trim().length !== 6) {
      setError('Team code must be exactly 6 characters long.');
      return;
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setJoinedTeam({
        name: 'Eco Warriors Alliance',
        code: teamCode.toUpperCase(),
        members: [
          { name: 'Admin Leader', reduction: 210, streak: 8 },
          { name: 'You (Eco Hero)', reduction: data ? data.gamification.totalPoints * 0.2 : 0, streak: data ? data.gamification.currentStreak : 1 },
          { name: 'Plant_Eater', reduction: 110, streak: 4 },
        ],
      });
      setSuccess(`Successfully joined team using code ${teamCode.toUpperCase()}!`);
      setTeamCode('');
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Community & Teams</h1>
        <p className="text-gray-400">Compete on leaderboards and team up with friends to achieve net-zero milestones.</p>
      </div>

      {/* ── Banners ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-red-400 animate-fade-in" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-400 animate-fade-in" role="alert">
          <Check className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* ── Leaderboard ── */}
          <div className="glass-card p-6 lg:col-span-7 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
              <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" /> Active Standings
              </h2>
              <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5">
                {(['global', 'corporate', 'neighborhood'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeagueTab(tab)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition ${
                      leagueTab === tab ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse" role="table">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">{leagueTab === 'global' ? 'User' : leagueTab === 'corporate' ? 'Department' : 'Neighborhood'}</th>
                    <th className="py-3 px-4 text-right">League Streak</th>
                    <th className="py-3 px-4 text-right">CO₂ Reduced</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {leagueTab === 'global' && data.leaderboard.map((user) => {
                    const isCurrentUser = user.name === 'You (Eco Hero)' || (data.recentActivities.length > 0 && user.rank === 1);
                    return (
                      <tr 
                        key={user.userId} 
                        className={`border-b border-white/5 hover:bg-white/5 transition duration-150 ${
                          isCurrentUser ? 'bg-emerald-500/5' : ''
                        }`}
                        role="row"
                      >
                        <td className="py-3.5 px-4 font-bold text-gray-300">
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {user.name}
                        </td>
                        <td className="py-3.5 px-4 text-right text-orange-400 font-bold">
                          <span className="inline-flex items-center gap-1">
                            {user.streak} <Flame className="h-4 w-4 fill-orange-500/10" />
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                          -{user.co2Reduced.toFixed(1)} kg
                        </td>
                      </tr>
                    );
                  })}

                  {leagueTab === 'corporate' && [
                    { rank: 1, name: 'Engineering Department 💻', streak: 84, reduction: 1420 },
                    { rank: 2, name: 'Sales & Account Management 📈', streak: 42, reduction: 980 },
                    { rank: 3, name: 'HR & Corporate Operations 🏢', streak: 21, reduction: 540 }
                  ].map((dept) => (
                    <tr key={dept.rank} className="border-b border-white/5 hover:bg-white/5 transition duration-150" role="row">
                      <td className="py-3.5 px-4 font-bold text-gray-300">
                        {dept.rank === 1 ? '🥇' : dept.rank === 2 ? '🥈' : '🥉'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{dept.name}</td>
                      <td className="py-3.5 px-4 text-right text-orange-400 font-bold">
                        <span className="inline-flex items-center gap-1">
                          {dept.streak} <Flame className="h-4 w-4 fill-orange-500/10" />
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">-{dept.reduction.toFixed(1)} kg</td>
                    </tr>
                  ))}

                  {leagueTab === 'neighborhood' && [
                    { rank: 1, name: 'Green Valley Estates 🏡', streak: 124, reduction: 2840 },
                    { rank: 2, name: 'Oakwood Heights 🌳', streak: 98, reduction: 1920 },
                    { rank: 3, name: 'Riverbend District 🌊', streak: 64, reduction: 1120 }
                  ].map((neighborhood) => (
                    <tr key={neighborhood.rank} className="border-b border-white/5 hover:bg-white/5 transition duration-150" role="row">
                      <td className="py-3.5 px-4 font-bold text-gray-300">
                        {neighborhood.rank === 1 ? '🥇' : neighborhood.rank === 2 ? '🥈' : '🥉'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{neighborhood.name}</td>
                      <td className="py-3.5 px-4 text-right text-orange-400 font-bold">
                        <span className="inline-flex items-center gap-1">
                          {neighborhood.streak} <Flame className="h-4 w-4 fill-orange-500/10" />
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">-{neighborhood.reduction.toFixed(1)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Teams Panel ── */}
          <div className="lg:col-span-5 space-y-6">
            {joinedTeam ? (
              /* Joined Team view */
              <div className="glass-card p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">{joinedTeam.name}</h2>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">Code: {joinedTeam.code}</p>
                  </div>
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team Members</h3>
                  {joinedTeam.members.map((member, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm border border-white/5">
                      <span className="font-semibold text-white">{member.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-400 font-bold flex items-center gap-0.5 text-xs">
                          {member.streak} <Flame className="h-3.5 w-3.5 fill-orange-500/10" />
                        </span>
                        <span className="text-emerald-400 font-extrabold">-{member.reduction.toFixed(1)} kg</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setJoinedTeam(null)}
                    className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 border border-red-500/25 hover:bg-red-500/20 active:scale-95 transition"
                  >
                    Leave Team
                  </button>
                </div>
              </div>
            ) : (
              /* Join/Create Forms */
              <div className="space-y-6">
                {/* Join team */}
                <div className="glass-card p-6 space-y-4">
                  <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Compass className="h-5 w-5 text-emerald-400" /> Join Existing Team
                  </h2>
                  <form onSubmit={handleJoinTeam} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="ENTER 6-DIGIT CODE"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none uppercase tracking-widest text-center"
                      aria-label="Team invitation code input"
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="gradient-primary flex items-center justify-center rounded-lg px-6 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Join'}
                    </button>
                  </form>
                </div>

                {/* Create team */}
                <div className="glass-card p-6 space-y-4">
                  <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-400" /> Create Alliance Team
                  </h2>
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label htmlFor="team-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Alliance Team Name
                      </label>
                      <input
                        id="team-name"
                        type="text"
                        required
                        placeholder="e.g. Eco Knights"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="gradient-primary flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition"
                      >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Initialize Team
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
