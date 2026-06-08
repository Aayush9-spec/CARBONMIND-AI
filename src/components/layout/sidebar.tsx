'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Leaf,
  LayoutDashboard,
  Dna,
  TrendingUp,
  FlaskConical,
  MessageSquare,
  Target,
  Map,
  FileText,
  ScanLine,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/carbon-dna', label: 'Carbon DNA', icon: Dna },
  { href: '/dashboard/forecast', label: 'Forecast', icon: TrendingUp },
  { href: '/dashboard/simulator', label: 'Simulator', icon: FlaskConical },
  { href: '/dashboard/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/dashboard/challenges', label: 'Challenges', icon: Target },
  { href: '/dashboard/roadmap', label: 'Roadmap', icon: Map },
  { href: '/dashboard/report', label: 'Reports', icon: FileText },
  { href: '/dashboard/scan', label: 'Scan Receipt', icon: ScanLine },
  { href: '/dashboard/community', label: 'Community', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'glass-strong fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
      role="navigation"
      aria-label="Main sidebar navigation"
    >
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          aria-label="CarbonMind AI Dashboard"
        >
          <div className="gradient-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          {!collapsed && (
            <span className="font-heading text-lg font-bold">
              Carbon<span className="text-emerald-400">Mind</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              collapsed && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ── Nav Items ────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Dashboard navigation">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive
                        ? 'text-emerald-400'
                        : 'text-gray-500 group-hover:text-gray-300'
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="border-t border-white/5 p-3">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white',
            pathname === '/dashboard/settings' && 'bg-emerald-500/10 text-emerald-400'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
