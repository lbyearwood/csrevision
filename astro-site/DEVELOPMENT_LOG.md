# Development log

## 2026-06-17

- Created the fresh Astro project inside `astro-site` using the minimal Astro starter.
- Added Tailwind CSS through Astro's Tailwind 4 Vite plugin flow.
- Added the initial component architecture for layouts, navigation, lesson cards and structured lesson rendering.
- Added starter routes for the homepage, GCSE dashboard and a placeholder CPU architecture lesson.
- Added shared lesson-section CSS so each lesson navigation target lands on a complete teaching canvas with two primary cards and a support card.
- Removed development/status copy from rendered pages. Site pages should contain only end-user learning content; implementation notes belong in this log or code comments.
- Reworked the GCSE dashboard into a clean contents-style course page after the non-lesson QAP rule: no hero, revision flow or instructional dashboard panels.
- `app` remains the old reference site and has not been edited.

## 2026-06-18

- Imported the GCSE J277 topic hierarchy and old resource availability map into Astro structured data.
- Enabled the migrated `1.1.1 Architecture of the CPU` Lesson, Exam and Quiz routes from the GCSE dashboard while leaving Tasks disabled.
- Rebuilt the 1.1.1 lesson as a 14-section single-page lesson using the shared left navigation, two-card teaching canvas and support-card pattern.
- Added reusable assessment components for revealable exam mark schemes and self-marking quizzes.
- Added the 1.1.1 exam question page and a 20-question self-marking quiz page.
- Updated shared lesson CSS so navigation targets have viewport-aware teaching canvases and enough bottom scroll space for support cards.
- Reworked the shared lesson section renderer so 1.1.1 no longer repeats generic "OK" bullet icons or the same diagram card on every section. Lesson sections now support varied card types including lists, steps, tables, process models, term grids, check questions and prompts.
- Added the first shared lesson header tool pad: `Back to topics` now sits on the left of the lesson header, the course identity remains in the centre, and the right-side tools dropdown contains the working Print action only.
- Replaced visible typed arrows in Astro UI with shared SVG arrow icons and CSS-drawn process connectors.
- Refined the lesson header so the back link sits at the far left, course identity is centred without the CPU badge, and the white tools button sits at the far right without a fake text chevron.
- Moved the lesson shell, sidebar and mobile lesson navigation behaviour into shared CSS classes so desktop lesson slides stay sticky and mobile/tablet navigation remains usable.
- Promoted the lesson header to a named shared sticky class and moved desktop sticky behaviour onto the sidebar container itself, so the header and lesson slides navigation remain visible while the main lesson content scrolls.
- Added slide numbers to displayed lesson section titles through the shared lesson renderer while keeping lesson data headings clean and unnumbered.
- Added shared lesson navigation state tracking so the active lesson slide updates as users scroll or follow slide links, with `aria-current` applied to the visible slide.
- Added `DEVELOPMENT_CHECKLIST.md` as the tracked checklist for lesson-shell, slide-layout, activity, diagram and full migration readiness work.
- Added `0.0.0 Reusable modules` to the GCSE dashboard with a working lesson route for testing the reusable lesson shell and component patterns.
- Expanded `0.0.0 Reusable modules` so its lesson slide navigation lists the reusable components and patterns that need to be agreed before full lesson migration.
- Updated the desktop lesson sidebar so long lesson slide lists scroll inside the sidebar panel while the sidebar remains sticky.
- Tightened the tablet/mobile lesson navigation height so long slide lists stay inside the visible viewport and scroll internally.
- Paired each `0.0.0 Reusable modules` component/pattern intention slide with a matching `#` example slide for approval work.
- Added shared wheel-scroll handling for long lesson slide lists so the slide navigation itself scrolls when the pointer is over it.
- Renamed the lesson shell checklist to `DEVELOPMENT_CHECKLIST.md` and added the agreed lesson architecture layers: lesson slide, slide canvas, slide layout and reusable components.
- Renamed `0.0.0 Test topic` to `0.0.0 Reusable modules` and moved the route to `/gcse/reusable-modules/`.

## 2026-06-19

- Added a dedicated Dev dashboard for agreeing reusable lesson layouts, cards and smaller components before full lesson migration.
- Changed the main navigation GCSE control into a dropdown with links to the GCSE dashboard and Dev dashboard.
- Removed the `0.0.0 Reusable modules` test topic from the GCSE dashboard and removed its public GCSE route. Reusable module approval now belongs in the Dev dashboard.
- Reworked the main navigation dropdown trigger as a compact themed menu icon button while keeping the GCSE and Dev dashboard links inside the dropdown.
- Extracted the shared numbered lesson slide shell into `LessonSlideShell.astro` and added the first Dev dashboard layout route for checking the standard shell.
- Updated tablet/mobile lesson slide navigation so selecting a slide closes the navigation panel and scrolls the target heading below the sticky header.
- Added the shared `TwoColumnTeachingWithSupportLayout.astro` module and a Dev dashboard route for testing the two-column teaching layout with a full-width support area.
- Added shared Layout definition data and draft Dev dashboard review routes for every remaining Layout module, so each whole-slide pattern can be reviewed and amended before it becomes an approved lesson layout.
- Reduced Dev dashboard Layout review pages to two slides: `Purpose` and `Example`. Developer checks are kept as source code comments, not visible page content.
- Added `DEVTOOLS_TROUBLESHOOTING.md` for browser-control issues and recorded the temporary visual-QA workaround while pointer-click testing is unavailable.
- Updated QA documentation so Microsoft Edge is the required browser for site testing instead of Chrome.
- Refined the `Two-column teaching with support` example so the left area uses paragraph text and the full-width support card renders white for clearer visual review.
- Refined the `Two-column teaching with support` example so the right area starts with paragraph text before bullets, and the support card body text uses normal black Arial with a shared card shadow.
- Changed the `Two-column teaching with support` left and right main example cards from dashed to solid borders for clearer visual review.
- Matched the `Two-column teaching with support` support card border to the solid blue border used on the left and right main example cards.
- Emphasised the `Two-column teaching with support` support card with a thicker left border while preserving the shared blue border style.
- Added the reusable `ExplanationCard` module, linked it from the Dev dashboard Cards list, and updated the two-column support example to use it for the left and right explanation areas.
- Added reusable card modules and Dev dashboard review routes for all listed Cards, with concrete examples for tables, diagrams, images, questions, prompts, feedback, instructions, matching, mark schemes and misconceptions.
- Added the reusable Answer card module for question answers shown in lightbox/modal reveal contexts, with a concrete Dev dashboard review example.
- Added an exemplary answer block to the Mark scheme card review example so the card demonstrates both mark points and a model response.
- Updated the Mark scheme card review example to display inside a lightbox-style modal preview, matching its intended reveal context.
- Updated the Answer card and Mark scheme card purpose text to state that each opens in lightbox mode.
- Added reusable Interactive table and Modelling card modules with concrete Dev dashboard review examples, including row-selection behaviour for the interactive table.
- Updated the Interactive model layout review example to remove the old Control area and Observation area, replacing them with Previous step, Next step and Reset controls.

## Build notes

- Build command: `npm run build`
- Static output folder: `dist/`
- Local dev URL: `http://127.0.0.1:4321/`
