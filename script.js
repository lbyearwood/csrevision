const topicGroups = [
    {
        paper: "Paper 1",
        gridId: "paper-1-topic-grid",
        groups: [
            {
                heading: "1.1 Systems architecture",
                topics: [
                    { id: "1-1-1", title: "1.1.1 Architecture of the CPU" },
                    { id: "1-1-2", title: "1.1.2 CPU performance" },
                    { id: "1-1-3", title: "1.1.3 Embedded systems" }
                ]
            },
            {
                heading: "1.2 Memory and storage",
                topics: [
                    { id: "1-2-1", title: "1.2.1 Primary storage" },
                    { id: "1-2-2", title: "1.2.2 Secondary storage" },
                    { id: "1-2-3", title: "1.2.3 Units" },
                    { id: "1-2-4-1", title: "1.2.4.1 Numbers" },
                    { id: "1-2-4-2", title: "1.2.4.2 Characters" },
                    { id: "1-2-4-3", title: "1.2.4.3 Images" },
                    { id: "1-2-4-4", title: "1.2.4.4 Sound" },
                    { id: "1-2-5", title: "1.2.5 Compression" }
                ]
            },
            {
                heading: "1.3 Computer networks, connections and protocols",
                topics: [
                    { id: "1-3-1", title: "1.3.1 Networks and topologies" },
                    { id: "1-3-1-1", title: "1.3.1.1 Network hardware" },
                    { id: "1-3-2-1", title: "1.3.2.1 Wired and wireless networks" },
                    { id: "1-3-2-2", title: "1.3.2.2 Protocols" },
                    { id: "1-3-2-3", title: "1.3.2.3 Layers" }
                ]
            },
            {
                heading: "1.4 Network security",
                topics: [
                    { id: "1-4-1", title: "1.4.1 Threats to computer systems and networks" },
                    { id: "1-4-2", title: "1.4.2 Identifying and preventing vulnerabilities" }
                ]
            },
            {
                heading: "1.5 Systems software",
                topics: [
                    { id: "1-5-1", title: "1.5.1 Operating systems" },
                    { id: "1-5-2", title: "1.5.2 Utility software" }
                ]
            },
            {
                heading: "1.6 Impacts of digital technology",
                topics: [
                    { id: "1-6-1-1", title: "1.6.1.1 Ethical, legal, cultural, environmental and privacy issues" },
                    { id: "1-6-1-2", title: "1.6.1.2 Legislation" },
                    { id: "1-6-1-3", title: "1.6.1.3 Software licences" }
                ]
            }
        ]
    },
    {
        paper: "Paper 2",
        gridId: "paper-2-topic-grid",
        groups: [
            {
                heading: "2.1 Algorithms",
                topics: [
                    { id: "2-1-1", title: "2.1.1 Computational thinking" },
                    { id: "2-1-2", title: "2.1.2 Designing, creating and refining algorithms" },
                    { id: "2-1-3", title: "2.1.3 Searching and sorting algorithms" }
                ]
            },
            {
                heading: "2.2 Programming fundamentals",
                topics: [
                    { id: "2-2-1", title: "2.2.1 Programming fundamentals" },
                    { id: "2-2-2", title: "2.2.2 Data types" },
                    { id: "2-2-3-1", title: "2.2.3.1 String manipulation" },
                    { id: "2-2-3-2", title: "2.2.3.2 File handling" },
                    { id: "2-2-3-3", title: "2.2.3.3 Records" },
                    { id: "2-2-3-4", title: "2.2.3.4 SQL" },
                    { id: "2-2-3-5", title: "2.2.3.5 Arrays" },
                    { id: "2-2-3-6", title: "2.2.3.6 Sub programs" },
                    { id: "2-2-3-7", title: "2.2.3.7 Random number generation" }
                ]
            },
            {
                heading: "2.3 Producing robust programs",
                topics: [
                    { id: "2-3-1", title: "2.3.1 Defensive design" },
                    { id: "2-3-2", title: "2.3.2 Testing" }
                ]
            },
            {
                heading: "2.4 Boolean logic",
                topics: [
                    { id: "2-4-1", title: "2.4.1 Boolean logic" }
                ]
            },
            {
                heading: "2.5 Programming languages and IDEs",
                topics: [
                    { id: "2-5-1", title: "2.5.1 Languages" },
                    { id: "2-5-2", title: "2.5.2 The Integrated Development Environment IDE" }
                ]
            }
        ]
    }
];

const questionBanks = {};

topicGroups.forEach((paperGroup) => {
    paperGroup.groups.forEach((group) => {
        group.topics.forEach((topic) => {
            questionBanks[topic.id] = {
                paper: paperGroup.paper,
                title: topic.title,
                summary: "Starter question set. More questions can be added to this revision set later.",
                questions: [
                    {
                        question: `State one key fact about ${topic.title}.`,
                        marks: 1,
                        markScheme: [
                            "Award 1 mark for one accurate fact linked to the topic.",
                            "Accept any other valid point."
                        ]
                    }
                ]
            };
        });
    });
});

questionBanks["1-1-1"].questions = [
    {
        question: "State the purpose of the CPU. (1 mark)",
        marks: 1,
        markScheme: [
            "The CPU processes instructions/data OR controls the operation of the computer.",
            "Accept any other valid point."
        ]
    },
    {
        question: "Name two registers used in the Von Neumann architecture. (2 marks)",
        marks: 2,
        markScheme: [
            "MAR / Memory Address Register.",
            "MDR / Memory Data Register.",
            "Program Counter.",
            "Accumulator.",
            "Award 1 mark for each correct register, maximum 2 marks."
        ]
    }
];

questionBanks["1-2-4-1"].questions = [
    {
        question: "Convert the denary number 45 into 8-bit binary. (1 mark)",
        marks: 1,
        markScheme: [
            "00101101."
        ]
    },
    {
        question: "Explain what causes an overflow error when adding two 8-bit binary numbers. (2 marks)",
        marks: 2,
        markScheme: [
            "The result is too large to fit in 8 bits.",
            "An extra carry bit is produced beyond the available 8-bit storage.",
            "Accept any other valid point."
        ]
    }
];

questionBanks["1-2-4-2"].questions = [
    {
        question: "Explain why Unicode can represent more characters than ASCII. (2 marks)",
        marks: 2,
        markScheme: [
            "Unicode uses more bits per character than ASCII.",
            "More bits allow a larger number of unique binary codes/characters to be represented.",
            "Accept any other valid point."
        ]
    }
];

questionBanks["1-2-4-3"].questions = [
    {
        question: "Explain how increasing the resolution of an image affects the image file size. (2 marks)",
        marks: 2,
        markScheme: [
            "Increasing resolution increases the number of pixels in the image.",
            "More pixels require more binary data to be stored, so the file size increases.",
            "Accept any other valid point."
        ]
    }
];

questionBanks["1-2-4-4"].questions = [
    {
        question: "State two factors that affect the file size of a sound file. (2 marks)",
        marks: 2,
        markScheme: [
            "Sample rate.",
            "Duration.",
            "Bit depth.",
            "Award 1 mark for each correct factor, maximum 2 marks."
        ]
    }
];

questionBanks["1-3-1-1"].questions = [
    {
        question: "Identify two pieces of hardware needed to connect stand-alone computers into a local area network. (2 marks)",
        marks: 2,
        markScheme: [
            "Switch.",
            "Router.",
            "Wireless access point.",
            "Network Interface Controller/Card / NIC.",
            "Transmission media.",
            "Award 1 mark for each correct item, maximum 2 marks."
        ]
    }
];

function renderHomePage() {
    topicGroups.forEach((paperGroup) => {
        const grid = document.getElementById(paperGroup.gridId);
        grid.innerHTML = "";

        paperGroup.groups.forEach((group) => {
            const article = document.createElement("article");
            article.className = "topic-card";

            const heading = document.createElement("h3");
            heading.textContent = group.heading;
            article.appendChild(heading);

            const list = document.createElement("ul");
            list.className = "topic-list";

            group.topics.forEach((topic) => {
                const item = document.createElement("li");
                const button = document.createElement("button");
                button.className = "topic-button";
                button.type = "button";
                button.textContent = topic.title;
                button.addEventListener("click", () => openQuestionSet(topic.id));
                item.appendChild(button);
                list.appendChild(item);
            });

            article.appendChild(list);
            grid.appendChild(article);
        });
    });
}

function openQuestionSet(topicId) {
    const bank = questionBanks[topicId];
    const homeView = document.getElementById("home-view");
    const questionView = document.getElementById("question-view");
    const questionList = document.getElementById("question-list");

    document.getElementById("question-paper").textContent = bank.paper;
    document.getElementById("question-title").textContent = bank.title;
    document.getElementById("question-summary").textContent = bank.summary;
    questionList.innerHTML = "";

    bank.questions.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "question-card";

        const heading = document.createElement("h3");
        heading.textContent = `Question ${index + 1}`;
        card.appendChild(heading);

        const meta = document.createElement("span");
        meta.className = "question-meta";
        meta.textContent = `${item.marks} ${item.marks === 1 ? "mark" : "marks"}`;
        card.appendChild(meta);

        const question = document.createElement("p");
        question.className = "question-text";
        question.textContent = item.question;
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

        const marks = document.createElement("ul");
        item.markScheme.forEach((point) => {
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

    homeView.classList.remove("active-view");
    questionView.classList.add("active-view");
    window.scrollTo({ top: 0, behaviour: "smooth" });
}

function returnHome() {
    document.getElementById("question-view").classList.remove("active-view");
    document.getElementById("home-view").classList.add("active-view");
    window.scrollTo({ top: 0, behaviour: "smooth" });
}

document.getElementById("back-home").addEventListener("click", returnHome);
renderHomePage();
