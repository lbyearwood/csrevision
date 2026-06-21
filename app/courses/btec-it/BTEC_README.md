# BTEC IT Tutorial Authoring Guide

Use this guide when creating or editing BTEC IT tutorial content.

## Dashboard Language

- Unit dashboards group work into stages, not tutorials.
- Use the format `Stage N - Name` for large dashboard cards, for example `Stage 3 - Layouts and templates`.
- The links inside each stage card are the tutorials.
- Keep tutorial links as direct links to deployable HTML files. Do not link to planning folders.

## Unit 6 Web Tutorial Structure

- Put deployable Unit 6 tutorials inside `courses/btec-it/unit-6/tutorial-N/`.
- Use stable filenames such as `btec-unit-6-3-8-main-section-rows-columns.html`.
- Use the existing site shell:
  - `body data-page-type="btec-web-tutorial" data-course="btec-it"`
  - shared `styles.css`
  - `assets/css/btec-web-tutorials.css`
  - `routes.js`, `site-layout.js`, `code-display.js`, and `site.js`
- Use the existing content sections:
  - `question-header`
  - `lesson-part btec-web-guide`
  - `lesson-part btec-web-contents`
  - repeated `lesson-part btec-web-step`
  - `lesson-part btec-web-final-code`
  - `tutorial-page-nav`

## Tutorial Writing Rules

- Tutorials should be step-by-step and student friendly.
- Write all HTML steps first, then all CSS steps afterwards.
- Each step should normally include:
  - a short instruction box
  - one code block
  - a short explanation box
  - an expected-output preview
- Keep code chunks small enough for students to type accurately.
- Use escaped HTML inside code blocks.
- Use `pre class="algorithm-code code-block"` and set `data-lang` to `HTML`, `CSS`, or `TEXT`.
- Final code must always be visible. Do not add password boxes, hidden final code, locked messages, or unlock UI.

## Preview And Styling Rules

- Expected-output previews must not affect the surrounding site.
- Put reusable preview styles in `assets/css/btec-web-tutorials.css`.
- Scope preview selectors under `body[data-page-type="btec-web-tutorial"] .expected-output`.
- Do not add global tutorial-only body, header, main, footer, or section styles that leak outside previews.
- Preview frames must resize on tablet and mobile.
- Code blocks may scroll horizontally, but the page itself should not require horizontal scrolling.

## Navigation And QA

- Add each new tutorial to the correct stage card on the Unit 6 dashboard.
- Update previous/next navigation inside the same tutorial stage.
- Include `Back to Unit 6` navigation.
- Before finishing, check:
  - every dashboard link points to an existing file
  - every new tutorial includes the site CSS and scripts
  - no deployable page references planning folders
  - no lock/password wording remains
  - desktop, tablet, and mobile layouts are readable in Chrome
