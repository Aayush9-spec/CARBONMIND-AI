import Link from 'next/link';
import {
  Leaf,
  BarChart3,
  Brain,
  Target,
  Users,
  Zap,
  ArrowRight,
  Shield,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* ── Background Effects ──────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-[100px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav
        className="glass-strong sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold"
            aria-label="CarbonMind AI Home"
          >
            <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-heading">
              Carbon<span className="text-emerald-400">Mind</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="gradient-primary rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <main id="main-content">
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-20 text-center lg:pt-32">
          <div className="animate-fade-in-up opacity-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI-Powered Climate Intelligence
            </div>
          </div>

          <h1 className="animate-fade-in-up opacity-0 stagger-1 font-heading text-5xl font-extrabold leading-tight tracking-tight md:text-7xl lg:text-8xl">
            Your Personal
            <br />
            <span className="gradient-text">Climate Digital Twin</span>
          </h1>

          <p className="animate-fade-in-up opacity-0 stagger-2 mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
            Understand, predict, and reduce your carbon emissions with
            AI-powered insights. CarbonMind learns your behavior and creates a
            personalized roadmap to a sustainable future.
          </p>

          <div className="animate-fade-in-up opacity-0 stagger-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group gradient-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-lg font-semibold text-white shadow-xl shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
            >
              Start Tracking Free
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              Explore Features
            </Link>
          </div>

          {/* ── Stats Row ───────────────────────────────────────────── */}
          <div className="animate-fade-in-up opacity-0 stagger-4 mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8">
            {[
              { value: '2.4t', label: 'Avg. CO₂ Reduced/User', icon: TrendingDown },
              { value: '92%', label: 'Prediction Accuracy', icon: Brain },
              { value: '50k+', label: 'Active Users', icon: Users },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <stat.icon
                    className="h-5 w-5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="font-heading text-3xl font-bold text-white md:text-4xl">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────────────────────── */}
        <section
          id="features"
          className="relative z-10 mx-auto max-w-7xl px-6 py-20"
          aria-labelledby="features-heading"
        >
          <div className="mb-16 text-center">
            <h2
              id="features-heading"
              className="font-heading text-3xl font-bold md:text-5xl"
            >
              Intelligent Features
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Everything you need to understand and reduce your carbon footprint
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className={`glass-card group p-6 opacity-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────── */}
        <section
          className="relative z-10 mx-auto max-w-7xl px-6 py-20"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mb-16 text-center">
            <h2
              id="how-it-works-heading"
              className="font-heading text-3xl font-bold md:text-5xl"
            >
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Three steps to a lower carbon future
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`relative text-center opacity-0 animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-white shadow-lg shadow-emerald-500/20">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="glass-card p-12 animate-pulse-glow">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Ready to Meet Your{' '}
              <span className="gradient-text">Climate Twin?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Join thousands of users who are actively reducing their carbon
              footprint with AI-powered insights.
            </p>
            <Link
              href="/register"
              className="group gradient-primary mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-lg font-semibold text-white shadow-xl shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
            >
              Get Started Free
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/5 py-8" role="contentinfo">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Leaf className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>© 2026 CarbonMind AI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span>SOC 2 Compliant</span>
              <span>·</span>
              <span>WCAG 2.1 AA</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ── Feature Data ──────────────────────────────────────────────────────────────

const features = [
  {
    title: 'Carbon DNA Analysis',
    description:
      'Get your unique carbon profile showing exactly how transportation, food, energy, and shopping contribute to your footprint.',
    icon: BarChart3,
    color: '#10b981',
  },
  {
    title: 'Future Forecasting',
    description:
      'AI predicts your emissions 30, 60, and 90 days ahead based on behavioral patterns and seasonal trends.',
    icon: TrendingDown,
    color: '#3b82f6',
  },
  {
    title: 'What-If Simulator',
    description:
      'Simulate lifestyle changes and instantly see how they impact your carbon footprint before committing.',
    icon: Zap,
    color: '#f59e0b',
  },
  {
    title: 'AI Sustainability Coach',
    description:
      'Chat with an AI coach that understands your history, goals, and habits to provide personalized reduction advice.',
    icon: Brain,
    color: '#8b5cf6',
  },
  {
    title: 'Smart Challenges',
    description:
      'AI-generated challenges tailored to your profile. Complete them to earn points, badges, and climb the leaderboard.',
    icon: Target,
    color: '#ef4444',
  },
  {
    title: 'Community Impact',
    description:
      'Create or join teams, compete with friends, and collectively reduce emissions in community challenges.',
    icon: Users,
    color: '#14b8a6',
  },
];

const steps = [
  {
    title: 'Log Your Activities',
    description:
      'Manually enter activities or scan receipts and bills. Our AI automatically calculates emissions.',
  },
  {
    title: 'Get AI Insights',
    description:
      'Receive personalized analysis, forecasts, and actionable recommendations based on your data.',
  },
  {
    title: 'Reduce & Track',
    description:
      'Follow your personalized roadmap, complete challenges, and watch your carbon footprint shrink.',
  },
];
