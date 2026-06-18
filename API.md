# CarbonMind AI — API Specification

This document details the Next.js Server Actions interface endpoints used by the client-side screens.

---

## ⚡ Server Actions API

### 1. `addActivity`
Log a new carbon footprint activity.
*   **Parameters**:
    ```typescript
    formData: {
      category: string;
      subcategory: string;
      value: number;
      unit: string;
      activityDate: string;
    }
    ```
*   **Returns**: `Promise<ApiResponse<CarbonActivity>>`

### 2. `deleteActivity`
Delete a logged carbon footprint activity entry.
*   **Parameters**: `activityId: string`
*   **Returns**: `Promise<ApiResponse<void>>`

### 3. `getDashboardData`
Retrieve a single-transaction dataset containing user stats, DNA totals, and forecasts.
*   **Parameters**: none
*   **Returns**: `Promise<ApiResponse<DashboardData>>`

### 4. `gradeLiteracyQuiz`
Evaluate interactive sustainability quiz answers and award bonus experience points on passing.
*   **Parameters**: `answers: number[]`
*   **Returns**: `Promise<ApiResponse<{ score: number; passed: boolean; feedback: string }>>`
