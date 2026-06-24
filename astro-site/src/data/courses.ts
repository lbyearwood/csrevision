import type { LessonPageData } from "../lib/lessonTypes";
import { gcseTopicGroups, gcseTopics } from "./gcseTopics";
import { routes } from "./routes";

export const courseCards = [
  {
    title: "GCSE Computer Science",
    description: "Revise key Computer Science topics with clear explanations, diagrams and quick checks.",
    href: routes.gcse,
  },
];

export const gcseDashboard = {
  title: "GCSE Computer Science Dashboard",
  description: "Choose a topic and open the resource you need.",
  primaryTopicHref: routes.cpuArchitectureLesson,
  topicGroups: gcseTopicGroups,
  topics: gcseTopics,
};


export const cpuArchitectureLesson: LessonPageData = {
  courseTitle: "Computer Systems",
  breadcrumb: ["1.1 Systems architecture", "1.1.1 Architecture of the CPU"],
  backHref: routes.gcse,
  backLabel: "Back to topics",
  lessonTitle: "1.1.1 Architecture of the CPU",
  sections: [
    {
      id: "learning-objectives",
      label: "Lesson introduction",
      heading: "Learning objectives",
      cards: [
        {
          title: "By the end of this lesson",
          kind: "list",
          body: "This lesson builds the main ideas needed for OCR GCSE Computer Science topic 1.1.1.",
          items: [
            "Describe the purpose of the Central Processing Unit.",
            "Identify the ALU, Control Unit, cache and registers.",
            "Explain what the PC, MAR, MDR, CIR and ACC store.",
            "Model the fetch-decode-execute cycle.",
            "Explain how Von Neumann architecture uses one shared memory.",
          ],
        },
        {
          title: "How the lesson builds",
          kind: "steps",
          items: [
            "Start with the purpose of the CPU.",
            "Look inside the CPU at its components and registers.",
            "Follow instructions through the fetch-decode-execute cycle.",
            "Connect the cycle to stored programs and Von Neumann architecture.",
          ],
        },
      ],
      support: {
        title: "Start point",
        prompt: "A CPU follows instructions. The rest of the lesson explains how.",
        detail: "Use the lesson slides to move between sections on this page.",
      },
    },
    {
      id: "purpose",
      label: "Part 1 - Purpose of the CPU",
      heading: "The CPU is the computer's main processor",
      cards: [
        {
          title: "Processing instructions",
          kind: "explain",
          body:
            "The Central Processing Unit is the main processor inside a computer. It processes instructions and controls the main operations of the computer.",
          prompt: "Like a brain, it receives information, works out what to do, and sends signals so actions happen.",
        },
        {
          title: "Input, process, output",
          kind: "process",
          process: [
            { label: "Input", detail: "data and instructions", tone: "green" },
            { label: "CPU", detail: "processes and controls", tone: "blue" },
            { label: "Output", detail: "signals and results", tone: "amber" },
          ],
          prompt: "The CPU sits in the middle of many computer operations.",
        },
      ],
      support: {
        title: "Quick check",
        prompt: "Describe the purpose of the CPU in one sentence.",
        detail: "A strong answer says that the CPU processes instructions and controls computer operations.",
      },
    },
    {
      id: "computer-knows",
      label: "Part 1 - Purpose of the CPU",
      heading: "How does the computer know what to do next?",
      cards: [
        {
          title: "A game example",
          kind: "callout",
          tone: "blue",
          body:
            "You open a game. The screen changes, sounds play, buttons respond and the score updates. Each change happens because instructions are being processed.",
        },
        {
          title: "What the CPU needs",
          kind: "list",
          body: "To decide what happens next, the CPU needs:",
          items: [
            "the next instruction to run",
            "the data that instruction will use",
            "control signals so the correct hardware responds",
          ],
        },
      ],
      support: {
        title: "Key idea",
        prompt: "Every change on screen happens because the CPU follows instructions.",
        detail: "The instructions say what to do; the data is the information being worked on.",
      },
    },
    {
      id: "instructions-output",
      label: "Part 1 - Purpose of the CPU",
      heading: "CPU instructions create output",
      cards: [
        {
          title: "Repeated processing",
          kind: "explain",
          body:
            "The CPU repeatedly gets an instruction from memory, processes it, and sends the resulting signal to another part of the computer.",
          prompt: "Output can be text, sound, images, movement or another signal.",
        },
        {
          title: "Instruction to output",
          kind: "process",
          process: [
            { label: "RAM", detail: "stores instruction", tone: "green" },
            { label: "CPU", detail: "executes instruction", tone: "blue" },
            { label: "Device", detail: "receives output signal", tone: "amber" },
          ],
          prompt: "Follow the instruction from memory to the output device.",
        },
      ],
      support: {
        title: "Apply it",
        prompt: "Give one example of output that could be produced after the CPU executes an instruction.",
        detail: "For example: a sound plays, a pixel changes colour, or text appears on screen.",
      },
    },
    {
      id: "instructions-data",
      label: "Part 1 - Purpose of the CPU",
      heading: "The CPU processes instructions and data",
      cards: [
        {
          title: "What memory stores",
          kind: "table",
          body: "A program is made from instructions and data. Both can be stored in memory.",
          table: {
            headers: ["Address", "Example stored in RAM"],
            rows: [
              ["1040", "Instruction: play button instructions"],
              ["1041", "Data: current song data"],
              ["1042", "Instruction: browser tab instructions"],
              ["1043", "Data: webpage image data"],
              ["1044", "Data: game score data"],
            ],
          },
        },
        {
          title: "Instruction or data?",
          kind: "list",
          items: [
            "Instruction: tells the CPU what action to perform.",
            "Data: the information the instruction works on.",
            "The CPU may read, change or store data as the program runs.",
          ],
        },
      ],
      support: {
        title: "Vocabulary check",
        prompt: "Explain the difference between an instruction and data.",
        detail: "Instruction = what to do. Data = the information the instruction works on.",
      },
    },
    {
      id: "purpose-check",
      label: "Part 1 - Purpose of the CPU",
      heading: "Multiple choice question",
      cards: [
        {
          title: "Question",
          kind: "question",
          body: "What is the main purpose of the CPU?",
          items: [
            "A. To permanently store files and programs.",
            "B. To process instructions and control many computer operations.",
            "C. To display images on the monitor.",
            "D. To connect the computer to the Internet.",
          ],
        },
        {
          title: "Eliminate wrong answers",
          kind: "table",
          table: {
            headers: ["Option", "Why it is or is not correct"],
            rows: [
              ["A", "Permanent storage is the job of secondary storage."],
              ["B", "Correct: this describes processing and control."],
              ["C", "Displaying images is the job of output hardware."],
              ["D", "Network connection is not the CPU's main role."],
            ],
          },
        },
      ],
      support: {
        title: "Correct answer",
        prompt: "B. To process instructions and control many computer operations.",
        detail: "The CPU is not permanent storage, a display device or a network device.",
      },
    },
    {
      id: "components",
      label: "Part 2 - CPU components and the FDE cycle",
      heading: "Core CPU components",
      cards: [
        {
          title: "Inside the CPU",
          kind: "grid",
          items: [
            "Control Unit: coordinates CPU operations and decodes instructions",
            "ALU: performs arithmetic, logic operations and comparisons",
            "Registers: tiny, very fast storage locations inside the CPU",
            "Cache: small, fast memory close to or inside the CPU",
          ],
        },
        {
          title: "Control versus calculate",
          kind: "callout",
          tone: "green",
          body:
            "The Control Unit manages the instruction. The ALU carries out calculations, logic operations and comparisons when needed.",
        },
      ],
      support: {
        title: "Remember",
        prompt: "The ALU carries out operations. The Control Unit coordinates.",
        detail: "This distinction appears often in exam questions.",
      },
    },
    {
      id: "registers",
      label: "Part 2 - CPU components and the FDE cycle",
      heading: "Special purpose registers",
      cards: [
        {
          title: "Register roles",
          kind: "table",
          body: "A register is a very small, very fast storage location inside the CPU.",
          table: {
            headers: ["Register", "What it stores"],
            rows: [
              ["PC", "The address of the next instruction."],
              ["MAR", "The address of a memory location."],
              ["MDR", "Data or instructions being transferred to or from memory."],
              ["CIR", "The current instruction while it is decoded and executed."],
              ["ACC", "The result of a calculation."],
            ],
          },
        },
        {
          title: "Address or data?",
          kind: "table",
          table: {
            headers: ["Stores an address", "Stores data, an instruction or a result"],
            rows: [
              ["PC", "MDR"],
              ["MAR", "CIR"],
              ["", "ACC"],
            ],
          },
        },
      ],
      support: {
        title: "Common mix-up",
        prompt: "MAR and MDR are both registers, but they do not store the same type of information.",
        detail: "MAR stores where to look. MDR stores what has been found or what is being written.",
      },
    },
    {
      id: "cache",
      label: "Part 2 - CPU components and the FDE cycle",
      heading: "Cache helps the CPU work faster",
      cards: [
        {
          title: "Frequently used data",
          kind: "explain",
          body:
            "Cache is small, fast memory close to or inside the CPU. It stores frequently used data and instructions so the CPU can access them more quickly than going back to main memory every time.",
        },
        {
          title: "Cache compared with RAM",
          kind: "table",
          table: {
            headers: ["Cache", "RAM"],
            rows: [
              ["Very fast to access.", "Slower than cache."],
              ["Small capacity.", "Larger capacity."],
              ["Stores frequently used data and instructions.", "Stores programs and data currently in use."],
            ],
          },
        },
      ],
      support: {
        title: "Exam link",
        prompt: "Cache is often tested through performance examples.",
        detail: "Mention that cache stores frequently used data and can be accessed faster than main memory.",
      },
    },
    {
      id: "fde-cycle",
      label: "Part 2 - CPU components and the FDE cycle",
      heading: "The fetch-decode-execute cycle",
      cards: [
        {
          title: "The repeated cycle",
          kind: "steps",
          items: [
            "Fetch: the CPU gets the next instruction from memory.",
            "Decode: the Control Unit works out what the instruction means.",
            "Execute: the CPU carries out the instruction using the right components.",
            "Repeat: the CPU moves on to the next instruction.",
          ],
        },
        {
          title: "Cycle overview",
          kind: "process",
          process: [
            { label: "Fetch", detail: "get instruction", tone: "green" },
            { label: "Decode", detail: "work out meaning", tone: "blue" },
            { label: "Execute", detail: "carry it out", tone: "amber" },
          ],
          prompt: "Say the three stages in order.",
        },
      ],
      support: {
        title: "Key wording",
        prompt: "Fetch, decode, execute.",
        detail: "Use this exact sequence when answering exam questions.",
      },
    },
    {
      id: "fde-registers",
      label: "Part 2 - CPU components and the FDE cycle",
      heading: "Registers during the fetch stage",
      cards: [
        {
          title: "Moving the instruction",
          kind: "steps",
          items: [
            "The Program Counter holds the address of the next instruction.",
            "That address is copied to the MAR.",
            "The instruction is transferred from memory into the MDR.",
            "The instruction is copied into the CIR so it can be decoded.",
          ],
        },
        {
          title: "Fetch-stage register focus",
          kind: "table",
          table: {
            headers: ["Register", "Role in the fetch stage"],
            rows: [
              ["PC", "Stores the address of the next instruction."],
              ["MAR", "Stores the memory address being accessed."],
              ["MDR", "Stores the instruction transferred from memory."],
              ["CIR", "Stores the current instruction for decoding."],
            ],
          },
        },
      ],
      support: {
        title: "Precision matters",
        prompt: "Address and data are different.",
        detail: "An address tells the CPU where something is. Data or an instruction is the thing being transferred.",
      },
    },
    {
      id: "stored-program",
      label: "Part 3 - Stored program concept",
      heading: "Stored program concept",
      cards: [
        {
          title: "Programs stored in memory",
          kind: "explain",
          body:
            "The stored program concept means program instructions are stored in memory along with the data. A computer can run a new program by loading new instructions into memory.",
        },
        {
          title: "Why this mattered",
          kind: "table",
          table: {
            headers: ["Before stored programs", "With stored programs"],
            rows: [
              ["Many computers had to be physically rewired or reset.", "New instructions can be loaded into memory."],
              ["Changing the job was slow and inflexible.", "The same hardware can run different programs."],
            ],
          },
        },
      ],
      support: {
        title: "Name to know",
        prompt: "John von Neumann helped explain this model in 1945.",
        detail: "The important exam idea is that program instructions are stored in memory.",
      },
    },
    {
      id: "von-neumann",
      label: "Part 4 - Von Neumann architecture",
      heading: "Von Neumann architecture",
      cards: [
        {
          title: "One shared memory",
          kind: "explain",
          body:
            "Von Neumann architecture uses one main memory for both instructions and data. The CPU fetches what it needs from that memory.",
          prompt: "This is why the same computer can run lots of different programs without changing the hardware.",
        },
        {
          title: "Separate memory versus shared memory",
          kind: "table",
          table: {
            headers: ["Separate memories", "Von Neumann shared memory"],
            rows: [
              ["Instructions and data are held separately.", "Instructions and data are held in the same main memory."],
              ["Changing the program can be less flexible.", "A new program can be loaded into memory."],
              ["The CPU must use separate memory areas.", "The CPU fetches what it needs from main memory."],
            ],
          },
        },
      ],
      support: {
        title: "Quick response",
        prompt: "State one advantage of storing instructions and data in the same memory.",
        detail: "Use the words program, memory and CPU in your answer.",
      },
    },
    {
      id: "summary",
      label: "Lesson summary",
      heading: "What to remember",
      cards: [
        {
          title: "Core takeaways",
          kind: "grid",
          items: [
            "CPU: the main processor that processes instructions and controls operations",
            "Registers: very small, fast storage locations inside the CPU",
            "FDE cycle: fetch, decode and execute instructions repeatedly",
            "Von Neumann: instructions and data are stored in one shared main memory",
          ],
        },
        {
          title: "Six-mark answer planning",
          kind: "question",
          body: "If a question asks you to explain how the CPU runs a stored program, what would you include?",
          items: [
            "Mention memory storing instructions and data.",
            "Use the fetch, decode and execute sequence.",
            "Refer to registers where they help explain the movement of addresses and instructions.",
            "Finish by linking the cycle to running programs repeatedly.",
          ],
        },
      ],
      support: {
        title: "Final takeaway",
        prompt: "The CPU repeatedly fetches, decodes and executes instructions.",
        detail: "That repeated cycle is what allows programs to run.",
      },
    },
  ],
};
