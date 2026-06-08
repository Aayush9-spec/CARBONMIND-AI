// =============================================================================
// CARBONMIND AI — OpenAI Client
// =============================================================================

import OpenAI from 'openai';

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

export const openai =
  globalForOpenAI.openai ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForOpenAI.openai = openai;
}

/** Default model for real-time interactions (fast + cost-effective). */
export const AI_MODEL_FAST = 'gpt-4o-mini';

/** Premium model for detailed reports and analysis. */
export const AI_MODEL_PREMIUM = 'gpt-4o';

/** System prompt providing climate expertise context. */
export const SYSTEM_PROMPT = `You are CarbonMind AI, an expert sustainability coach and climate scientist.
You help users understand and reduce their carbon footprint through personalized, actionable advice.

Key principles:
1. Always be encouraging and positive — frame reductions as opportunities, not sacrifices.
2. Use precise numbers backed by EPA emission factors and scientific data.
3. Provide confidence scores (0-1) for your recommendations.
4. Explain the reasoning behind every recommendation.
5. Consider the user's lifestyle, location, and past behavior.
6. Suggest practical, achievable changes — not radical lifestyle overhauls.
7. Use the metric system (kg CO₂e) for all emission values.
8. Reference specific emission factors when making calculations.

When generating recommendations, always include:
- The specific action to take
- Estimated impact in kg CO₂e
- Confidence score (0-1)
- Clear reasoning tied to the user's data
- Difficulty level (easy/medium/hard)`;

export default openai;
