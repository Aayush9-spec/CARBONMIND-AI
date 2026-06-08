# Accessibility Statement (WCAG 2.1 AA)

## Design Compliance

CarbonMind AI is designed to meet WCAG 2.1 Level AA specifications to ensure accessibility for individuals with visual, auditory, cognitive, or motor impairments.

---

## Implemented Accessibility Controls

### 1. Semantic HTML & ARIA
- All page sections use proper HTML5 semantic markup (`<main>`, `<header>`, `<aside>`, `<footer>`, `<nav>`).
- Forms include corresponding `<label>` associations linking control elements explicitly.
- Interactive widgets (collapsible sidebar, tooltip charts, tabs) utilize appropriate ARIA tags (`aria-expanded`, `aria-controls`, `aria-label`).

### 2. Keyboard Navigation
- All interactive elements are fully focusable using `Tab` key traversal.
- Focus rings are styled with `outline-offset` to ensure high visibility without cluttering the aesthetic.
- Table columns, action logs, and dashboard widgets are accessible using keyboard controls.
- A **Skip-to-Content** link is included at the top of the root layout to allow screen-reader and keyboard users to bypass header navigation.

### 3. Contrast & Typography
- Typography uses modern, readable system-fallback sans fonts (Outfit, Inter) with generous line heights (1.5–1.625) to assist dyslexic readers.
- Default text and background colors achieve a minimum contrast ratio of 4.5:1.
- A **High Contrast Mode** toggle is provided in the Settings page to enforce high visibility guidelines.

### 4. Reduced Motion
- Micro-animations and gradient transitions respect user system settings via `@media (prefers-reduced-motion: reduce)`.
- Option to manually disable all visual transitions is provided directly in settings.
