# CarbonMind AI — Architectural Decision Records (ADR)

This document details the critical design decisions made during the development of CarbonMind AI, establishing rationale, context, and consequences.

---

## ADR 001 — Separation of Data Layer via Repository Pattern

### Context
Direct database access in Next.js Server Actions couples routing and transaction logic to the Prisma client. This makes unit testing complex (requires mocking the prisma module globally) and degrades code maintainability.

### Decision
We will encapsulate all database queries and mutations inside isolated repository classes (`CarbonRepository`, `UserRepository`) in `src/repositories/`.

### Consequences
*   **Decoupling**: Server Actions no longer interact directly with the Prisma client.
*   **Testability**: Database dependencies can be easily mocked during unit testing, raising statement coverage metrics.
*   **Maintainability**: Any database schema changes require modification only within the Repository layer.

---

## ADR 002 — Encapsulation of Carbon Mathematics in Service Layer

### Context
Carbon emission calculations, Holt-Winters smoothing forecast engines, and quiz grading logic represent core domain business rules that must remain independent of specific Next.js page components.

### Decision
Implement a service layer pattern in `src/services/` (`CarbonService`, `ForecastService`, `QuizService`).

### Consequences
*   **Dry Principle**: 100% of calculations are consolidated, eliminating duplicate calculation algorithms.
*   **Test Isolation**: The service engines are purely functional and can be tested with 100% test coverage using standard Vitest assertions.
