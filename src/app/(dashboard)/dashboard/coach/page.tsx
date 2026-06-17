// =============================================================================
// CARBONMIND AI — AI Coach Page
// =============================================================================

'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { 
  Send, 
  Sparkles, 
  Leaf, 
  Lightbulb, 
  Loader2,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import type { ChatMessage, AIRecommendation } from '@/types';

let messageIdCounter = 0;
const generateMsgId = (): string => {
  messageIdCounter++;
  return `${Date.now()}-${messageIdCounter}`;
};

const SUGGESTED_PROMPTS = [
  'How can I lower my electricity emissions?',
  'What is the footprint difference of beef vs chicken?',
  'Give me 3 easy actions for travel commuting.',
  'How do I earn the Transport Hero badge?',
];

const PRESET_ANSWERS: Record<string, { message: string; recs?: AIRecommendation[] }> = {
  'default': {
    message: "I am your Climate Digital Twin Coach. I analyze your carbon DNA profile to find high-impact, achievable ways for you to reduce greenhouse emissions. How can I help you today?",
  },
  'how can i lower my electricity emissions?': {
    message: "Your home energy is one of the highest leverage sectors. Here are some immediate, high-confidence recommendations to lower your electrical footprint:",
    recs: [
      {
        action: 'Unplug phantom energy loads (vampire draw)',
        impactKg: 12,
        confidence: 0.95,
        difficulty: 'easy',
        reason: 'Electronics draw power even when turned off but plugged in.'
      },
      {
        action: 'Wash laundry in cold water instead of hot',
        impactKg: 22,
        confidence: 0.9,
        difficulty: 'easy',
        reason: '90% of a washing machine\'s energy goes to heating water.'
      },
      {
        action: 'Lower thermostat by 2 degrees in winter',
        impactKg: 45,
        confidence: 0.85,
        difficulty: 'medium',
        reason: 'Reduces HVAC load, saving significant grid energy emissions.'
      }
    ]
  },
  'what is the footprint difference of beef vs chicken?': {
    message: "The difference is massive! Producing 1kg of beef generates approximately 27.0 kg CO₂e (GHG Protocol average). In contrast, chicken generates just 6.9 kg CO₂e per kg. Switching beef to chicken, pork, or vegetables is one of the most effective diet shifts you can make.",
    recs: [
      {
        action: 'Swap beef for chicken or vegetables twice a week',
        impactKg: 35,
        confidence: 0.95,
        difficulty: 'easy',
        reason: 'Saves 20.1 kg CO₂e per kilogram of meat substituted.'
      }
    ]
  },
  'give me 3 easy actions for travel commuting.': {
    message: "Transportation contributes significantly to personal footprints. Here are three simple, low-effort changes you can make immediately:",
    recs: [
      {
        action: 'Carpool with a colleague once a week',
        impactKg: 18,
        confidence: 0.9,
        difficulty: 'easy',
        reason: 'Cuts single-passenger vehicle emissions in half for that day.'
      },
      {
        action: 'Switch to bus/train for your Friday commute',
        impactKg: 24,
        confidence: 0.95,
        difficulty: 'easy',
        reason: 'Public transit emissions per km are 60-70% lower than driving.'
      },
      {
        action: 'Combine errands into a single circular trip',
        impactKg: 10,
        confidence: 0.9,
        difficulty: 'easy',
        reason: 'Avoids cold starts and decreases total distance traveled.'
      }
    ]
  },
  'how do i earn the transport hero badge?': {
    message: "To unlock the **Transport Hero** badge, you must record active transit (walking, bicycling, or using train/bus instead of driving) for 5 consecutive days, saving at least 25 kg CO₂e overall. Log some travel activities on the Carbon DNA page to track your progress!",
  }
};

export default function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: PRESET_ANSWERS.default.message,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text) return;

    if (!textToSend) setInput('');

    // Append user message
    const userMsg: ChatMessage = {
      id: generateMsgId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    startTransition(async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const query = text.toLowerCase().replace(/[?.]/g, '');
      const matched = PRESET_ANSWERS[query];

      let reply: ChatMessage;

      if (matched) {
        reply = {
          id: generateMsgId(),
          role: 'assistant',
          content: matched.message,
          recommendations: matched.recs,
          timestamp: new Date(),
        };
      } else {
        reply = {
          id: generateMsgId(),
          role: 'assistant',
          content: `I appreciate the question! As your Carbon Digital Twin, I see your dominant emission sector is transport. Focusing reduction effort there will save the most CO₂e. Try asking for specific tips, or ask: "Give me 3 easy actions for travel commuting."`,
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, reply]);
    });
  };

  // Extract all recommendations generated during this session
  const activeRecommendations: AIRecommendation[] = messages
    .flatMap((m) => m.recommendations ?? [])
    .filter((v, i, a) => a.findIndex((t) => t.action === v.action) === i); // Deduplicate

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">AI Climate Coach</h1>
        <p className="text-gray-400">Ask questions and receive real-time lifestyle suggestions customized by your Carbon DNA.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* ── Chat Interface ── */}
        <div className="glass-card flex flex-col justify-between lg:col-span-8 h-[550px] overflow-hidden">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-500 text-white font-medium rounded-tr-none'
                        : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {isUser ? (
                        <span>You</span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Sparkles className="h-3 w-3" /> Coach
                        </span>
                      )}
                      <span>• {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="whitespace-pre-line font-sans">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            
            {isPending && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  Twin AI is writing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts & Form */}
          <div className="border-t border-white/5 p-4 space-y-3 bg-black/20">
            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {prompt} <ChevronRight className="h-3 w-3 text-gray-500" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask your climate digital twin coach..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                aria-label="Coach prompt input"
              />
              <button
                onClick={() => handleSend()}
                className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:opacity-90 active:scale-95 shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Active Recommendations Sidepanel ── */}
        <div className="glass-card p-5 lg:col-span-4 flex flex-col justify-between max-h-[550px] overflow-hidden">
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-1 shrink-0">
              <Lightbulb className="h-5 w-5 text-amber-400" /> Session Coach Recommendations
            </h2>
            <p className="text-xs text-gray-400 mb-3 shrink-0">Actionable modifications generated during your chat session.</p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeRecommendations.length > 0 ? (
                activeRecommendations.map((rec, idx) => {
                  const difficultyColor = rec.difficulty === 'easy'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : rec.difficulty === 'medium'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-red-400 bg-red-500/10';

                  return (
                    <div key={idx} className="rounded-lg border border-white/5 bg-white/5 p-3 animate-fade-in space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white leading-tight">{rec.action}</h4>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide shrink-0 ${difficultyColor}`}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">{rec.reason}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 rounded p-1 border border-emerald-500/10">
                        <TrendingDown className="h-3 w-3" />
                        <span>Saves {rec.impactKg} kg CO₂e / month</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-8 text-gray-500">
                  <Leaf className="h-8 w-8 mb-2 animate-bounce" />
                  <p className="text-xs">Select prompts or ask questions to populate personalized eco recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
