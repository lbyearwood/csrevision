const topicGroups = [
  {
    paper: "Paper 1",
    gridId: "paper-1-topic-grid",
    groups: [
      { heading: "1.1 Systems architecture", topics: [
        { id: "1-1-1", title: "1.1.1 Architecture of the CPU" },
        { id: "1-1-2", title: "1.1.2 CPU performance" },
        { id: "1-1-3", title: "1.1.3 Embedded systems" }
      ]},
      { heading: "1.2 Memory and storage", topics: [
        { id: "1-2-1", title: "1.2.1 Primary storage" },
        { id: "1-2-2", title: "1.2.2 Secondary storage" },
        { id: "1-2-3", title: "1.2.3 Units" },
        { id: "1-2-4-1", title: "1.2.4.1 Numbers" },
        { id: "1-2-4-2", title: "1.2.4.2 Characters" },
        { id: "1-2-4-3", title: "1.2.4.3 Images" },
        { id: "1-2-4-4", title: "1.2.4.4 Sound" },
        { id: "1-2-5", title: "1.2.5 Compression" }
      ]},
      { heading: "1.3 Computer networks, connections and protocols", topics: [
        { id: "1-3-1", title: "1.3.1 LAN vs WAN" },
        { id: "1-3-2", title: "1.3.2 Star vs Mesh topologies" },
        { id: "1-3-3", title: "1.3.3 Client-server vs Peer-to-peer architectures" },
        { id: "1-3-4", title: "1.3.4 Network hardware" },
        { id: "1-3-5", title: "1.3.5 The Internet, DNS and Cloud" },
        { id: "1-3-6", title: "1.3.6 Wired vs Wireless networks and performance factors" },
        { id: "1-3-7", title: "1.3.7 Network protocols" },
        { id: "1-3-8", title: "1.3.8 Network layers" },
        { id: "1-3-9", title: "1.3.9 Encryption" }
      ]},
      { heading: "1.4 Network security", topics: [
        { id: "1-4-1", title: "1.4.1 Threats to computer systems and networks" },
        { id: "1-4-2", title: "1.4.2 Identifying and preventing vulnerabilities" }
      ]},
      { heading: "1.5 Systems software", topics: [
        { id: "1-5-1", title: "1.5.1 Operating systems" },
        { id: "1-5-2", title: "1.5.2 Utility software" }
      ]},
      { heading: "1.6 Impacts of digital technology", topics: [
        { id: "1-6-1-1", title: "1.6.1.1 Ethical, legal, cultural, environmental and privacy issues" },
        { id: "1-6-1-2", title: "1.6.1.2 Legislation" },
        { id: "1-6-1-3", title: "1.6.1.3 Software licences" }
      ]}
    ]
  },
  {
    paper: "Paper 2",
    gridId: "paper-2-topic-grid",
    groups: [
      { heading: "2.1 Algorithms", topics: [
        { id: "2-1-1", title: "2.1.1 Computational thinking" },
        { id: "2-1-2", title: "2.1.2 Designing, creating and refining algorithms" },
        { id: "2-1-3", title: "2.1.3 Searching and sorting algorithms" }
      ]},
      { heading: "2.2 Programming fundamentals", topics: [
        { id: "2-2-1", title: "2.2.1 Programming fundamentals" },
        { id: "2-2-2", title: "2.2.2 Data types" },
        { id: "2-2-3-1", title: "2.2.3.1 String manipulation" },
        { id: "2-2-3-2", title: "2.2.3.2 File handling" },
        { id: "2-2-3-3", title: "2.2.3.3 Records" },
        { id: "2-2-3-4", title: "2.2.3.4 SQL" },
        { id: "2-2-3-5", title: "2.2.3.5 Arrays" },
        { id: "2-2-3-6", title: "2.2.3.6 Sub programs" },
        { id: "2-2-3-7", title: "2.2.3.7 Random number generation" }
      ]},
      { heading: "2.3 Producing robust programs", topics: [
        { id: "2-3-1", title: "2.3.1 Defensive design" },
        { id: "2-3-2", title: "2.3.2 Testing" }
      ]},
      { heading: "2.4 Boolean logic", topics: [
        { id: "2-4-1", title: "2.4.1 Boolean logic" }
      ]},
      { heading: "2.5 Programming languages and IDEs", topics: [
        { id: "2-5-1", title: "2.5.1 Languages" },
        { id: "2-5-2", title: "2.5.2 The Integrated Development Environment IDE" }
      ]}
    ]
  }
];

function allTopics() {
  const topics = [];
  topicGroups.forEach(paper => paper.groups.forEach(group => group.topics.forEach(topic => topics.push({ ...topic, paper: paper.paper }))));
  return topics;
}

const topicsById = Object.fromEntries(allTopics().map(topic => [topic.id, topic]));

const questionBanks = {};
allTopics().forEach(topic => {
  questionBanks[topic.id] = {
    paper: topic.paper,
    title: topic.title,
    summary: "Question set will be added shortly.",
    questions: [{
      question: `State one key fact about ${topic.title}.`,
      marks: 1,
      markSchemeIntro: "1 mark for a correct point:",
      markScheme: ["Award 1 mark for one accurate fact linked to the topic.", "Accept any other valid point."]
    }]
  };
});

questionBanks["1-1-1"] = {
  paper: "Paper 1",
  title: "1.1.1 Architecture of the CPU",
  summary: "Answer each question, then reveal the hidden mark scheme underneath to check your response.",
  questions: [
    { question: "<strong>Describe</strong> the purpose of the CPU in a computer system.", marks: 2, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The CPU processes data and instructions.", "The CPU controls the operation of the computer system.", "The CPU carries out the fetch-execute cycle.", "The CPU performs arithmetic and logical operations.", "Accept any other valid point."] },
    { question: "<strong>Describe</strong> what happens during the fetch, decode and execute stages of the fetch-execute cycle.", marks: 6, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The next instruction is fetched from memory.", "The Program Counter holds/tracks the address of the next instruction.", "The instruction is transferred from memory to the CPU.", "The instruction is decoded to work out what needs to be done.", "The Control Unit decodes/manages the instruction.", "The instruction is executed.", "The ALU may carry out a calculation or logical operation.", "The result may be stored in a register or memory.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> how the Control Unit helps the CPU carry out the fetch-execute cycle.", marks: 3, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The Control Unit coordinates the activities of the CPU.", "It decodes instructions.", "It sends control signals to other parts of the CPU.", "It manages the flow of data between the CPU, memory and other components.", "It ensures instructions are carried out in the correct order.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> the role of the ALU when an instruction is executed.", marks: 3, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The ALU performs arithmetic operations.", "The ALU performs logical/comparison operations.", "The ALU carries out calculations needed by the instruction.", "The result of an ALU operation may be stored in the Accumulator.", "The ALU is used during the execute stage of the fetch-execute cycle.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> how cache helps the CPU process instructions more efficiently.", marks: 3, markSchemeIntro: "1 mark for each correct point:", markScheme: ["Cache stores frequently used data and instructions.", "Cache is located close to or inside the CPU.", "Cache is faster to access than main memory/RAM.", "The CPU can access needed data/instructions more quickly.", "This can reduce the time spent waiting for data from memory.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> why the CPU uses registers instead of only using main memory.", marks: 3, markSchemeIntro: "1 mark for each correct point:", markScheme: ["Registers are small storage locations inside the CPU.", "Registers can be accessed very quickly.", "They temporarily store data, instructions or addresses being used by the CPU.", "They help the CPU process instructions without repeatedly accessing main memory.", "Different registers have specific roles during the fetch-execute cycle.", "Accept any other valid point."] },
    { question: "<strong>Compare</strong> the roles of the ALU and the Control Unit.", marks: 4, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The ALU performs arithmetic operations.", "The ALU performs logical/comparison operations.", "The Control Unit coordinates the CPU’s activities.", "The Control Unit decodes instructions.", "The Control Unit sends control signals to other CPU components.", "The ALU carries out operations, whereas the Control Unit manages the execution of instructions.", "Both are key components of the CPU.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> the purpose of the MAR and MDR. In your answer, explain the difference between storing data and storing an address.", marks: 5, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The MAR stores the address of a memory location.", "The address identifies where data or an instruction is stored in memory.", "The MDR stores data being transferred to or from memory.", "Data is the actual value or instruction being used.", "An address is the location where the data or instruction can be found.", "The MAR holds where to look, while the MDR holds what has been found or what is being written.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> the purpose of the Program Counter and the Accumulator during the fetch-execute cycle.", marks: 4, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The Program Counter stores the address of the next instruction to be fetched.", "The Program Counter helps the CPU fetch instructions in the correct order.", "The Program Counter is updated as instructions are fetched.", "The Accumulator stores the result of calculations.", "The Accumulator stores intermediate values used by the ALU.", "The Accumulator is used during the execution of instructions.", "Accept any other valid point."] },
    { question: "A student says, “The MAR and MDR do the same job because they both store information during the fetch-execute cycle.” <strong>Explain</strong> why this statement is incorrect.", marks: 3, markSchemeIntro: "1 mark for each correct point:", markScheme: ["The MAR and MDR have different roles.", "The MAR stores a memory address.", "The MDR stores data or an instruction being transferred.", "An address is a location in memory.", "Data is the actual value or instruction.", "They are both registers, but they do not store the same type of information.", "Accept any other valid point."] },
    { question: "<strong>Explain</strong> the key idea of Von Neumann architecture and how it allows stored programs to be executed.", marks: 5, markSchemeIntro: "1 mark for each correct point:", markScheme: ["Von Neumann architecture stores programs and data in the same memory.", "Instructions are stored in memory before they are processed.", "The CPU fetches instructions from memory.", "The CPU decodes and executes the instructions.", "The Program Counter helps identify the next instruction to fetch.", "The same memory system can hold both instructions and data.", "This allows a stored program to be run automatically by the CPU.", "Accept any other valid point."] }
  ]
};

function slug(topicId) {
  return `topics/${topicId}.html`;
}

function formatMarks(marks) {
  return marks === 1 ? "1 mark" : `${marks} marks`;
}

function renderHomePage() {
  topicGroups.forEach(paperGroup => {
    const grid = document.getElementById(paperGroup.gridId);
    if (!grid) return;
    grid.innerHTML = "";
    paperGroup.groups.forEach(group => {
      const article = document.createElement("article");
      article.className = "topic-card";
      const heading = document.createElement("h3");
      heading.textContent = group.heading;
      article.appendChild(heading);
      const list = document.createElement("ul");
      list.className = "topic-list";
      group.topics.forEach(topic => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.className = "topic-button";
        link.href = slug(topic.id);
        link.textContent = topic.title;
        item.appendChild(link);
        list.appendChild(item);
      });
      article.appendChild(list);
      grid.appendChild(article);
    });
  });
}

function renderQuestionPage(topicId) {
  const bank = questionBanks[topicId];
  const questionList = document.getElementById("question-list");
  if (!bank || !questionList) return;
  document.getElementById("question-paper").textContent = bank.paper;
  document.getElementById("question-title").textContent = bank.title;
  document.getElementById("question-summary").textContent = bank.summary;
  questionList.innerHTML = "";
  bank.questions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    const question = document.createElement("p");
    question.className = "question-text";
    question.innerHTML = `${index + 1}) ${item.question} (${formatMarks(item.marks)})`;
    card.appendChild(question);
    const revealButton = document.createElement("button");
    revealButton.className = "reveal-button";
    revealButton.type = "button";
    revealButton.textContent = "Show mark scheme";
    card.appendChild(revealButton);
    const markScheme = document.createElement("div");
    markScheme.className = "mark-scheme";
    const markHeading = document.createElement("h4");
    markHeading.textContent = "Mark scheme";
    markScheme.appendChild(markHeading);
    if (item.markSchemeIntro) {
      const intro = document.createElement("p");
      intro.className = "mark-scheme-intro";
      intro.textContent = item.markSchemeIntro;
      markScheme.appendChild(intro);
    }
    const marks = document.createElement("ul");
    item.markScheme.forEach(point => {
      const markPoint = document.createElement("li");
      markPoint.textContent = point;
      marks.appendChild(markPoint);
    });
    markScheme.appendChild(marks);
    card.appendChild(markScheme);
    revealButton.addEventListener("click", () => {
      markScheme.classList.toggle("visible");
      revealButton.textContent = markScheme.classList.contains("visible") ? "Hide mark scheme" : "Show mark scheme";
    });
    questionList.appendChild(card);
  });
}

renderHomePage();
const topicId = document.body.dataset.topicId;
if (topicId) renderQuestionPage(topicId);
