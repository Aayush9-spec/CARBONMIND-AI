# CarbonMind AI

> **Your Personal Climate Digital Twin** — An AI-powered Carbon Footprint Awareness Platform designed to help users calculate, simulate, forecast, and reduce their greenhouse gas emissions.

---

## Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js 15 App Router] --> B[React Server Components]
        A --> C[Client Components + TanStack Query]
        A --> D[shadcn/ui + Tailwind CSS]
    end

    subgraph "API Layer"
        E[Server Actions] --> F[Zod Validation]
        G[API Routes] --> F
        F --> H[Rate Limiter]
        H --> I[Auth Middleware - NextAuth v5]
    end

    subgraph "Business Logic"
        J[Carbon Calculator Engine]
        K[Forecasting Engine]
        L[What-If Simulator]
        M[AI Coach - OpenAI]
        N[OCR Pipeline - Tesseract.js]
        O[Gamification Engine]
        P[Challenge Generator]
      end

    subgraph "Data Layer"
        Q[(PostgreSQL)]
        R[Prisma ORM]
        S[Emission Factor DB]
    end

    I --> J & K & L & M & N & O & P
    J & K & L & M & N & O & P --> R --> Q
```

---

## Core Features

1. **Carbon DNA Profile**: Interactive pie charts demonstrating emission percentages across Transport, Food, Energy, and Shopping.
2. **What-If Simulator**: Scenario-builder to calculate potential monthly and yearly savings from lifestyle changes (e.g. car commute to bicycle).
3. **Forecasting Engine**: Weighted Moving Average and seasonal decomposition algorithm to project 30, 60, and 90-day emission curves.
4. **AI Climate Coach**: Conversation assistant giving real-time, context-aware suggestions linked to Carbon DNA data.
5. **Scan receipt OCR**: Tesseract OCR file processor that automatically reads utility bills or fuel receipts to compute carbon impact.
6. **Gamified Challenges**: User levels (Green Starter to Net Zero Hero), streaks, and lockable achievements.
7. **Regional Leaderboards**: Competition interface with codes to create or join Alliance Teams.
8. **Weekly PDF Report**: Custom styled reports with full client export using jsPDF and html2canvas.

---

## Database Schema (Prisma)

- **User**: Authentication details, gamification points, levels, and active streaks.
- **CarbonProfile**: Aggregated DNA totals.
- **CarbonActivity**: Logged activity categories, subcategories, units, and confidence indices.
- **AIInsight**: Recommendations and Warnings.
- **Challenge**: Reduction challenges.
- **Achievement**: Badge locker.
- **Team & TeamMember**: Community alliances.

---

## Technology Stack

- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS, Recharts
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5 (Auth.js)
- **OCR Engine**: Tesseract.js
- **PDF Generation**: jsPDF, html2canvas

---

## Getting Started

### 1. Configure Environment Variables
Create a `.env` file from the example template:
```bash
cp .env.example .env
```

Set the variables inside `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/carbonmind"
AUTH_SECRET="your-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Setup Database
Apply migrations or push the schema to your development database:
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
