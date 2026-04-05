# Tech Stack

## Runtime
- Static HTML page — no build step, no bundler, no framework
- Vanilla JavaScript (ES5-compatible, `var` declarations, no modules) embedded in a `<script>` tag inside `index.html`
- CSS is inline in a `<style>` block using CSS custom properties

## Testing
- **Vitest** (`^3.2.1`) — test runner
- **fast-check** (`^4.1.1`) — property-based testing library
- Tests use ES module imports (`import { describe, it, expect } from 'vitest'`)
- `vitest.config.js` has `globals: false` — always import test functions explicitly

## Test Files
- `quiz.test.js` — property-based tests (fast-check) for quiz logic correctness properties
- `quiz.unit.test.js` — unit tests for structure, scoring, and validation
- `quiz.integration.test.js` — integration tests for full quiz flows (select → submit → reset)

Quiz logic functions are duplicated across test files and `index.html` (no shared module). When modifying quiz logic, update all locations.

## Commands
```bash
# Run all tests (single run, no watch)
npx vitest --run

# Run a specific test file
npx vitest --run quiz.unit.test.js

# Run tests matching a pattern
npx vitest --run -t "Score Calculation"
```
