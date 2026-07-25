/* global console, process */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const subjectUuid = '50000000-0000-4000-8000-000000000001';
const teacherProfileUuid = '10000000-0000-4000-8000-000000000001';
const class8aUuid = '40000000-0000-4000-8000-000000000001';
const student1Uuid = '30000000-0000-4000-8000-000000000101';
const student2Uuid = '30000000-0000-4000-8000-000000000102';
const attempt1Uuid = '58000000-0000-4000-8000-000000000101';
const attempt2Uuid = '58000000-0000-4000-8000-000000000102';
const assignmentUuid = '57000000-0000-4000-8000-000000000001';

const oldSeedIds = {
  units: [
    '51000000-0000-4000-8000-000000000001',
    '51000000-0000-4000-8000-000000000002',
  ],
  topics: [
    '52000000-0000-4000-8000-000000000001',
    '52000000-0000-4000-8000-000000000002',
    '52000000-0000-4000-8000-000000000003',
  ],
  tests: [
    '53000000-0000-4000-8000-000000000001',
    '53000000-0000-4000-8000-000000000002',
  ],
  versions: [
    '54000000-0000-4000-8000-000000000001',
    '54000000-0000-4000-8000-000000000002',
  ],
  questions: [
    '55000000-0000-4000-8000-000000000001',
    '55000000-0000-4000-8000-000000000002',
    '55000000-0000-4000-8000-000000000003',
    '55000000-0000-4000-8000-000000000004',
    '55000000-0000-4000-8000-000000000011',
    '55000000-0000-4000-8000-000000000012',
    '55000000-0000-4000-8000-000000000013',
    '55000000-0000-4000-8000-000000000014',
  ],
  options: [
    '56000000-0000-4000-8000-000000000001',
    '56000000-0000-4000-8000-000000000002',
    '56000000-0000-4000-8000-000000000003',
    '56000000-0000-4000-8000-000000000004',
    '56000000-0000-4000-8000-000000000005',
    '56000000-0000-4000-8000-000000000006',
    '56000000-0000-4000-8000-000000000007',
    '56000000-0000-4000-8000-000000000008',
    '56000000-0000-4000-8000-000000000009',
    '56000000-0000-4000-8000-000000000010',
    '56000000-0000-4000-8000-000000000011',
    '56000000-0000-4000-8000-000000000012',
    '56000000-0000-4000-8000-000000000013',
    '56000000-0000-4000-8000-000000000014',
    '56000000-0000-4000-8000-000000000015',
    '56000000-0000-4000-8000-000000000016',
    '56000000-0000-4000-8000-000000000017',
    '56000000-0000-4000-8000-000000000018',
    '56000000-0000-4000-8000-000000000019',
    '56000000-0000-4000-8000-000000000020',
  ],
};

const ocrCourse = [
  {
    unitCode: '1',
    unitTitle: 'Programming',
    topics: [
      { code: '1.1', title: 'Programming fundamentals' },
      { code: '1.2', title: 'Sequence and selection' },
      { code: '1.3', title: 'Iteration' },
      { code: '1.4', title: 'Arrays' },
      { code: '1.5', title: 'Procedures and functions' },
      { code: '1.6', title: 'Text files' },
      { code: '1.7', title: 'Introduction to SQL' },
      { code: '1.8', title: 'Defensive design' },
      { code: '1.9', title: 'Errors and testing' },
      { code: '1.10', title: 'Translators and facilities' },
      { code: '1.11', title: 'IDEs' },
    ],
  },
  {
    unitCode: '2',
    unitTitle: 'Hardware',
    topics: [
      { code: '2.1', title: 'Architecture of the CPU' },
      { code: '2.2', title: 'CPU performance and Embedded systems' },
      { code: '2.3', title: 'Primary Memory' },
      { code: '2.4', title: 'Secondary storage' },
    ],
  },
  {
    unitCode: '3',
    unitTitle: 'Software',
    topics: [
      { code: '3.1', title: 'Operating systems' },
      { code: '3.2', title: 'Utility software' },
    ],
  },
  {
    unitCode: '4',
    unitTitle: 'Data representation',
    topics: [
      { code: '4.1', title: 'Units and binary numbers' },
      { code: '4.2', title: 'Binary arithmetic and hexadecimal' },
      { code: '4.3', title: 'Logic gates and Truth tables' },
      { code: '4.4', title: 'Characters' },
      { code: '4.5', title: 'Images' },
      { code: '4.6', title: 'Sound' },
      { code: '4.7', title: 'Data compression, File Formats & Encryption' },
    ],
  },
  {
    unitCode: '5',
    unitTitle: 'Networks',
    topics: [
      { code: '5.1', title: 'LAN' },
      { code: '5.2', title: 'LAN Hardware' },
      { code: '5.3', title: 'LAN Topologies' },
      { code: '5.4', title: 'The Internet and WAN' },
      { code: '5.5', title: 'Client-server and P2P networks' },
      { code: '5.6', title: 'Network Protocols and Layers' },
    ],
  },
  {
    unitCode: '6',
    unitTitle: 'Cyber security',
    topics: [
      { code: '6.1', title: 'Network threats' },
      { code: '6.2', title: 'Preventing vulnerabilities' },
    ],
  },
  {
    unitCode: '7',
    unitTitle: 'Algorithms',
    topics: [
      { code: '7.1', title: 'Computational thinking' },
      { code: '7.2', title: 'Searching algorithms' },
      { code: '7.3', title: 'Sorting algorithms' },
      { code: '7.4', title: 'Flowcharts' },
      { code: '7.5', title: 'Pseudocode' },
      { code: '7.6', title: 'Interpreting algorithms' },
    ],
  },
  {
    unitCode: '8',
    unitTitle: 'Societal implications of digital technology',
    topics: [
      { code: '8.1', title: 'Ethical and cultural issues' },
      { code: '8.2', title: 'Environmental issues' },
      { code: '8.3', title: 'Legislation & privacy' },
    ],
  },
];

const repoRoot = resolve(process.cwd());
const demoDataPath = resolve(repoRoot, 'src/data/demoData.ts');
const seedPath = resolve(repoRoot, 'supabase/seed.sql');
const assignedTopicSlug = slugify('2.1 Architecture of the CPU');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uuidFromSeed(seed) {
  const hash = createHash('md5').update(seed).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlUuidList(values) {
  return values.map((value) => `'${value}'`).join(', ');
}

function sqlArray(values) {
  if (!values.length) return "'{}'";
  return `array[${values.map(sqlString).join(', ')}]`;
}

function flattenTopics() {
  return ocrCourse.flatMap((unit) =>
    unit.topics.map((topic, topicIndex) => {
      const topicName = `${topic.code} ${topic.title}`;
      const topicSlug = slugify(topicName);
      return {
        unitCode: unit.unitCode,
        unitTitle: unit.unitTitle,
        unitSlug: `unit-${unit.unitCode}-${slugify(unit.unitTitle)}`,
        unitId: `unit-${unit.unitCode}`,
        topicCode: topic.code,
        topicTitle: topic.title,
        topicName,
        topicSlug,
        topicId: `topic-${topicSlug}`,
        testId: `test-${topicSlug}`,
        testVersionId: `version-${topicSlug}-1`,
        displayOrder: topicIndex + 1,
      };
    }),
  );
}

function buildQuestions(topic) {
  const prompts = [
    `Which option best matches the focus of ${topic.topicName}?`,
    `What should a student revise first for ${topic.topicName}?`,
    `Which resource belongs with ${topic.topicName}?`,
    `Which statement is safest to keep as a placeholder for ${topic.topicName}?`,
    `What is this practice check for?`,
  ];
  const correctOptions = [
    `The key ideas and vocabulary for ${topic.topicName}`,
    `The main definitions, examples and exam command words for ${topic.topicName}`,
    `A short multiple choice check for ${topic.topicName}`,
    `This question is dummy content and must be replaced before production`,
    `${topic.topicName}`,
  ];
  return prompts.map((questionText, questionIndex) => {
    const questionOrder = questionIndex + 1;
    const questionId = `q-${topic.topicSlug}-${questionOrder}`;
    return {
      id: questionId,
      testVersionId: topic.testVersionId,
      questionOrder,
      questionType: 'multiple_choice',
      questionText,
      maxMarks: 1,
      studentExplanation: `Placeholder explanation for ${topic.topicName}. Replace this when production questions are authored.`,
      options: [
        {
          id: `opt-${topic.topicSlug}-${questionOrder}-a`,
          questionId,
          optionText: correctOptions[questionIndex],
          optionOrder: 1,
        },
        {
          id: `opt-${topic.topicSlug}-${questionOrder}-b`,
          questionId,
          optionText: 'A randomly chosen item from another course',
          optionOrder: 2,
        },
        {
          id: `opt-${topic.topicSlug}-${questionOrder}-c`,
          questionId,
          optionText: 'A teacher-only planning note',
          optionOrder: 3,
        },
        {
          id: `opt-${topic.topicSlug}-${questionOrder}-d`,
          questionId,
          optionText: 'A finished production question bank',
          optionOrder: 4,
        },
      ],
    };
  });
}

function generateDemoData() {
  const topicMapLiteral = JSON.stringify(ocrCourse, null, 2);
  return `import { leaderboardDisplay } from '../lib/identity';
import { rankLeaderboard } from '../lib/leaderboard';
import { statusForPoints } from '../lib/points';
import type {
  ClassRecord,
  LeaderboardRow,
  Question,
  StudentProfile,
  Test,
  TestAssignment,
  TestAttempt,
  TestVersion,
  Topic,
  Unit,
  Subject,
  TeacherProfile,
  PointsTransaction,
} from '../types/domain';

export const teacher: TeacherProfile = {
  id: 'teacher-1',
  profileId: 'profile-teacher-1',
  displayName: 'J. Doe',
  email: 'j.doe@school.example',
};

export const classes: ClassRecord[] = [
  {
    id: 'class-8a',
    className: '8A Computing',
    academicYear: '2026/27',
    yearGroup: '8',
    ownerTeacherId: teacher.id,
    status: 'active',
  },
  {
    id: 'class-9b',
    className: '9B Computer Science',
    academicYear: '2026/27',
    yearGroup: '9',
    ownerTeacherId: teacher.id,
    status: 'active',
  },
];

export const students: StudentProfile[] = [
  {
    id: 'student-1',
    profileId: 'profile-student-1',
    firstName: 'Ananya',
    surname: 'Singh',
    username: 'asingh5827',
    publicStudentId: '2587',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-2',
    profileId: 'profile-student-2',
    firstName: 'Rohan',
    surname: 'Mehta',
    username: 'rmehta4120',
    publicStudentId: '2410',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-3',
    profileId: 'profile-student-3',
    firstName: 'Diya',
    surname: 'Patel',
    username: 'dpatel9144',
    publicStudentId: '2468',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-4',
    profileId: 'profile-student-4',
    firstName: 'Vikram',
    surname: 'Kumar',
    username: 'vkumar3021',
    publicStudentId: '2390',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-5',
    profileId: 'profile-student-5',
    firstName: 'Maya',
    surname: 'Khan',
    username: 'mkhan7712',
    publicStudentId: '2472',
    classId: 'class-8a',
    accountStatus: 'active',
  },
];

export const subjects: Subject[] = [
  {
    id: 'subject-ocr-cs',
    subjectName: 'OCR GCSE Computer Science',
    description: 'GCSE computer science revision and assessment content.',
  },
];

const ocrCourse = ${topicMapLiteral} as const;

interface TopicRow extends Topic {
  topicSlug: string;
  testId: string;
  testVersionId: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const topicRows: TopicRow[] = ocrCourse.flatMap((unit) =>
  unit.topics.map((topic) => {
    const topicName = \`\${topic.code} \${topic.title}\`;
    const topicSlug = slugify(topicName);
    return {
      id: \`topic-\${topicSlug}\`,
      unitId: \`unit-\${unit.unitCode}\`,
      topicName,
      topicSlug,
      testId: \`test-\${topicSlug}\`,
      testVersionId: \`version-\${topicSlug}-1\`,
    };
  }),
);

export const units: Unit[] = ocrCourse.map((unit) => ({
  id: \`unit-\${unit.unitCode}\`,
  subjectId: 'subject-ocr-cs',
  unitName: \`\${unit.unitCode}. \${unit.unitTitle}\`,
}));

export const topics: Topic[] = topicRows.map((topic) => ({
  id: topic.id,
  unitId: topic.unitId,
  topicName: topic.topicName,
}));

export const tests: Test[] = topicRows.map((topic) => ({
  id: topic.testId,
  topicId: topic.id,
  testTitle: \`\${topic.topicName} Check\`,
  testDescription: \`Placeholder five-question multiple choice check for \${topic.topicName}.\`,
  defaultMode: 'practice',
  defaultTimeLimitSeconds: 900,
  randomiseQuestions: true,
  shuffleOptions: true,
  status: 'published',
}));

export const testVersions: TestVersion[] = topicRows.map((topic) => ({
  id: topic.testVersionId,
  testId: topic.testId,
  versionNumber: 1,
  totalMarks: 5,
  status: 'published',
}));

function buildQuestions(topic: TopicRow): Question[] {
  const prompts = [
    \`Which option best matches the focus of \${topic.topicName}?\`,
    \`What should a student revise first for \${topic.topicName}?\`,
    \`Which resource belongs with \${topic.topicName}?\`,
    \`Which statement is safest to keep as a placeholder for \${topic.topicName}?\`,
    'What is this practice check for?',
  ];
  const correctOptions = [
    \`The key ideas and vocabulary for \${topic.topicName}\`,
    \`The main definitions, examples and exam command words for \${topic.topicName}\`,
    \`A short multiple choice check for \${topic.topicName}\`,
    'This question is dummy content and must be replaced before production',
    topic.topicName,
  ];

  return prompts.map((questionText, questionIndex) => {
    const questionOrder = questionIndex + 1;
    const questionId = \`q-\${topic.topicSlug}-\${questionOrder}\`;
    return {
      id: questionId,
      testVersionId: topic.testVersionId,
      questionOrder,
      questionType: 'multiple_choice',
      questionText,
      maxMarks: 1,
      studentExplanation: \`Placeholder explanation for \${topic.topicName}. Replace this when production questions are authored.\`,
      options: [
        {
          id: \`opt-\${topic.topicSlug}-\${questionOrder}-a\`,
          questionId,
          optionText: correctOptions[questionIndex],
          optionOrder: 1,
        },
        {
          id: \`opt-\${topic.topicSlug}-\${questionOrder}-b\`,
          questionId,
          optionText: 'A randomly chosen item from another course',
          optionOrder: 2,
        },
        {
          id: \`opt-\${topic.topicSlug}-\${questionOrder}-c\`,
          questionId,
          optionText: 'A teacher-only planning note',
          optionOrder: 3,
        },
        {
          id: \`opt-\${topic.topicSlug}-\${questionOrder}-d\`,
          questionId,
          optionText: 'A finished production question bank',
          optionOrder: 4,
        },
      ],
    };
  });
}

export const questions: Question[] = topicRows.flatMap(buildQuestions);

const assignedTopicSlug = '2-1-architecture-of-the-cpu';
const assignedTestId = \`test-\${assignedTopicSlug}\`;
const assignedVersionId = \`version-\${assignedTopicSlug}-1\`;

export const assignments: TestAssignment[] = [
  {
    id: 'assignment-2-1-cpu-8a',
    testVersionId: assignedVersionId,
    classId: 'class-8a',
    startAt: '2026-07-25T08:00:00.000Z',
    dueAt: '2026-08-31T22:59:00.000Z',
    timeLimitSeconds: 900,
    attemptLimit: 1,
    feedbackPolicy: 'score_only',
    status: 'open',
  },
];

export const attempts: TestAttempt[] = [
  {
    id: 'attempt-1',
    studentId: 'student-1',
    classIdAtAttempt: 'class-8a',
    testId: assignedTestId,
    testVersionId: assignedVersionId,
    attemptType: 'practice',
    attemptNumber: 1,
    status: 'feedback_released',
    startedAt: '2026-07-05T09:12:00.000Z',
    submittedAt: '2026-07-05T09:22:00.000Z',
    durationSeconds: 600,
    timeLimitSeconds: 900,
    score: 4,
    maxScore: 5,
    percentage: 80,
    markingStatus: 'marked',
    feedbackStatus: 'released',
    suspiciousEventCount: 1,
  },
  {
    id: 'attempt-2',
    studentId: 'student-2',
    classIdAtAttempt: 'class-8a',
    testId: assignedTestId,
    testVersionId: assignedVersionId,
    attemptType: 'practice',
    attemptNumber: 1,
    status: 'feedback_released',
    startedAt: '2026-07-04T10:00:00.000Z',
    submittedAt: '2026-07-04T10:08:00.000Z',
    durationSeconds: 480,
    timeLimitSeconds: 900,
    score: 5,
    maxScore: 5,
    percentage: 100,
    markingStatus: 'marked',
    feedbackStatus: 'released',
    suspiciousEventCount: 0,
  },
];

export const pointsTransactions: PointsTransaction[] = [
  {
    id: 'points-1',
    studentId: 'student-1',
    points: 320,
    reason: 'Practice progress and assigned completion',
    createdAt: '2026-07-05T09:22:00.000Z',
  },
  {
    id: 'points-2',
    studentId: 'student-2',
    points: 360,
    reason: 'Strong CPU practice score',
    createdAt: '2026-07-04T10:08:00.000Z',
  },
  {
    id: 'points-3',
    studentId: 'student-3',
    points: 260,
    reason: 'Recent assessment progress',
    createdAt: '2026-07-03T11:25:00.000Z',
  },
  {
    id: 'points-4',
    studentId: 'student-4',
    points: 300,
    reason: 'Consistent practice attempts',
    createdAt: '2026-07-06T12:45:00.000Z',
  },
  {
    id: 'points-5',
    studentId: 'student-5',
    points: 160,
    reason: 'New starter progress',
    createdAt: '2026-07-01T15:10:00.000Z',
  },
];

export function pointsForStudent(studentId: string): number {
  return pointsTransactions
    .filter((transaction) => transaction.studentId === studentId)
    .reduce((total, transaction) => total + transaction.points, 0);
}

export const leaderboardRows: LeaderboardRow[] = rankLeaderboard(
  students.map((student) => {
    const points = pointsForStudent(student.id);
    const className = classes.find((classRecord) => classRecord.id === student.classId)?.className ?? '';
    return {
      studentId: student.id,
      displayName: leaderboardDisplay(student),
      publicStudentId: student.publicStudentId,
      className,
      points,
      status: statusForPoints(points).name,
    };
  }),
);
`;
}

function generateSqlInsert(tableName, columns, rows, conflictClause) {
  return `insert into ${tableName} (${columns.join(', ')})\nvalues\n${rows.map((row) => `  (${row.join(', ')})`).join(',\n')}\n${conflictClause};`;
}

function generatedContentSql() {
  const topics = flattenTopics();
  const unitRows = ocrCourse.map((unit, index) => [
    sqlString(uuidFromSeed(`unit:${unit.unitCode}`)),
    sqlString(subjectUuid),
    sqlString(`unit-${unit.unitCode}-${slugify(unit.unitTitle)}`),
    sqlString(`${unit.unitCode}. ${unit.unitTitle}`),
    sqlString(unit.unitCode),
    sqlString(`Placeholder OCR GCSE Computer Science unit for ${unit.unitTitle}.`),
    sqlString('active'),
    String(index + 1),
  ]);
  const topicRows = topics.map((topic) => [
    sqlString(uuidFromSeed(`topic:${topic.topicSlug}`)),
    sqlString(uuidFromSeed(`unit:${topic.unitCode}`)),
    sqlString(topic.topicSlug),
    sqlString(topic.topicName),
    sqlString(`Placeholder OCR topic for ${topic.topicName}.`),
    sqlArray([topic.topicCode, topic.topicTitle]),
    sqlString('active'),
    String(topic.displayOrder),
  ]);
  const testRows = topics.map((topic) => [
    sqlString(uuidFromSeed(`test:${topic.topicSlug}`)),
    sqlString(uuidFromSeed(`topic:${topic.topicSlug}`)),
    sqlString(`${topic.topicSlug}-check`),
    sqlString(`${topic.topicName} Check`),
    sqlString(`Placeholder five-question multiple choice check for ${topic.topicName}.`),
    sqlString('practice'),
    '900',
    sqlString('full_review'),
    'true',
    'true',
    sqlString('published'),
    sqlString(teacherProfileUuid),
  ]);
  const versionRows = topics.map((topic) => [
    sqlString(uuidFromSeed(`test-version:${topic.topicSlug}`)),
    sqlString(uuidFromSeed(`test:${topic.topicSlug}`)),
    '1',
    sqlString('published'),
    '5',
    '900',
    'now()',
    sqlString(teacherProfileUuid),
    sqlString('Placeholder local seed version. Replace with authored production content later.'),
  ]);
  const allQuestions = topics.flatMap((topic) =>
    buildQuestions(topic).map((question) => ({
      ...question,
      topicSlug: topic.topicSlug,
      questionUuid: uuidFromSeed(`question:${topic.topicSlug}:${question.questionOrder}`),
      versionUuid: uuidFromSeed(`test-version:${topic.topicSlug}`),
      correctOptionUuid: uuidFromSeed(`option:${topic.topicSlug}:${question.questionOrder}:1`),
    })),
  );
  const questionRows = allQuestions.map((question) => [
    sqlString(question.questionUuid),
    sqlString(question.versionUuid),
    String(question.questionOrder),
    sqlString('multiple_choice'),
    sqlString(question.questionText),
    '1',
    `to_jsonb(${sqlString(question.correctOptionUuid)}::text)`,
    "'{}'",
    sqlString(question.studentExplanation),
  ]);
  const optionRows = allQuestions.flatMap((question) =>
    question.options.map((option) => [
      sqlString(uuidFromSeed(`option:${question.topicSlug}:${question.questionOrder}:${option.optionOrder}`)),
      sqlString(question.questionUuid),
      sqlString(option.optionText),
      option.optionOrder === 1 ? 'true' : 'false',
      String(option.optionOrder),
      option.optionOrder === 1 ? sqlString('Correct.') : sqlString('Placeholder distractor.'),
    ]),
  );
  const assignedTopic = topics.find((topic) => topic.topicSlug === assignedTopicSlug);
  if (!assignedTopic) throw new Error('Assigned placeholder topic not found.');
  const assignedTestUuid = uuidFromSeed(`test:${assignedTopic.topicSlug}`);
  const assignedVersionUuid = uuidFromSeed(`test-version:${assignedTopic.topicSlug}`);
  const assignedQuestions = Array.from({ length: 5 }, (_, questionIndex) => {
    const questionOrder = questionIndex + 1;
    return {
      questionOrder,
      questionUuid: uuidFromSeed(`question:${assignedTopic.topicSlug}:${questionOrder}`),
      correctOptionUuid: uuidFromSeed(`option:${assignedTopic.topicSlug}:${questionOrder}:1`),
      wrongOptionUuid: uuidFromSeed(`option:${assignedTopic.topicSlug}:${questionOrder}:2`),
    };
  });
  const answerRows = [
    ...assignedQuestions.map((question) => {
      const chosenOptionUuid = question.questionOrder === 2 ? question.wrongOptionUuid : question.correctOptionUuid;
      const isCorrect = question.questionOrder === 2 ? 'false' : 'true';
      return [
        sqlString(`61000000-0000-4000-8000-00000000010${question.questionOrder}`),
        sqlString(attempt1Uuid),
        sqlString(question.questionUuid),
        `to_jsonb(${sqlString(chosenOptionUuid)}::text)`,
        'null',
        isCorrect,
        isCorrect === 'true' ? '1' : '0',
        '1',
        sqlString('system'),
        isCorrect === 'true' ? sqlString('Correct answer.') : sqlString('Review this question and try again.'),
      ];
    }),
    ...assignedQuestions.map((question) => [
      sqlString(`61000000-0000-4000-8000-00000000020${question.questionOrder}`),
      sqlString(attempt2Uuid),
      sqlString(question.questionUuid),
      `to_jsonb(${sqlString(question.correctOptionUuid)}::text)`,
      'null',
      'true',
      '1',
      '1',
      sqlString('system'),
      sqlString('Correct answer.'),
    ]),
  ];

  return `-- Placeholder OCR topic/resource seed generated by scripts/generate-placeholder-resources.mjs.
-- These questions are dummy content for development only.

${generateSqlInsert(
  'public.units',
  ['id', 'subject_id', 'slug', 'unit_name', 'unit_code', 'description', 'status', 'display_order'],
  unitRows,
  `on conflict (id) do update
set
  subject_id = excluded.subject_id,
  slug = excluded.slug,
  unit_name = excluded.unit_name,
  unit_code = excluded.unit_code,
  description = excluded.description,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now()`,
)}

${generateSqlInsert(
  'public.topics',
  ['id', 'unit_id', 'slug', 'topic_name', 'description', 'keywords', 'status', 'display_order'],
  topicRows,
  `on conflict (id) do update
set
  unit_id = excluded.unit_id,
  slug = excluded.slug,
  topic_name = excluded.topic_name,
  description = excluded.description,
  keywords = excluded.keywords,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now()`,
)}

${generateSqlInsert(
  'public.tests',
  [
    'id',
    'topic_id',
    'slug',
    'test_title',
    'test_description',
    'default_mode',
    'default_time_limit_seconds',
    'default_feedback_policy',
    'randomise_questions',
    'shuffle_options',
    'status',
    'created_by',
  ],
  testRows,
  `on conflict (id) do update
set
  topic_id = excluded.topic_id,
  slug = excluded.slug,
  test_title = excluded.test_title,
  test_description = excluded.test_description,
  default_mode = excluded.default_mode,
  default_time_limit_seconds = excluded.default_time_limit_seconds,
  default_feedback_policy = excluded.default_feedback_policy,
  randomise_questions = excluded.randomise_questions,
  shuffle_options = excluded.shuffle_options,
  status = excluded.status,
  created_by = excluded.created_by,
  updated_at = now()`,
)}

${generateSqlInsert(
  'public.test_versions',
  [
    'id',
    'test_id',
    'version_number',
    'status',
    'total_marks',
    'estimated_duration_seconds',
    'published_at',
    'published_by',
    'version_notes',
  ],
  versionRows,
  'on conflict (id) do nothing',
)}

${generateSqlInsert(
  'public.questions',
  [
    'id',
    'test_version_id',
    'question_order',
    'question_type',
    'question_text',
    'max_marks',
    'correct_answer',
    'accepted_keywords',
    'student_explanation',
  ],
  questionRows,
  'on conflict (id) do nothing',
)}

${generateSqlInsert(
  'public.question_options',
  ['id', 'question_id', 'option_text', 'is_correct', 'option_order', 'feedback'],
  optionRows,
  'on conflict (id) do nothing',
)}

insert into public.test_assignments (
  id,
  test_version_id,
  assigned_by,
  class_id,
  start_at,
  due_at,
  time_limit_seconds,
  attempt_limit,
  feedback_policy,
  status
)
values (
  ${sqlString(assignmentUuid)},
  ${sqlString(assignedVersionUuid)},
  ${sqlString(teacherProfileUuid)},
  ${sqlString(class8aUuid)},
  '2026-07-25T08:00:00Z',
  '2026-08-31T22:59:00Z',
  900,
  1,
  'score_only',
  'open'
)
on conflict (id) do update
set
  test_version_id = excluded.test_version_id,
  assigned_by = excluded.assigned_by,
  class_id = excluded.class_id,
  start_at = excluded.start_at,
  due_at = excluded.due_at,
  time_limit_seconds = excluded.time_limit_seconds,
  attempt_limit = excluded.attempt_limit,
  feedback_policy = excluded.feedback_policy,
  status = excluded.status,
  updated_at = now();

insert into public.test_attempts (
  id,
  student_id,
  class_id_at_attempt,
  test_id,
  test_version_id,
  attempt_type,
  attempt_number,
  status,
  started_at,
  submitted_at,
  duration_seconds,
  time_limit_seconds,
  score,
  max_score,
  percentage,
  marking_status,
  feedback_status,
  points_awarded,
  suspicious_event_count
)
values
  (${sqlString(attempt1Uuid)}, ${sqlString(student1Uuid)}, ${sqlString(class8aUuid)}, ${sqlString(assignedTestUuid)}, ${sqlString(assignedVersionUuid)}, 'practice', 1, 'feedback_released', '2026-07-05T09:12:00Z', '2026-07-05T09:22:00Z', 600, 900, 4, 5, 80, 'marked', 'released', 95, 1),
  (${sqlString(attempt2Uuid)}, ${sqlString(student2Uuid)}, ${sqlString(class8aUuid)}, ${sqlString(assignedTestUuid)}, ${sqlString(assignedVersionUuid)}, 'practice', 1, 'feedback_released', '2026-07-04T10:00:00Z', '2026-07-04T10:08:00Z', 480, 900, 5, 5, 100, 'marked', 'released', 125, 0)
on conflict (id) do update
set
  student_id = excluded.student_id,
  class_id_at_attempt = excluded.class_id_at_attempt,
  test_id = excluded.test_id,
  test_version_id = excluded.test_version_id,
  attempt_type = excluded.attempt_type,
  attempt_number = excluded.attempt_number,
  status = excluded.status,
  started_at = excluded.started_at,
  submitted_at = excluded.submitted_at,
  duration_seconds = excluded.duration_seconds,
  time_limit_seconds = excluded.time_limit_seconds,
  score = excluded.score,
  max_score = excluded.max_score,
  percentage = excluded.percentage,
  marking_status = excluded.marking_status,
  feedback_status = excluded.feedback_status,
  points_awarded = excluded.points_awarded,
  suspicious_event_count = excluded.suspicious_event_count,
  updated_at = now();

${generateSqlInsert(
  'public.student_answers',
  [
    'id',
    'attempt_id',
    'question_id',
    'answer',
    'answer_text',
    'is_correct',
    'marks_awarded',
    'max_marks',
    'marked_by',
    'feedback',
  ],
  answerRows,
  `on conflict (id) do update
set
  attempt_id = excluded.attempt_id,
  question_id = excluded.question_id,
  answer = excluded.answer,
  answer_text = excluded.answer_text,
  is_correct = excluded.is_correct,
  marks_awarded = excluded.marks_awarded,
  max_marks = excluded.max_marks,
  marked_by = excluded.marked_by,
  feedback = excluded.feedback,
  updated_at = now()`,
)}

delete from public.question_options
where id in (${sqlUuidList(oldSeedIds.options)});

delete from public.questions
where id in (${sqlUuidList(oldSeedIds.questions)});

delete from public.test_versions
where id in (${sqlUuidList(oldSeedIds.versions)});

delete from public.tests
where id in (${sqlUuidList(oldSeedIds.tests)});

delete from public.topics
where id in (${sqlUuidList(oldSeedIds.topics)});

delete from public.units
where id in (${sqlUuidList(oldSeedIds.units)});
`;
}

function replaceGeneratedSeedContent(seedSql, contentSql) {
  const startMarker = 'insert into public.units (id, subject_id, slug, unit_name, unit_code, description, status, display_order)';
  const endMarker = 'insert into public.points_transactions (id, student_id, related_attempt_id, points, reason, created_by, metadata, created_at)';
  const start = seedSql.indexOf(startMarker);
  const end = seedSql.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Could not find seed content section to replace.');
  }

  return `${seedSql.slice(0, start)}${contentSql}\n${seedSql.slice(end)}`;
}

const seedSql = readFileSync(seedPath, 'utf8');
writeFileSync(demoDataPath, generateDemoData(), 'utf8');
writeFileSync(seedPath, replaceGeneratedSeedContent(seedSql, generatedContentSql()), 'utf8');

const topicCount = flattenTopics().length;
console.log(`Generated ${ocrCourse.length} units, ${topicCount} topics, ${topicCount} tests, and ${topicCount * 5} questions.`);
