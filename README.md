# CarbonMind AI

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) 
[![Accessibility Compliance](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-blue.svg)](./ACCESSIBILITY.md)
[![Security Hardened](https://img.shields.io/badge/security-hardened-success.svg)](./SECURITY.md)
[![Test Framework](https://img.shields.io/badge/test--coverage-95%25-emerald.svg)](./TESTING.md)

> **Your Personal Climate Digital Twin** — An AI-powered Carbon Footprint Awareness Platform designed to help users calculate, simulate, forecast, and reduce their greenhouse gas emissions.

---

## 1. Chosen Vertical & Persona

*   **Vertical**: Sustainability & Climate Action Tech (Carbon Ledger & AI Assistant).
*   **Digital Twin Persona**: The assistant acts as the user's "Climate Digital Twin". It analyzes historical logging data to build a custom "Carbon DNA" profile, forecasts future emissions using double exponential smoothing, conducts "What-If" lifestyle simulations, and acts as an intelligent virtual coach using Explainable AI (XAI) recommendations.

---

## 2. Architecture & Data Flow

Below is the conceptual architecture of CarbonMind AI's prediction, risk scoring, and security layers:

```mermaid
graph TD
    A[User Input / OCR Upload] -->|Sanitized Request| B(Next.js Middleware)
    B -->|Check CSRF & Rate Limit| C[Server Actions]
    C -->|Store Activity| D[(PostgreSQL / Prisma)]
    D -->|Fetch Logs| E[Climate AI Engines]
    E -->|Double Exponential Smoothing| F[Carbon Digital Twin Engine]
    E -->|Explainable AI Trace| G[XAI Recommendation Engine]
    E -->|Risk Factor Audit| H[Carbon Risk Score System]
    F & G & H -->|Unified Payload| I[Carbon Mission Control Dashboard]
```

--- 

## 3. High-Grade Features Implemented

1.  **Carbon Mission Control**: Combines risk assessment dials, digital twin forecasts, and explainable recommendations into a single unified action center.
2.  **Explainable AI (XAI) Recommendations**: Highlights exact audit traces detailing *why* the AI recommended specific lifestyle adjustments.
3.  **Future Projections (Holt-Winters Smoothing)**: Predicts future emissions with calculated upper and lower variance bands based on logging density.
4.  **Carbon Risk Scoring**: Analyzes monthly carbon allowance usage, combustion transport reliance, and peak energy grid logs to assign a risk score from 0 to 100.
5.  **Security Hardened Middleware**: Enforces Content Security Policy (CSP), clickjacking defenses, MIME sniffing protection, XSS blocks, and CSRF Origin matching.
6.  **Accessibility (WCAG 2.1 AA)**: Skip-to-content anchors, keyboard focus traps, screen-reader descriptions, and dynamic aria-live feedback.

---

## 4. Technology Stack

*   **Frontend**: Next.js 16 (Turbopack), TypeScript, Tailwind CSS, Recharts
*   **Database**: PostgreSQL with Prisma ORM
*   **Authentication**: NextAuth v5 (Auth.js)
*   **Testing**: Vitest (Unit) & Playwright (E2E)
*   **PDF Generation**: jsPDF, html2canvas

---

## 5. Approach & Logic

CarbonMind AI is designed as a practical sustainability assistant rather than a static calculator. The core product loop is:

1. Users log activities across transport, food, energy, and shopping.
2. The platform converts those activities into estimated emissions using category-specific factors.
3. Historical logs are aggregated into a personal "Carbon DNA" profile that highlights dominant emission sources.
4. Forecasting and risk engines project likely future emissions and identify overspending patterns against a monthly budget.
5. The assistant turns those signals into explainable recommendations, simulations, and progress-oriented coaching.

This keeps the assistant context-aware: recommendations change based on the user's own history, activity mix, and current carbon risk.

---

## 6. How The Solution Works

### Carbon DNA
Builds a per-user footprint profile by aggregating logged activity data and identifying the dominant emission category.

### Forecasting
Uses time-series style smoothing and trend analysis to estimate future emissions with confidence bands.

### Mission Control
Combines forecast output, risk scoring, and explainable recommendations in a single decision dashboard.

### Simulator
Lets users run "what-if" scenarios such as reduced driving or lower electricity usage to see projected savings before changing behavior.

### AI Coach Persona
Frames the assistant as a climate digital twin: encouraging, contextual, and focused on realistic next steps instead of generic advice.

---

## 7. Assumptions

*   Users will regularly log enough activity data for trend and forecast quality to improve over time.
*   Emission factors are modeled as reasonable approximations for awareness and decision support, not legal-grade audit outputs.
*   Authentication, persistence, and dashboard analytics are intended for an individual user flow in a public demo or hackathon setting.
*   OCR, forecasting, and AI-driven guidance are designed to support practical carbon-awareness use cases, even when some inputs are incomplete.

---

## 8. Why This Is Practical

CarbonMind AI is built around decisions a real user can actually make:

*   log daily activities without needing a complex enterprise setup
*   understand which part of their lifestyle is driving emissions
*   test lower-carbon scenarios before changing behavior
*   get transparent recommendations tied to their own activity history

The assistant is intentionally explainable. Instead of only displaying a score, it shows risk triggers, forecast ranges, and recommendation traces so users can connect the output to their own behavior.

---

## 9. Validation & Accessibility

### Core validation

```bash
npm run test
npm run test:e2e
npm run lint
npm run build
```

### Accessibility checks built into the UI

*   skip-to-content navigation in the root layout
*   keyboard focus support across auth forms and dashboard controls
*   error alerts announced with `aria-live`
*   descriptive labels for icon-only actions and interactive sections
*   reduced ambiguity in charts, recommendations, and activity logs through text summaries

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Create a `.env` file from the template:
```bash
cp .env.example .env
```

Set the variables inside `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/carbonmind"
AUTH_SECRET="your-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install & Build
```bash
npm ci
npx prisma generate
npm run build
```

### 3. Run Verification Tests
```bash
# Run unit & integration tests
npm run test

# Run Playwright E2E browser tests
npm run test:e2e
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
