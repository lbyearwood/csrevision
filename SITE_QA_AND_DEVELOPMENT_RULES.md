# Site QA and Development Rules

This is the current reference guide for future Codex development on CS Revision. Read this before starting any development task, then follow it unless the user gives a newer instruction.

This document is not a changelog. It should describe the current agreed rules and principles. When the user gives a new rule, design preference or correction, update this document. If a new rule replaces an older rule, revise the old rule instead of leaving contradictions.

## QAP Marker

- When the user writes `QAP:`, treat the instruction as an important QA and development principle.
- Address the instruction in the current work, not just as a comment or suggestion.
- Update this rules document so the principle is preserved for future Codex development.
- If the `QAP:` instruction replaces or corrects an older rule, revise the older rule so this document remains current and non-contradictory.

## QAP Hard Rule: Sensible Pre-Amendment Edge Access Gate

Before making any amendment that can affect the rendered site, user-facing behaviour, layout, styling, routing, navigation, browser interactions, build output or public content, first confirm that the affected site area can be opened and interacted with in Microsoft Edge.

This is mandatory for site-affecting work. Do not make user-facing code changes first and then discover later that browser testing is unavailable.

The Edge pre-amendment gate is not required for amendments that cannot affect the rendered site, such as updating developer-only documentation, handover notes, troubleshooting logs, internal checklists or code comments that do not alter output. For those tasks, state that Edge pre-amendment QA is not applicable and explain why.

Pre-amendment check:

1. Start or confirm the local development server.
2. Open the affected page or route in Microsoft Edge.
3. Confirm the page renders.
4. Confirm Edge can physically interact with the page where relevant, including scrolling, clicking buttons, opening and closing modals, using navigation, checking breadcrumbs, and resizing or testing responsive widths.
5. Only after this Edge access check passes may the site-affecting code be amended.

If Edge cannot be opened, controlled or used for visual and physical testing during a site-affecting task:

1. Stop immediately.
2. Do not amend the site-affecting code.
3. Tell the user clearly: "I cannot begin this amendment because I cannot complete the required Edge browser access check."
4. Explain what failed.
5. State that no user-facing QA can be completed until Edge browser access is restored.
6. Ask the user how they want to proceed.

Banned practice when Edge QA applies:

- Do not infer that something works from code alone.
- Checking source code is not a substitute for Edge user testing.
- Checking compiled CSS is not a substitute for Edge user testing.
- Checking that `position: sticky` exists is not a substitute for Edge user testing.
- Checking that HTML elements exist is not a substitute for Edge user testing.
- Running `npm run build` is not a substitute for Edge user testing.
- Checking that a route returns `200` is not a substitute for Edge user testing.
- Reading the DOM only is not a substitute for Edge user testing.
- Relying on screenshots without interaction is not a substitute for Edge user testing.
- Assuming behaviour from CSS rules is not a substitute for Edge user testing.
- Do not say "this should work" without proving it in Edge.

Those checks can support development, but they do not prove user-facing behaviour.

Post-amendment QA:

- After every site-affecting update, use Edge to visually and physically test the areas affected by the amendment.
- For user-facing changes, test as a user would: scroll the page, click buttons, follow navigation, check visible text, check contrast, check spacing, check desktop layout, check tablet layout, check mobile layout, and confirm there are no obvious regressions.
- Code and build checks may support QA, but they do not replace Edge visual and physical QA.
- If Edge testing was required but not completed, do not say the task is complete.
- Use this wording when browser testing fails: "Code/build may have been checked, but Edge visual/physical QA was not completed, so the user-facing behaviour is not proven."

Required status reporting at the end of every task:

1. Edge pre-amendment access check: passed/failed/not applicable.
2. Code/build check: passed/failed/not applicable.
3. Edge post-amendment visual QA: passed/failed/not applicable.
4. Edge physical interaction QA: passed/failed/not applicable.
5. Desktop/tablet/mobile check: passed/failed/not applicable.
6. Any known limitations.

Temporary browser-control limitation:

- Microsoft Edge is the required browser for site testing. Do not use Chrome as the default QA browser.
- If Edge can render pages for visual QA but cannot prove pointer-click interaction because the browser-control layer is failing, visual browser QA is temporarily acceptable only when the user explicitly allows it for the task.
- In that situation, still complete visual checks for rendering, spacing, contrast, overflow and responsive layout before and after amendments.
- Do not claim physical interaction QA passed unless clicks, navigation and relevant controls were actually proven in the browser.
- Report the limitation clearly in the final status.
- Record repeat browser-control failures and recovery attempts in `docs/dev/TROUBLESHOOTING.md`.

## Troubleshooting Log Standard

- When a development, build, server, browser-control, QA or tooling error is discovered, update `docs/dev/TROUBLESHOOTING.md` before finishing the task.
- Record the visible symptom, the exact or likely cause, the affected command or workflow, the working solution or workaround, and any remaining limitation.
- If the first diagnosis was wrong or incomplete, revise the existing troubleshooting entry so future Codex sessions see the current truth rather than a stack of conflicting notes.
- Do not leave solved environment problems as unexplained errors in handover notes. Add the solution to the troubleshooting log so the next Codex can recover quickly.

## Project Boundaries

- `app` is the old working site and the reference source for content, behaviours and teaching intent.
- New rebuild work must happen inside `astro-site`.
- Do not edit, restructure, rename or rebuild anything inside `app` unless the user explicitly asks for that.
- Do not migrate the whole old site in one step. Migrate gradually and safely.
- Before migrating an old page, inspect the relevant files in `app`, identify what the page teaches, then rebuild the useful content and behaviour in `astro-site`.

## End-User Content Only

- Rendered site pages must contain only content relevant to teachers or other end users.
- Do not show developer instructions, build status, migration status, implementation notes, "foundation" labels, "placeholder" labels, framework names, or Codex-facing commentary in the site UI.
- Rendered site copy must avoid third-person "student" or "students" wording. Use direct "you" wording or neutral phrasing instead.
- The Dev dashboard is the exception for reusable module approval and QA. It may use layout, card and component names because it is an intentional development route, not a migrated student lesson.
- Dev dashboard pages must not render Codex-facing review notes, checklists, implementation notes or "comments" panels as visible UI. Keep that guidance in source code comments, QA documents or development logs instead.
- Development notes belong in `astro-site/DEVELOPMENT_LOG.md`, this rules document, README files, or code comments where appropriate.
- Code comments are allowed when they help future maintainers understand non-obvious implementation details.
- User-facing writing should use UK English and be clear, direct and concise.

## Non-Lesson Page Design

- This rule applies to dashboards, course pages, topic index pages, unit pages, landing pages and navigation pages.
- Non-lesson pages help users get somewhere; lesson pages help users learn something.
- Keep non-lesson pages clean, simple, direct and easy to scan.
- Focus dashboards and index pages on clear headings, unit/topic grouping, topic cards or rows, direct resource buttons, clean navigation and restrained status labels where needed.
- Do not add instructional content unless there is a genuine usability issue that cannot be solved through clearer layout.
- Avoid "how to use this page" panels, revision flow boxes, decorative learning steps, unnecessary badges, duplicated headings, dashboard gadgets, multiple competing call-to-action buttons, feature cards, long explanatory text and side panels that distract from the topic list.
- Non-lesson pages should feel like a well-organised contents page, not a lesson page, marketing page or worksheet.
- Before adding an element to a non-lesson page, check whether it helps users navigate faster, removes confusion or shows important resource status. If it does not, leave it out.
- Avoid redundant labelling that repeats information already supplied by a nearby heading or page structure.
- Repeated metadata on cards creates visual noise, weakens scanability and competes with the important topic titles.
- Use purposeful labelling only where it adds clarity; prefer clean, minimal, uncluttered cards with a clear information hierarchy.

## Lesson Model

- Lessons must use a single-page lesson model, not separate slide routes.
- A lesson page should contain multiple lesson sections on one route.
- The left lesson navigation should jump between sections on that same page.
- The left lesson navigation is for lesson slides or section movement only; general lesson tools belong in the shared lesson header tool pad.
- Normal migrated lessons should use student-facing teaching slide titles in the lesson navigation. The Dev dashboard may use reusable layout, card and component names so modules can be agreed before full lesson migration.
- On desktop, lesson slides navigation should remain visible while lesson content scrolls, using the shared sticky sidebar shell.
- Long desktop lesson slide navigation must scroll inside the sidebar panel while the sidebar itself remains sticky.
- When a lesson slide list is longer than the visible panel, wheel scrolling over the list must move the list itself until it reaches a boundary, not make the page scroll away unexpectedly.
- On tablet and mobile, lesson slides navigation should remain clear and usable without covering or squeezing the lesson content.
- Open tablet/mobile lesson navigation must stay within the visible viewport and scroll internally when the slide list is long.
- On tablet and mobile, lesson slides navigation should collapse after a slide link is selected so the chosen slide is not obscured by the navigation panel.
- On tablet and mobile, selecting a lesson slide link must land the slide heading below the sticky header and collapsed navigation summary.
- Lesson headers should keep the back action in the far-left corner, the course/topic identity centred, and the tools control tucked into the far-right corner.
- Do not use a small course badge in the lesson header unless it provides a clear functional benefit.
- Do not show inactive, decorative or placeholder tools. Add a tool only when it performs a real useful action.
- Lesson navigation targets must land on a complete teaching canvas where the main cards and full-width support card are visible as a core design feature.
- Lesson section titles must display their slide number as part of the title text, using the format `6. Multiple choice question`.
- Keep lesson data headings clean and unnumbered where possible; add slide numbering through the shared lesson rendering layer so the standard is consistent across lessons.
- Lesson navigation must reflect the currently visible slide as the user scrolls or follows a slide link.
- The active lesson navigation item must use `aria-current="location"` and should remain visible inside the desktop sidebar where practical.
- Use shared lesson CSS standards for section scroll offset, card sizing, spacing and responsive behaviour. Do not fix lesson-canvas issues with one-off page tweaks.
- For the lesson navigation issue, do not amend sticky or sidebar code until the Edge pre-amendment access check has passed.
- Before amending sticky or sidebar code, prove that Edge can open the lesson page and scroll the existing page.
- After fixing lesson navigation, physically scroll through the lesson in Edge and confirm that the lesson navigation remains visible while scrolling, the `Back to topics` button text is visible, the sidebar does not overlap the lesson content, the page does not create awkward double scrollbars, and the layout works on desktop, tablet and mobile widths.
- If those Edge tests cannot be performed, stop and raise it with the user before making changes.

## Lesson Layout Design

- Treat lesson design as layered: the lesson slide is the numbered section, the slide canvas is the available teaching area, the slide layout is the reusable arrangement inside that canvas, and reusable components are the cards, visuals, questions or activities placed inside the layout.
- Use this naming standard: `Layout` means a whole slide pattern, `Card` means a reusable block inside a layout, and `Component` means a smaller reusable part inside a card or layout.
- Card names must be one clear thing and must not use slash-separated names. Use names such as `Explanation card`, `Diagram card`, `Table card`, `Support card` and `Summary card`.
- Answer cards and mark scheme cards should use a green theme so correct answers, model answers and assessment guidance are visually distinct from general teaching cards.
- Dev dashboard layout pages are draft review routes until the user has reviewed and amended or accepted them. Do not treat a draft route as an approved teaching layout just because the route exists.
- The standard numbered lesson slide shell is the default outer wrapper for lesson slides. It owns the section ID, scroll target, section label, generated slide number, title rendering, slide canvas spacing and responsive scroll behaviour.
- The standard numbered lesson slide shell must not decide the inner teaching layout, the cards used by that layout, topic-specific content, diagrams or activity behaviour.
- Do not force every lesson slide into the same two-column layout. Choose an agreed reusable slide layout that fits the teaching purpose.
- Use the improved two-column teaching layout where appropriate.
- The two-column teaching with support layout is a whole-slide layout. It owns the arrangement of two balanced main areas with one full-width support area beneath them.
- The two-column teaching with support layout must not define the final card designs inside those areas. Teaching, diagram, question and support cards should still be agreed as separate card modules.
- Lesson layouts must use available card modules rather than one-off card markup. If a needed card has not been created or agreed, create and review that card first before treating the layout as approved.
- The Dev dashboard Cards list is the source of visible available card modules. Layout routes should import those card components so future developers can trace which card a layout is using.
- Dev dashboard card examples must be concrete, not empty placeholders. Table card examples must contain a real table, Diagram card examples must contain a real diagram, Image card examples must use a real JPG or PNG asset, and activity-like cards must show their actual expected structure.
- On desktop, the usual sequence is:
  - section label
  - large section heading
  - two balanced main cards
  - left explanation card
  - right diagram, model, table or interactive card
  - full-width support card underneath
- The two main cards should feel balanced in visual weight and spacing.
- Diagram/model cards should be self-contained, with a heading, readable visual area and prompt.
- Do not use repeated generic confirmation icons, such as identical "OK" bullets, as the default teaching pattern across lesson sections.
- Do not repeat the same diagram structure across pages unless the content genuinely uses the same model.
- Lesson cards should vary by teaching purpose: explanation, list, process, table, term grid, check question, model or support prompt as appropriate.
- Support cards should reinforce, question or extend learning, and should span the main content width under the two cards.
- Avoid narrow central lesson content on desktop when there is useful horizontal space available.

## Components and Styling

- Build reusable Astro components for repeated lesson, dashboard, navigation, resource and assessment patterns.
- Do not create one-off layouts for individual lessons unless there is a clear teaching reason.
- If a pattern appears more than once, create or extend a shared component.
- Do not use typed ASCII arrow sequences as visible UI arrows. Use shared SVG icon components for navigation arrows and CSS/SVG connectors for process flows.
- Do not use letters or placeholder text, such as `v`, to impersonate iconography. Use a proper icon, a native browser affordance, or no visual indicator.
- Use Tailwind CSS and shared CSS/component standards consistently.
- The site font must be Arial only. Do not add other font families, web fonts or fallback font stacks.
- Keep shared design decisions in shared components or shared CSS, not scattered through page-specific markup.
- Avoid page-specific CSS unless needed for a complex visual or model.
- The visual style should feel like a polished educational platform: clear hierarchy, readable spacing, accessible contrast, calm colours and consistent cards.

## QAP: Text Hierarchy In Cards

- Card text hierarchy must be checked visually, not only by reading the CSS.
- Body text, numbered-list text and command words must not overpower the card title or make the introductory sentence feel unrelated.
- Bold command words such as `Describe`, `Explain` and `Calculate` should use weight for emphasis, not a larger font size than the rest of the objective sentence.
- Number circles, badges and markers should support scanning. They must not feel like oversized buttons unless they are actually interactive controls.
- Avoid viewport-scaled font sizes for compact card text. Use stable rem sizes and responsive layout changes instead.
- Before accepting a card design, compare the rendered title, intro sentence, list text, bold text and markers as one hierarchy. If one layer shouts, rebalance the sizes before completion.

## Content and Migration Priorities

- GCSE Computer Science is the first priority.
- Rebuild GCSE structure from data or structured content, not hand-coded dashboard cards.
- Where available, use the relevant course specification to understand content requirements, vocabulary and exam expectations.
- If a specification is not already available locally, search online for it or ask the user to provide it.
- Do not use specification bullet-point order as the default lesson order. Specifications are often not written in the most student-friendly teaching sequence.
- Organise lesson content in the sequence that best supports student understanding and progression.
- When the user gives a topic/spec, first agree a logical set of lesson parts with the user before building detailed lesson content. This workflow is still being practised and should not be formalised into a separate final workflow document until the user is happy with it.
- After the GCSE foundation is stable, migrate BTEC content using tutorial-style components.
- BTEC pages should use tutorial patterns such as steps, code examples, expected output, checkpoints, common mistakes, tasks and extensions.
- Do not remove important teaching detail from the old site without a reason.
- Do not blindly copy old HTML. Preserve teaching value and rebuild the structure properly.

## Modelling and Interactivity

- Modelling-heavy pages must preserve their teaching value.
- Before migrating a modelling page, inspect the old page, JavaScript, selectors, data attributes, interactions and any D3 diagrams.
- Preserve important behaviours such as reveal buttons, steppers, trace tables, quizzes, modals and diagrams.
- Use local D3 where it improves learning.
- Use vanilla JavaScript for simple interactions.
- Only use React or Svelte islands for genuinely complex interactive components, and keep them isolated.

## Responsive and Accessibility Standards

- The site must work well on PC/laptop, tablet and mobile.
- Design responsively from the beginning rather than shrinking a desktop-only layout later.
- On mobile, lesson cards should stack cleanly and the lesson navigation should collapse into a usable compact control.
- Do not use tiny text, transform scaling or horizontal scrolling to force lesson content to fit.
- Diagrams, tables and modelling visuals must remain readable across device sizes.
- Use semantic HTML, real buttons for actions and links for navigation.
- Provide visible focus states and keyboard-accessible interactions.
- Do not rely only on colour to communicate correctness, status or meaning.

## Static Site and Technology Rules

- The rebuild should remain an Astro static site.
- Use Astro components, Tailwind CSS, TypeScript where useful and structured content/data.
- Do not turn the whole site into a React, Svelte or server-rendered app.
- Do not add PHP, Express, server-side Node, Python, Ruby or other traditional backend code.
- The site must build with `npm run build` and publish static output from `astro-site/dist`.
- GitHub Pages or Cloudflare Pages should build from `astro-site`.

## Future Accounts and Data Separation

- Supabase will be introduced later for student and staff accounts, but must not be connected until explicitly requested.
- Static lesson content belongs in files, content collections or structured data.
- Student and staff data must not be stored in lesson files.
- Future user data includes accounts, classes, memberships, lesson progress, quiz attempts, scores and completion tracking.
- Future account, progress and dashboard logic should be kept separate from static lesson content.
- Use adapter-style boundaries for progress and auth logic so local storage can be replaced later with Supabase cleanly.
- Never expose private credentials, service role keys or secret keys in front-end code.

## QA Expectations

- Run `npm run build` before completing implementation work that changes the Astro site.
- Check the relevant routes after UI work.
- For lesson changes, check desktop, tablet and mobile behaviour.
- Confirm lesson navigation, reveal interactions, quizzes, diagrams and models work after touching related code.
- Confirm rendered pages do not contain developer-only language.
- Keep `app` unchanged unless the user explicitly requested changes there.
