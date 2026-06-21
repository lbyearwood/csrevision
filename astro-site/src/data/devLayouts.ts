export type DevLayoutZone = {
  title: string;
  detail: string;
  span: "full" | "half" | "third" | "quarter";
};

export type DevLayoutDefinition = {
  title: string;
  slug: string;
  label: string;
  purpose: string;
  href: string;
  customRoute?: boolean;
  zones: DevLayoutZone[];
  reviewPoints: string[];
  dependencies: string[];
};

const layoutHref = (slug: string) => `/dev-dashboard/layouts/${slug}/`;

export const devLayoutDefinitions: DevLayoutDefinition[] = [
  {
    title: "Standard numbered lesson slide shell",
    slug: "standard-numbered-lesson-slide-shell",
    label: "Slide shell",
    purpose: "The default outer wrapper for every numbered lesson slide.",
    href: layoutHref("standard-numbered-lesson-slide-shell"),
    customRoute: true,
    zones: [],
    reviewPoints: [],
    dependencies: [],
  },
  {
    title: "Two-column teaching with support",
    slug: "two-column-teaching-with-support",
    label: "Two-column",
    purpose: "Two balanced main areas with a full-width support area underneath.",
    href: layoutHref("two-column-teaching-with-support"),
    customRoute: true,
    zones: [],
    reviewPoints: [],
    dependencies: [],
  },
  {
    title: "Two-column teaching without support",
    slug: "two-column-teaching-without-support",
    label: "Two-column",
    purpose: "Two balanced main areas where the slide does not need a separate support area.",
    href: layoutHref("two-column-teaching-without-support"),
    zones: [
      { title: "Left main area", detail: "Primary teaching, explanation or setup.", span: "half" },
      { title: "Right main area", detail: "Visual, model, comparison, question or second teaching block.", span: "half" },
    ],
    reviewPoints: [
      "Both areas should feel balanced on desktop.",
      "The layout should not force a support prompt when the slide does not need one.",
      "Long content should move to another layout.",
    ],
    dependencies: ["Explanation card", "Diagram card", "Question card"],
  },
  {
    title: "Single teaching card",
    slug: "single-teaching-card",
    label: "Single card",
    purpose: "One central teaching block for a focused explanation or short concept.",
    href: layoutHref("single-teaching-card"),
    zones: [
      { title: "Main teaching area", detail: "One dominant explanation, prompt or worked idea.", span: "full" },
    ],
    reviewPoints: [
      "The slide should feel focused rather than empty.",
      "The main area should not become too wide for comfortable reading.",
      "This layout should be used when one idea is enough.",
    ],
    dependencies: ["Explanation card", "Prompt card"],
  },
  {
    title: "Full-width visual/title",
    slug: "full-width-visual-title",
    label: "Visual",
    purpose: "A title-led slide where a large visual carries the teaching focus.",
    href: layoutHref("full-width-visual-title"),
    zones: [
      { title: "Title focus", detail: "Short slide title and label from the shared shell.", span: "full" },
      { title: "Full-width visual area", detail: "Large image, diagram, model or visual explanation.", span: "full" },
    ],
    reviewPoints: [
      "The visual should be the main learning signal.",
      "The slide should not need a separate explanation card.",
      "The visual must remain readable on mobile.",
    ],
    dependencies: ["Image card", "Diagram component", "Accessible visual label"],
  },
  {
    title: "Full-width visual with prompt",
    slug: "full-width-visual-with-prompt",
    label: "Visual",
    purpose: "A large visual area with one prompt underneath or beside the visual.",
    href: layoutHref("full-width-visual-with-prompt"),
    zones: [
      { title: "Full-width visual area", detail: "Large teaching visual or model.", span: "full" },
      { title: "Prompt area", detail: "A short question, instruction or noticing prompt.", span: "full" },
    ],
    reviewPoints: [
      "The prompt should direct attention without becoming a worksheet.",
      "The visual must not be cropped in a way that hides the teaching point.",
      "Prompt and visual should stack cleanly.",
    ],
    dependencies: ["Image card", "Diagram card", "Prompt card"],
  },
  {
    title: "Comparison/table",
    slug: "comparison-table",
    label: "Compare",
    purpose: "A whole-slide layout for comparing two or more ideas clearly.",
    href: layoutHref("comparison-table"),
    zones: [
      { title: "Comparison heading area", detail: "Names what is being compared.", span: "full" },
      { title: "Table or comparison area", detail: "Rows, columns or paired comparison blocks.", span: "full" },
      { title: "Key takeaway area", detail: "One concise summary of the comparison.", span: "full" },
    ],
    reviewPoints: [
      "The comparison should be easier to scan than paragraphs.",
      "Columns must remain readable on smaller screens.",
      "The takeaway should not repeat the table.",
    ],
    dependencies: ["Table card"],
  },
  {
    title: "Process/sequence",
    slug: "process-sequence",
    label: "Sequence",
    purpose: "A whole-slide layout for ordered steps, cycles or flows.",
    href: layoutHref("process-sequence"),
    zones: [
      { title: "Step 1", detail: "First stage or state.", span: "quarter" },
      { title: "Step 2", detail: "Second stage or state.", span: "quarter" },
      { title: "Step 3", detail: "Third stage or state.", span: "quarter" },
      { title: "Step 4", detail: "Optional final stage or outcome.", span: "quarter" },
      { title: "Process prompt", detail: "Question or check that uses the sequence.", span: "full" },
    ],
    reviewPoints: [
      "Order must be clear without typed ASCII arrows.",
      "Mobile stacking should preserve the step order.",
      "The prompt should check the process, not distract from it.",
    ],
    dependencies: ["Step connector", "Flow connector", "Process diagram component"],
  },
  {
    title: "Vocabulary/key terms",
    slug: "vocabulary-key-terms",
    label: "Vocabulary",
    purpose: "A layout for teaching related terms, definitions and distinctions.",
    href: layoutHref("vocabulary-key-terms"),
    zones: [
      { title: "Term area 1", detail: "Key term and definition.", span: "third" },
      { title: "Term area 2", detail: "Key term and definition.", span: "third" },
      { title: "Term area 3", detail: "Key term and definition.", span: "third" },
      { title: "Usage prompt", detail: "Short prompt to use the terms accurately.", span: "full" },
    ],
    reviewPoints: [
      "Definitions should be short and accurate.",
      "The layout should avoid a wall of terms.",
      "A usage prompt should help apply vocabulary.",
    ],
    dependencies: ["Vocabulary card", "Label badge", "Prompt card"],
  },
  {
    title: "Question/check",
    slug: "question-check",
    label: "Check",
    purpose: "A whole-slide check for understanding before moving on.",
    href: layoutHref("question-check"),
    zones: [
      { title: "Question area", detail: "The main check question or prompt.", span: "full" },
      { title: "Answer area", detail: "Space for options, written response or reveal later.", span: "half" },
      { title: "Feedback area", detail: "Correct, incorrect or model-answer feedback.", span: "half" },
    ],
    reviewPoints: [
      "The question should be visually dominant.",
      "Feedback must be useful, not decorative.",
      "The activity state should be accessible.",
    ],
    dependencies: ["Question card", "Feedback state", "Reveal button"],
  },
  {
    title: "Activity",
    slug: "activity",
    label: "Activity",
    purpose: "A flexible whole-slide layout for one focused action.",
    href: layoutHref("activity"),
    zones: [
      { title: "Instruction area", detail: "Short task instruction.", span: "full" },
      { title: "Activity area", detail: "Interactive or paper-based task space.", span: "full" },
      { title: "Feedback/control area", detail: "Check, reset, reveal or feedback controls.", span: "full" },
    ],
    reviewPoints: [
      "The activity should have one clear action.",
      "Controls must be real and usable.",
      "The layout should not become a mini worksheet unless needed.",
    ],
    dependencies: ["Instruction card", "Reset button", "Feedback state"],
  },
  {
    title: "Summary/recap",
    slug: "summary-recap",
    label: "Recap",
    purpose: "A whole-slide layout for consolidating the main learning points.",
    href: layoutHref("summary-recap"),
    zones: [
      { title: "Recap area", detail: "Three to five key points.", span: "full" },
      { title: "Check area", detail: "Short recall or confidence check.", span: "full" },
    ],
    reviewPoints: [
      "The recap should be concise.",
      "It should not duplicate a dashboard or navigation page.",
      "The check should reinforce the lesson goal.",
    ],
    dependencies: ["Summary card", "Question card"],
  },
  {
    title: "Apply-it scenario",
    slug: "apply-it-scenario",
    label: "Apply",
    purpose: "A layout for applying a concept to a short scenario.",
    href: layoutHref("apply-it-scenario"),
    zones: [
      { title: "Scenario area", detail: "Short situation, system or problem context.", span: "half" },
      { title: "Apply area", detail: "Question or decision based on the scenario.", span: "half" },
      { title: "Reasoning area", detail: "Prompt for explanation or justification.", span: "full" },
    ],
    reviewPoints: [
      "The scenario should be short enough to scan.",
      "The task should require application, not copying.",
      "The reasoning area should make the expected thinking clear.",
    ],
    dependencies: ["Scenario card", "Prompt card", "Feedback card"],
  },
  {
    title: "Minimal title/image",
    slug: "minimal-title-image",
    label: "Minimal",
    purpose: "A sparse slide with a title and one visual for teacher-led explanation.",
    href: layoutHref("minimal-title-image"),
    zones: [
      { title: "Title area", detail: "The numbered shell title carries most of the text.", span: "full" },
      { title: "Image area", detail: "One large image or visual object.", span: "full" },
    ],
    reviewPoints: [
      "This should be visually calm and sparse.",
      "The image must carry a clear teaching purpose.",
      "Avoid adding extra panels just to fill space.",
    ],
    dependencies: ["Image card", "Accessible image text"],
  },
  {
    title: "End-of-lesson next steps",
    slug: "end-of-lesson-next-steps",
    label: "Next steps",
    purpose: "A closing slide that points to the next useful action.",
    href: layoutHref("end-of-lesson-next-steps"),
    zones: [
      { title: "Lesson recap", detail: "Very short summary of what was covered.", span: "full" },
      { title: "Next resource", detail: "Direct route to quiz, exam or task when available.", span: "half" },
      { title: "Review prompt", detail: "One useful review question or action.", span: "half" },
    ],
    reviewPoints: [
      "The slide should not become a dashboard.",
      "Next actions should be limited and useful.",
      "Links should reflect actual available resources.",
    ],
    dependencies: ["Resource button", "Summary card"],
  },
  {
    title: "Match activity",
    slug: "match-activity",
    label: "Match",
    purpose: "A whole-slide matching activity for terms, roles, examples or definitions.",
    href: layoutHref("match-activity"),
    zones: [
      { title: "Left set", detail: "Terms, prompts or source items.", span: "half" },
      { title: "Right set", detail: "Definitions, examples or target items.", span: "half" },
      { title: "Feedback area", detail: "Match status, reset and check controls.", span: "full" },
    ],
    reviewPoints: [
      "The matching pattern should work with keyboard and pointer.",
      "Click-to-match may be better than drag-and-drop.",
      "Feedback should identify the problem, not just mark wrong.",
    ],
    dependencies: ["Matching area card", "Feedback state", "Reset button"],
  },
  {
    title: "Hinge question",
    slug: "hinge-question",
    label: "Hinge",
    purpose: "A decision-point question used to check whether the lesson can move on.",
    href: layoutHref("hinge-question"),
    zones: [
      { title: "Question stem", detail: "One diagnostic question.", span: "full" },
      { title: "Option A", detail: "Possible answer or misconception.", span: "quarter" },
      { title: "Option B", detail: "Possible answer or misconception.", span: "quarter" },
      { title: "Option C", detail: "Possible answer or misconception.", span: "quarter" },
      { title: "Option D", detail: "Possible answer or misconception.", span: "quarter" },
      { title: "Teaching decision", detail: "Feedback that informs the next teaching move.", span: "full" },
    ],
    reviewPoints: [
      "Each option should reveal something useful.",
      "Feedback should support the teacher decision.",
      "The layout should be quick to use mid-lesson.",
    ],
    dependencies: ["Multiple-choice option", "Feedback state"],
  },
  {
    title: "Misconception check",
    slug: "misconception-check",
    label: "Misconception",
    purpose: "A whole-slide layout for surfacing and correcting a common mistake.",
    href: layoutHref("misconception-check"),
    zones: [
      { title: "Misconception", detail: "The incorrect idea stated clearly.", span: "half" },
      { title: "Correction", detail: "The accurate idea and why it matters.", span: "half" },
      { title: "Check prompt", detail: "Short prompt that tests the corrected understanding.", span: "full" },
    ],
    reviewPoints: [
      "The tone should support learning rather than blame.",
      "The correction should be direct.",
      "The check should confirm the misconception has been repaired.",
    ],
    dependencies: ["Misconception card", "Question card"],
  },
  {
    title: "Exam practice",
    slug: "exam-practice",
    label: "Exam",
    purpose: "A whole-slide layout for one exam-style question inside a lesson.",
    href: layoutHref("exam-practice"),
    zones: [
      { title: "Question area", detail: "Command word, marks and question wording.", span: "full" },
      { title: "Planning area", detail: "Optional space for bullet planning or hints.", span: "half" },
      { title: "Mark scheme area", detail: "Revealable mark points or model answer.", span: "half" },
    ],
    reviewPoints: [
      "Marks and command words should be visible.",
      "The mark scheme should not be shown too early.",
      "This should not replace the separate Exam resource.",
    ],
    dependencies: ["Exam-practice card", "Mark scheme reveal"],
  },
  {
    title: "Teacher-led discussion",
    slug: "teacher-led-discussion",
    label: "Discuss",
    purpose: "A layout for a teacher-led question, comparison or debate.",
    href: layoutHref("teacher-led-discussion"),
    zones: [
      { title: "Discussion prompt", detail: "The main question or statement.", span: "full" },
      { title: "Prompt support", detail: "Optional sentence starters or points to consider.", span: "full" },
    ],
    reviewPoints: [
      "The prompt should be strong enough to drive discussion.",
      "Support should not over-script the conversation.",
      "The slide should stay uncluttered.",
    ],
    dependencies: ["Prompt card", "Discussion support component"],
  },
  {
    title: "Interactive model",
    slug: "interactive-model",
    label: "Model",
    purpose: "A layout for a visual or interactive model with previous step, next step and reset controls.",
    href: layoutHref("interactive-model"),
    zones: [
      { title: "Model area", detail: "Large visual, simulation or interactive diagram.", span: "full" },
    ],
    reviewPoints: [
      "The model should preserve the teaching value of the old page.",
      "Controls must be usable on mobile.",
      "The model should not be flattened into static text when interaction matters.",
    ],
    dependencies: ["Interactive model component", "Reset button", "Feedback state"],
  },
];

export const draftDevLayoutDefinitions = devLayoutDefinitions.filter((layout) => !layout.customRoute);
