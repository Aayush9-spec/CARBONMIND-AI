// =============================================================================
// CARBONMIND AI — Carbon Awareness & Literacy Center
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  XCircle,
  TrendingDown, 
  Award,
  Loader2,
  Bookmark
} from 'lucide-react';
import { getDashboardData, gradeLiteracyQuiz } from '@/actions/carbon-actions';
import { QuizService } from '@/services/quiz-service';
import type { DashboardData } from '@/types';

export default function AwarenessPage() {
  const [dbData, setDbData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; feedback: string } | null>(null);
  const [grading, setGrading] = useState(false);

  // Client-safe mounting flags for hydration matching
  const [mounted, setMounted] = useState(false);

  const quizService = new QuizService();
  const questions = quizService.getQuizQuestions();
  const modules = quizService.getEducationalModules();

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);

    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getDashboardData();
        if (res.success && res.data) {
          setDbData(res.data);
        }
      } catch (err) {
        console.error('Failed to load awareness dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(quizAnswers).length < questions.length) return;
    
    try {
      setGrading(true);
      // Map answers map to sequential array
      const answerArr = questions.map(q => quizAnswers[q.id] ?? 0);
      const res = await gradeLiteracyQuiz(answerArr);
      if (res.success && res.data) {
        setQuizResult(res.data);
        setQuizSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGrading(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  if (!mounted || loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-gray-400 font-medium">Booting Carbon Awareness Center...</p>
      </div>
    );
  }

  // Journey milestones tracking
  const currentPoints = dbData?.gamification?.totalPoints || 0;
  const currentLevel = dbData?.gamification?.level || 'green_starter';

  const levels = [
    { key: 'green_starter', name: 'Green Starter', target: 0, desc: 'Initial logging' },
    { key: 'eco_explorer', name: 'Eco Explorer', target: 200, desc: 'Understand habits' },
    { key: 'climate_warrior', name: 'Climate Warrior', target: 500, desc: 'Active reduction' },
    { key: 'planet_guardian', name: 'Planet Guardian', target: 1000, desc: 'Smart syncing' },
    { key: 'net_zero_hero', name: 'Net Zero Hero', target: 1500, desc: 'Perfect alignment' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 id="awareness-title" className="font-heading text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-emerald-400" aria-hidden="true" />
          Carbon Awareness & Literacy
        </h1>
        <p className="text-gray-400">
          Improve your climate literacy, analyze carbon habits, and track your individual reduction journey.
        </p>
      </div>

      {/* ── Journey Milestones Stepper ── */}
      <section 
        aria-labelledby="journey-heading"
        className="border-glow bg-card-dark rounded-xl p-6"
      >
        <h2 id="journey-heading" className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-400" />
          Individual Reduction Journey
        </h2>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {levels.map((lvl, index) => {
            const isCompleted = currentPoints >= lvl.target;
            const isActive = currentLevel === lvl.key;

            return (
              <div key={lvl.key} className="flex md:flex-col items-center gap-4 md:gap-2 flex-1 w-full relative">
                {/* Visual Step bubble */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                  isActive ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/25' :
                  isCompleted ? 'bg-emerald-500 text-white' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Vertical/Horizontal connector line */}
                {index < levels.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-gray-800 -z-0" />
                )}

                <div className="text-left md:text-center">
                  <h3 className={`text-sm font-bold ${isActive ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {lvl.name}
                  </h3>
                  <p className="text-xs text-gray-500">{lvl.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left Column: Educational Modules ── */}
        <section 
          aria-labelledby="modules-heading"
          className="lg:col-span-2 space-y-4"
        >
          <div className="border-glow bg-card-dark rounded-xl p-6">
            <h2 id="modules-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-emerald-400" />
              Educational Sustainability Modules
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Read these brief modules to build baseline awareness of smart grids, food footprints, and carbon ledgers.
            </p>

            <div className="space-y-4" role="list">
              {modules.map((mod) => {
                const isExpanded = activeModule === mod.id;
                return (
                  <div 
                    key={mod.id}
                    role="listitem"
                    className="border border-gray-800 rounded-lg p-4 bg-gray-950/35 transition hover:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
                          {mod.category}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1.5">{mod.title}</h3>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{mod.readTime}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{mod.description}</p>

                    <button
                      onClick={() => setActiveModule(isExpanded ? null : mod.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`mod-content-${mod.id}`}
                      className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none"
                    >
                      {isExpanded ? 'Collapse Module' : 'Start Reading'}
                    </button>

                    {isExpanded && (
                      <div 
                        id={`mod-content-${mod.id}`}
                        className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-300 leading-relaxed space-y-2 bg-gray-950/45 p-3 rounded"
                      >
                        <p>{mod.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Right Column: Habit Analysis & Impact Insights ── */}
        <section 
          aria-labelledby="habits-heading"
          className="space-y-4"
        >
          <div className="border-glow bg-card-dark rounded-xl p-6">
            <h2 id="habits-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-rose-400" />
              Personalized Habit Analysis
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-950/45 p-4 rounded-lg border border-gray-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Logging Consistency</span>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Your streak stands at <strong className="text-emerald-400">{dbData?.gamification?.currentStreak || 0} days</strong>. Frequent logging increases the confidence score of the forecasting engines.
                </p>
              </div>

              <div className="bg-gray-950/45 p-4 rounded-lg border border-gray-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Dominant Sector Impact</span>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {dbData?.carbonDNA?.dominantCategory === 'transport' ? 'Transportation is driving the largest portion of your footprint. Swap combustion trips for green transit where possible.' :
                   dbData?.carbonDNA?.dominantCategory === 'energy' ? 'Home energy is your largest sector. Sync major utility cycles with green solar peak grid slots.' :
                   'Your carbon categories are balanced. Continue logging items to refine your digital twin metrics.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Carbon Literacy Quiz Section ── */}
      <section 
        aria-labelledby="quiz-heading"
        className="border-glow bg-card-dark rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
          <div>
            <h2 id="quiz-heading" className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-indigo-400" />
              Carbon Literacy Quiz
            </h2>
            <p className="text-sm text-gray-400">
              Test your climate understanding and unlock <strong className="text-indigo-400">50 points</strong> bonus for passing!
            </p>
          </div>
          {quizSubmitted && (
            <button
              onClick={handleResetQuiz}
              className="text-xs font-semibold px-4 py-2 border border-gray-800 hover:border-gray-700 text-gray-300 rounded-lg bg-gray-950/35 transition"
            >
              Reset Quiz
            </button>
          )}
        </div>

        {/* Quiz Questions List */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const selectedOptIdx = quizAnswers[q.id];
            const isCorrect = selectedOptIdx === q.correctAnswerIndex;

            return (
              <div key={q.id} className="space-y-3">
                <h3 className="text-sm font-bold text-gray-200">
                  {qIdx + 1}. {q.question}
                </h3>

                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOptIdx === optIdx;
                    
                    let btnStyle = 'border-gray-800 bg-gray-950/20 text-gray-300 hover:border-gray-700';
                    if (isSelected) {
                      btnStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-medium';
                    }
                    if (quizSubmitted) {
                      if (optIdx === q.correctAnswerIndex) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={quizSubmitted}
                        className={`text-left text-xs p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text box visible on submit */}
                {quizSubmitted && (
                  <div className={`text-xs p-3 rounded-lg flex items-start gap-2.5 ${
                    isCorrect ? 'bg-emerald-500/5 border border-emerald-500/15 text-emerald-300' :
                    'bg-rose-500/5 border border-rose-500/15 text-rose-300'
                  }`}>
                    {isCorrect ? <CheckCircle className="h-4.5 w-4.5 text-emerald-400 mt-0.5 shrink-0" /> : <XCircle className="h-4.5 w-4.5 text-rose-400 mt-0.5 shrink-0" />}
                    <div>
                      <strong>{isCorrect ? 'Correct! ' : 'Incorrect. '}</strong>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit action panel */}
        {!quizSubmitted ? (
          <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
            <button
              onClick={handleSubmitQuiz}
              disabled={grading || Object.keys(quizAnswers).length < questions.length}
              className="gradient-primary flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-40"
            >
              {grading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Grading...
                </>
              ) : (
                'Submit Answers'
              )}
            </button>
          </div>
        ) : (
          quizResult && (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-300">Quiz Completed!</h3>
                  <p className="text-sm text-gray-300 mt-1">{quizResult.feedback}</p>
                </div>
                <div className="text-center shrink-0">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Your Score</span>
                  <span className="text-4xl font-extrabold text-white block mt-1">{quizResult.score}%</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded block mt-1 ${
                    quizResult.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {quizResult.passed ? 'PASSED & COMPLETED' : 'TRY AGAIN'}
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </section>

    </div>
  );
}
