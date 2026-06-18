# CarbonMind AI — Accessibility Specification & WCAG 2.1 AA Compliance

## ♿ Design Compliance & Guidelines

CarbonMind AI is engineered to fully satisfy the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA criteria. The application provides high contrast ratios, screen-reader semantic layers, and comprehensive keyboard-only navigation.

---

## 🛠️ Accessibility Controls Matrix

| Element Area | Accessibility Pattern | WCAG 2.1 Criteria Met |
| :--- | :--- | :--- |
| **Global Shell** | **Skip to Main Content Link** to bypass main layout navigation grids. | **2.4.1 Bypass Blocks** (Level A) |
| **Color Palette** | Contrast ratios of all text elements against dark background exceed **4.5:1** (default) and **7:1** (high-contrast mode). | **1.4.3 Contrast (Minimum)** (Level AA) |
| **Interactive Graphs** | Screen-reader aria-labels providing summaries of data trends for blind users. | **1.1.1 Non-text Content** (Level A) |
| **Modal Overlays** | Lock-focus and Escape key handlers to release view overlays cleanly. | **2.1.2 No Keyboard Trap** (Level A) |
| **Animations** | Automatic CSS media checks respect system `@media (prefers-reduced-motion: reduce)` rules. | **2.2.2 Pause, Stop, Hide** (Level A) |

---

## ⌨️ Keyboard Navigation Map

Users can navigate the entire platform using standard keyboard bindings:

*   `Tab` / `Shift + Tab`: Traverses links, form inputs, buttons, and simulation inputs in a logical top-to-bottom layout.
*   `Enter` / `Space`: Activates tabs, buttons, accordion lists (AI explanations), and sync triggers.
*   `Escape`: Closes open dialogs (e.g. OCR scan modal, transaction log verification modal).

---

## 🗣️ Screen Reader Verification

*   **Aria-live Regions**: Active carbon points update logs use `aria-live="polite"` tags to narrate updates immediately when the user logs activities.
*   **Accessible Icons**: All graphic-only SVG buttons (e.g. Close `X`, edit icons) have associated `<span className="sr-only">` label values.
