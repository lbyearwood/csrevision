## **Main objective(s)**

CS Revision site is a teaching, revision and assessment platform for Computer Science, ICT and digital courses.

The site must support the delivery of GCSE Computer Science, BTEC IT, Creative iMedia and KS3 Computing through clear teaching slides, classroom tasks, exam-style questions, assessment-style questions and quizzes. It must be suitable for use on a classroom board, by a teacher during live instruction, and by students for revision or independent practice.

The site must prioritise:

* Accurate subject content.

* Clear lesson structure.

* Consistent design.

* Low cognitive load.

* Reliable classroom use.

* Fast navigation.

* Reusable components.

* Maintainable code.

The site must not become a collection of disconnected pages with different layouts, different button labels, different styling or different interaction patterns.

## 

## **Single source of truth rule(s)**

This README is the single live developer instruction document for the site.

Do not follow older design documents, previous README versions, old template names, old page patterns or earlier Codex-generated conventions if they conflict with this README.

Do not update this README unless the user explicitly asks for the README to be reviewed and updated.

If a change seems necessary, complete the requested development task first, then report the recommended README change to the user.

The live source of truth for GCSE topic structure must remain the relevant topic data file in the site. Do not manually duplicate complete topic structures inside this README.

The live source of truth for approved templates is:

`slide-wire-frames.pdf`

Do not hard-code individual template filenames into this README as the permanent template list. Template names may change as the design system improves.

## 

## **Repository inspection rule(s)**

Before editing, inspect the current repository. Do not rely on memory, assumptions or older versions of the project.

Before editing a page or module, inspect:

* The target file.

* The relevant route or topic data file.

* The relevant shared CSS file.

* The relevant shared JavaScript module.

* At least one working page of the same resource type.

Do not guess where files are. Inspect the repository and use the existing folder structure.

Do not create duplicate folders or duplicate systems if an existing system already handles the same responsibility.

## 

## **Input rule(s)**

1. When the user gives a direct instruction, follow the instruction precisely.

2. If the user specifies a topic, resource type or template, use that exact requirement unless it conflicts with this README.

3. If the user gives a screenshot, compare the screenshot against the relevant live page or template and identify the actual layout or interaction issue before changing code.

4. If the user asks for a site-wide fix, search the site for every affected pattern before editing. Do not fix only the visible example.

5. If the user asks for a template update, update the template only unless they explicitly ask for live pages to be updated as well.

6. If the user asks for a live page update, do not treat a standalone template as the final implementation.

## 

## **Content rule(s)**

1. All Computer Science, ICT and digital course content must be accurate, age-appropriate and aligned with the relevant course or specification.

2. GCSE Computer Science content must be aligned with OCR J277 GCSE Computer Science.

3. BTEC IT and Creative iMedia content must be aligned with the relevant assignment, unit, component or assessment requirement.

4. KS3 Computing content must be clear, age-appropriate and suitable for building progression into KS4.

5. Content must be specific to the topic or subtopic. Do not use generic filler text or generic repeated tasks across multiple topics.

6. Lessons must be structured as a sequence of teachable parts. Each part must have a clear teaching purpose.

7. Tasks must consolidate the learning from the matching lesson section. Tasks should require students to think, apply, explain, calculate, trace, match, complete, compare or correct.

8. Exam pages must use OCR-style wording where they relate to GCSE Computer Science.

9. Assessment-style pages for BTEC, Creative iMedia or KS3 must match the purpose of the course and assessment model.

10. Quizzes must include a suitable mix of activity types. Avoid excessive multiple choice unless the topic genuinely suits it.

11. When creating programming content, remember that students may answer using OCR Exam Reference Language or a high-level programming language they have studied, where the exam context allows it.

12. Do not include content outside the relevant course or specification unless it is clearly marked as enrichment and the user has asked for it.

13. Do not ask students about topics excluded from OCR J277 when creating GCSE Computer Science content.

## 

## **Language rule(s)**

1. Use UK English spelling throughout the site.

2. Use `program` when referring to a computer program.

3. Use clear, direct, student-friendly language.

4. Student-facing text should speak directly to the student using `you` and `your` where appropriate.

5. Avoid unnecessary jargon. Where technical vocabulary is required, introduce it clearly and use it consistently.

6. Use OCR-style terminology where appropriate, especially for GCSE exam pages and programming content.

7. Use `=` in OCR-style pseudocode, not an assignment arrow.

8. Avoid the long dash character in paragraphs.

## 

## **Resource model rule(s)**

1. Each GCSE subtopic should use the same resource model:

   1. **Lesson | Tasks | Exam | Quiz**

   2. The order must be exactly:

      1. Lesson

      2. Tasks

      3. Exam

      4. Quiz

2. Do not use older labels such as Learn, Worksheet, Q\&A or other alternatives unless the user explicitly asks for a different label.

3. Each resource type has a distinct purpose.

   1. ### **Lesson**

      1. The Lesson is used for teacher-led explanation, modelling, questioning and demonstration. It should be suitable for display on a classroom board.

   2. ### **Tasks**

      1. Tasks are used by students to consolidate learning. They should be suitable for copying into books or completing as directed by the teacher.

   3. ### **Exam**

      1. Exam pages are used for OCR-style exam practice or assessment-style practice where appropriate. They should include questions and mark schemes.

   4. ### **Quiz**

      1. Quiz pages are used for quick checks, retrieval practice and interactive self-marking where possible.

## 

## **Resource readiness rule(s)**

1. A file existing does not mean the resource is ready.

2. Use readiness states rather than simple true/false thinking.

3. **Recommended states:**

   1. `ready`

   2. `placeholder`

   3. `missing`

4. A resource is ready only when it contains topic-specific, usable content and follows the correct design, layout and interaction rules.

5. A resource is placeholder when the route exists but the content is generic, incomplete, says coming soon, or does not properly teach or assess the topic.

6. A resource is missing when the expected file or route does not exist.

7. Do not mark placeholder resources as ready.

8. Dashboard status must not mislead the teacher. If a page exists but is not instructionally usable, show or store it as placeholder.

   ## 

## **Template rule(s)**

1. The root folder for approved templates is:

   1. `app/slide-wire-frames.pdf`

2. If the user specifies a template, use that template.

3. If the user does not specify a template, search the `app/slide-wire-frames.pdf` file and select the best match based on the learning purpose.

4. Template choice should be based on purpose:

| Learning purpose | Template choice should be based on |
| ----- | ----- |
| Introducing a concept | A lesson introduction or hook-style template |
| Explaining a key idea | A key teaching, explanation or diagram-based template |
| Modelling a calculation | A calculation walkthrough template |
| Modelling code or pseudocode | A pseudocode or code walkthrough template |
| Tracing an algorithm | A trace table or dry-run template |
| Showing a process | A process walkthrough template |
| Showing a diagram | A centre diagram, labelled diagram or side-diagram template |
| Asking a diagnostic question | A hinge point, AFL or question-card template |
| Embedding external content | An embed template for video, slides, docs, sheets or PDF |
| Creating an interactive activity | A drag-and-drop, fill-in-the-blank, matching, ordering or quiz-style template |

Inspect the chosen template before editing. Preserve its intended layout, interaction pattern and teaching purpose.

Do not create a new layout from scratch unless:

1. No existing template fits the required learning purpose.

2. The user explicitly asks for a new template.

3. You explain why no existing template is suitable.

## 

## **Layout and structure rule(s)**

1. Lessons must use a full-screen lesson shell suitable for classroom teaching.

2. The left panel must remain consistent across lessons and should contain:

   1. Lesson title.

   2. Lesson navigation.

   3. Lesson tools.

   4. Teacher tools.

   5. Back to topics button.

3. Lesson navigation, lesson tools and teacher tools should be expandable and collapsible.

4. The lesson content area must use the available screen width effectively.

5. Do not overcrowd slides. One slide should have one clear teaching purpose.

6. Avoid placing too much text, too many diagrams or too many activities on a single slide.

7. If a concept needs several steps, split it into several lesson parts or use a walkthrough template.

8. Navigation buttons should be consistent. Use clear previous and next controls.

9. Do not place controls where they clash with lesson navigation or slide navigation.

10. Do not use horizontal rules.

## 

## **Styling rule(s)**

1. The visual style must remain consistent across the site.

2. Use clear contrast, readable spacing and board-readable text sizes.

3. Teacher-facing tools should be visually distinct from student-facing content.

4. Use cards, panels and spacing consistently.

5. Do not introduce a new colour palette or visual style for a single page.

6. Do not use tiny text in classroom slides.

7. Do not allow diagrams, captions, explanation boxes or buttons to be cut off at the bottom of a slide.

8. Do not use decorative visuals that do not support the learning.

## **CSS ownership rule(s)**

1. Live pages should use shared CSS.

2. Do not add large internal CSS blocks to live lesson, task, exam or quiz pages.

3. Do not duplicate large CSS blocks across many pages.

4. Do not create page-specific CSS unless the design genuinely cannot be handled through existing component classes.

5. If a new reusable component is created, add its styling to the shared component CSS rather than embedding it in a live page.

## 

## **JavaScript architecture rule(s)**

1. `site.js` must remain a bootstrap file only.

2. `site.js` may detect page type, call initialisation functions and fail safely when optional modules are missing.

3. `site.js` must not contain:

   1. GCSE topic arrays.

   2. Dashboard rendering logic.

   3. Resource button definitions.

   4. Lesson shell construction.

   5. Left panel construction.

   6. Quiz marking logic.

   7. Drag-and-drop logic.

   8. Exam reveal logic.

   9. Task reveal logic.

   10. Teacher tool logic.

   11. D3 component logic.

4. Feature logic must live in named modules with clear responsibilities.

5. Use existing modules before creating new ones.

6. If a new feature is needed, create a focused module with a clear name and a single responsibility.

7. Do not create one large catch-all JavaScript file.

8. Do not duplicate the same behaviour across multiple scripts.

## 

## **Routing rule(s)**

1. Routes must be consistent and predictable.

2. Do not hard-code route lists manually when a route or topic data file already exists.

3. Resource buttons must route to the correct resource type:

   1. Lesson routes to lesson pages.

   2. Tasks routes to task pages.

   3. Exam routes to exam pages.

   4. Quiz routes to quiz pages.

4. When changing topic IDs, resource labels or folder paths, update all dependent route logic and test the affected dashboard links.

5. Do not leave dead links.

6. Do not use local absolute paths such as `C:/Users/...` in live files.

7. Do not use `file://` links in live files.

## 

## **Navigation rule(s)**

1. Lesson pages must have clear slide navigation.

2. The current lesson part must be visibly highlighted.

3. Back to topics must be available from the lesson shell.

4. Navigation must work with a local server, not only when opened directly as a file.

5. Avoid hidden or inconsistent navigation patterns.

## 

## **Diagram rule(s)**

1. Diagrams must support the teaching point.

2. Use diagrams when they make a concept easier to see, compare, trace or explain.

3. Diagram components should be labelled clearly.

4. If a diagram has arrows, the arrows should have labels where this improves clarity.

5. If a diagram is interactive, hovering or focusing a component should reveal useful information, not decorative text.

6. If the explanation changes based on hover or focus, the explanation must match the selected component.

7. Interactive diagrams must also support keyboard focus, not hover only.

8. For DFD-style diagrams, use only the agreed symbols if the user specifies a symbol set.

9. Do not let diagrams be cut off by the slide footer.

## 

## **Animation rule(s)**

1. Use animation to support understanding, not for decoration.

2. Animations are appropriate for:

   1. Sorting algorithms.

   2. Searching algorithms.

   3. Binary shifts.

   4. Binary addition.

   5. Trace tables.

   6. Network topologies.

   7. Data flow.

   8. CPU/fetch-execute cycle modelling.

   9. Memory and storage processes.

   10. Logic gate signal flow.

3. Animations should be controllable where needed.

4. Teacher-led animations should usually have Previous, Next and Reset controls.

5. Avoid animations that move too quickly for explanation.

6. Avoid excessive motion, flashing or distraction.

7. Respect reduced-motion preferences where practical.

## 

## **D3 rule(s)**

1. D3 is suitable when the component benefits from data-generated visuals, animated diagrams, trace tables, process flows or algorithm visualisations.

2. Use D3 for structured, data-driven diagrams and animations where it improves maintainability or clarity.

3. For production live lesson pages, use the local D3 file from the site assets, not a CDN.

4. The site should store D3 locally, for example:

5. `assets/vendor/d3/d3.min.js`

6. Standalone templates may include a CDN link for easy preview, but production pages must not depend on CDN access.

7. Do not use an unpinned D3 CDN version in templates.

8. If D3 fails to load, include a safe fallback message where appropriate.

9. D3 code should be data-driven. Store nodes, links, stages, rows or steps in arrays or objects so the component is easy to adapt.

## 

## **Accessibility rule(s)**

1. Interactive elements must be keyboard accessible where practical.

2. Hover-only behaviour is not enough for important learning content.

3. Buttons must be real buttons or accessible interactive elements.

4. Use clear focus states.

5. Do not rely on colour alone to communicate meaning.

6. Maintain readable contrast.

7. Use semantic headings in a logical order.

8. Images and diagrams should have appropriate labels, captions or explanatory text.

9. Avoid tiny text in SVGs and diagrams.

## 

## **Workflow rule(s)**

1. Before making changes:

   1. Inspect the relevant files.

   2. Inspect the relevant existing example.

   3. Inspect the template folder if a component or lesson is involved.

   4. Identify the correct shared CSS and JavaScript modules.

   5. Make the smallest coherent change that solves the issue.

   6. Test the affected page through the local server.

   7. Check for console errors.

   8. Check that the visual result matches the requested behaviour.

   9. Complete the QA and testing rules

2. Report what changed and any remaining risks.

3. For site-wide changes, search for every affected pattern before editing.

4. For repeated issues, fix the shared template or shared module rather than manually patching individual pages.

5. Do not claim a site-wide fix after only changing one example page.

## 

## **QA and testing rule(s)**

1. Before saying work is complete, perform relevant checks.

2. **Minimum checks for page changes:**

   1. Page loads through local server.

   2. No console errors.

   3. Required CSS loads.

   4. Required JavaScript loads.

   5. No missing local references.

   6. No `file://` or `C:/Users/...` references.

   7. Correct resource button labels.

   8. Correct navigation behaviour.

   9. Correct template or component pattern.

   10. No content cut off at common classroom screen sizes.

   11. No placeholder text unless the page is intentionally a placeholder.

3. **Minimum checks for JavaScript changes:**

   1. Run syntax checks where possible.

   2. Check affected pages in browser.

   3. Check that unrelated page types still load.

   4. Confirm `site.js` remains a bootstrap only.

   5. Confirm feature logic is in the correct module.

4. **Minimum checks for D3 changes:**

   1. D3 loads locally in production pages.

   2. Component has a fallback if appropriate.

   3. Animation works.

   4. Hover and keyboard focus work where required.

   5. Explanation text matches the selected component.

   6. No diagram content is cut off.

5. **Minimum checks for dashboard or routing changes:**

   1. GCSE dashboard loads.

   2. All topic rows render.

   3. Buttons appear in the correct order.

   4. Links route to the correct pages.

   5. Missing, placeholder and ready states are not confused.

## 

## **Output rule(s)**

1. When reporting changes to the user, be specific.

2. State:

   1. What was changed.

   2. Which files were changed.

   3. What was tested.

   4. Any issues found.

   5. Any work still needed.

3. Do not overclaim. If something was not browser-tested, say so.

4. Do not say a resource is ready if it is only a placeholder.

5. Do not say the site is fully fixed if only one route or example was checked.

   ## 

## **Mandatory rule(s)**

1. These rules are non-negotiable:

   1. Use UK English.

   2. Use **Lesson | Tasks | Exam | Quiz** in that exact order.

   3. Keep this README as the single live developer instruction document.

   4. Do not update this README unless the user explicitly asks.

   5. Inspect the repository before editing.

   6. Do not create new lesson layouts from scratch when an approved template can be used.

   7. Keep `site.js` as a bootstrap only.

   8. Use shared CSS and shared JavaScript for live pages.

   9. Use local D3 in production live pages.

   10. Do not mark placeholder resources as ready.

   11. Do not use CDN dependencies in production live pages unless the user explicitly accepts that risk.

   12. Do not use `file://` or `C:/Users/...` paths in live files.

   13. Do not use horizontal rules in site content.

   14. Do not overcrowd slides.

   15. Do not let diagrams or explanation panels be cut off.

   16. Test before claiming completion.

## 

## **Prohibitions**

1. Do not invent a new design system.

2. Do not create a new layout because it is quicker than finding the correct template.

3. Do not copy large internal CSS from templates into live pages.

4. Do not put all new JavaScript into `site.js`.

5. Do not duplicate topic lists manually in multiple files.

6. Do not leave old labels such as Learn, Worksheet or Q\&A when the required labels are Lesson, Tasks, Exam and Quiz.

7. Do not leave generic placeholder content in a resource marked as ready.

8. Do not use excessive multiple choice in quizzes where varied activity types would be better.

9. Do not use diagrams or animations as decoration only.

10. Do not use hover-only interactions for essential content.

11. Do not include content outside the relevant course or specification unless explicitly requested or clearly labelled as enrichment.

12. Do not update this README as part of ordinary development work.

