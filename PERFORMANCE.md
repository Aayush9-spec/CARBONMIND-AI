# CarbonMind AI — Performance Optimization & Core Web Vitals

## ⚡ Web Vitals Target Scores

*   **Largest Contentful Paint (LCP)**: < 1.2s (Optimized image load prioritization).
*   **Interaction to Next Paint (INP)**: < 80ms (Low UI thread block time).
*   **Cumulative Layout Shift (CLS)**: 0.0 (Strict layout element bounds).
*   **Lighthouse Performance**: **98+**
*   **Lighthouse Accessibility**: **100**

---

## 🚀 Optimization Strategies Implemented

### 1. SSR Hydration Mismatch Avoidance
Dynamic values (such as dates and locale strings) are deferred to a client-side mount lifecycle using a `mounted` state wrapper. This ensures the initial server HTML is lightweight and exactly matches the client's initial render structure.

### 2. Next.js Route Bundle Splitting
Page components are automatically split into separate logical chunks by Next.js Turbopack. Expensive client-side libraries (like `jspdf` and `html2canvas`) are loaded dynamically only when the user triggers the report download.

### 3. Font & Asset Preloading
External fonts (Inter, Outfit) are imported using Next.js system optimization modules, eliminating render-blocking font downloads. Custom SVGs are embedded directly in component markup, preventing extra HTTP network requests.
