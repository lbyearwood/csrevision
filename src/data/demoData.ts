import { leaderboardDisplay } from '../lib/identity';
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

const ocrCourse = [
  {
    "unitCode": "1",
    "unitTitle": "Programming",
    "topics": [
      {
        "code": "1.1",
        "title": "Programming fundamentals"
      },
      {
        "code": "1.2",
        "title": "Sequence and selection"
      },
      {
        "code": "1.3",
        "title": "Iteration"
      },
      {
        "code": "1.4",
        "title": "Arrays"
      },
      {
        "code": "1.5",
        "title": "Procedures and functions"
      },
      {
        "code": "1.6",
        "title": "Text files"
      },
      {
        "code": "1.7",
        "title": "Introduction to SQL"
      },
      {
        "code": "1.8",
        "title": "Defensive design"
      },
      {
        "code": "1.9",
        "title": "Errors and testing"
      },
      {
        "code": "1.10",
        "title": "Translators and facilities"
      },
      {
        "code": "1.11",
        "title": "IDEs"
      }
    ]
  },
  {
    "unitCode": "2",
    "unitTitle": "Hardware",
    "topics": [
      {
        "code": "2.1",
        "title": "Architecture of the CPU"
      },
      {
        "code": "2.2",
        "title": "CPU performance and Embedded systems"
      },
      {
        "code": "2.3",
        "title": "Primary Memory"
      },
      {
        "code": "2.4",
        "title": "Secondary storage"
      }
    ]
  },
  {
    "unitCode": "3",
    "unitTitle": "Software",
    "topics": [
      {
        "code": "3.1",
        "title": "Operating systems"
      },
      {
        "code": "3.2",
        "title": "Utility software"
      }
    ]
  },
  {
    "unitCode": "4",
    "unitTitle": "Data representation",
    "topics": [
      {
        "code": "4.1",
        "title": "Units and binary numbers"
      },
      {
        "code": "4.2",
        "title": "Binary arithmetic and hexadecimal"
      },
      {
        "code": "4.3",
        "title": "Logic gates and Truth tables"
      },
      {
        "code": "4.4",
        "title": "Characters"
      },
      {
        "code": "4.5",
        "title": "Images"
      },
      {
        "code": "4.6",
        "title": "Sound"
      },
      {
        "code": "4.7",
        "title": "Data compression, File Formats & Encryption"
      }
    ]
  },
  {
    "unitCode": "5",
    "unitTitle": "Networks",
    "topics": [
      {
        "code": "5.1",
        "title": "LAN"
      },
      {
        "code": "5.2",
        "title": "LAN Hardware"
      },
      {
        "code": "5.3",
        "title": "LAN Topologies"
      },
      {
        "code": "5.4",
        "title": "The Internet and WAN"
      },
      {
        "code": "5.5",
        "title": "Client-server and P2P networks"
      },
      {
        "code": "5.6",
        "title": "Network Protocols and Layers"
      }
    ]
  },
  {
    "unitCode": "6",
    "unitTitle": "Cyber security",
    "topics": [
      {
        "code": "6.1",
        "title": "Network threats"
      },
      {
        "code": "6.2",
        "title": "Preventing vulnerabilities"
      }
    ]
  },
  {
    "unitCode": "7",
    "unitTitle": "Algorithms",
    "topics": [
      {
        "code": "7.1",
        "title": "Computational thinking"
      },
      {
        "code": "7.2",
        "title": "Searching algorithms"
      },
      {
        "code": "7.3",
        "title": "Sorting algorithms"
      },
      {
        "code": "7.4",
        "title": "Flowcharts"
      },
      {
        "code": "7.5",
        "title": "Pseudocode"
      },
      {
        "code": "7.6",
        "title": "Interpreting algorithms"
      }
    ]
  },
  {
    "unitCode": "8",
    "unitTitle": "Societal implications of digital technology",
    "topics": [
      {
        "code": "8.1",
        "title": "Ethical and cultural issues"
      },
      {
        "code": "8.2",
        "title": "Environmental issues"
      },
      {
        "code": "8.3",
        "title": "Legislation & privacy"
      }
    ]
  }
] as const;

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
    const topicName = `${topic.code} ${topic.title}`;
    const topicSlug = slugify(topicName);
    return {
      id: `topic-${topicSlug}`,
      unitId: `unit-${unit.unitCode}`,
      topicName,
      topicSlug,
      testId: `test-${topicSlug}`,
      testVersionId: `version-${topicSlug}-1`,
    };
  }),
);

export const units: Unit[] = ocrCourse.map((unit) => ({
  id: `unit-${unit.unitCode}`,
  subjectId: 'subject-ocr-cs',
  unitName: `${unit.unitCode}. ${unit.unitTitle}`,
}));

export const topics: Topic[] = topicRows.map((topic) => ({
  id: topic.id,
  unitId: topic.unitId,
  topicName: topic.topicName,
}));

export const tests: Test[] = topicRows.map((topic) => ({
  id: topic.testId,
  topicId: topic.id,
  testTitle: 'Test',
  testDescription: `A short multiple-choice test covering the key ideas and vocabulary for ${topic.topicName}.`,
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
    `Which option best matches the focus of ${topic.topicName}?`,
    `What should a student revise first for ${topic.topicName}?`,
    `Which resource belongs with ${topic.topicName}?`,
    `Which statement is safest to keep as a placeholder for ${topic.topicName}?`,
    'What is this practice check for?',
  ];
  const correctOptions = [
    `The key ideas and vocabulary for ${topic.topicName}`,
    `The main definitions, examples and exam command words for ${topic.topicName}`,
    `A short multiple choice check for ${topic.topicName}`,
    'This question is dummy content and must be replaced before production',
    topic.topicName,
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

export const questions: Question[] = topicRows.flatMap(buildQuestions);

const assignedTopicSlug = '2-1-architecture-of-the-cpu';
const assignedTestId = `test-${assignedTopicSlug}`;
const assignedVersionId = `version-${assignedTopicSlug}-1`;

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
