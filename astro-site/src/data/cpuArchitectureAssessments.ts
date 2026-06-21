export type ExamQuestion = {
  question: string;
  marks: number;
  intro?: string;
  markScheme: string[];
  bands?: {
    range: string;
    quality: string;
    content: string;
  }[];
};

export type QuizQuestion = {
  id: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answers: string[];
  correctFeedback: string;
  incorrectFeedback: string;
};

export const cpuArchitectureExam = {
  eyebrow: "Paper 1",
  title: "1.1.1 Architecture of the CPU questions",
  description: "Answer each question, then reveal the mark scheme to check your response.",
  questions: [
    {
      question: "Describe the purpose of the CPU in a computer system.",
      marks: 2,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The CPU processes data and instructions.",
        "The CPU controls the operation of the computer system.",
        "The CPU carries out the fetch-execute cycle.",
        "The CPU performs arithmetic and logical operations.",
        "Accept any other valid point.",
      ],
    },
    {
      question: "Describe what happens during the fetch, decode and execute stages of the fetch-execute cycle.",
      marks: 6,
      intro: "Use the banded mark scheme first, then the indicative content below to decide the final mark.",
      bands: [
        {
          range: "5-6",
          quality: "Clear, accurate and well-developed response.",
          content: "Covers most relevant points from the indicative content.",
        },
        {
          range: "3-4",
          quality: "Some accurate explanation with relevant points.",
          content: "Covers several relevant points but may lack detail or clarity.",
        },
        {
          range: "1-2",
          quality: "Limited response with basic understanding.",
          content: "Includes one or two relevant points.",
        },
        {
          range: "0",
          quality: "No creditworthy response.",
          content: "No relevant answer or too unclear to award marks.",
        },
      ],
      markScheme: [
        "The next instruction is fetched from memory.",
        "The Program Counter holds or tracks the address of the next instruction.",
        "The instruction is transferred from memory to the CPU.",
        "The instruction is decoded to work out what needs to be done.",
        "The Control Unit decodes or manages the instruction.",
        "The instruction is executed.",
        "The ALU may carry out a calculation or logical operation.",
        "The result may be stored in a register or memory.",
        "Accept any other valid point.",
      ],
    },
    {
      question: "Explain how the Control Unit helps the CPU carry out the fetch-execute cycle.",
      marks: 3,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The Control Unit coordinates the activities of the CPU.",
        "It decodes instructions.",
        "It sends control signals to other parts of the CPU.",
        "It manages the flow of data between the CPU, memory and other components.",
        "It ensures instructions are carried out in the correct order.",
        "Accept any other valid point.",
      ],
    },
    {
      question: "Explain the role of the ALU when an instruction is executed.",
      marks: 3,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The ALU performs arithmetic operations.",
        "The ALU performs logical or comparison operations.",
        "The ALU carries out calculations needed by the instruction.",
        "The result of an ALU operation may be stored in the Accumulator.",
        "The ALU is used during the execute stage of the fetch-execute cycle.",
        "Accept any other valid point.",
      ],
    },
    {
      question:
        "A gaming computer repeatedly uses the same graphics and physics data while a game is running. Explain how cache helps the CPU process this data more efficiently.",
      marks: 3,
      intro: "1 mark for each correct point:",
      markScheme: [
        "Cache stores frequently used data and instructions.",
        "Cache is located close to or inside the CPU.",
        "Cache is faster to access than main memory or RAM.",
        "The CPU can access needed data or instructions more quickly.",
        "Repeated game data can be accessed from cache instead of being fetched from RAM each time.",
        "This can reduce the time spent waiting for data from memory.",
        "Accept any other valid point.",
      ],
    },
    {
      question:
        "A video editing program performs many calculations on frames of a video. Explain why the CPU uses registers instead of only using main memory while carrying out these instructions.",
      marks: 3,
      intro: "1 mark for each correct point:",
      markScheme: [
        "Registers are small storage locations inside the CPU.",
        "Registers can be accessed very quickly.",
        "They temporarily store data, instructions or addresses being used by the CPU.",
        "They help the CPU process instructions without repeatedly accessing main memory.",
        "Intermediate values from the video calculations can be held close to the CPU while they are being processed.",
        "Different registers have specific roles during the fetch-execute cycle.",
        "Accept any other valid point.",
      ],
    },
    {
      question: "Compare the roles of the ALU and the Control Unit.",
      marks: 4,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The ALU performs arithmetic operations.",
        "The ALU performs logical or comparison operations.",
        "The Control Unit coordinates the CPU's activities.",
        "The Control Unit decodes instructions.",
        "The Control Unit sends control signals to other CPU components.",
        "The ALU carries out operations, whereas the Control Unit manages the execution of instructions.",
        "Both are key components of the CPU.",
        "Accept any other valid point.",
      ],
    },
    {
      question:
        "Explain the purpose of the MAR and MDR. In your answer, explain the difference between storing data and storing an address.",
      marks: 5,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The MAR stores the address of a memory location.",
        "The address identifies where data or an instruction is stored in memory.",
        "The MDR stores data being transferred to or from memory.",
        "Data is the actual value or instruction being used.",
        "An address is the location where the data or instruction can be found.",
        "The MAR holds where to look, while the MDR holds what has been found or what is being written.",
        "Accept any other valid point.",
      ],
    },
    {
      question: "Explain the purpose of the Program Counter and the Accumulator during the fetch-execute cycle.",
      marks: 4,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The Program Counter stores the address of the next instruction to be fetched.",
        "The Program Counter helps the CPU fetch instructions in the correct order.",
        "The Program Counter is updated as instructions are fetched.",
        "The Accumulator stores the result of calculations.",
        "The Accumulator stores intermediate values used by the ALU.",
        "The Accumulator is used during the execution of instructions.",
        "Accept any other valid point.",
      ],
    },
    {
      question:
        "Someone says, \"The MAR and MDR do the same job because they both store information during the fetch-execute cycle.\" Explain why this statement is incorrect.",
      marks: 3,
      intro: "1 mark for each correct point:",
      markScheme: [
        "The MAR and MDR have different roles.",
        "The MAR stores a memory address.",
        "The MDR stores data or an instruction being transferred.",
        "An address is a location in memory.",
        "Data is the actual value or instruction.",
        "They are both registers, but they do not store the same type of information.",
        "Accept any other valid point.",
      ],
    },
    {
      question: "Explain the key idea of Von Neumann architecture and how it allows stored programs to be executed.",
      marks: 5,
      intro: "1 mark for each correct point:",
      markScheme: [
        "Von Neumann architecture stores programs and data in the same memory.",
        "Instructions are stored in memory before they are processed.",
        "The CPU fetches instructions from memory.",
        "The CPU decodes and executes the instructions.",
        "The Program Counter helps identify the next instruction to fetch.",
        "The same memory system can hold both instructions and data.",
        "This allows a stored program to be run automatically by the CPU.",
        "Accept any other valid point.",
      ],
    },
  ] satisfies ExamQuestion[],
};

export const cpuArchitectureQuiz = {
  eyebrow: "Paper 1 quiz",
  title: "1.1.1 Architecture of the CPU quiz",
  description: "Choose the best answer for each question, then check your score.",
  questions: [
    {
      id: "q1",
      type: "single",
      question: "Which CPU component coordinates the activities of the CPU?",
      options: ["ALU", "Control Unit", "Cache", "MDR"],
      answers: ["Control Unit"],
      correctFeedback: "The Control Unit coordinates CPU activity and manages instruction execution.",
      incorrectFeedback: "The Control Unit coordinates CPU activity and manages instruction execution.",
    },
    {
      id: "q2",
      type: "multi",
      question: "Which two types of operation are carried out by the ALU?",
      options: ["Arithmetic operations", "Logic operations", "Storing addresses", "Decoding instructions"],
      answers: ["Arithmetic operations", "Logic operations"],
      correctFeedback: "The ALU carries out arithmetic and logical operations.",
      incorrectFeedback: "The ALU carries out arithmetic operations and logic operations.",
    },
    {
      id: "q3",
      type: "single",
      question: "Which sentence correctly completes the idea about the next instruction?",
      options: [
        "The MDR stores the calculation result of the next instruction.",
        "The Program Counter stores the address of the next instruction.",
        "The MAR stores the output of the next instruction.",
        "The Control Unit stores the next instruction permanently.",
      ],
      answers: ["The Program Counter stores the address of the next instruction."],
      correctFeedback: "The Program Counter stores the address of the next instruction.",
      incorrectFeedback: "The Program Counter stores the address of the next instruction.",
    },
    {
      id: "q4",
      type: "multi",
      question: "Which register matches are correct?",
      options: [
        "Memory address = MAR",
        "Data or instruction from memory = MDR",
        "Result of a calculation = Accumulator",
        "Decoded instruction = Router",
      ],
      answers: [
        "Memory address = MAR",
        "Data or instruction from memory = MDR",
        "Result of a calculation = Accumulator",
      ],
      correctFeedback: "Each value has been matched to the correct register.",
      incorrectFeedback: "Memory address = MAR; data or instruction from memory = MDR; result = Accumulator.",
    },
    {
      id: "q5",
      type: "single",
      question: "Which register stores data or instructions being transferred to or from memory?",
      options: ["Program Counter", "MAR", "MDR", "Control Unit"],
      answers: ["MDR"],
      correctFeedback: "The MDR stores data or instructions being transferred to or from memory.",
      incorrectFeedback: "The MDR stores data or instructions being transferred to or from memory.",
    },
    {
      id: "q6",
      type: "single",
      question: "True or false: Cache is faster for the CPU to access than main memory.",
      options: ["True", "False"],
      answers: ["True"],
      correctFeedback: "Cache is faster to access than main memory.",
      incorrectFeedback: "Cache is small, fast memory close to or inside the CPU.",
    },
    {
      id: "q7",
      type: "multi",
      question: "Select the three main stages of the fetch-execute cycle.",
      options: ["Fetch", "Compress", "Decode", "Encrypt", "Execute"],
      answers: ["Fetch", "Decode", "Execute"],
      correctFeedback: "The basic cycle is fetch, decode, execute.",
      incorrectFeedback: "The fetch-execute cycle is commonly described as fetch, decode and execute.",
    },
    {
      id: "q8",
      type: "single",
      question: "In the sequence fetch, decode, execute, what stage number is decode?",
      options: ["1", "2", "3"],
      answers: ["2"],
      correctFeedback: "Decode is stage 2 in fetch, decode, execute.",
      incorrectFeedback: "Decode is stage 2 when the stages are fetch, decode, execute.",
    },
    {
      id: "q9",
      type: "single",
      question: "Which architecture stores program instructions and data in the same memory?",
      options: ["Harvard", "Von Neumann", "Client-server", "Peer-to-peer"],
      answers: ["Von Neumann"],
      correctFeedback: "Von Neumann architecture stores program instructions and data in the same memory.",
      incorrectFeedback: "Von Neumann architecture stores program instructions and data in the same memory.",
    },
    {
      id: "q10",
      type: "single",
      question: "Which register stores the result of calculations?",
      options: ["Accumulator", "Program Counter", "MAR", "Control Unit"],
      answers: ["Accumulator"],
      correctFeedback: "The Accumulator stores the result of calculations.",
      incorrectFeedback: "The Accumulator stores the result of calculations carried out by the CPU.",
    },
    {
      id: "q11",
      type: "multi",
      question: "Which CPU keyword matches are correct?",
      options: [
        "ALU = performs arithmetic and logical operations",
        "Control Unit = decodes instructions and coordinates CPU activity",
        "MAR = holds a memory address",
        "MDR = permanently stores user files",
      ],
      answers: [
        "ALU = performs arithmetic and logical operations",
        "Control Unit = decodes instructions and coordinates CPU activity",
        "MAR = holds a memory address",
      ],
      correctFeedback: "Each keyword has been matched to a correct definition.",
      incorrectFeedback:
        "ALU = arithmetic and logic; Control Unit = decodes and coordinates; MAR = memory address; MDR = data or instructions being transferred.",
    },
    {
      id: "q12",
      type: "single",
      question: "Which order correctly describes the fetch stage and decode role?",
      options: [
        "Program Counter, MAR, MDR, Control Unit",
        "Accumulator, MDR, MAR, ALU",
        "MAR, Program Counter, Control Unit, MDR",
        "Control Unit, Accumulator, MAR, MDR",
      ],
      answers: ["Program Counter, MAR, MDR, Control Unit"],
      correctFeedback: "The fetch stage and decode role are in the correct order.",
      incorrectFeedback: "Correct order: Program Counter, MAR, MDR, Control Unit.",
    },
    {
      id: "q13",
      type: "single",
      question: "Spot the odd one out.",
      options: ["ALU", "Control Unit", "Cache", "Router"],
      answers: ["Router"],
      correctFeedback: "A router is network hardware, not an internal CPU component.",
      incorrectFeedback: "The odd one out is Router because it is network hardware, not an internal CPU component.",
    },
    {
      id: "q14",
      type: "single",
      question: "Identify the misconception in this statement: \"The Program Counter stores the result of calculations.\"",
      options: [
        "The Program Counter stores the address of the next instruction, not calculation results.",
        "The Program Counter performs arithmetic and logic operations.",
        "The Program Counter stores data being transferred from memory.",
        "The Program Counter decodes the instruction.",
      ],
      answers: ["The Program Counter stores the address of the next instruction, not calculation results."],
      correctFeedback: "The Accumulator stores calculation results; the Program Counter stores the next instruction address.",
      incorrectFeedback:
        "The misconception is that the Program Counter stores calculation results. It stores the address of the next instruction.",
    },
    {
      id: "q15",
      type: "multi",
      question: "Which information type matches are correct?",
      options: ["MAR = Address", "MDR = Data or instruction", "Program Counter = Address", "Accumulator = Data or result"],
      answers: ["MAR = Address", "MDR = Data or instruction", "Program Counter = Address", "Accumulator = Data or result"],
      correctFeedback: "The table correctly separates address storage from data or result storage.",
      incorrectFeedback: "MAR and Program Counter store addresses; MDR and Accumulator store data, instructions or results.",
    },
    {
      id: "q16",
      type: "single",
      question: "Which order is correct for the fetch-execute cycle?",
      options: ["Fetch, decode, execute", "Decode, fetch, execute", "Execute, fetch, decode"],
      answers: ["Fetch, decode, execute"],
      correctFeedback: "The sequence is fetch, decode, execute.",
      incorrectFeedback: "Correct order: fetch, decode, execute.",
    },
    {
      id: "q17",
      type: "multi",
      question: "Tick all that apply: why does cache help CPU performance?",
      options: [
        "It stores frequently used data and instructions",
        "It can be accessed faster than main memory",
        "It permanently stores user files",
        "It replaces the need for the Control Unit",
      ],
      answers: ["It stores frequently used data and instructions", "It can be accessed faster than main memory"],
      correctFeedback: "Cache stores frequently used data and instructions and is faster to access than main memory.",
      incorrectFeedback: "Cache stores frequently used data and instructions, and the CPU can access it faster than main memory.",
    },
    {
      id: "q18",
      type: "single",
      question: "Which sentence correctly describes the purpose of the CPU?",
      options: [
        "The CPU stores data permanently and controls the monitor.",
        "The CPU processes data and instructions and controls the operation of the computer system.",
        "The CPU encrypts every file stored on secondary storage.",
        "The CPU connects every device to the Internet.",
      ],
      answers: ["The CPU processes data and instructions and controls the operation of the computer system."],
      correctFeedback: "The CPU processes data and instructions and controls the operation of the computer system.",
      incorrectFeedback: "The CPU processes data and instructions and controls the operation of the computer system.",
    },
    {
      id: "q19",
      type: "multi",
      question: "Which fetch-execute stage descriptions are correct?",
      options: [
        "Fetch = the CPU gets the next instruction from memory",
        "Decode = the instruction is worked out by the Control Unit",
        "Execute = the instruction is carried out",
        "Fetch = the ALU permanently stores files",
      ],
      answers: [
        "Fetch = the CPU gets the next instruction from memory",
        "Decode = the instruction is worked out by the Control Unit",
        "Execute = the instruction is carried out",
      ],
      correctFeedback: "Each fetch-execute stage has been matched to the correct description.",
      incorrectFeedback:
        "Fetch gets the next instruction; decode works out the instruction; execute carries it out.",
    },
    {
      id: "q20",
      type: "single",
      question: "True or false: Von Neumann architecture stores program instructions and data in completely separate memories.",
      options: ["True", "False"],
      answers: ["False"],
      correctFeedback: "Von Neumann architecture stores instructions and data in the same memory.",
      incorrectFeedback: "This is false. Von Neumann architecture stores instructions and data in the same memory.",
    },
  ] satisfies QuizQuestion[],
};
