# CarbonMind AI — System Architecture Specification

## 🏗️ Architectural Overview

CarbonMind AI implements a strict **Domain-Driven Architecture** combined with a **Service Layer Pattern** and **Repository Pattern** to separate raw storage interactions, business logic orchestration, and frontend React views.

```mermaid
graph TD
    subgraph View Layer [React & UI View Layer]
        A[Dashboard Screen]
        B[Awareness Center Page]
        C[Mission Control Screen]
    end

    subgraph Controller Layer [Orchestration Actions]
        D[Next.js Server Actions]
    end

    subgraph Service Layer [Core Climate Logic]
        E[CarbonService]
        F[ForecastService]
        G[QuizService]
    end

    subgraph Repository Layer [Data Layer Isolation]
        H[CarbonRepository]
        I[UserRepository]
    end

    subgraph Storage Layer [Persistence]
        J[(PostgreSQL Database)]
    end

    A & B & C -->|Trigger| D
    D -->|Instantiate & Query| E & F & G
    E & F & G -->|Fetch / Persist| H & I
    H & I -->|Query Engine| J
```

---

## 📂 Modular Structure

*   **`src/app/`**: Next.js 16 file-system router page layouts and actions configurations.
*   **`src/actions/`**: Server Actions handling API entry points and user validation checks.
*   **`src/services/`**: Climate AI mathematical projection modeling, quiz grading, and carbon scoring metrics.
*   **`src/repositories/`**: Clean DB interface methods wrapping all Prisma query structures.
*   **`src/types/`**: Common types, enums, and interfaces for model typing safety.
