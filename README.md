# CarbonMind AI

> **Your Personal Climate Digital Twin** — An AI-powered Carbon Footprint Awareness Platform designed to help users calculate, simulate, forecast, and reduce their greenhouse gas emissions.

---

## 1. Chosen Vertical & Persona

- **Vertical**: Sustainability & Climate Action Tech (Carbon Ledger & AI Assistant).
- **Digital Twin Persona**: The assistant acts as the user's "Climate Digital Twin". It analyzes the user's historical logging data to create a custom "Carbon DNA" profile, forecasts future emissions, provides a sandboxed "What-If" simulator for lifestyle shifts, and acts as an intelligent virtual coach using dynamic recommendations.

---

## 2. Approach & Logic

The system utilizes modular architecture dividing frontend display layers from backend transaction layers and core calculation engines:

- **Carbon DNA Engine**: Aggregates manual or OCR-extracted activities across 4 core sectors (Transport, Food, Energy, Shopping). It calculates percentage distribution and flags the dominant emission sector.
- **Forecasting Engine (Weighted Moving Average + Seasonal Decomposition)**:
  - Takes historical activity data.
  - Computes a WMA where recent logs carry higher weight.
  - Applies a seasonal multiplier (day-of-week variation) to identify routine weekly footprint peaks.
  - Computes linear trend slopes to project 30, 60, and 90-day futures with widening confidence bounds (representing prediction entropy).
- **What-If Simulator Engine**: Connects to the profile data to simulate lifestyle shifts (e.g. replacing gasoline commutes with cycling or bus) on a daily, weekly, or monthly frequency, displaying comparative bar charts showing Current vs Projected footprints.
- **OCR Pipeline (Tesseract.js)**: Runs in the browser to extract text from uploads, runs regular expression matches to capture power consumption (kWh) or fuel spent, categorizes the document type, and suggests carbon logging metrics.
- **Gamification Engine**: Enforces streaks and rank progression levels based on cumulative experience points earned through logging or challenge completions.

---

## 3. How the Solution Works

1. **User Sign Up & Login**: Secure credentials validation with NextAuth v5 session tokens.
2. **Dashboard Overview**: Fetches a single-transaction payload containing Carbon Score (0-100 scale vs global baseline), DNA charts, forecasting values, and active challenges.
3. **Log Activity (DNA)**: Users enter travel distance, electricity consumed, or retail spend. The calculator processes EPA emission multipliers and updates the user's Carbon DNA.
4. **Receipt Scan**: Drag and drop a utility bill. Tesseract reads text, extracts details, estimates emissions, and logs it directly.
5. **AI Climate Coach**: A dynamic chat interface where users can ask questions (e.g., about diet footprint changes) and receive suggestions.
6. **PDF Reporting**: Users click "Export Weekly PDF" to capture report widgets and download a clean carbon ledger.

---

## 4. Key Assumptions Made

- **Baseline Averages**: The global monthly baseline is assumed to be **391 kg CO₂e** (equivalent to ~4.7 tons CO₂e per year) for score comparisons.
- **EPA Factors**: Standard GHG Protocol multipliers are assumed:
  - Gasoline cars: 0.21 kg CO₂e/km.
  - Bus: 0.089 kg CO₂e/km.
  - Electricity grid average: 0.42 kg CO₂e/kWh.
  - Beef production: 27 kg CO₂e/kg.
- **OCR Completeness**: Receipt scan logic assumes legible text is provided to successfully match regex parameters.

---

## Technology Stack

- **Frontend**: Next.js 15 (Turbopack), TypeScript, Tailwind CSS, Recharts
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
