'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <header
      className="glass-strong sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 px-6"
      role="banner"
    >
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search activities, insights..."
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          aria-label="Search dashboard"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div
            className="gradient-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {session?.user?.name ?? 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.email ?? ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
