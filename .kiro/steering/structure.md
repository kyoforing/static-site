# Project Structure

```
/
├── index.html                  # Single-page app: HTML + CSS + JS all-in-one
├── quiz.test.js                # Property-based tests (fast-check)
├── quiz.unit.test.js           # Unit tests
├── quiz.integration.test.js    # Integration tests
├── vitest.config.js            # Vitest configuration
├── package.json                # Dependencies (vitest, fast-check)
├── photo/                      # Chapter images (IMG_5236–5245.png)
└── .kiro/
    ├── steering/               # AI steering rules
    └── specs/                  # Feature specs
        └── vibe-coding-chapter7-interactive/
```

## Architecture Notes
- Single `index.html` contains all markup, styles, and logic — no separate JS/CSS files
- Quiz state is managed via a plain object (`quizState`) with imperative mutation
- DOM interaction uses `querySelector`/`querySelectorAll` with `data-*` attributes
- IntersectionObserver handles nav highlighting and section entrance animations
- All error handling uses try/catch with silent failures to keep the page functional
- Test files re-declare quiz logic functions locally (no shared module import from `index.html`)
