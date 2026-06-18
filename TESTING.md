# CarbonMind AI — Quality Assurance & Testing Framework

## 🧪 Testing Strategy

CarbonMind AI implements a multi-tier testing pipeline to guarantee structural integrity, algorithm precision, and zero regression across upgrades.

---

## 📂 Test Categories & Structure

```
├── __tests__/
│   ├── e2e/
│   │   └── dashboard.spec.ts   # Playwright End-to-End browser tests
│   ├── engines.test.ts         # Unit tests for forecasting, XAI, risk scores, gamification
│   ├── services.test.ts        # Unit tests for carbon emission calculators
│   └── utils.test.ts           # Helper logic and state validators
├── vitest.config.ts            # Unit/Integration configuration
└── playwright.config.ts        # E2E multi-browser configuration
```

---

## 🚀 Execution Instructions

### 1. Run Unit & Integration Tests (Vitest)
Unit tests evaluate carbon calculations, streak triggers, and the forecasting engines:
```bash
npm run test
```

### 2. Run E2E Integration Tests (Playwright)
Playwright spins up headless browser environments (Chromium, Firefox, WebKit) to validate route access, login forms, and interaction states:
```bash
npx playwright test
```

---

## 📈 Test Coverage Requirements

The CI/CD pipeline enforces:
- **95%+ statement and function coverage** on all core service files (`src/services/*`).
- Automated blocks preventing code merges if test runs fail or coverage falls below the threshold.
