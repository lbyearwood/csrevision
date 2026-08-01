/* global document, localStorage, matchMedia, structuredClone */
import { markCategorisation, markExtendedResponse, markFillBlanks, markMatching, markMultipleSelect, markNumeric, markOrdering, markShortText, markSingleChoice, markSqlQuery, markStructuredFields } from './marking.mjs';

const questions = [
  {
    id: 'single-choice', label: 'Single choice', kind: 'single',
    prompt: 'Which component performs calculations and logical comparisons?', help: 'Choose one answer.',
    options: [['cpu', 'CPU'], ['ram', 'RAM'], ['hdd', 'Hard disk drive'], ['gpu', 'Graphics processing unit']],
    config: { correctAnswer: 'cpu', maxMarks: 1, successFeedback: 'Correct. The CPU executes instructions, including arithmetic and logic operations.', incorrectFeedback: 'Not quite. The CPU contains the arithmetic logic unit (ALU).' },
    strategy: 'Exact option match',
    contract: 'One option ID must exactly equal the configured correct option ID.',
    qa: ['Exactly one option can be selected.', 'No answer produces guidance, not a wrong mark.', 'Keyboard arrow keys work within the radio group.'],
  },
  {
    id: 'multiple-select', label: 'Multiple select', kind: 'multiple',
    prompt: 'Which two are examples of secondary storage?', help: 'Choose every answer that applies.',
    options: [['ssd', 'Solid-state drive'], ['ram', 'RAM'], ['hdd', 'Hard disk drive'], ['cache', 'Cache memory']],
    config: { correctAnswers: ['ssd', 'hdd'], maxMarks: 2, partialMarks: true, successFeedback: 'Correct. SSDs and hard disk drives both retain data when power is removed.', partialFeedback: 'Partly correct. Review which storage keeps data when power is removed.', incorrectFeedback: 'Not correct yet. Select only the non-volatile secondary storage devices.' },
    strategy: 'Set match with controlled partial credit',
    contract: 'Exact set = full marks. If enabled, each correct choice earns proportional credit and each incorrect choice cancels one correct choice.',
    qa: ['The number of required answers is stated.', 'Guessing every option cannot earn marks.', 'The AI must explicitly configure whether partial marking is allowed.'],
  },
  {
    id: 'true-false', label: 'True / false', kind: 'boolean',
    prompt: 'A Boolean variable can store only True or False.', help: 'Decide whether the statement is true or false.',
    options: [['true', 'True'], ['false', 'False']],
    config: { correctAnswer: 'true', maxMarks: 1, successFeedback: 'Correct. Boolean data has two possible states: True and False.', incorrectFeedback: 'Not quite. A Boolean value represents one of two states.' },
    strategy: 'Exact Boolean match',
    contract: 'The selected Boolean value must exactly equal the configured answer.',
    qa: ['The statement avoids ambiguous qualifiers.', 'True and False are presented equally.', 'The feedback explains the concept rather than repeating the answer.'],
  },
  {
    id: 'short-text', label: 'Short text', kind: 'text',
    prompt: 'Write the full name of CPU.', help: 'Enter a short answer. Spacing and capital letters are ignored in this prototype.',
    config: { acceptedAnswers: ['central processing unit'], caseSensitive: false, maxMarks: 1, successFeedback: 'Correct. CPU stands for central processing unit.', incorrectFeedback: 'Not accepted. Give the complete expansion of the abbreviation CPU.' },
    strategy: 'Normalised accepted-answer match',
    contract: 'Trim and collapse spaces, apply the case rule, then require an exact whole-answer match against an approved variant.',
    qa: ['Substring matching is never used.', 'Every accepted spelling is stored in the AI-authored answer model.', 'Unexpected but valid answers are flagged for AI review in production.'],
  },
  {
    id: 'numeric', label: 'Numeric', kind: 'numeric',
    prompt: 'A file is 4,300 MB. Convert it to GB. Use 1 GB = 1000 MB.', help: 'Enter the number and choose its unit.', units: ['GB', 'MB'],
    config: { expectedValue: 4.3, tolerance: 0.01, requiredUnit: 'GB', maxMarks: 2, successFeedback: 'Correct. 4,300 / 1,000 = 4.3 GB.', incorrectFeedback: 'Not correct. Divide the number of megabytes by 1,000.' },
    strategy: 'Numeric tolerance and unit match',
    contract: 'The value must be within the inclusive tolerance and the selected unit must match the required unit.',
    qa: ['The conversion basis is stated in the question.', 'Tolerance is explicit and inclusive.', 'The number and unit are marked together as one submitted answer.'],
  },
  {
    id: 'matching', label: 'Matching', kind: 'matching',
    prompt: 'Match each component to its primary purpose.', help: 'Choose one description for each component.',
    items: [['cpu', 'CPU'], ['ram', 'RAM'], ['ssd', 'SSD']],
    targets: [['processes', 'Executes program instructions'], ['temporary', 'Stores data currently in use'], ['persistent', 'Stores data without power']],
    config: { correctPairs: { cpu: 'processes', ram: 'temporary', ssd: 'persistent' }, maxMarks: 3, successFeedback: 'Correct. Every component is matched to its primary purpose.', partialFeedback: 'Partly correct. Check the purpose of each component.', incorrectFeedback: 'None of those matches are correct yet.' },
    strategy: 'One deterministic mark per pair',
    contract: 'Each left-hand item has one configured target ID. Every exact pair earns its share of the available marks.',
    qa: ['Every target is distinct and used once.', 'Select controls provide an accessible alternative to drag and drop.', 'Partial feedback does not reveal unanswered pairs.'],
  },
  {
    id: 'ordering', label: 'Ordering', kind: 'ordering',
    prompt: 'Put the fetch-decode-execute cycle in the correct order.', help: 'Use the arrow buttons to move each step.',
    orderItems: [['fetch', 'Fetch the instruction'], ['decode', 'Decode the instruction'], ['execute', 'Execute the instruction']],
    initialOrder: ['execute', 'fetch', 'decode'],
    config: { correctOrder: ['fetch', 'decode', 'execute'], maxMarks: 3, successFeedback: 'Correct. The CPU fetches, decodes and then executes each instruction.', partialFeedback: 'Partly correct. Some steps are in the right position.', incorrectFeedback: 'The sequence is not correct yet.' },
    strategy: 'Position-by-position sequence match',
    contract: 'Each item ID is compared with the configured ID at the same zero-based position.',
    qa: ['The starting sequence is deliberately shuffled.', 'Every move is keyboard operable.', 'Items retain visible position numbers after movement.'],
  },
  {
    id: 'categorisation', label: 'Categorisation', kind: 'categorisation',
    prompt: 'Categorise each storage component as volatile or non-volatile.', help: 'Assign one category to every item.',
    items: [['ram', 'RAM'], ['cache', 'Cache memory'], ['ssd', 'SSD'], ['rom', 'ROM']],
    categories: [['volatile', 'Volatile'], ['non-volatile', 'Non-volatile']],
    config: { correctCategories: { ram: 'volatile', cache: 'volatile', ssd: 'non-volatile', rom: 'non-volatile' }, maxMarks: 4, successFeedback: 'Correct. RAM and cache are volatile; SSD and ROM are non-volatile.', partialFeedback: 'Partly correct. Check which components retain data without power.', incorrectFeedback: 'Those categories are not correct yet.' },
    strategy: 'One deterministic mark per category assignment',
    contract: 'Each item ID must map to its configured category ID. Correct assignments receive proportional credit.',
    qa: ['Category names are mutually exclusive.', 'Every item has exactly one valid category.', 'The interface does not rely on colour or dragging.'],
  },
  {
    id: 'paragraph-cloze', label: 'Paragraph blanks', kind: 'paragraph',
    prompt: 'Complete the paragraph about network addressing.', help: 'Choose the correct term for each numbered blank.',
    blankOptions: [['', 'Choose a term'], ['ip', 'IP'], ['mac', 'MAC'], ['url', 'URL'], ['ram', 'RAM']],
    config: { acceptedAnswers: [['ip'], ['mac']], caseSensitive: false, maxMarks: 2, successFeedback: 'Correct. IP addresses support network routing, while MAC addresses identify network interfaces.', partialFeedback: 'Partly correct. Recheck the role of each address.', incorrectFeedback: 'Those terms do not complete the paragraph correctly.' },
    strategy: 'Accepted answer per paragraph blank',
    contract: 'Each blank is independently normalised and matched against its configured accepted-answer list.',
    qa: ['Every blank has enough surrounding context.', 'Distractors are plausible but unambiguous.', 'Blank numbers match the answer controls and feedback.'],
  },
  {
    id: 'code-cloze', label: 'Code blanks', kind: 'code',
    prompt: 'Complete the Python loop so it prints the numbers 0 to 4.', help: 'Enter the missing number and variable name. Use one token in each blank.',
    config: { acceptedAnswers: [['5'], ['count']], caseSensitive: true, maxMarks: 2, successFeedback: 'Correct. range(0, 5) produces 0 to 4 and count stores each value.', partialFeedback: 'Partly correct. Check the range boundary and loop variable.', incorrectFeedback: 'The completed code would not produce the required output.' },
    strategy: 'Case-sensitive accepted token per code blank',
    contract: 'Each code blank is trimmed, then matched exactly against its case-sensitive accepted-token list.',
    qa: ['The fixed code makes each blank unambiguous: range(0, [blank]) requires 5, not 0, 5.', 'Each blank represents one token, not an arbitrary code block.', 'The AI must either list every equivalent valid completion or use fixed surrounding code to leave one intended answer.', 'Whitespace around tokens is ignored but letter case is preserved.'],
  },
  {
    id: 'table-completion', label: 'Table completion', kind: 'table',
    prompt: 'Complete the comparison of hard disk drives and solid-state drives.', help: 'Choose one value for every empty table cell.',
    columns: [
      { id: 'moving', label: 'Moving parts?', options: [['', 'Choose'], ['yes', 'Yes'], ['no', 'No']] },
      { id: 'speed', label: 'Typical speed', options: [['', 'Choose'], ['slower', 'Slower'], ['faster', 'Faster']] },
    ],
    rows: [['hdd', 'HDD'], ['ssd', 'SSD']],
    config: { correctValues: { 'hdd-moving': 'yes', 'hdd-speed': 'slower', 'ssd-moving': 'no', 'ssd-speed': 'faster' }, maxMarks: 4, successFeedback: 'Correct. HDDs use moving parts and are generally slower; SSDs have no moving parts and are generally faster.', partialFeedback: 'Partly correct. Recheck the construction and typical speed of each device.', incorrectFeedback: 'Those table entries do not describe HDDs and SSDs correctly.' },
    solutions: [['HDD — moving parts', 'Yes'], ['HDD — typical speed', 'Slower'], ['SSD — moving parts', 'No'], ['SSD — typical speed', 'Faster']],
    strategy: 'One deterministic mark per configured table cell',
    contract: 'Each editable cell has a stable key and one approved value. Every exact cell match earns its proportional mark.',
    qa: ['Row and column headers identify every cell.', 'Each select remains at least 44 pixels high.', 'Blank and partially completed tables are handled explicitly.'],
  },
  {
    id: 'truth-table', label: 'Truth-table completion', kind: 'truth',
    prompt: 'Complete the output column for an AND gate.', help: 'Choose 0 or 1 for each output cell.',
    truthRows: [['00', '0', '0'], ['01', '0', '1'], ['10', '1', '0'], ['11', '1', '1']],
    config: { correctValues: { 'q-00': '0', 'q-01': '0', 'q-10': '0', 'q-11': '1' }, maxMarks: 4, successFeedback: 'Correct. An AND gate outputs 1 only when both inputs are 1.', partialFeedback: 'Partly correct. An AND output is 1 only when both inputs are 1.', incorrectFeedback: 'Those outputs do not match the AND operation.' },
    solutions: [['A=0, B=0', 'Q=0'], ['A=0, B=1', 'Q=0'], ['A=1, B=0', 'Q=0'], ['A=1, B=1', 'Q=1']],
    strategy: 'One deterministic mark per truth-table output',
    contract: 'Fixed input rows are immutable. Each output cell must exactly match its configured binary value.',
    qa: ['The table has a visible caption and semantic headers.', 'Inputs are fixed and outputs alone are editable.', 'Binary choices prevent invalid characters.'],
  },
  {
    id: 'trace-table', label: 'Trace-table completion', kind: 'trace',
    prompt: 'Trace the algorithm and complete the value of total after each loop.', help: 'Enter the value produced at the end of each iteration.',
    traceRows: [['iteration-1', '1', '1'], ['iteration-2', '2', '2'], ['iteration-3', '3', '3']],
    config: { correctValues: { 'total-iteration-1': '1', 'total-iteration-2': '3', 'total-iteration-3': '6' }, maxMarks: 3, successFeedback: 'Correct. The running total changes from 1 to 3 and then to 6.', partialFeedback: 'Partly correct. Carry the previous total into the next iteration.', incorrectFeedback: 'Those values do not trace the running total correctly.' },
    solutions: [['Iteration 1 total', '1'], ['Iteration 2 total', '3'], ['Iteration 3 total', '6']],
    strategy: 'One deterministic mark per trace-table cell',
    contract: 'Each trace row represents a fixed iteration. The entered state is matched exactly against the configured state for that row.',
    qa: ['The algorithm and trace columns use the same variable names.', 'Numeric keyboards are requested on touch devices.', 'Each row represents one unambiguous execution point.'],
  },
  {
    id: 'diagram-labelling', label: 'Diagram labelling', kind: 'hotspot',
    prompt: 'Label the three numbered regions of this simplified CPU diagram.', help: 'Use the numbered controls below the diagram; dragging is not required.',
    hotspotOptions: [['', 'Choose a label'], ['alu', 'Arithmetic logic unit'], ['control', 'Control unit'], ['cache', 'Cache']],
    hotspots: [['cpu-1', '1'], ['cpu-2', '2'], ['cpu-3', '3']],
    config: { correctValues: { 'cpu-1': 'control', 'cpu-2': 'alu', 'cpu-3': 'cache' }, maxMarks: 3, successFeedback: 'Correct. The control unit coordinates instructions, the ALU performs arithmetic and logic, and cache stores frequently used data.', partialFeedback: 'Partly correct. Recheck the roles of the CPU components.', incorrectFeedback: 'Those labels are not in the correct CPU regions.' },
    solutions: [['Hotspot 1', 'Control unit'], ['Hotspot 2', 'Arithmetic logic unit'], ['Hotspot 3', 'Cache']],
    strategy: 'Stable hotspot ID to label ID match',
    contract: 'Every numbered hotspot has one configured label ID. Labels are selected through accessible controls linked to the diagram numbers.',
    qa: ['The SVG has a text alternative.', 'Hotspots are numbered rather than identified by colour.', 'Native selects provide a touch and keyboard alternative to dragging.'],
  },
  {
    id: 'diagram-slots', label: 'Diagram slots', kind: 'slots',
    prompt: 'Complete the data flow from input through processing to output.', help: 'Choose the component that belongs in each numbered slot.',
    slotOptions: [['', 'Choose a component'], ['keyboard', 'Keyboard'], ['cpu', 'CPU'], ['monitor', 'Monitor']],
    slots: [['flow-1', '1', 'Data enters the system'], ['flow-2', '2', 'Instructions are processed'], ['flow-3', '3', 'Information is displayed']],
    config: { correctValues: { 'flow-1': 'keyboard', 'flow-2': 'cpu', 'flow-3': 'monitor' }, maxMarks: 3, successFeedback: 'Correct. The keyboard provides input, the CPU processes it and the monitor displays output.', partialFeedback: 'Partly correct. Follow the direction of data through the three stages.', incorrectFeedback: 'Those components do not complete the input-process-output flow.' },
    solutions: [['Slot 1', 'Keyboard'], ['Slot 2', 'CPU'], ['Slot 3', 'Monitor']],
    strategy: 'One configured component per diagram slot',
    contract: 'Each spatial slot has one expected component ID. Every exact slot match earns its proportional mark.',
    qa: ['The flow direction is clear without relying on animation.', 'Every slot is keyboard and touch operable.', 'The mobile layout stacks slots without changing their order.'],
  },
  {
    id: 'logic-diagram', label: 'Logic diagram', kind: 'logic-diagram',
    prompt: 'Build the two-stage logic circuit for Q = NOT (A AND B).', help: 'Choose one gate for each numbered stage. The diagram updates as you build it.',
    gateOptions: [['', 'Choose a gate'], ['and', 'AND'], ['or', 'OR'], ['xor', 'XOR'], ['not', 'NOT']],
    stages: [['gate-1', '1', 'Combines inputs A and B'], ['gate-2', '2', 'Processes the result from stage 1']],
    config: { correctValues: { 'gate-1': 'and', 'gate-2': 'not' }, maxMarks: 2, successFeedback: 'Correct. A and B enter an AND gate, then a NOT gate inverts its output.', partialFeedback: 'Partly correct. Read the expression from the brackets outwards.', incorrectFeedback: 'That circuit does not implement NOT (A AND B).' },
    solutions: [['Stage 1', 'AND'], ['Stage 2', 'NOT']],
    strategy: 'One whitelisted gate ID per fixed circuit slot',
    contract: 'Each numbered circuit slot accepts one approved gate ID. The ordered slot-to-gate mapping is compared with the configured circuit model.',
    qa: ['Standard gate symbols update without changing the fixed wiring.', 'The circuit has a complete text alternative.', 'Native selectors replace imprecise drag-and-drop on touchscreens.'],
  },
  {
    id: 'predict-output', label: 'Predict the output', kind: 'output',
    prompt: 'What is printed when this Python code runs?', help: 'Trace the code, then choose one output.',
    options: [['3', '3'], ['6', '6'], ['9', '9'], ['12', '12']],
    config: { correctAnswer: '9', maxMarks: 1, successFeedback: 'Correct. The loop adds 2, then 3, then 4, so total becomes 9.', incorrectFeedback: 'Not correct. Trace total after each value in range(2, 5).' },
    strategy: 'Exact output-model match',
    contract: 'The selected output ID must exactly equal the output produced by the validated reference execution.',
    qa: ['The code is syntax highlighted and has no hidden input.', 'The language and runtime version are fixed in the question version.', 'Distractors represent plausible trace errors.'],
  },
  {
    id: 'base-conversions', label: 'Base conversions', kind: 'conversion',
    prompt: 'Complete all three number-base conversions.', help: 'Enter digits only. Leading zeroes are accepted where they do not change the value.',
    conversions: [
      ['binary-denary', '101101', '2', '10', 'Denary value of binary 101101', 'numeric'],
      ['denary-hex', '94', '10', '16', 'Hexadecimal value of denary 94', 'text'],
      ['hex-binary', '3A', '16', '2', 'Binary value of hexadecimal 3A', 'numeric'],
    ],
    config: { correctValues: { 'binary-denary': '45', 'denary-hex': ['5E', '5e'], 'hex-binary': ['00111010', '111010'] }, caseSensitive: false, maxMarks: 3, successFeedback: 'Correct. 101101₂ = 45₁₀, 94₁₀ = 5E₁₆ and 3A₁₆ = 00111010₂.', partialFeedback: 'Partly correct. Recheck place values and group binary digits into four-bit nibbles.', incorrectFeedback: 'Those values do not represent the same numbers in the requested bases.' },
    solutions: [['101101₂', '45₁₀'], ['94₁₀', '5E₁₆'], ['3A₁₆', '00111010₂ or 111010₂']],
    strategy: 'Normalised accepted value per conversion',
    contract: 'Each conversion field is compared with an explicit accepted-value list. Case is ignored for hexadecimal and approved leading-zero variants are enumerated.',
    qa: ['Source and target bases are always visible.', 'Each field requests the appropriate mobile keyboard.', 'Accepted leading-zero variants are explicit rather than inferred loosely.'],
  },
  {
    id: 'boolean-evaluation', label: 'Boolean evaluation', kind: 'boolean-eval',
    prompt: 'Evaluate the first expression, then complete the equivalence.', help: 'Answer both independent parts. Each correct part earns one mark.',
    config: { correctValues: { 'boolean-output': '0', 'boolean-equivalent': 'not-a-or-not-b' }, maxMarks: 2, successFeedback: 'Correct. (1 AND 0) OR NOT 1 evaluates to 0, and De Morgan’s law gives NOT A OR NOT B.', partialFeedback: 'Partly correct. Work through brackets first and then apply De Morgan’s law.', incorrectFeedback: 'Neither Boolean result is correct yet.' },
    solutions: [['Q when A=1, B=0, C=1', '0'], ['NOT (A AND B)', 'NOT A OR NOT B']],
    strategy: 'Independent exact result and equivalence matches',
    contract: 'The evaluated output and selected equivalent-expression ID are marked as two separate deterministic fields.',
    qa: ['Input values remain visible beside the expression.', 'Operators are written consistently in OCR pseudocode style.', 'The two parts have separate labels and marks.'],
  },
  {
    id: 'sql-query', label: 'SQL query', kind: 'sql',
    prompt: 'Write a query to list the names of students in class 10A, ordered alphabetically.', help: 'Use the fixed students table. SQL keywords are colour coded in the live preview.',
    config: { acceptedQueries: ["SELECT name FROM students WHERE class_name = '10A' ORDER BY name ASC", "SELECT name FROM students WHERE class_name = '10A' ORDER BY name"], maxMarks: 3, successFeedback: 'Correct. The query selects name, filters class_name to 10A and orders the result by name.', incorrectFeedback: 'That query does not yet select, filter and order the required data.' },
    strategy: 'Normalised whitelist match against a fixed read-only dataset',
    contract: 'The query is never executed by this prototype. Whitespace, keyword case and a trailing semicolon are normalised before exact comparison with validated equivalent queries.',
    qa: ['Only SELECT tasks against a fixed read-only schema are permitted.', 'Quoted data values retain case during normalisation.', 'Production marking must parse and whitelist syntax before any sandboxed execution.'],
  },
  {
    id: 'code-debugging', label: 'Code debugging', kind: 'debug',
    prompt: 'Fix the program so it prints the square numbers 0, 1, 4, 9 and 16.', help: 'Select the faulty line, then choose its complete replacement.',
    codeLines: [['1', 'for number in range(5):'], ['2', '    square = number * number'], ['3', '    print(number)']],
    replacements: [['', 'Choose a replacement'], ['print-square', '    print(square)'], ['print-number-plus-one', '    print(number + 1)'], ['change-square', '    square = number + number']],
    config: { correctValues: { 'bug-line': '3', replacement: 'print-square' }, maxMarks: 2, successFeedback: 'Correct. Line 3 must print square rather than number.', partialFeedback: 'Partly correct. Check both the faulty line and the complete replacement.', incorrectFeedback: 'That change would not print the required square numbers.' },
    solutions: [['Faulty line', '3'], ['Replacement', 'print(square)']],
    strategy: 'Fixed line ID and whitelisted replacement match',
    contract: 'The selected source-line ID and complete replacement ID are marked independently against a validated repair.',
    qa: ['The whole program remains visible while choosing.', 'Line selection does not rely on colour.', 'Every offered replacement is syntactically valid but only one meets the stated behaviour.'],
  },
  {
    id: 'programming-task', label: 'Structured code response', kind: 'program',
    prompt: 'Complete the Python function so it returns True for even numbers and False for odd numbers.', help: 'Write one complete return statement. It is compared with approved variants and is never executed.',
    config: { acceptedAnswers: ['return number % 2 == 0', 'return (number % 2) == 0'], caseSensitive: true, maxMarks: 4, successFeedback: 'Accepted. This return statement matches an approved equivalent answer.', incorrectFeedback: 'That response does not match an approved complete return statement.' },
    strategy: 'Exact match against approved complete code variants',
    contract: 'The response is normalised only for surrounding whitespace and compared with explicitly approved complete variants. Student code is never executed by the browser, Supabase or another service.',
    qa: ['The required language and surrounding function are fixed.', 'Every semantically accepted response is enumerated before publication.', 'The interface and authoring contract must never imply that submitted code is executed.'],
  },
  {
    id: 'multi-part', label: 'Multi-part question', kind: 'multi-part',
    prompt: 'Answer all three parts about this 8 × 4 pixel image stored at 2 bits per pixel.', help: 'Each part is marked independently and is worth one mark.',
    config: { correctValues: { colours: '4', bits: '64', compression: 'lossless' }, maxMarks: 3, successFeedback: 'Correct. Two bits represent four colours, the image data uses 64 bits, and lossless compression preserves every pixel.', partialFeedback: 'Partly correct. Recheck the colour depth, bitmap-size calculation and compression requirement.', incorrectFeedback: 'Those answers do not describe the bitmap correctly.' },
    solutions: [['Part A: maximum colours', '4'], ['Part B: image-data size', '64 bits'], ['Part C: compression', 'Lossless']],
    strategy: 'Independent deterministic marking per sub-part',
    contract: 'Every sub-part has its own stable field, answer model and mark allocation. The total is the sum of independently earned marks.',
    qa: ['Part labels and marks remain visible.', 'A wrong early part cannot block later marks.', 'Mixed control types retain clear individual labels on mobile.'],
  },
  {
    id: 'extended-response', label: 'Extended response', kind: 'extended',
    prompt: 'Explain how virtual memory allows a computer to keep running when RAM is full, and discuss its effect on performance.', help: 'Write a developed response. This question is submitted for rubric review and is not auto-marked.',
    submitLabel: 'Submit for review',
    rubric: ['Explains that secondary storage is used when RAM is full.', 'Describes movement of inactive data between RAM and secondary storage.', 'Explains why secondary storage makes virtual memory slower than RAM.'],
    config: { minimumWords: 20, maxMarks: 6, reviewMethod: 'Teacher, self or AI-assisted rubric review', reviewFeedback: 'Your response has been saved and queued for rubric review. No mark is awarded until that review is complete.' },
    strategy: 'Rubric review; deliberately not deterministic auto-marking',
    contract: 'Submission completeness can be validated automatically, but the six-mark quality judgement remains pending until a teacher, learner or approved AI-assisted rubric review is recorded.',
    qa: ['The interface never presents a guessed mark as authoritative.', 'The rubric focus is visible before submission.', 'The pending-review state is distinct from correct, incorrect and unanswered feedback.'],
  },
];

const approvalAreas = [
  ['Design', 'The prompt, answer control and feedback hierarchy are clear at desktop and mobile sizes.'],
  ['Functionality', 'Selection, reset, checking and movement between question types behave predictably.'],
  ['Auto-marking', 'The marking contract is deterministic, inspectable and resistant to accidental credit.'],
  ['Accessibility', 'Controls have native semantics, visible focus, labels and non-colour status text.'],
  ['QA', 'Correct, incorrect, blank and boundary cases have been exercised.'],
];

function initialAnswer(question) {
  if (question.kind === 'multiple' || question.kind === 'paragraph' || question.kind === 'code') return [];
  if (question.kind === 'numeric') return { value: '', unit: question.config.requiredUnit };
  if (['matching', 'categorisation', 'table', 'truth', 'trace', 'hotspot', 'slots', 'logic-diagram', 'conversion', 'boolean-eval', 'debug', 'multi-part'].includes(question.kind)) return {};
  if (question.kind === 'ordering') return [...question.initialOrder];
  return '';
}

const configs = Object.fromEntries(questions.map((question) => [question.id, structuredClone(question.config)]));
const answers = Object.fromEntries(questions.map((question) => [question.id, initialAnswer(question)]));
const results = {};
let activeIndex = 0;
let mode = 'student';
let lastMovedOrderId = '';

function readApprovals() {
  try { return JSON.parse(localStorage.getItem('question-lab-approvals') || '{}'); }
  catch { return {}; }
}

const approvals = readApprovals();
const nav = document.querySelector('#type-nav');
const workspace = document.querySelector('#workspace-content');
const approvalBody = document.querySelector('#approval-body');
const approvalSummary = document.querySelector('#approval-summary');
const approvalPanel = document.querySelector('#approval-panel');
const modeButtons = [...document.querySelectorAll('[data-mode]')];

if (matchMedia('(max-width: 1040px)').matches) approvalPanel.open = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function activeQuestion() { return questions[activeIndex]; }

function renderNav() {
  nav.innerHTML = questions.map((question, index) => `
    <button class="type-button" type="button" data-type-index="${index}" aria-current="${index === activeIndex}">
      <span class="type-number">${index + 1}</span><span class="type-label">${question.label}</span><span class="type-arrow" aria-hidden="true">&#8250;</span>
    </button>`).join('');
}

function renderChoiceAnswers(question, multiple = false) {
  const answer = answers[question.id];
  return `<fieldset class="answer-list"><legend>${escapeHtml(question.help)}</legend>
    ${question.options.map(([id, label], index) => {
      const checked = multiple ? answer.includes(id) : answer === id;
      return `<label class="answer-option"><input type="${multiple ? 'checkbox' : 'radio'}" name="answer-${question.id}" value="${id}" ${checked ? 'checked' : ''} /><span class="option-letter">${String.fromCharCode(65 + index)}.</span><span class="option-copy">${escapeHtml(label)}</span><span class="selection-indicator" aria-hidden="true"></span></label>`;
    }).join('')}
  </fieldset>`;
}

function renderSelectOptions(options, selectedValue) {
  return options.map(([value, label]) => `<option value="${escapeHtml(value)}" ${selectedValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('');
}

function renderTableCompletion(question, answer) {
  return `<div class="table-shell"><table class="question-table"><caption>Storage-device comparison</caption><thead><tr><th scope="col">Device</th>${question.columns.map((column) => `<th scope="col">${escapeHtml(column.label)}</th>`).join('')}</tr></thead><tbody>${question.rows.map(([rowId, rowLabel]) => `<tr><th scope="row">${escapeHtml(rowLabel)}</th>${question.columns.map((column) => {
    const key = `${rowId}-${column.id}`;
    return `<td><label class="cell-answer ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="visually-hidden">${escapeHtml(rowLabel)}, ${escapeHtml(column.label)}</span><select data-structured-key="${key}" aria-label="${escapeHtml(rowLabel)}, ${escapeHtml(column.label)}">${renderSelectOptions(column.options, answer[key])}</select></label></td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function renderTruthTable(question, answer) {
  const options = [['', '–'], ['0', '0'], ['1', '1']];
  return `<div class="table-shell compact-table"><table class="question-table truth-table"><caption>AND gate truth table</caption><thead><tr><th scope="col">A</th><th scope="col">B</th><th scope="col">Q</th></tr></thead><tbody>${question.truthRows.map(([rowId, a, b]) => {
    const key = `q-${rowId}`;
    return `<tr><td>${a}</td><td>${b}</td><td><label class="cell-answer ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="visually-hidden">Output Q when A is ${a} and B is ${b}</span><select data-structured-key="${key}" aria-label="Output Q when A is ${a} and B is ${b}">${renderSelectOptions(options, answer[key])}</select></label></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function renderTraceTable(question, answer) {
  return `<div class="trace-program" aria-label="Algorithm to trace"><code><span class="syntax-variable">total</span> <span class="syntax-punctuation">=</span> <span class="syntax-number">0</span><br /><span class="syntax-keyword">FOR</span> <span class="syntax-variable">number</span> <span class="syntax-punctuation">=</span> <span class="syntax-number">1</span> <span class="syntax-keyword">TO</span> <span class="syntax-number">3</span><br />&nbsp;&nbsp;<span class="syntax-variable">total</span> <span class="syntax-punctuation">=</span> <span class="syntax-variable">total</span> <span class="syntax-punctuation">+</span> <span class="syntax-variable">number</span><br /><span class="syntax-keyword">NEXT</span> <span class="syntax-variable">number</span></code></div><div class="table-shell compact-table"><table class="question-table trace-table"><caption>Trace table</caption><thead><tr><th scope="col">Iteration</th><th scope="col">number</th><th scope="col">total</th></tr></thead><tbody>${question.traceRows.map(([rowId, iteration, number]) => {
    const key = `total-${rowId}`;
    return `<tr><th scope="row">${iteration}</th><td>${number}</td><td><label class="cell-answer ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="visually-hidden">Total after iteration ${iteration}</span><input data-structured-key="${key}" aria-label="Total after iteration ${iteration}" inputmode="numeric" autocomplete="off" value="${escapeHtml(answer[key] || '')}" /></label></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function renderHotspotDiagram(question, answer) {
  return `<figure class="diagram-question"><svg class="hotspot-diagram" viewBox="0 0 680 300" role="img" aria-labelledby="cpu-diagram-title cpu-diagram-description"><title id="cpu-diagram-title">Simplified CPU diagram</title><desc id="cpu-diagram-description">A processor outline containing three numbered regions. Region 1 is upper left, region 2 is lower left and region 3 is on the right.</desc><rect class="diagram-frame" x="18" y="18" width="644" height="264" rx="26" /><rect class="diagram-region" x="58" y="58" width="250" height="82" rx="18" /><rect class="diagram-region" x="58" y="166" width="250" height="74" rx="18" /><rect class="diagram-region diagram-region-wide" x="354" y="58" width="268" height="182" rx="18" /><circle class="hotspot-number" cx="92" cy="92" r="21" /><text x="92" y="99" text-anchor="middle">1</text><circle class="hotspot-number" cx="92" cy="201" r="21" /><text x="92" y="208" text-anchor="middle">2</text><circle class="hotspot-number" cx="390" cy="92" r="21" /><text x="390" y="99" text-anchor="middle">3</text><path class="diagram-connector" d="M308 99h46M308 203h46" /></svg><figcaption>Match each numbered region to a CPU component.</figcaption></figure><div class="diagram-label-grid">${question.hotspots.map(([key, number]) => `<label class="diagram-answer ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="slot-number">${number}</span><span class="diagram-answer-copy"><strong>Hotspot ${number}</strong><small>Choose its component</small></span><select data-structured-key="${key}" aria-label="Label for hotspot ${number}">${renderSelectOptions(question.hotspotOptions, answer[key])}</select></label>`).join('')}</div>`;
}

function renderDiagramSlots(question, answer) {
  return `<div class="slot-flow" role="group" aria-label="Input, processing and output diagram">${question.slots.map(([key, number, description], index) => `${index ? '<svg class="flow-arrow" aria-hidden="true" viewBox="0 0 48 48" fill="none"><path d="M8 24h29m-9-9 9 9-9 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>' : ''}<label class="diagram-slot ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="slot-number">${number}</span><strong>Slot ${number}</strong><small>${escapeHtml(description)}</small><select data-structured-key="${key}" aria-label="Component for slot ${number}">${renderSelectOptions(question.slotOptions, answer[key])}</select></label>`).join('')}</div>`;
}

function renderGateShape(kind, x, y, stage) {
  const label = kind ? kind.toUpperCase() : `Stage ${stage} empty`;
  if (!kind) return `<g class="logic-gate logic-gate-empty"><rect x="${x}" y="${y}" width="120" height="100" rx="18" /><text x="${x + 60}" y="${y + 59}" text-anchor="middle">?</text><title>${label}</title></g>`;
  if (kind === 'not') return `<g class="logic-gate"><path d="M${x} ${y}v100l100-50Z" /><circle cx="${x + 114}" cy="${y + 50}" r="14" /><title>${label} gate</title></g>`;
  if (kind === 'and') return `<g class="logic-gate"><path d="M${x} ${y}h45a50 50 0 0 1 0 100h-45Z" /><title>${label} gate</title></g>`;
  const xorLine = kind === 'xor' ? `<path class="logic-gate-extra" d="M${x - 13} ${y}q35 50 0 100" />` : '';
  return `<g class="logic-gate"><path d="M${x} ${y}q44 0 112 50-68 50-112 50 34-50 0-100Z" />${xorLine}<title>${label} gate</title></g>`;
}

function renderLogicDiagram(question, answer) {
  const gate1 = answer['gate-1'] || '';
  const gate2 = answer['gate-2'] || '';
  const gate1Options = question.gateOptions.filter(([value]) => value !== 'not');
  const gate2Options = question.gateOptions.filter(([value]) => value !== 'xor');
  return `<figure class="logic-builder"><svg class="logic-canvas" viewBox="0 0 760 260" role="img" aria-labelledby="logic-title logic-description"><title id="logic-title">Two-stage logic circuit</title><desc id="logic-description">Inputs A and B connect to stage 1, currently ${escapeHtml(gate1 || 'empty')}. Its output connects to stage 2, currently ${escapeHtml(gate2 || 'empty')}, then to output Q.</desc><text class="logic-terminal" x="30" y="83">A</text><text class="logic-terminal" x="30" y="183">B</text><path class="logic-wire" d="M52 78H175M52 178H175M287 128H470M584 128H716" />${renderGateShape(gate1, 175, 78, 1)}${renderGateShape(gate2, 470, 78, 2)}<circle class="logic-stage-number" cx="188" cy="65" r="18" /><text class="logic-stage-text" x="188" y="71">1</text><circle class="logic-stage-number" cx="483" cy="65" r="18" /><text class="logic-stage-text" x="483" y="71">2</text><text class="logic-terminal" x="722" y="134">Q</text></svg><figcaption>The fixed wiring updates with the selected standard gate symbols.</figcaption></figure><div class="logic-stage-grid">${question.stages.map(([key, number, description]) => `<label class="logic-stage-card ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="slot-number">${number}</span><span><strong>Stage ${number}</strong><small>${escapeHtml(description)}</small></span><select data-structured-key="${key}" aria-label="Gate for stage ${number}">${renderSelectOptions(number === '1' ? gate1Options : gate2Options, answer[key])}</select></label>`).join('')}</div>`;
}

function renderOutputQuestion(question) {
  return `<div class="trace-program output-program" aria-label="Python program"><code><span class="syntax-variable">total</span> <span class="syntax-punctuation">=</span> <span class="syntax-number">0</span><br /><span class="syntax-keyword">for</span> <span class="syntax-variable">number</span> <span class="syntax-keyword">in</span> <span class="syntax-function">range</span><span class="syntax-punctuation">(</span><span class="syntax-number">2</span><span class="syntax-punctuation">, </span><span class="syntax-number">5</span><span class="syntax-punctuation">):</span><br />&nbsp;&nbsp;&nbsp;&nbsp;<span class="syntax-variable">total</span> <span class="syntax-punctuation">=</span> <span class="syntax-variable">total</span> <span class="syntax-punctuation">+</span> <span class="syntax-variable">number</span><br /><span class="syntax-function">print</span><span class="syntax-punctuation">(</span><span class="syntax-variable">total</span><span class="syntax-punctuation">)</span></code></div>${renderChoiceAnswers(question)}`;
}

function renderConversions(question, answer) {
  return `<div class="conversion-grid">${question.conversions.map(([key, source, sourceBase, targetBase, label, inputMode], index) => `<label class="conversion-card ${answer[key] ? 'is-selected' : ''}" data-answer-container><span class="conversion-number">${index + 1}</span><span class="conversion-source" aria-hidden="true">${escapeHtml(source)}<sub>${sourceBase}</sub></span><svg class="conversion-arrow" aria-hidden="true" viewBox="0 0 44 24" fill="none"><path d="M3 12h34m-8-8 8 8-8 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg><span class="conversion-target"><span class="visually-hidden">${escapeHtml(label)}</span><input data-structured-key="${key}" aria-label="${escapeHtml(label)}" inputmode="${inputMode}" autocomplete="off" spellcheck="false" value="${escapeHtml(answer[key] || '')}" /><sub>${targetBase}</sub></span></label>`).join('')}</div>`;
}

function renderBooleanEvaluation(answer) {
  const binaryOptions = [['', 'Choose 0 or 1'], ['0', '0'], ['1', '1']];
  const equivalenceOptions = [['', 'Choose an expression'], ['not-a-and-not-b', 'NOT A AND NOT B'], ['not-a-or-not-b', 'NOT A OR NOT B'], ['a-or-b', 'A OR B']];
  return `<div class="boolean-values" aria-label="Boolean input values"><span>A = <strong>1</strong></span><span>B = <strong>0</strong></span><span>C = <strong>1</strong></span></div><div class="boolean-task-grid"><label class="boolean-card ${answer['boolean-output'] ? 'is-selected' : ''}" data-answer-container><span class="part-label">Part 1</span><strong class="boolean-expression">Q = (A AND B) OR NOT C</strong><small>Evaluate Q using the values above.</small><select data-structured-key="boolean-output" aria-label="Value of Q">${renderSelectOptions(binaryOptions, answer['boolean-output'])}</select></label><label class="boolean-card ${answer['boolean-equivalent'] ? 'is-selected' : ''}" data-answer-container><span class="part-label">Part 2</span><strong class="boolean-expression">NOT (A AND B) &equiv;</strong><small>Choose the equivalent expression.</small><select data-structured-key="boolean-equivalent" aria-label="Expression equivalent to NOT (A AND B)">${renderSelectOptions(equivalenceOptions, answer['boolean-equivalent'])}</select></label></div>`;
}

function highlightSql(value) {
  const tokens = String(value ?? '').match(/'(?:''|[^'])*'|\b(?:SELECT|FROM|WHERE|ORDER|BY|ASC|DESC|AND|OR|NOT|AS)\b|\b\d+\b|[(),=*<>;]+|[A-Za-z_]\w*|\s+|./gi) || [];
  return tokens.map((token) => {
    const safe = escapeHtml(token);
    if (/^'(?:''|[^'])*'$/.test(token)) return `<span class="syntax-string">${safe}</span>`;
    if (/^(?:SELECT|FROM|WHERE|ORDER|BY|ASC|DESC|AND|OR|NOT|AS)$/i.test(token)) return `<span class="syntax-keyword">${safe}</span>`;
    if (/^\d+$/.test(token)) return `<span class="syntax-number">${safe}</span>`;
    if (/^[(),=*<>;]+$/.test(token)) return `<span class="syntax-punctuation">${safe}</span>`;
    return safe;
  }).join('');
}

function renderSqlQuery(answer) {
  const preview = answer ? highlightSql(answer) : '<span class="syntax-comment">-- Your colour-coded query will appear here</span>';
  return `<section class="dataset-card" aria-labelledby="students-schema-heading"><div class="dataset-heading"><div><strong id="students-schema-heading">students</strong><span>Fixed read-only table</span></div><code>students(id, name, class_name, score)</code></div><div class="table-shell dataset-table-shell"><table class="question-table dataset-table"><caption>Sample rows</caption><thead><tr><th scope="col">id</th><th scope="col">name</th><th scope="col">class_name</th><th scope="col">score</th></tr></thead><tbody><tr><td>1</td><td>Amina</td><td>10A</td><td>78</td></tr><tr><td>2</td><td>Ben</td><td>10B</td><td>65</td></tr><tr><td>3</td><td>Cyrus</td><td>10A</td><td>91</td></tr></tbody></table></div></section><label class="sql-editor-shell ${answer ? 'is-filled' : ''}" data-answer-container><strong>SQL query</strong><textarea id="sql-answer" data-sql-answer aria-label="SQL query" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="SELECT ...">${escapeHtml(answer)}</textarea></label><div class="sql-preview" aria-label="Colour-coded SQL preview"><span class="preview-label">Live syntax preview</span><code id="sql-preview-code">${preview}</code></div>`;
}

function highlightPython(value) {
  const tokens = String(value ?? '').match(/#[^\n]*|'(?:\\'|[^'])*'|"(?:\\"|[^"])*"|\b(?:def|return|for|in|if|else|True|False|and|or|not|range|print)\b|\b\d+\b|[()[\],:%+\-*=/<>]+|[A-Za-z_]\w*|\s+|./g) || [];
  return tokens.map((token) => {
    const safe = escapeHtml(token);
    if (/^#/.test(token)) return `<span class="syntax-comment">${safe}</span>`;
    if (/^['"]/.test(token)) return `<span class="syntax-string">${safe}</span>`;
    if (/^(?:def|return|for|in|if|else|True|False|and|or|not)$/.test(token)) return `<span class="syntax-keyword">${safe}</span>`;
    if (/^(?:range|print)$/.test(token)) return `<span class="syntax-function">${safe}</span>`;
    if (/^\d+$/.test(token)) return `<span class="syntax-number">${safe}</span>`;
    if (/^[()[\],:%+\-*=/<>]+$/.test(token)) return `<span class="syntax-punctuation">${safe}</span>`;
    return safe;
  }).join('');
}

function renderDebugTask(question, answer) {
  return `<fieldset class="debug-task"><legend>Select the faulty line</legend><div class="debug-code-frame">${question.codeLines.map(([line, code]) => `<label class="debug-line ${answer['bug-line'] === line ? 'is-selected' : ''}"><input type="radio" name="debug-line" value="${line}" data-debug-line ${answer['bug-line'] === line ? 'checked' : ''} /><span class="debug-line-number">${line}</span><code>${highlightPython(code)}</code><span class="selection-indicator" aria-hidden="true"></span></label>`).join('')}</div></fieldset><label class="replacement-card ${answer.replacement ? 'is-selected' : ''}" data-answer-container><span class="slot-number">2</span><span><strong>Choose the complete replacement</strong><small>The indentation is included.</small></span><select data-structured-key="replacement" aria-label="Replacement code line">${renderSelectOptions(question.replacements, answer.replacement)}</select></label>`;
}

function renderProgrammingTask(question, answer) {
  const preview = answer ? highlightPython(answer) : '<span class="syntax-comment"># Your colour-coded return statement will appear here</span>';
  return `<section class="program-shell" aria-labelledby="program-editor-heading"><div class="program-signature"><span id="program-editor-heading" class="preview-label">Python function</span><code>${highlightPython('def is_even(number):')}</code></div><label class="program-editor ${answer ? 'is-filled' : ''}" data-answer-container><span class="visually-hidden">Function body</span><textarea id="program-answer" data-program-answer autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="    return ...">${escapeHtml(answer)}</textarea></label><div class="program-preview" aria-label="Colour-coded Python preview"><span class="preview-label">Live syntax preview</span><code id="program-preview-code">${preview}</code></div></section><section class="test-contract" aria-labelledby="test-contract-heading"><div><span class="eyebrow">Deterministic marking contract</span><h3 id="test-contract-heading">A complete approved response is required</h3></div><div class="test-case-grid"><div class="test-case"><span>Response shape</span><strong>One return statement</strong></div><div class="test-case"><span>Comparison</span><strong>Approved variants only</strong></div><div class="test-case hidden-tests"><span>Execution</span><strong>Student code is never run</strong></div></div></section>`;
}

function renderMultiPart(answer) {
  const colourOptions = [['', 'Choose a value'], ['2', '2 colours'], ['4', '4 colours'], ['8', '8 colours'], ['16', '16 colours']];
  const compressionOptions = [['', 'Choose a type'], ['lossless', 'Lossless'], ['lossy', 'Lossy']];
  return `<div class="multi-part-grid"><label class="part-card ${answer.colours ? 'is-selected' : ''}" data-answer-container><span class="part-heading"><span class="part-label">Part A</span><strong>1 mark</strong></span><span>Maximum colours</span><small>How many colours can 2 bits represent?</small><select data-structured-key="colours" aria-label="Maximum colours">${renderSelectOptions(colourOptions, answer.colours)}</select></label><label class="part-card ${answer.bits ? 'is-selected' : ''}" data-answer-container><span class="part-heading"><span class="part-label">Part B</span><strong>1 mark</strong></span><span>Image-data size</span><small>Give the uncompressed size in bits.</small><input data-structured-key="bits" aria-label="Image-data size in bits" inputmode="numeric" autocomplete="off" value="${escapeHtml(answer.bits || '')}" /></label><label class="part-card ${answer.compression ? 'is-selected' : ''}" data-answer-container><span class="part-heading"><span class="part-label">Part C</span><strong>1 mark</strong></span><span>Compression type</span><small>Which type preserves every pixel?</small><select data-structured-key="compression" aria-label="Compression type that preserves every pixel">${renderSelectOptions(compressionOptions, answer.compression)}</select></label></div>`;
}

function renderExtendedResponse(question, answer) {
  const wordCount = String(answer ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `<section class="review-focus" aria-labelledby="rubric-focus-heading"><div><span class="eyebrow">Rubric focus</span><h3 id="rubric-focus-heading">A strong response should cover</h3></div><ol class="rubric-list">${question.rubric.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></section><label class="extended-editor ${answer ? 'is-filled' : ''}" data-answer-container><strong>Your developed response</strong><textarea id="extended-answer" data-extended-answer autocomplete="off" spellcheck="true" placeholder="Explain the process and its effect on performance...">${escapeHtml(answer)}</textarea><span class="word-count" id="extended-word-count">${wordCount} words · minimum ${question.config.minimumWords}</span></label><div class="review-route"><span aria-hidden="true">&#128203;</span><div><strong>Submitted for rubric review</strong><p>Completeness is checked now; the mark remains pending until a human or approved AI-assisted review.</p></div></div>`;
}

function renderAnswerControl(question) {
  if (question.kind === 'single' || question.kind === 'boolean') return renderChoiceAnswers(question);
  if (question.kind === 'multiple') return renderChoiceAnswers(question, true);
  if (question.kind === 'text') return `<label class="setup-field" for="short-answer">Your answer<input class="text-answer ${answers[question.id] ? 'is-filled' : ''}" id="short-answer" name="short-answer" autocomplete="off" placeholder="Type your answer" value="${escapeHtml(answers[question.id])}" /></label>`;
  const answer = answers[question.id];
  if (question.kind === 'numeric') return `<div class="number-answer ${answer.value ? 'is-filled' : ''}">
      <label class="setup-field" for="numeric-answer">Number<input id="numeric-answer" inputmode="decimal" type="text" placeholder="e.g. 4.3" value="${escapeHtml(answer.value)}" /></label>
      <label class="setup-field" for="numeric-unit">Unit<select id="numeric-unit">${question.units.map((unit) => `<option ${answer.unit === unit ? 'selected' : ''}>${unit}</option>`).join('')}</select></label>
    </div>`;
  if (question.kind === 'matching') return `<div class="structured-list">${question.items.map(([id, label], index) => `<label class="mapping-row ${answer[id] ? 'is-selected' : ''}"><span class="row-number">${index + 1}</span><strong>${escapeHtml(label)}</strong><select data-match-id="${id}" aria-label="Match for ${escapeHtml(label)}"><option value="">Choose a purpose</option>${question.targets.map(([targetId, targetLabel]) => `<option value="${targetId}" ${answer[id] === targetId ? 'selected' : ''}>${escapeHtml(targetLabel)}</option>`).join('')}</select><span class="row-complete" aria-hidden="true"></span></label>`).join('')}</div>`;
  if (question.kind === 'ordering') return `<ol class="order-list">${answer.map((id, index) => {
      const label = question.orderItems.find(([itemId]) => itemId === id)?.[1] || id;
      return `<li class="${id === lastMovedOrderId ? 'is-moved' : ''}"><span class="order-position">${index + 1}</span><strong>${escapeHtml(label)}</strong><span class="move-controls"><button class="icon-button" type="button" data-action="move-up" data-order-index="${index}" ${index === 0 ? 'disabled' : ''} aria-label="Move ${escapeHtml(label)} up"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m6 15 6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></button><button class="icon-button" type="button" data-action="move-down" data-order-index="${index}" ${index === answer.length - 1 ? 'disabled' : ''} aria-label="Move ${escapeHtml(label)} down"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></button></span></li>`;
    }).join('')}</ol>`;
  if (question.kind === 'categorisation') return `<div class="structured-list">${question.items.map(([id, label], index) => `<label class="mapping-row ${answer[id] ? 'is-selected' : ''}"><span class="row-number">${index + 1}</span><strong>${escapeHtml(label)}</strong><select data-category-id="${id}" aria-label="Category for ${escapeHtml(label)}"><option value="">Choose a category</option>${question.categories.map(([categoryId, categoryLabel]) => `<option value="${categoryId}" ${answer[id] === categoryId ? 'selected' : ''}>${escapeHtml(categoryLabel)}</option>`).join('')}</select><span class="row-complete" aria-hidden="true"></span></label>`).join('')}</div>`;
  if (question.kind === 'paragraph') return `<div class="cloze-passage" aria-label="Paragraph with two blanks">An <label class="cloze-blank ${answer[0] ? 'is-selected' : ''}"><span class="visually-hidden">Blank 1</span><select data-blank-index="0" aria-label="Blank 1"><option value="">Blank 1</option>${question.blankOptions.slice(1).map(([id, label]) => `<option value="${id}" ${answer[0] === id ? 'selected' : ''}>${label}</option>`).join('')}</select></label> address helps routers send data to the correct network. A <label class="cloze-blank ${answer[1] ? 'is-selected' : ''}"><span class="visually-hidden">Blank 2</span><select data-blank-index="1" aria-label="Blank 2"><option value="">Blank 2</option>${question.blankOptions.slice(1).map(([id, label]) => `<option value="${id}" ${answer[1] === id ? 'selected' : ''}>${label}</option>`).join('')}</select></label> address identifies a network interface.</div>`;
  if (question.kind === 'code') return `<div class="code-editor" role="group" aria-label="Python code with two blanks"><code><span class="syntax-keyword">for</span> <span class="syntax-variable">count</span> <span class="syntax-keyword">in</span> <span class="syntax-function">range</span><span class="syntax-punctuation">(</span><span class="syntax-number">0</span><span class="syntax-punctuation">, </span><label class="code-blank-number ${answer[0] ? 'is-selected' : ''}"><span class="visually-hidden">Code blank 1: stop value</span><input data-blank-index="0" aria-label="Code blank 1: stop value" placeholder="…" value="${escapeHtml(answer[0] || '')}" autocomplete="off" spellcheck="false" /></label><span class="syntax-punctuation">):</span><br /><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="syntax-function">print</span><span class="syntax-punctuation">(</span><label class="code-blank-variable ${answer[1] ? 'is-selected' : ''}"><span class="visually-hidden">Code blank 2: loop variable</span><input data-blank-index="1" aria-label="Code blank 2: loop variable" placeholder="…" value="${escapeHtml(answer[1] || '')}" autocomplete="off" spellcheck="false" /></label><span class="syntax-punctuation">)</span></code></div>`;
  if (question.kind === 'table') return renderTableCompletion(question, answer);
  if (question.kind === 'truth') return renderTruthTable(question, answer);
  if (question.kind === 'trace') return renderTraceTable(question, answer);
  if (question.kind === 'hotspot') return renderHotspotDiagram(question, answer);
  if (question.kind === 'slots') return renderDiagramSlots(question, answer);
  if (question.kind === 'logic-diagram') return renderLogicDiagram(question, answer);
  if (question.kind === 'output') return renderOutputQuestion(question);
  if (question.kind === 'conversion') return renderConversions(question, answer);
  if (question.kind === 'boolean-eval') return renderBooleanEvaluation(answer);
  if (question.kind === 'sql') return renderSqlQuery(answer);
  if (question.kind === 'debug') return renderDebugTask(question, answer);
  if (question.kind === 'program') return renderProgrammingTask(question, answer);
  if (question.kind === 'multi-part') return renderMultiPart(answer);
  if (question.kind === 'extended') return renderExtendedResponse(question, answer);
  return '';
}

function renderFeedback(question) {
  const result = results[question.id];
  if (!result) return '';
  const headings = { correct: 'Correct', incorrect: 'Try again', partial: 'Partly correct', unanswered: 'Answer needed', review: 'Submitted for review' };
  const icons = {
    correct: '<svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.2 4.2L19 6.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    incorrect: '<svg viewBox="0 0 24 24" fill="none"><path d="m6.5 6.5 11 11m0-11-11 11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" /></svg>',
    partial: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 7.5v5.5m0 3.5h.01" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" /></svg>',
    unanswered: '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 9a2.7 2.7 0 1 1 3.8 2.5c-.9.4-1.3 1-1.3 2m0 3h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>',
    review: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 4.5h8m-7.5 4h7m-7 4h5M7 3h10a2 2 0 0 1 2 2v14H5V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  };
  const score = result.status === 'review' ? `Pending / ${result.maxMarks} marks` : `${result.marks} / ${result.maxMarks} marks`;
  const testSummary = question.kind === 'program' && result.status !== 'unanswered' ? `<div class="test-result-strip">${result.status === 'correct' ? '&#10003; Approved structured response matched' : '&#10007; No approved complete response matched'}</div>` : '';
  return `<section class="feedback-card ${result.status}" role="status" aria-live="polite"><div class="feedback-heading"><div class="feedback-title"><span class="feedback-icon" aria-hidden="true">${icons[result.status]}</span><strong>${headings[result.status]}</strong></div><span class="score-chip">${score}</span></div><p>${escapeHtml(result.feedback)}</p>${testSummary}</section>`;
}

function renderStudent(question) {
  const marks = configs[question.id].maxMarks;
  workspace.innerHTML = `<article class="question-card">
    <div class="question-meta"><span>Question type: ${escapeHtml(question.label)}</span><span class="mark-value">${marks} ${marks === 1 ? 'mark' : 'marks'}</span></div>
    <h2 id="active-type-heading" tabindex="-1">${escapeHtml(question.prompt)}</h2><p class="question-help">${escapeHtml(question.help)}</p>
    <form id="answer-form" novalidate>${renderAnswerControl(question)}
      <div class="actions">
        <div class="action-group"><button class="button" type="button" data-action="reset">Reset</button><button class="button primary" type="submit">${escapeHtml(question.submitLabel || 'Check answer')}</button></div>
        <div class="navigation-group">
          <button class="button" type="button" data-action="previous" ${activeIndex === 0 ? 'disabled' : ''}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M15 18 9 12l6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Back
          </button>
          <button class="button" type="button" data-action="next" ${activeIndex === questions.length - 1 ? 'disabled' : ''}>
            Next type
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
      </div>
    </form>
  </article>${renderFeedback(question)}`;
}

function optionLabel(question, id) {
  return question.options?.find(([optionId]) => optionId === id)?.[1] || id;
}

function renderSpecFields(question) {
  const config = configs[question.id];
  if (question.kind === 'single' || question.kind === 'boolean' || question.kind === 'output') return `<div class="spec-item"><dt>Correct answer</dt><dd>${escapeHtml(optionLabel(question, config.correctAnswer))}</dd></div>`;
  if (question.kind === 'multiple') return `<div class="spec-item"><dt>Correct answer set</dt><dd>${config.correctAnswers.map((id) => escapeHtml(optionLabel(question, id))).join(', ')}</dd></div><div class="spec-item"><dt>Partial marking</dt><dd>${config.partialMarks ? 'Enabled; incorrect selections cancel correct selections' : 'Disabled'}</dd></div>`;
  if (question.kind === 'text') return `<div class="spec-item"><dt>Accepted whole answers</dt><dd>${config.acceptedAnswers.map(escapeHtml).join(', ')}</dd></div><div class="spec-item"><dt>Case handling</dt><dd>${config.caseSensitive ? 'Case-sensitive' : 'Case-insensitive; whitespace normalised'}</dd></div>`;
  if (question.kind === 'numeric') return `<div class="spec-item"><dt>Expected value</dt><dd>${config.expectedValue}</dd></div><div class="spec-item"><dt>Inclusive tolerance</dt><dd>&plusmn;${config.tolerance}</dd></div><div class="spec-item"><dt>Required unit</dt><dd>${escapeHtml(config.requiredUnit)}</dd></div>`;
  if (question.kind === 'matching') return `<div class="spec-item full"><dt>Correct pairs</dt><dd>${question.items.map(([id, label]) => `${escapeHtml(label)} &rarr; ${escapeHtml(question.targets.find(([targetId]) => targetId === config.correctPairs[id])?.[1])}`).join('<br />')}</dd></div>`;
  if (question.kind === 'ordering') return `<div class="spec-item full"><dt>Correct order</dt><dd>${config.correctOrder.map((id, index) => `${index + 1}. ${escapeHtml(question.orderItems.find(([itemId]) => itemId === id)?.[1])}`).join('<br />')}</dd></div>`;
  if (question.kind === 'categorisation') return `<div class="spec-item full"><dt>Correct categories</dt><dd>${question.items.map(([id, label]) => `${escapeHtml(label)} &rarr; ${escapeHtml(question.categories.find(([categoryId]) => categoryId === config.correctCategories[id])?.[1])}`).join('<br />')}</dd></div>`;
  if (['table', 'truth', 'trace', 'hotspot', 'slots', 'logic-diagram', 'conversion', 'boolean-eval', 'debug', 'multi-part'].includes(question.kind)) return `<div class="spec-item full"><dt>Correct structured values</dt><dd>${question.solutions.map(([label, value]) => `${escapeHtml(label)} &rarr; ${escapeHtml(value)}`).join('<br />')}</dd></div>`;
  if (question.kind === 'sql') return `<div class="spec-item full"><dt>Accepted query variants</dt><dd>${config.acceptedQueries.map((query) => `<code>${escapeHtml(query)}</code>`).join('<br />')}</dd></div><div class="spec-item"><dt>Execution policy</dt><dd>Never executed in this prototype</dd></div>`;
  if (question.kind === 'program') return `<div class="spec-item full"><dt>Accepted complete responses</dt><dd>${config.acceptedAnswers.map((answer) => `<code>${escapeHtml(answer)}</code>`).join('<br />')}</dd></div><div class="spec-item"><dt>Execution model</dt><dd>No execution; deterministic approved-variant comparison only</dd></div>`;
  if (question.kind === 'extended') return `<div class="spec-item"><dt>Review method</dt><dd>${escapeHtml(config.reviewMethod)}</dd></div><div class="spec-item"><dt>Minimum submission</dt><dd>${config.minimumWords} words</dd></div><div class="spec-item full"><dt>Rubric focus</dt><dd>${question.rubric.map((item, index) => `${index + 1}. ${escapeHtml(item)}`).join('<br />')}</dd></div>`;
  return `<div class="spec-item full"><dt>Accepted answers by blank</dt><dd>${config.acceptedAnswers.map((accepted, index) => `Blank ${index + 1}: ${accepted.map(escapeHtml).join(' or ')}`).join('<br />')}</dd></div><div class="spec-item"><dt>Case handling</dt><dd>${config.caseSensitive ? 'Case-sensitive' : 'Case-insensitive'}</dd></div>`;
}

function renderSpec(question) {
  const config = configs[question.id];
  workspace.innerHTML = `<article class="setup-card">
    <div class="setup-intro"><div><h2 id="active-type-heading" tabindex="-1">${escapeHtml(question.label)} authoring spec</h2><p>Read-only contract for AI-generated and AI-maintained questions. Teachers do not edit question content.</p></div><span class="strategy-tag">${escapeHtml(question.strategy)}</span></div>
    <dl class="spec-grid"><div class="spec-item full"><dt>Example prompt</dt><dd>${escapeHtml(question.prompt)}</dd></div>${renderSpecFields(question)}<div class="spec-item"><dt>Maximum marks</dt><dd>${config.maxMarks}</dd></div></dl>
    <section class="contract"><h3>Marking contract</h3><p>${escapeHtml(question.contract)}</p></section>
    <section class="contract"><h3>AI maintenance rule</h3><p>The AI must produce the prompt, answer model, feedback and marking configuration as one validated version. Any later change creates a new version and repeats automated QA before publication.</p></section>
    <section class="qa-notes"><h3>QA focus</h3><ul>${question.qa.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
  </article>`;
}

function renderApproval() {
  const question = activeQuestion();
  const values = approvals[question.id] || {};
  const approvedCount = approvalAreas.filter(([area]) => values[area]).length;
  const pending = approvalAreas.length - approvedCount;
  approvalSummary.textContent = pending === 0 ? 'Ready for sign-off' : `${pending} ${pending === 1 ? 'item' : 'items'} pending`;
  approvalBody.innerHTML = approvalAreas.map(([area, description]) => {
    const approved = Boolean(values[area]);
    return `<div class="approval-item"><div class="approval-row"><strong>${area}</strong><button class="approval-toggle" type="button" data-approval="${area}" data-approved="${approved}">${approved ? 'Approved' : 'Pending'}</button></div><p>${escapeHtml(description)}</p></div>`;
  }).join('');
}

function render() {
  renderNav();
  modeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  if (mode === 'student') renderStudent(activeQuestion()); else renderSpec(activeQuestion());
  renderApproval();
  nav.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function mark(question) {
  const config = configs[question.id];
  if (question.kind === 'multiple') return markMultipleSelect(answers[question.id], config);
  if (question.kind === 'text') return markShortText(answers[question.id], config);
  if (question.kind === 'numeric') return markNumeric(answers[question.id], config);
  if (question.kind === 'matching') return markMatching(answers[question.id], config);
  if (question.kind === 'ordering') return markOrdering(answers[question.id], config);
  if (question.kind === 'categorisation') return markCategorisation(answers[question.id], config);
  if (question.kind === 'paragraph' || question.kind === 'code') return markFillBlanks(answers[question.id], config);
  if (['table', 'truth', 'trace', 'hotspot', 'slots', 'logic-diagram', 'conversion', 'boolean-eval', 'debug', 'multi-part'].includes(question.kind)) return markStructuredFields(answers[question.id], config);
  if (question.kind === 'sql') return markSqlQuery(answers[question.id], config);
  if (question.kind === 'program') return markShortText(answers[question.id], config);
  if (question.kind === 'extended') return markExtendedResponse(answers[question.id], config);
  return markSingleChoice(answers[question.id], config);
}

function collectStudentAnswer(question) {
  const form = document.querySelector('#answer-form');
  if (question.kind === 'multiple') answers[question.id] = [...form.querySelectorAll('input:checked')].map((input) => input.value);
  else if (question.kind === 'single' || question.kind === 'boolean' || question.kind === 'output') answers[question.id] = form.querySelector('input:checked')?.value || '';
  else if (question.kind === 'text') answers[question.id] = document.querySelector('#short-answer').value;
  else if (question.kind === 'numeric') answers[question.id] = { value: document.querySelector('#numeric-answer').value, unit: document.querySelector('#numeric-unit').value };
  else if (question.kind === 'matching') answers[question.id] = Object.fromEntries([...form.querySelectorAll('[data-match-id]')].map((select) => [select.dataset.matchId, select.value]));
  else if (question.kind === 'categorisation') answers[question.id] = Object.fromEntries([...form.querySelectorAll('[data-category-id]')].map((select) => [select.dataset.categoryId, select.value]));
  else if (question.kind === 'paragraph' || question.kind === 'code') answers[question.id] = [...form.querySelectorAll('[data-blank-index]')].map((input) => input.value);
  else if (['table', 'truth', 'trace', 'hotspot', 'slots', 'logic-diagram', 'conversion', 'boolean-eval', 'multi-part'].includes(question.kind)) answers[question.id] = Object.fromEntries([...form.querySelectorAll('[data-structured-key]')].map((input) => [input.dataset.structuredKey, input.value]));
  else if (question.kind === 'sql') answers[question.id] = form.querySelector('[data-sql-answer]')?.value || '';
  else if (question.kind === 'debug') answers[question.id] = { 'bug-line': form.querySelector('[data-debug-line]:checked')?.value || '', replacement: form.querySelector('[data-structured-key="replacement"]')?.value || '' };
  else if (question.kind === 'program') answers[question.id] = form.querySelector('[data-program-answer]')?.value || '';
  else if (question.kind === 'extended') answers[question.id] = form.querySelector('[data-extended-answer]')?.value || '';
}

nav.addEventListener('click', (event) => {
  const button = event.target.closest('[data-type-index]');
  if (!button) return;
  activeIndex = Number(button.dataset.typeIndex);
  lastMovedOrderId = '';
  render();
  document.querySelector('#active-type-heading')?.focus({ preventScroll: true });
});

modeButtons.forEach((button) => button.addEventListener('click', () => { mode = button.dataset.mode; render(); }));

workspace.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = activeQuestion();
  if (event.target.id === 'answer-form') {
    collectStudentAnswer(question);
    results[question.id] = mark(question);
    renderStudent(question);
  }
});

function refreshAnswerEmphasis(question) {
  if (question.kind === 'matching' || question.kind === 'categorisation') {
    document.querySelectorAll('.mapping-row').forEach((row) => row.classList.toggle('is-selected', Boolean(row.querySelector('select')?.value)));
  }
  if (question.kind === 'paragraph') {
    document.querySelectorAll('.cloze-blank').forEach((blank) => blank.classList.toggle('is-selected', Boolean(blank.querySelector('select')?.value)));
  }
  if (question.kind === 'code') {
    document.querySelectorAll('.code-editor label').forEach((blank) => blank.classList.toggle('is-selected', Boolean(blank.querySelector('input')?.value.trim())));
  }
  if (['table', 'truth', 'trace', 'hotspot', 'slots', 'logic-diagram', 'conversion', 'boolean-eval', 'multi-part'].includes(question.kind)) {
    document.querySelectorAll('[data-answer-container]').forEach((container) => container.classList.toggle('is-selected', Boolean(container.querySelector('[data-structured-key]')?.value.trim())));
  }
  if (question.kind === 'debug') {
    document.querySelectorAll('.debug-line').forEach((line) => line.classList.toggle('is-selected', Boolean(line.querySelector('input')?.checked)));
    const replacement = document.querySelector('.replacement-card');
    replacement?.classList.toggle('is-selected', Boolean(replacement.querySelector('select')?.value));
  }
  if (question.kind === 'sql') {
    const sqlInput = document.querySelector('#sql-answer');
    const sqlShell = document.querySelector('.sql-editor-shell');
    const sqlPreview = document.querySelector('#sql-preview-code');
    sqlShell?.classList.toggle('is-filled', Boolean(sqlInput?.value.trim()));
    if (sqlPreview) sqlPreview.innerHTML = sqlInput?.value.trim() ? highlightSql(sqlInput.value) : '<span class="syntax-comment">-- Your colour-coded query will appear here</span>';
  }
  if (question.kind === 'program') {
    const input = document.querySelector('#program-answer');
    const editor = document.querySelector('.program-editor');
    const preview = document.querySelector('#program-preview-code');
    editor?.classList.toggle('is-filled', Boolean(input?.value.trim()));
    if (preview) preview.innerHTML = input?.value.trim() ? highlightPython(input.value) : '<span class="syntax-comment"># Your colour-coded return statement will appear here</span>';
  }
  if (question.kind === 'extended') {
    const input = document.querySelector('#extended-answer');
    const editor = document.querySelector('.extended-editor');
    const counter = document.querySelector('#extended-word-count');
    const count = String(input?.value || '').trim().split(/\s+/).filter(Boolean).length;
    editor?.classList.toggle('is-filled', Boolean(input?.value.trim()));
    if (counter) counter.textContent = `${count} words · minimum ${question.config.minimumWords}`;
  }
  document.querySelector('#short-answer')?.classList.toggle('is-filled', Boolean(document.querySelector('#short-answer')?.value.trim()));
  document.querySelector('.number-answer')?.classList.toggle('is-filled', Boolean(document.querySelector('#numeric-answer')?.value.trim()));
}

workspace.addEventListener('change', () => {
  if (mode !== 'student' || !document.querySelector('#answer-form')) return;
  const question = activeQuestion();
  collectStudentAnswer(question);
  delete results[question.id];
  if (question.kind === 'logic-diagram') renderStudent(question);
  else refreshAnswerEmphasis(question);
});

workspace.addEventListener('input', () => {
  if (mode !== 'student' || !document.querySelector('#answer-form')) return;
  const question = activeQuestion();
  collectStudentAnswer(question);
  delete results[question.id];
  refreshAnswerEmphasis(question);
});

workspace.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  const question = activeQuestion();
  if ((action === 'move-up' || action === 'move-down') && question.kind === 'ordering') {
    const from = Number(event.target.closest('[data-order-index]').dataset.orderIndex);
    const to = action === 'move-up' ? from - 1 : from + 1;
    if (to >= 0 && to < answers[question.id].length) {
      lastMovedOrderId = answers[question.id][from];
      [answers[question.id][from], answers[question.id][to]] = [answers[question.id][to], answers[question.id][from]];
      delete results[question.id];
      renderStudent(question);
    }
    return;
  }
  if (action === 'reset') {
    answers[question.id] = initialAnswer(question);
    delete results[question.id];
    renderStudent(question);
  }
  if (action === 'previous' && activeIndex > 0) {
    activeIndex -= 1;
    render();
    document.querySelector('#active-type-heading')?.focus();
  }
  if (action === 'next' && activeIndex < questions.length - 1) {
    activeIndex += 1;
    render();
    document.querySelector('#active-type-heading')?.focus();
  }
});

approvalBody.addEventListener('click', (event) => {
  const button = event.target.closest('[data-approval]');
  if (!button) return;
  const question = activeQuestion();
  approvals[question.id] ||= {};
  approvals[question.id][button.dataset.approval] = !approvals[question.id][button.dataset.approval];
  try { localStorage.setItem('question-lab-approvals', JSON.stringify(approvals)); } catch { /* Storage is optional. */ }
  renderApproval();
});

render();
