# csrevision

## Project overview

This project is an AI-maintained static revision site for OCR GCSE Computer Science J277.

The site supports students with two types of practice:

- Q&A pages for GCSE-style written questions with hidden mark schemes.
- Quiz pages for self-marking retrieval practice.

All new or edited Q&A and Quiz content must follow the guidance in this README.md. This README is the single source of truth for content creation, quiz creation, mark schemes, diagrams, images, SQL tables, programming examples and HTML formatting.

## Site architecture rules

- Keep the site fully static and suitable for GitHub Pages.
- Do not add a CMS, database, login system, admin panel, upload system, progress tracking, bookmarks or student accounts.
- Keep Q&A question content hard-coded directly inside topic HTML pages.
- Do not store Q&A question content in JavaScript objects.
- Do not create topic-specific JavaScript files for Q&A pages.
- Do not reintroduce `questionBanks` or `renderQuestionPage`.
- Keep JavaScript only for shared behaviour, quiz interactivity and homepage navigation.
- Keep design in `styles.css`.
- Keep images in `assets/images/`.
- Use UK English spelling.
- Use the word `program` when referring to a computer program.
- Do not use horizontal rules.

## Branding and OCR wording

The site supports OCR GCSE Computer Science J277 revision, but it must not claim to be an official OCR website, an OCR-approved platform or an official OCR revision site.

Acceptable wording:

- OCR GCSE Computer Science J277 revision
- Based on the OCR GCSE Computer Science J277 specification
- Supports OCR GCSE Computer Science J277

Do not use wording such as:

- Official OCR platform
- OCR-approved revision platform
- Official OCR revision site

A custom logo is acceptable. Do not use the official OCR logo or any asset that could imply OCR ownership or approval.


## Course specification coverage

This section defines what each current site subtopic must cover. It matches the site titles to OCR GCSE Computer Science J277, while splitting the official specification into smaller student-friendly subtopics.

## Paper 1 - Computer systems

## 1.1 Systems architecture

### 1.1.1 Architecture of the CPU

Must cover:

- The purpose of the CPU.
- The fetch-execute cycle.
- The role of the ALU, CU, cache and registers.
- Von Neumann architecture.
- The purpose of the MAR, MDR, Program Counter and Accumulator.
- What each register stores, either data or an address.
- The difference between storing data and storing an address.
- What happens at each stage of the fetch-execute cycle.

Not required:

- Students do not need to know the exact passing of data between registers at each stage of the fetch-execute cycle.

### 1.1.2 CPU performance

Must cover:

- Clock speed.
- Cache size.
- Number of cores.
- How each factor can affect CPU performance.
- How changing more than one factor can affect overall system performance.

Not required:

- No explicit OCR exclusion.

### 1.1.3 Embedded systems

Must cover:

- What an embedded system is.
- The purpose of embedded systems.
- Typical characteristics of embedded systems.
- Examples such as washing machines, traffic lights, central heating systems, microwaves, cars and medical devices.

Not required:

- No explicit OCR exclusion.

## 1.2 Memory and storage

### 1.2.1 Primary storage

Must cover:

- The need for primary storage.
- RAM.
- ROM.
- The difference between RAM and ROM.
- The purpose of RAM in a computer system.
- The purpose of ROM in a computer system.
- The key characteristics of RAM and ROM.
- Cache as a form of fast memory.

Not required:

- No explicit OCR exclusion.

### 1.2.2 Virtual memory

Must cover:

- Why virtual memory is needed.
- What happens when RAM becomes full.
- How data is transferred between RAM and secondary storage.
- Why virtual memory is slower than using RAM.
- The effect virtual memory can have on system performance.

Not required:

- No explicit OCR exclusion.

### 1.2.3 Secondary storage

Must cover:

- The need for secondary storage.
- Optical storage.
- Magnetic storage.
- Solid state storage.
- Examples of storage devices and media.
- Choosing suitable storage for a given scenario.
- Comparing devices using:
  - Capacity
  - Speed
  - Portability
  - Durability
  - Reliability
  - Cost
- Advantages and disadvantages of each storage type.

Not required:

- Students do not need to know the internal component parts of storage devices.

### 1.2.4 Binary units

Must cover:

- Bit.
- Nibble.
- Byte.
- Kilobyte.
- Megabyte.
- Gigabyte.
- Terabyte.
- Petabyte.
- Converting between units.
- Understanding that data must be stored in binary.
- Data capacity.
- Calculating storage requirements for a set of files.
- File size calculations for text, images and sound.

Not required:

- No explicit OCR exclusion.
- OCR allows either 1,000 or 1,024 for conversions, depending on the question context.

### 1.2.5 Binary number system

Must cover:

- Converting positive denary whole numbers to binary.
- Converting binary to denary.
- Binary values up to 8 bits.
- Denary range 0 to 255.
- Binary range 00000000 to 11111111.
- Most significant bit.
- Least significant bit.
- Understanding that shorter binary numbers can be padded with leading zeroes.

Not required:

- No explicit OCR exclusion.

### 1.2.6 Hexadecimal number system

Must cover:

- Converting positive denary whole numbers to 2-digit hexadecimal.
- Converting hexadecimal to denary.
- Converting binary to hexadecimal.
- Converting hexadecimal to binary.
- Hexadecimal range 00 to FF.
- Why hexadecimal is often easier for humans to read than binary.

Not required:

- No explicit OCR exclusion.

### 1.2.7 Binary addition and binary shifts

Must cover:

- Adding two binary integers together, up to and including 8 bits.
- Explaining overflow errors.
- Carrying out binary shifts left and right.
- Understanding the effect of a left shift.
- Understanding the effect of a right shift.

Not required:

- No explicit OCR exclusion.

### 1.2.8 Characters

Must cover:

- How characters are represented using binary codes.
- Character sets.
- ASCII.
- Unicode.
- The relationship between bits per character and the number of characters that can be represented.
- How character sets are logically ordered, for example the code for B follows A.
- The difference between ASCII and Unicode.
- The impact of using a larger character set.

Not required:

- Students do not need to memorise character set codes.

### 1.2.9 Images

Must cover:

- Images as a series of pixels.
- Pixels represented using binary.
- Colour depth.
- Resolution.
- Metadata.
- How colour depth affects image quality and file size.
- How resolution affects image quality and file size.
- Image file size calculations:
  - Colour depth × image height × image width

Not required:

- No explicit OCR exclusion.

### 1.2.10 Sound

Must cover:

- Analogue sound being converted into digital form.
- Sampling.
- Sample rate.
- Duration.
- Bit depth.
- How sample rate affects quality and file size.
- How bit depth affects quality and file size.
- Sound file size calculations:
  - Sample rate × duration × bit depth

Not required:

- No explicit OCR exclusion.

### 1.2.11 Compression

Must cover:

- Why compression is needed.
- Lossy compression.
- Lossless compression.
- Common scenarios where compression is useful.
- Advantages and disadvantages of lossy compression.
- Advantages and disadvantages of lossless compression.
- The effect of each compression type on the file.

Not required:

- Students do not need to carry out specific compression algorithms.

## 1.3 Computer networks, connections and protocols

### 1.3.1 LAN vs WAN

Must cover:

- What a LAN is.
- What a WAN is.
- Characteristics of LANs and WANs.
- Examples of LANs and WANs.
- Differences between LANs and WANs.
- Ownership, geographical area and typical use.
- Applying LAN and WAN knowledge to scenarios.

Not required:

- No explicit OCR exclusion.

### 1.3.2 Star vs Mesh topologies

Must cover:

- What a network topology is.
- Star topology.
- Mesh topology.
- How devices are connected in each topology.
- Advantages and disadvantages of star topology.
- Advantages and disadvantages of mesh topology.
- Choosing a suitable topology for a scenario.

Not required:

- No explicit OCR exclusion.

### 1.3.3 Client-server vs Peer-to-peer architectures

Must cover:

- What a client is.
- What a server is.
- Client-server networks.
- Peer-to-peer networks.
- The role of computers in each network type.
- Advantages and disadvantages of client-server networks.
- Advantages and disadvantages of peer-to-peer networks.
- Choosing a suitable architecture for a scenario.

Not required:

- No explicit OCR exclusion.

### 1.3.4 Network hardware

Must cover:

- Wireless access points.
- Routers.
- Switches.
- Network Interface Controller/Card.
- Transmission media.
- The task performed by each piece of hardware.
- How network hardware connects stand-alone computers into a LAN.
- Choosing suitable hardware for a given scenario.

Not required:

- No explicit OCR exclusion.

### 1.3.5 The Internet, DNS and Cloud

Must cover:

- The Internet as a worldwide collection of computer networks.
- DNS.
- DNS being made up of multiple Domain Name Servers.
- DNS converting a URL into an IP address.
- Hosting.
- Web servers.
- Clients.
- Servers providing services.
- The Cloud as remote service provision.
- Cloud storage.
- Cloud software.
- Cloud processing.
- Advantages and disadvantages of the Cloud.

Not required:

- No explicit OCR exclusion.

### 1.3.6 Wired vs Wireless networks and performance factors

Must cover:

- Wired connections.
- Ethernet.
- Wireless connections.
- Wi-Fi.
- Bluetooth.
- Benefits and drawbacks of wired connections.
- Benefits and drawbacks of wireless connections.
- Recommending a suitable connection for a scenario.
- Factors affecting network performance, including:
  - Number of connected devices
  - Bandwidth
  - Wired or wireless connection type

Not required:

- Students do not need to know how Ethernet, Wi-Fi or Bluetooth protocols work internally.

### 1.3.7 Network protocols

Must cover:

- What a communication protocol is.
- Protocols as rules for transferring data.
- TCP/IP.
- HTTP.
- HTTPS.
- FTP.
- POP.
- IMAP.
- SMTP.
- The purpose and key features of each protocol.
- IP addressing.
- IPv4 and IPv6 format.
- MAC addressing.
- MAC address format.
- Standards.
- How standards allow hardware and software from different manufacturers to interact.

Not required:

- Students do not need to know the difference between static and dynamic IP addresses.
- Students do not need to know the difference between public and private IP addresses.
- Students do not need detailed knowledge of individual standards.

### 1.3.8 Network layers

Must cover:

- The concept of layers.
- How layers are used in protocols.
- The benefits of using layers.
- The 4-layer TCP/IP model as a teaching example.

Not required:

- Students do not need to know the names and functions of each TCP/IP layer.

### 1.3.9 Encryption

Must cover:

- The principle of encryption.
- How encryption secures data across network connections.
- Plaintext and ciphertext.
- Why intercepted encrypted data is harder to understand.
- Suitable scenarios where encryption is needed.

Not required:

- No explicit OCR exclusion.

## 1.4 Network security

### 1.4.1 Threats to computer systems and networks

Must cover:

- Malware.
- Social engineering.
- Phishing.
- People as the weak point.
- Brute-force attacks.
- Denial of service attacks.
- Data interception.
- Data theft.
- SQL injection.
- How each attack is used.
- The purpose of each attack.
- The threat posed to devices, systems and networks.

Not required:

- No explicit OCR exclusion.

### 1.4.2 Identifying and preventing vulnerabilities

Must cover:

- Penetration testing.
- Anti-malware software.
- Firewalls.
- User access levels.
- Passwords.
- Encryption.
- Physical security.
- How each method limits or prevents attacks.
- How vulnerabilities can be removed or reduced.
- Matching prevention methods to specific threats.

Not required:

- No explicit OCR exclusion.

## 1.5 Systems software

### 1.5.1 Operating systems

Must cover:

- Purpose of an operating system.
- User interface.
- Memory management.
- Multitasking.
- Peripheral management.
- Drivers.
- User management.
- File management.
- Allocation of memory to applications.
- Transfer of data between memory.
- Transfer of data between devices and the processor.
- User accounts.
- Access rights.
- Security.
- Naming, saving, moving and organising files into folders.

Not required:

- Students do not need to understand paging or segmentation. 

### 1.5.2 Utility software

Must cover:

- Purpose of utility software.
- Utility software as housekeeping software.
- Encryption software.
- Defragmentation.
- Data compression.
- Why each utility is needed.
- How utility software performs tasks that may not be carried out by the operating system.

Not required:

- No explicit OCR exclusion.

## 1.6 Impacts of digital technology

### 1.6.1.1 Ethical, legal, cultural, environmental and privacy issues

Must cover:

- Ethical issues.
- Legal issues.
- Cultural issues.
- Environmental issues.
- Privacy issues.
- How digital technology affects individuals.
- How digital technology affects wider society.
- Discussing positive and negative impacts.
- Applying issues to real or given scenarios.

Not required:

- No explicit OCR exclusion.

### 1.6.1.2 Legislation

Must cover:

- Data Protection Act 2018.
- Computer Misuse Act 1990.
- Copyright, Designs and Patents Act 1988.
- The purpose of each law.
- What each law allows or prohibits.
- Applying legislation to scenarios.

Not required:

- Students do not need excessive legal detail beyond the purpose and relevant actions allowed or prohibited.

### 1.6.1.3 Software licences

Must cover:

- The need to license software.
- The purpose of a software licence.
- Open-source software.
- Proprietary software.
- Features of open-source software:
  - Access to source code
  - Ability to change the software
- Features of proprietary software:
  - No access to source code
  - Often bought as off-the-shelf software
- Recommending a licence type for a scenario.
- Benefits and drawbacks of each licence type.

Not required:

- No explicit OCR exclusion.

## Paper 2 - Computational thinking, algorithms and programming

## 2.1 Algorithms

### 2.1.1 Abstraction

Must cover:

- What abstraction means.
- Removing unnecessary detail.
- Focusing on the important parts of a problem.
- How abstraction helps define and refine problems.
- Applying abstraction to scenarios.

Not required:

- No explicit OCR exclusion.

### 2.1.2 Decomposition

Must cover:

- What decomposition means.
- Breaking a problem into smaller sub-problems.
- How decomposition helps make a problem easier to solve.
- Applying decomposition to scenarios.

Not required:

- No explicit OCR exclusion.

### 2.1.3 Algorithmic thinking

Must cover:

- What algorithmic thinking means.
- Creating a logical sequence of steps.
- Planning how to solve a problem.
- Using clear, ordered instructions.
- Applying algorithmic thinking to scenarios.

Not required:

- No explicit OCR exclusion.

### 2.1.4 Structure diagrams

Must cover:

- Purpose of structure diagrams.
- Showing the structure of a problem.
- Showing subsections of a problem.
- Showing links between subsections.
- Interpreting structure diagrams.
- Creating simple structure diagrams.

Not required:

- No explicit OCR exclusion.

### 2.1.5 Pseudocode

Must cover:

- Writing algorithms using pseudocode.
- Interpreting pseudocode.
- Completing pseudocode.
- Correcting pseudocode.
- Refining pseudocode.
- Using sequence, selection and iteration.
- Using nested selection and iteration where appropriate.

Not required:

- No explicit OCR exclusion, but students should use OCR Exam Reference Language or a high-level programming language when the exam question requires precise programming logic.

### 2.1.6 Flowcharts

Must cover:

- Creating flowcharts.
- Interpreting flowcharts.
- Completing flowcharts.
- Correcting flowcharts.
- Refining flowcharts.
- Flowchart symbols:
  - Terminal
  - Process
  - Input/output
  - Decision
  - Sub program
  - Flow line
- Using flowcharts to represent sequence, selection and iteration.

Not required:

- No explicit OCR exclusion.

### 2.1.7 Identifying common errors

Must cover:

- Identifying syntax errors.
- Identifying logic errors.
- Explaining why an error occurs.
- Suggesting fixes.
- Correcting, completing and refining algorithms.
- Understanding that syntax errors stop code from being run or translated.
- Understanding that logic errors produce unexpected output.

Not required:

- No explicit OCR exclusion.

### 2.1.8 Searching algorithms

Must cover:

- Linear search.
- Binary search.
- Main steps of each search algorithm.
- Prerequisites, especially that binary search requires ordered data.
- Applying searching algorithms to a data set.
- Identifying a searching algorithm from code, pseudocode or OCR Exam Reference Language.

Not required:

- Students do not need to memorise the full code or pseudocode for searching algorithms.

### 2.1.9 Sorting algorithms

Must cover:

- Bubble sort.
- Merge sort.
- Insertion sort.
- Main steps of each sorting algorithm.
- Applying sorting algorithms to a data set.
- Identifying a sorting algorithm from code, pseudocode or OCR Exam Reference Language.
- Understanding key segments of code in the algorithm.

Not required:

- Students do not need to memorise the full code or pseudocode for sorting algorithms.

### 2.1.10 Trace tables

Must cover:

- Purpose of trace tables.
- Creating trace tables.
- Completing trace tables.
- Using trace tables to follow an algorithm.
- Recording changes to variable values.
- Using trace tables to identify outputs and logic errors.

Not required:

- No explicit OCR exclusion.

## 2.2 Programming fundamentals

### 2.2.1 Programming fundamentals

Must cover:

- Variables.
- Constants.
- Assignment.
- Input.
- Output.
- Sequence.
- Selection.
- Iteration.
- Count-controlled loops.
- Condition-controlled loops.
- Arithmetic operators:
  - +
  - -
  - *
  - /
  - MOD
  - DIV
  - ^
- Comparison operators:
  - ==
  - !=
  - <
  - <=
  - >
  - >=
- Boolean operators:
  - AND
  - OR
  - NOT
- Practical use of these techniques in a high-level language.

Not required:

- No explicit OCR exclusion.

### 2.2.2 Data types

Must cover:

- Integer.
- Real.
- Boolean.
- Character.
- String.
- Casting.
- Choosing suitable data types for a scenario.
- Temporarily changing a data type using casting.
- Why casting is useful, for example converting input text into an integer for a calculation.

Not required:

- No explicit OCR exclusion.

### 2.2.3 String manipulation

Must cover:

- Basic string manipulation.
- Concatenation.
- Slicing.
- String length.
- Extracting parts of a string.
- Combining strings.
- Practical use of string manipulation in a high-level language.

Not required:

- No explicit OCR exclusion.

### 2.2.4 File handling

Must cover:

- Opening files.
- Reading from files.
- Writing to files.
- Closing files.
- Basic file handling operations in a high-level language.
- Why files need to be opened and closed.
- Reading and writing text data.

Not required:

- No explicit OCR exclusion.

### 2.2.5 Records

Must cover:

- Records as a way to store related data.
- Fields.
- Records in the context of a collection of data.
- How records can be represented using 2D arrays or similar structures.
- Practical use of records in simple programs.

Not required:

- No explicit OCR exclusion.

### 2.2.6 SQL

Must cover:

- SQL as a way to search for data.
- SELECT.
- FROM.
- WHERE.
- Writing simple SQL queries.
- Understanding what each part of a simple SQL statement does.

Not required:

- No explicit OCR exclusion beyond the listed SQL commands.

### 2.2.7 Lists / Arrays

Must cover:

- Arrays or equivalent structures.
- 1D arrays.
- 2D arrays.
- Arrays as fixed length or static structures.
- Using arrays to store multiple values.
- Indexing.
- Accessing values in arrays.
- Updating values in arrays.
- Using 2D arrays to represent tables, fields and records.
- Passing and returning arrays in sub programs.

Not required:

- No explicit OCR exclusion.

### 2.2.8 Sub programs

Must cover:

- Sub programs.
- Procedures.
- Functions.
- Structured code.
- When to use functions.
- When to use procedures.
- Local variables and constants.
- Global variables and constants.
- Passing values into sub programs.
- Returning values from functions.
- Passing and returning arrays.

Not required:

- No explicit OCR exclusion.

### 2.2.9 Random number generation

Must cover:

- Creating random numbers in a program.
- Using random numbers in practical scenarios.
- Generating random integers.
- Generating random real numbers if using OCR Exam Reference Language.
- Applying random numbers in simple program tasks, for example dice rolls, games or simulations.

Not required:

- No explicit OCR exclusion.

## 2.3 Producing robust programs

### 2.3.1 Defensive design

Must cover:

- Anticipating misuse.
- Authentication.
- Username and password authentication.
- Input validation.
- How to deal with invalid data.
- Designing programs to handle likely input values.
- Maintainability.
- Use of sub programs.
- Naming conventions.
- Indentation.
- Commenting.
- Why commenting is useful.
- Applying comments appropriately.

Not required:

- No explicit OCR exclusion.

### 2.3.2 Testing & identifying errors

Must cover:

- Purpose of testing.
- Iterative testing.
- Final or terminal testing.
- Syntax errors.
- Logic errors.
- Normal test data.
- Boundary test data.
- Invalid test data.
- Erroneous test data.
- Selecting suitable test data for a given scenario.
- Creating or completing a test plan.
- Refining algorithms after testing.

Not required:

- No explicit OCR exclusion.

## 2.4 Boolean logic

### 2.4.1 Boolean logic

Must cover:

- AND.
- OR.
- NOT.
- Logic gate symbols.
- Simple logic diagrams.
- Truth tables.
- Combining Boolean operators.
- Applying logical operators in truth tables.
- Creating, completing and editing truth tables.
- Creating, completing and editing logic diagrams.
- Working with more than one gate in a logic diagram.
- Alternative notation, such as T/F for 1/0, where appropriate.

Not required:

- No explicit OCR exclusion.

## 2.5 Programming languages and IDEs

### 2.5.1 Languages

Must cover:

- High-level languages.
- Low-level languages.
- Characteristics of each language level.
- Purpose of each language level.
- The need for translators.
- Compilers.
- Interpreters.
- Differences between compilers and interpreters.
- Benefits and drawbacks of compilers.
- Benefits and drawbacks of interpreters.

Not required:

- Students do not need to understand assemblers.

### 2.5.2 The Integrated Development Environment (IDE)

Must cover:

- What an IDE is.
- Editors.
- Error diagnostics.
- Run-time environment.
- Translators.
- How each tool helps a programmer develop a program.
- Practical experience of using IDE tools.

Not required:

- No explicit OCR exclusion.

## 2.6 Writing programs

### 2.6.1 Writing basic programs

This is not a separate OCR specification heading, but it is a sensible teaching/practice subtopic based on Paper 2 programming content.

Must cover:

- Writing simple programs using:
  - Variables
  - Constants
  - Input
  - Output
  - Assignment
  - Arithmetic operators
  - Comparison operators
  - Boolean operators
  - Sequence
  - Selection
  - Iteration
- Using data types correctly.
- Using casting where needed.
- Writing programs that solve straightforward problems.
- Reading and predicting simple code.
- Using clear variable names, indentation and comments.

Not required:

- Avoid content outside GCSE scope such as advanced object-oriented programming, complex GUIs, APIs, recursion, advanced data structures or external libraries.

### 2.6.2 Writing advanced programs

This is also not a separate OCR specification heading, but it can be used to combine the more complex programming skills students need for Section B.

Must cover:

- Writing programs using:
  - Nested selection
  - Nested iteration
  - String manipulation
  - Lists / arrays
  - 2D arrays
  - File handling
  - Records
  - Sub programs
  - Random number generation
  - Validation
  - Authentication
- Creating structured programs using functions and procedures.
- Using local and global variables appropriately.
- Passing and returning values.
- Testing and refining programs.
- Identifying and fixing syntax and logic errors.
- Using trace tables and test plans to check program behaviour.
- Solving scenario-based programming problems.

Not required:

- Avoid topics beyond OCR J277 such as classes and inheritance, recursion, linked lists, stacks, queues, complex database design, web frameworks or graphical interfaces unless used only as enrichment and clearly labelled as beyond GCSE.

## Q&A and Quiz mode rules

- Q&A pages are for GCSE-style written questions and hidden mark schemes.
- Q&A questions may use command words such as `explain`, `describe`, `discuss`, `evaluate` and `justify`.
- Quiz pages are for self-marking retrieval practice only.
- Quiz answers must have clear, predictable correct answers that the system can mark automatically.
- Do not move written-response exam questions into quiz pages unless they can be marked automatically with one clear correct answer.
- Any answer requiring a sentence, paragraph or teacher judgement belongs in Q&A, not Quiz.

## Q&A question creation rules

- All questions must be based on the OCR GCSE Computer Science J277 specification.
- Do not ask questions that are outside the specification.
- Do not ask questions on content listed as not required in the specification or in the site’s subtopic coverage notes.
- Questions should be typical of GCSE Computer Science exam style.
- Questions should be clear, precise and suitable for Year 10 and Year 11 students.
- Use OCR-style command words where appropriate, such as:
  - state
  - identify
  - describe
  - explain
  - compare
  - discuss
  - evaluate
  - justify
  - complete
  - write
  - draw
  - calculate
  - convert
  - refine
- Command words should be bold in the question text using `<strong>`.
- Do not make the whole question bold.
- Marks must appear at the end of the question, for example `(3 marks)`.
- Marks should be allocated based on the number of points or skills expected.
- One mark should normally equal one valid point, step, reason, comparison or correct part of an answer.
- Avoid vague questions such as `State one key fact about...`.
- Avoid repeated questions that assess the same idea in almost the same way.
- Do not create questions simply to reach a fixed number. Quality is more important than quantity.
- Each topic page should start with a short `What this topic covers` summary of around one or two sentences.

## Q&A subtopic coverage rules

- Each subtopic should have 12 or fewer Q&A questions.
- A subtopic does not have to contain 12 questions.
- The question set should cover the whole subtopic, not just the easiest parts.
- Include a sensible range of difficulty:
  - recall questions
  - understanding questions
  - application questions
  - comparison or judgement questions where suitable
- Use scenarios where possible.
- Scenarios should be realistic, short and relevant.
- Avoid long scenarios unless the question genuinely needs one.
- Do not use the same scenario repeatedly across a topic unless the questions are clearly linked.
- Do not overload a subtopic with too many low-mark recall questions.
- Do not include 6 or 8 mark questions unless that style is suitable for the topic.

## Scenario rules

- Use scenarios where possible.
- Scenarios should be short, realistic and relevant to the topic.
- Scenarios should not add unnecessary reading load.
- Use school, business, home, gaming, media, health, transport, online service, warehouse, booking system, login system or data-processing contexts where appropriate.
- The question must require students to apply knowledge to the scenario, not just repeat memorised definitions.
- Do not force a scenario where a direct technical question is clearer.

## Q&A question type variety

Use a mixture of question formats where suitable:

- Text-based written responses.
- Table completion.
- Fill in the blanks.
- Matching terms to descriptions.
- Multiple-choice style questions where useful.
- Code completion.
- Trace table completion.
- Diagram labelling.
- Diagram drawing.
- Scenario-based recommendations.
- Short comparison questions.
- Error identification and correction.

When using multiple-choice, matching or option-list questions:

- Include plausible distractors.
- Do not make incorrect options obviously wrong.
- Jumble the order of options.
- Keep all options within the same topic area.

## Mark scheme rules

- Every Q&A question must have a mark scheme.
- Mark scheme breakdowns should be bulleted.
- Each bullet should normally represent one creditworthy point.
- Mark schemes should be clear enough for a student to self-assess.
- Include `Accept any other valid point` where appropriate.
- Do not over-credit vague answers.
- Do not require exact wording unless the exact term is essential.
- Where examples are acceptable, say so clearly.
- Where a question asks for a comparison, the mark scheme should credit linked comparative points, not just separate descriptions.
- Where a question asks students to justify or evaluate, the mark scheme should credit reasoning, not just a stated choice.
- Mark schemes must match the scenario when the question is scenario-based.

## Banded mark scheme rules

- Any answer worth 6 or more marks must use a banded mark scheme table.
- The table should describe levels of response.
- Include a top, middle and lower band where appropriate.
- The table should include:
  - mark range
  - quality of response
  - expected content
- The mark scheme may also include indicative content below the banded table.
- Banded mark schemes should be student-friendly.
- Banded mark schemes should not be vague. They must explain what a strong answer includes.

## Programming question rules

- Programming questions must allow either OCR Exam Reference Language or Python.
- The question text should state that students may use OCR Exam Reference Language or Python.
- Programming questions should focus on logic, not exact syntax only.
- Mark schemes should award marks for correct algorithmic steps.
- Credit should be given for:
  - suitable input
  - suitable output
  - assignment
  - correct variables
  - correct data types where relevant
  - selection
  - iteration
  - conditions
  - list or array use where relevant
  - string handling where relevant
  - correct processing logic
- Programming mark schemes must include:
  - a bulleted mark breakdown
  - an OCR-style pseudocode example
  - a Python example
- Python examples should be simple, readable and suitable for GCSE students.
- Pseudocode should use `=` for assignment.
- Pseudocode should not use the arrow symbol.
- Do not force students to use Python only.
- Do not penalise minor syntax differences if the logic is correct.
- Do not include advanced programming concepts unless they are intended for the specific topic.

## Writing programs rules

- Questions on `2.6.1 Writing basic programs` must be worth between 2 and 4 marks.
- Questions on `2.6.2 Writing advanced programs` must be worth between 5 and 8 marks.
- Basic program questions should be short and focused.
- Advanced program questions should require a more complete algorithm or program.
- Advanced program questions may combine selection, iteration, lists, strings and validation-style logic where suitable.

## Diagram question rules

For questions requiring students to draw a diagram, the mark scheme must include the correct diagram or a clear text version of the correct diagram.

This applies to:

- Network diagrams.
- Boolean logic diagrams.
- Flowcharts.
- Structure diagrams or structure charts.
- Any other required technical diagram.

Diagram mark schemes should include:

- The correct drawing or layout.
- Labels where required.
- Mark allocation for each correct component.
- Acceptable alternatives where appropriate.
- Clear notes about direction of flow or connections where relevant.

## Image rules

- Images should be stored in `assets/images/`.
- Image filenames should be lowercase and descriptive, using hyphens.
- Do not use vague filenames such as `image1.png`, `diagram.png`, `screenshot.png` or `question-image.png`.
- Every image must have suitable alt text.
- If the image is needed to answer the question, the alt text must describe the important information.
- Use the reusable `<figure class="question-figure">` pattern.
- Do not rely on colour alone to communicate meaning.

Example:

```html
<figure class="question-figure">
  <img src="../assets/images/example-image.png" alt="Clear description of the image for screen reader users.">
  <figcaption>Figure 1: Short useful caption</figcaption>
</figure>
```

## SQL question rules

- SQL questions must provide the table or tables needed to answer the question.
- Tables should include:
  - table name
  - field names
  - sample records where needed
- If a question involves more than one table, the relationship between the tables should be clear.
- SQL questions should be appropriate for GCSE level.
- Mark schemes should credit correct `SELECT`, `FROM`, `WHERE` and any other required clauses.
- Do not include SQL features beyond the expected GCSE level unless clearly justified by the specification.

## Trace table rules

- Trace table questions must provide the algorithm or code to trace.
- The number of rows should be manageable for GCSE students.
- The mark scheme must include the completed trace table.
- Mark allocation should be clear.
- If marks are awarded per row or per correct value, state this clearly.

## Fill in the blank rules

- Missing words should test meaningful understanding.
- Do not remove too many words from one sentence.
- Provide a word bank if the question would otherwise become too vague.
- Distractors in a word bank should be plausible and from the same topic area.
- The mark scheme should show the completed version or list the correct blanks in order.

## Table completion rules

- Tables should be used where they genuinely improve clarity.
- Table completion questions should have clear column headings.
- Mark schemes should include the completed table.
- If multiple answers are acceptable, say so in the mark scheme.

## Difficulty and mark balance

- Most subtopics should include a mixture of 1, 2, 3 and 4 mark questions.
- Use 5 mark questions only when the answer genuinely needs extended explanation or several linked points.
- Use 6 or more marks only when a banded response is appropriate.
- Do not force an 8 mark question into a subtopic unless it is suitable.
- Avoid making every subtopic follow the same question pattern.
- Ensure harder questions appear after easier questions where possible.

## OCR style rules

- Use concise exam-style wording.
- Avoid informal phrasing.
- Avoid overly leading questions.
- Avoid asking for content that is not part of the OCR GCSE Computer Science specification.
- Do not include university-level or industry-level detail unless the GCSE specification requires it.
- Accept equivalent technical wording where appropriate.

## Self-marking quiz rules

- Quiz pages are for self-marking retrieval practice only.
- Quiz answers must have clear, predictable correct answers.
- Do not use quiz questions for answers that require teacher judgement.
- Do not use quiz questions for extended explanation, discussion, evaluation or justification.
- Written-response exam practice belongs in Q&A, not Quiz.
- Input questions must only be used where the answer is exact and automatically markable.
- Each quiz question should give brief feedback after submission.
- Do not reveal the correct answer before the student submits.
- Allow retry where appropriate.

## Allowed quiz activity types

The following self-marking quiz activity types are allowed:

- Radio buttons.
- Multiple choice.
- True / False.
- Tick all that apply using checkboxes.
- Slider bars.
- Mix and match keyword to description.
- Match example to category.
- Match protocol to purpose.
- Match hardware to function.
- Drag the word to the blank in a paragraph.
- Drag the word to the blank in a table.
- Dropdown missing word.
- Spot the odd one out.
- Identify the misconception.
- Ordering / sequencing.
- Drag steps into the correct order.
- Sort into categories.
- Label the diagram.
- Select the correct diagram.
- Select the correct logic gate.
- Select the correct flowchart symbol.
- Identify the correct network topology.
- Click or select the correct part of a diagram.
- Complete a truth table.
- Complete a trace table.
- Predict the output.
- Identify the syntax error.
- Identify the logic error.
- Choose the correct fix.
- Complete missing code.
- Match code to output.
- Match pseudocode to flowchart.
- Match flowchart to pseudocode.
- Select suitable test data.
- Complete a test plan table.
- Input result calculation.

Do not use every quiz type in every subtopic. Choose the activity type that best matches the knowledge or skill being tested.

## Quiz activity type guidance

Radio buttons should be used when there is one correct answer from a short list.

Multiple choice should be used when students select one correct answer and the distractors can be made plausible.

True / False should be used only for clear factual statements. Avoid statements that are partly true or ambiguous.

Tick all that apply should be used when more than one answer may be correct. The question must clearly say `Tick all that apply`.

Slider bars should be used for numeric values, ranges, ordering, confidence checks or approximate values. Do not use sliders for written judgement questions.

Mix and match should be used for definitions, protocols, hardware, data types, threats, prevention methods and command words.

Drag word to blank activities should be used for key term retrieval. Provide a word bank and include plausible distractors.

Dropdown missing word should be used where drag-and-drop is unnecessary or difficult on mobile. It is also the required accessible fallback for drag-and-drop activities.

Spot the odd one out should be used where one item does not belong in a group and the reason is clear and objective.

Identify the misconception should be used where students must choose the incorrect statement or flawed explanation. The misconception must be common and clearly wrong.

Ordering / sequencing should be used when students need to place steps in the correct order. Suitable examples include the fetch-execute cycle, DNS lookup sequence, binary search steps, bubble sort passes, program execution steps and file handling sequence.

Sort into categories should be used when items can be grouped clearly. Suitable categories include volatile / non-volatile, lossy / lossless, LAN / WAN, wired / wireless, syntax error / logic error, and normal / boundary / invalid / erroneous test data.

Label the diagram should be used for CPU components, network topology diagrams, logic gates, flowchart symbols and structure diagrams.

Select the correct diagram should be used when students must choose the diagram matching a description or expression. Suitable examples include Boolean logic circuits, network topologies, flowcharts and structure diagrams.

Complete a truth table should be used for Boolean logic. Inputs and expected outputs must be unambiguous.

Complete a trace table should be used for algorithms and programming questions. Every cell must have a clear correct value.

Predict the output should be used with short code, pseudocode or OCR Exam Reference Language. The final output must be deterministic.

Identify the error should be used for syntax errors, logic errors or flowchart errors. The correct error must be clear.

Choose the correct fix should be used after an error has been identified. Distractors should be plausible but wrong.

Complete missing code should be used for short gaps in code or pseudocode. Avoid open-ended full program writing. Use Q&A pages for longer code-writing questions.

Match code to output should be used where students match short code fragments to the correct output.

Match pseudocode to flowchart and match flowchart to pseudocode should be used where students identify equivalent representations.

Select suitable test data should be used for normal, boundary, invalid and erroneous test data. It must be linked to a clear validation rule.

Input result calculation should be used only for exact answers.

## Calculation input quiz rules

Calculation input was previously called input quiz. It must not be used for long written responses.

Use calculation input only for short exact answers such as:

- Binary to denary conversions, for example `1000101` in denary.
- Denary to binary conversions, for example converting `37` to 8-bit binary.
- Hexadecimal conversions, for example converting `3F` to denary.
- Binary addition answers.
- Binary shifts.
- File size calculations in bits or bytes.
- Boolean logic outputs.
- Trace table values, such as the final value of a variable.
- Code output questions, such as what is printed when code runs.
- Short SQL output answers where the answer is a single clear value.

Do not use calculation input for:

- Explain questions.
- Describe questions.
- Discuss questions.
- Evaluate questions.
- Justify questions.
- Any answer requiring a sentence or paragraph.
- Any answer where several different phrasings could be correct.
- Any answer that needs teacher judgement.

## Quiz length and coverage rules

A quiz is not complete unless it has been checked against the OCR GCSE Computer Science J277 specification and covers the required areas for that subtopic.

- Each subtopic quiz should normally contain between 10 and 25 questions.
- A quiz may contain more than 25 questions only if the subtopic is large, calculation-heavy, code-heavy, diagram-heavy or has several challenging key areas.
- The number of quiz questions should be justified by coverage and learning value, not by a fixed target.
- Do not create extra questions just to reach a number.
- Each quiz must test all required areas for that subtopic according to the OCR GCSE Computer Science J277 specification.
- Before creating or editing a quiz, check the specification coverage for that subtopic.
- Do not include content outside the specification.
- Do not include content listed as `Not required`.
- A quiz should use a suitable mixture of self-marking question types.
- A quiz should not rely entirely on multiple choice unless the topic is very small.

## Key area testing rules

A quiz should test all required areas for the subtopic, but only key areas should be tested in multiple ways.

Key areas are areas that are:

- Essential for students to know for the OCR GCSE Computer Science J277 exam.
- Commonly assessed in GCSE-style questions.
- Commonly misunderstood by students.
- More challenging than simple recall.
- Needed for later topics.
- Calculation-based, algorithmic, diagram-based or code-based.
- Important for applying knowledge to scenarios.

Do not duplicate questions for no reason.

A required area may only need one question if it is straightforward or minor.

A key area may need several questions if students need to practise it in different ways.

Every question should have a clear purpose. Before adding a quiz question, check:

- Which required area does this question test?
- Is this a key area, or a minor area?
- Is this question testing the idea in a genuinely different way?
- Does this question add useful practice?
- Is it self-marking and objective?
- Is it within the OCR GCSE Computer Science J277 specification?
- Does it avoid content listed as not required?

If the question does not add useful assessment value, do not include it.

## Examples of appropriate repeated testing

Binary conversion may be tested more than once because students need repeated calculation practice.

Boolean logic may be tested through gate recognition, truth tables, logic diagrams, output calculation and misconception questions.

Searching algorithms may be tested through identifying linear search, identifying binary search, applying the algorithm to a list, understanding that binary search requires sorted data, and spotting an error in the steps.

## Examples of unnecessary duplication

Do not ask three separate questions that all simply ask for the definition of RAM.

Do not ask several questions that all test the same advantage of an SSD.

Do not ask multiple true/false questions that repeat the same fact using slightly different wording.

Do not repeat a question just to increase the quiz length.

## Distractor rules

For multiple choice, matching, dropdowns, sorting and misconception questions:

- Distractors must be plausible.
- Distractors should be from the same topic area.
- Avoid obviously silly answers.
- Jumble the order of options.
- Do not place the correct answer in a predictable position.

## Quiz feedback and accessibility rules

- Show whether the answer is correct after submission.
- Give a short explanation after the answer is checked.
- Where useful, link back to the Q&A topic page.
- Do not reveal the answer before the student submits.
- Allow retry where appropriate.
- All quiz controls must be keyboard accessible.
- Do not rely on colour alone.
- Use readable labels for radio buttons and checkboxes.
- Drag-and-drop activities must have an accessible fallback, such as dropdowns.
- Input answers should ignore harmless spacing and capitalisation where appropriate.
- Feedback should be concise, clear and student-friendly.

## HTML formatting rules

- Questions and mark schemes must be hard-coded directly inside the topic HTML page.
- Do not store Q&A questions in JavaScript.
- Do not create topic-specific JavaScript files.
- Each Q&A question must be inside an `<article class="question-card">`.
- Each Q&A question should use `<p class="question-text">`.
- Each mark scheme must use `<div class="mark-scheme">`.
- Each reveal button must use `aria-expanded` and `aria-controls`.
- Each mark scheme must have a unique id.
- Do not leave empty `<div id="question-list"></div>` containers.
- Do not use horizontal rules.

## Topic page requirements

Each topic Q&A page should contain:

- Header.
- Back to home button.
- Question header with paper name, topic title and short topic summary.
- Hard-coded question-card sections.
- Each question-card should include question text, marks at the end, a Show mark scheme button and a hidden mark scheme div.
- Footer.
- Shared `site.js` script only.

## Final Q&A quality assurance checklist

Before committing Q&A question changes, check that:

- Every question is linked to the correct subtopic.
- Every question is within the OCR GCSE Computer Science specification.
- The number of marks matches the expected answer.
- The mark scheme has enough valid points for the marks available.
- The mark scheme does not award more marks than the question total.
- Command words are used correctly.
- Command words are bold and only command words are bold.
- Mark schemes are hidden by default.
- Reveal buttons work correctly.
- There are no duplicate question IDs or mark scheme IDs.
- There are no duplicate or near-duplicate questions in the same subtopic.
- Programming questions include both pseudocode and Python examples.
- Diagram questions include the correct diagram or a clear correct drawing guide.
- SQL questions include the required table or tables.
- The page uses UK English spelling.
- The page contains no placeholder questions.
- The page contains 12 or fewer Q&A questions.

## Final quiz quality assurance checklist

Before committing quiz changes, check that:

- The quiz matches the correct subtopic.
- The quiz has been checked against the OCR GCSE Computer Science J277 specification.
- The quiz covers all required areas for the subtopic.
- The quiz avoids content that is not required.
- Key areas are tested in more than one way where useful.
- There is a sensible range of difficulty.
- The quiz normally contains between 10 and 25 questions unless more are justified by topic size.
- All questions are self-marking.
- All answers are objectively markable.
- Distractors are plausible and from the same topic area.
- Answers and feedback are accurate.
- Calculations are checked carefully.
- Code, pseudocode, trace table and truth table answers are correct.
- Quiz controls are accessible and usable on mobile.
- UK English spelling is used throughout.

## Repository maintenance rule

This README.md replaces `QUESTION_CREATION_POLICY.md`. If `QUESTION_CREATION_POLICY.md` still exists, delete it. If deletion is not possible, replace its contents with:

`This file has been merged into README.md. Use README.md as the single source of truth.`
