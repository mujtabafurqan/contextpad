# Visual Testing for ContextPad

## Quick Start

1. Start the dev server: `npm run dev`
2. Run visual tests: `npm run visual-test`
3. View results: Open `visual-test-report.html` in your browser

## What It Does

- Takes screenshots at desktop (1280px) and mobile (375px) sizes
- Tests toggle functionality (Edit ↔ Preview)
- Captures interactions (typing, button clicks)
- Generates HTML report with all screenshots

## Output

- `screenshots/` folder with timestamped PNG files
- `visual-test-report.html` with visual summary
- Console progress showing each test step

Perfect for catching visual regressions and documenting UI changes!