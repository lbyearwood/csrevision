import type { ResourceKind, TopicResourceStatus } from "./resourceStatus";
import { gcseResourceStatus, resourceLabels } from "./resourceStatus";
import { routes } from "./routes";

export type TopicResourceLink = {
  kind: ResourceKind;
  label: string;
  href?: string;
  sourceAvailable: boolean;
};

export type GcseTopic = {
  id: string;
  code: string;
  title: string;
  resources: TopicResourceLink[];
};

export type GcseTopicGroup = {
  heading: string;
  topics: GcseTopic[];
};

export type GcsePaper = {
  paper: string;
  groups: GcseTopicGroup[];
};

const migratedResourceRoutes: Partial<Record<string, Partial<Record<ResourceKind, string>>>> = {
  "1-1-1": {
    lesson: routes.cpuArchitectureLesson,
    exam: routes.cpuArchitectureExam,
    quiz: routes.cpuArchitectureQuiz,
  },
};

const rawTopicGroups = [
  {
    paper: "Paper 1",
    groups: [
      {
        heading: "1.1 Systems architecture",
        topics: [
          ["1-1-1", "1.1.1 Architecture of the CPU"],
          ["1-1-2", "1.1.2 CPU performance"],
          ["1-1-3", "1.1.3 Embedded systems"],
        ],
      },
      {
        heading: "1.2 Memory and storage",
        topics: [
          ["1-2-1", "1.2.1 Primary storage"],
          ["1-2-2", "1.2.2 Virtual memory"],
          ["1-2-3", "1.2.3 Secondary storage"],
          ["1-2-4", "1.2.4 Binary units"],
          ["1-2-5", "1.2.5 Binary number system"],
          ["1-2-6", "1.2.6 Hexadecimal number system"],
          ["1-2-7", "1.2.7 Binary addition and binary shifts"],
          ["1-2-8", "1.2.8 Characters"],
          ["1-2-9", "1.2.9 Images"],
          ["1-2-10", "1.2.10 Sound"],
          ["1-2-11", "1.2.11 Compression"],
        ],
      },
      {
        heading: "1.3 Computer networks, connections and protocols",
        topics: [
          ["1-3-1", "1.3.1 LAN vs WAN"],
          ["1-3-2", "1.3.2 Star vs Mesh topologies"],
          ["1-3-3", "1.3.3 Client-server vs Peer-to-peer architectures"],
          ["1-3-4", "1.3.4 Network hardware"],
          ["1-3-5", "1.3.5 The Internet, DNS and Cloud"],
          ["1-3-6", "1.3.6 Wired vs Wireless networks and performance factors"],
          ["1-3-7", "1.3.7 Network protocols"],
          ["1-3-8", "1.3.8 Network layers"],
          ["1-3-9", "1.3.9 Encryption"],
        ],
      },
      {
        heading: "1.4 Network security",
        topics: [
          ["1-4-1", "1.4.1 Threats to computer systems and networks"],
          ["1-4-2", "1.4.2 Identifying and preventing vulnerabilities"],
        ],
      },
      {
        heading: "1.5 Systems software",
        topics: [
          ["1-5-1", "1.5.1 Operating systems"],
          ["1-5-2", "1.5.2 Utility software"],
        ],
      },
      {
        heading: "1.6 Impacts of digital technology",
        topics: [
          ["1-6-1-1", "1.6.1.1 Ethical, legal, cultural, environmental and privacy issues"],
          ["1-6-1-2", "1.6.1.2 Legislation"],
          ["1-6-1-3", "1.6.1.3 Software licences"],
        ],
      },
    ],
  },
  {
    paper: "Paper 2",
    groups: [
      {
        heading: "2.1 Algorithms",
        topics: [
          ["2-1-1", "2.1.1 Abstraction"],
          ["2-1-2", "2.1.2 Decomposition"],
          ["2-1-3", "2.1.3 Algorithmic thinking"],
          ["2-1-4", "2.1.4 Structure diagrams"],
          ["2-1-5", "2.1.5 Pseudocode"],
          ["2-1-6", "2.1.6 Flowcharts"],
          ["2-1-7", "2.1.7 Identifying common errors"],
          ["2-1-8", "2.1.8 Searching algorithms"],
          ["2-1-9", "2.1.9 Sorting algorithms"],
          ["2-1-10", "2.1.10 Trace tables"],
        ],
      },
      {
        heading: "2.2 Programming fundamentals",
        topics: [
          ["2-2-1", "2.2.1 Variables, Constants, Data types and Type Casting"],
          ["2-2-2", "2.2.2 Input and output"],
          ["2-2-3", "2.2.3 Arithmetic operators and Math functions"],
          ["2-2-4", "2.2.4 Comparison and Boolean operators"],
          ["2-2-5", "2.2.5 Evaluating multi-term conditions"],
          ["2-2-6", "2.2.6 String functions and string operators"],
          ["2-2-7", "2.2.7 Selection constructs"],
          ["2-2-8", "2.2.8 Iteration constructs"],
          ["2-2-9", "2.2.9 Status Flags"],
          ["2-2-10", "2.2.10 1D Lists"],
          ["2-2-11", "2.2.11 Subroutines"],
          ["2-2-12", "2.2.12 Nested Selection constructs"],
          ["2-2-13", "2.2.13 Nested Iteration constructs"],
          ["2-2-14", "2.2.14 2D Lists"],
          ["2-2-15", "2.2.15 Exception Handling"],
          ["2-2-16", "2.2.16 File handling"],
          ["2-2-17", "2.2.17 Records"],
          ["2-2-18", "2.2.18 SQL"],
        ],
      },
      {
        heading: "2.3 Producing robust programs",
        topics: [
          ["2-3-1", "2.3.1 Defensive design"],
          ["2-3-2", "2.3.2 Testing & identifying errors"],
        ],
      },
      {
        heading: "2.4 Boolean logic",
        topics: [
          ["2-4-1", "2.4.1 Logic gate diagrams"],
          ["2-4-2", "2.4.2 Truth tables"],
        ],
      },
      {
        heading: "2.5 Programming languages and IDEs",
        topics: [
          ["2-5-1", "2.5.1 Languages"],
          ["2-5-2", "2.5.2 The Integrated Development Environment (IDE)"],
        ],
      },
      {
        heading: "2.6 Writing programs",
        topics: [
          ["2-6-1", "2.6.1 Writing basic programs"],
          ["2-6-2", "2.6.2 Writing advanced programs"],
        ],
      },
    ],
  },
] as const;

const emptyStatus: TopicResourceStatus = {
  lesson: false,
  tasks: false,
  exam: false,
  quiz: false,
};

function splitTopicTitle(title: string) {
  const match = title.match(/^([\d.]+)\s+(.+)$/);

  return {
    code: match?.[1] ?? "",
    title: match?.[2] ?? title,
  };
}

function getTopicResources(topicId: string): TopicResourceLink[] {
  const status = gcseResourceStatus[topicId] ?? emptyStatus;
  const topicRoutes = migratedResourceRoutes[topicId] ?? {};

  return (Object.keys(resourceLabels) as ResourceKind[]).map((kind) => ({
    kind,
    label: resourceLabels[kind],
    href: topicRoutes[kind],
    sourceAvailable: status[kind],
  }));
}

export const gcseTopicGroups: GcsePaper[] = rawTopicGroups.map((paper) => ({
  paper: paper.paper,
  groups: paper.groups.map((group) => ({
    heading: group.heading,
    topics: group.topics.map(([id, fullTitle]) => ({
      id,
      ...splitTopicTitle(fullTitle),
      resources: getTopicResources(id),
    })),
  })),
}));

export const gcseTopics = gcseTopicGroups.flatMap((paper) =>
  paper.groups.flatMap((group) => group.topics),
);
