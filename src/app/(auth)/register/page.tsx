'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, User, AlertCircle, Loader2, Check } from 'lucide-react';
import { registerUser } from '@/actions/auth-actions';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerUser(formData);
      if (result.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(result.error ?? 'Registration failed');
      }
    });
  }

  return (
    <div className="animate-scale-in opacity-0">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl font-bold"
          aria-label="CarbonMind AI Home"
        >
          <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Leaf className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <span className="font-heading text-2xl">
            Carbon<span className="text-emerald-400">Mind</span>
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="glass-card p-8">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold">Create Your Account</h1>
          <p className="mt-1 text-sm text-gray-400">
            Start your journey to a lower carbon future
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Min 8 chars, upper + lower + number"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                aria-describedby="password-requirements"
              />
            </div>
            <p
              id="password-requirements"
              className="mt-1 text-xs text-gray-500"
            >
              At least 8 characters with uppercase, lowercase, and a number
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="register-confirm"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="gradient-primary flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating account...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
