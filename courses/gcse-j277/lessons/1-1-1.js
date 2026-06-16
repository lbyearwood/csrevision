(() => {
  window.CSRevision = window.CSRevision || {};
  window.CSRevision.lessonGlossaries = window.CSRevision.lessonGlossaries || {};
  window.CSRevision.lessonGlossaries["1-1-1"] = {
    title: "1.1.1 Architecture of the CPU",
    terms: [
      {
        term: "CPU",
        definition: "The main processor. It processes instructions and controls many computer operations."
      },
      {
        term: "Fetch-execute cycle",
        definition: "The repeated process where the CPU gets, understands and carries out instructions."
      },
      {
        term: "ALU",
        definition: "Performs calculations and logical comparisons."
      },
      {
        term: "Control Unit",
        definition: "Coordinates the movement of instructions and data."
      },
      {
        term: "Register",
        definition: "A very small and fast storage location inside the CPU."
      }
    ]
  };

  function initCpuMemoryFlow() {
    const svgElement = document.getElementById("cpu-memory-flow-d3");
    if (!svgElement) return;

    if (!window.d3) {
      svgElement.insertAdjacentHTML("afterend", "<p class=\"slide-answer\">The CPU and memory exchange binary data while a program runs.</p>");
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = d3.select(svgElement);
    const width = 920;
    const height = 520;
    const memory = { x: 80, y: 170, width: 230, height: 160, label: "Memory" };
    const cpu = { x: 610, y: 150, width: 230, height: 200, label: "CPU" };
    const packets = [
      { bits: "0101", y: 220, from: memory.x + memory.width + 24, to: cpu.x - 24, colour: "#233a8b", delay: 0 },
      { bits: "1100", y: 275, from: cpu.x - 24, to: memory.x + memory.width + 24, colour: "#00856f", delay: 900 },
      { bits: "1010", y: 245, from: memory.x + memory.width + 24, to: cpu.x - 24, colour: "#233a8b", delay: 1800 }
    ];

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "cpu-memory-arrow")
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("refX", 10)
      .attr("refY", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L12,6 L0,12 Z")
      .attr("fill", "#233a8b");

    defs.append("marker")
      .attr("id", "memory-cpu-arrow")
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("refX", 10)
      .attr("refY", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L12,6 L0,12 Z")
      .attr("fill", "#00856f");

    const bus = svg.append("g").attr("aria-hidden", "true");
    bus.append("line")
      .attr("x1", memory.x + memory.width + 34)
      .attr("y1", 220)
      .attr("x2", cpu.x - 34)
      .attr("y2", 220)
      .attr("class", "cpu-memory-flow-bus")
      .attr("marker-end", "url(#cpu-memory-arrow)");
    bus.append("line")
      .attr("x1", cpu.x - 34)
      .attr("y1", 300)
      .attr("x2", memory.x + memory.width + 34)
      .attr("y2", 300)
      .attr("class", "cpu-memory-flow-bus is-return")
      .attr("marker-end", "url(#memory-cpu-arrow)");

    function drawNode(node, className) {
      const group = svg.append("g");
      group.append("rect")
        .attr("x", node.x)
        .attr("y", node.y)
        .attr("width", node.width)
        .attr("height", node.height)
        .attr("rx", 28)
        .attr("class", className);
      group.append("text")
        .attr("x", node.x + node.width / 2)
        .attr("y", node.y + node.height / 2 + 10)
        .attr("text-anchor", "middle")
        .attr("class", className === "svg-chip-large" ? "svg-chip-text" : "cpu-memory-flow-label")
        .text(node.label);
    }

    drawNode(memory, "svg-memory");
    drawNode(cpu, "svg-chip-large");

    const packetLayer = svg.append("g").attr("aria-hidden", "true");

    function animatePacket(packet, index) {
      const group = packetLayer.append("g")
        .attr("transform", `translate(${packet.from}, ${packet.y})`)
        .attr("opacity", prefersReducedMotion ? 1 : 0);

      group.append("rect")
        .attr("x", -45)
        .attr("y", -22)
        .attr("width", 90)
        .attr("height", 44)
        .attr("rx", 14)
        .attr("fill", packet.colour);

      group.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("class", "cpu-memory-flow-bit")
        .text(packet.bits);

      if (prefersReducedMotion) {
        group.attr("transform", `translate(${packet.from + ((packet.to - packet.from) * (index + 1)) / 4}, ${packet.y})`);
        return;
      }

      function loop() {
        group
          .attr("transform", `translate(${packet.from}, ${packet.y})`)
          .attr("opacity", 0)
          .transition()
          .delay(packet.delay)
          .duration(250)
          .attr("opacity", 1)
          .transition()
          .duration(1800)
          .ease(d3.easeCubicInOut)
          .attr("transform", `translate(${packet.to}, ${packet.y})`)
          .transition()
          .duration(250)
          .attr("opacity", 0)
          .on("end", loop);
      }

      loop();
    }

    packets.forEach(animatePacket);
  }

  function initCpuArchitectureDiagram() {
    const svg = d3.select("#cpu-components-d3");
    if (svg.empty()) return;

    svg.selectAll("defs, g, rect, line, path, text").remove();

    function rect(parent, x, y, width, height, fill, stroke, strokeWidth = 3, rx = 0) {
      return parent.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("rx", rx)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth);
    }

    function label(parent, text, x, y, size = 18, weight = 800, fill = "#071638", anchor = "middle") {
      return parent.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", anchor)
        .attr("dominant-baseline", "middle")
        .attr("font-size", size)
        .attr("font-weight", weight)
        .attr("fill", fill)
        .text(text);
    }

    function twoLineLabel(parent, lineOne, lineTwo, x, y, size = 17) {
      const text = parent.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", size)
        .attr("font-weight", 800)
        .attr("fill", "#071638");
      text.append("tspan").attr("x", x).text(lineOne);
      text.append("tspan").attr("x", x).attr("dy", 22).text(lineTwo);
      return text;
    }

    function component(parent, name, labelText) {
      return parent.append("g")
        .attr("class", `cpu-component-node${name === "control" ? " is-active" : ""}`)
        .attr("data-cpu-component", name)
        .attr("tabindex", "0")
        .attr("role", "button")
        .attr("aria-label", `Explain ${labelText}`);
    }

    const root = svg.append("g").attr("transform", "translate(8, 18)");
    const cpu = root.append("g");
    rect(cpu, 0, 118, 520, 370, "#cfe8c8", "#285b24", 4);
    label(cpu, "Central Processing Unit (CPU)", 260, 154, 31, 900);

    const control = component(cpu, "control", "Control Unit");
    rect(control, 16, 182, 280, 112, "#f6d13a", "#8a7600", 3);
    label(control, "Control Unit (CU)", 156, 238, 20, 900);

    const alu = component(cpu, "alu", "ALU");
    rect(alu, 16, 304, 280, 166, "#b6a3d8", "#4f3e73", 3);
    twoLineLabel(alu, "Arithmetic Logic Unit", "(ALU)", 156, 388, 20);

    const registers = cpu.append("g");
    rect(registers, 304, 182, 208, 172, "#82adba", "#2d5962", 3);
    twoLineLabel(registers, "Special purpose", "registers", 408, 208, 16);

    const cir = component(registers, "cir", "CIR");
    rect(cir, 316, 244, 54, 48, "#8fc47f", "#285b24", 3);
    label(cir, "CIR", 343, 268, 16, 900);

    const mdr = component(registers, "mdr", "MDR");
    rect(mdr, 456, 244, 54, 48, "#a9c4ff", "#315fc8", 3);
    label(mdr, "MDR", 483, 268, 16, 900);

    const acc = component(registers, "acc", "ACC");
    rect(acc, 316, 304, 54, 48, "#c9b8e6", "#4f3e73", 3);
    label(acc, "ACC", 343, 328, 16, 900);

    const pc = component(registers, "pc", "PC");
    rect(pc, 386, 304, 54, 48, "#ffe169", "#8a7600", 3);
    label(pc, "PC", 413, 328, 16, 900);

    const mar = component(registers, "mar", "MAR");
    rect(mar, 456, 304, 54, 48, "#f3a4a4", "#9b2828", 3);
    label(mar, "MAR", 483, 328, 16, 900);

    const gpRegisters = component(registers, "gp-registers", "general purpose registers");
    rect(gpRegisters, 304, 366, 208, 104, "#63ad52", "#285b24", 3);
    twoLineLabel(gpRegisters, "General purpose", "registers", 408, 392, 16);
    rect(gpRegisters, 316, 424, 54, 48, "#cfe8c8", "#285b24", 3);
    label(gpRegisters, "R1", 343, 448, 15, 700);
    rect(gpRegisters, 386, 424, 54, 48, "#cfe8c8", "#285b24", 3);
    label(gpRegisters, "...", 413, 448, 15, 700);
    rect(gpRegisters, 456, 424, 54, 48, "#cfe8c8", "#285b24", 3);
    label(gpRegisters, "R16", 483, 448, 15, 700);

    const bus = cpu.append("g");

    bus.append("line")
      .attr("x1", 370)
      .attr("y1", 268)
      .attr("x2", 456)
      .attr("y2", 268)
      .attr("stroke", "#315fc8")
      .attr("stroke-width", 5);

    const dataBus = component(bus, "data-bus", "data bus");
    dataBus.append("rect").attr("x", 520).attr("y", 238).attr("width", 108).attr("height", 48).attr("fill", "transparent").attr("stroke", "transparent");
    dataBus.append("line")
      .attr("x1", 510)
      .attr("y1", 268)
      .attr("x2", 625)
      .attr("y2", 268)
      .attr("stroke", "#315fc8")
      .attr("stroke-width", 5);
    label(dataBus, "Data bus", 578, 246, 13, 800, "#315fc8");

    const addressBus = component(bus, "address-bus", "address bus");
    addressBus.append("rect").attr("x", 506).attr("y", 310).attr("width", 120).attr("height", 54).attr("fill", "transparent").attr("stroke", "transparent");
    addressBus.append("line")
      .attr("x1", 510)
      .attr("y1", 328)
      .attr("x2", 625)
      .attr("y2", 328)
      .attr("stroke", "#e45b64")
      .attr("stroke-width", 5);
    label(addressBus, "Address bus", 582, 352, 13, 800, "#e45b64");

    const ram = component(root, "ram", "RAM");
    const ramX = 626;
    const ramY = 118;
    const ramWidth = 250;
    const ramHeight = 370;
    const ramAddressWidth = 112;
    const ramDataWidth = ramWidth - ramAddressWidth;
    rect(ram, ramX, ramY, ramWidth, ramHeight, "#d8f0d1", "#2f762e", 3);
    rect(ram, ramX, ramY, ramWidth, 54, "#63a952", "#2f762e", 3);
    label(ram, "RAM", ramX + ramWidth / 2, ramY + 30, 25, 900);
    rect(ram, ramX, ramY + 54, ramAddressWidth, 34, "#63a952", "#2f762e", 3);
    rect(ram, ramX + ramAddressWidth, ramY + 54, ramDataWidth, 34, "#63a952", "#2f762e", 3);
    label(ram, "Address", ramX + ramAddressWidth / 2, ramY + 72, 13, 900);
    label(ram, "Instruction / data", ramX + ramAddressWidth + ramDataWidth / 2, ramY + 72, 13, 900);

    const rows = [
      ["00000000", "0110101101101011"],
      ["00000001", "0001010101010110"],
      ["00000010", "1010101000110101"],
      ["00000011", "1010101101010101"],
      ["00000100", "1111101010101010"],
      ["00000101", "1010101111010100"],
      ["00000110", "1010100011010101"]
    ];

    rows.forEach((row, index) => {
      const y = ramY + 88 + index * 36;
      rect(ram, ramX, y, ramAddressWidth, 36, "#d8f0d1", "#2f762e", 2);
      rect(ram, ramX + ramAddressWidth, y, ramDataWidth, 36, "#d8f0d1", "#2f762e", 2);
      label(ram, row[0], ramX + ramAddressWidth / 2, y + 18, 11, 900);
      label(ram, row[1], ramX + ramAddressWidth + ramDataWidth / 2, y + 18, 11, 900);
    });
  }

  function initCpuComponentExplorer() {
    const slide = document.querySelector(".cpu-components-interactive-slide");
    const panel = slide?.querySelector("[data-component-explanation]");
    const nodes = Array.from(slide?.querySelectorAll("[data-cpu-component]") || []);
    if (!slide || !panel || !nodes.length) return;

    const explanations = {
      control: {
        label: "Control Unit",
        text: "The Control Unit coordinates what happens inside the CPU. It directs the flow of instructions and data so the right CPU parts act in the right order."
      },
      alu: {
        label: "ALU",
        text: "The Arithmetic Logic Unit performs calculations and logical comparisons, such as adding numbers or checking whether one value is larger than another."
      },
      cir: {
        label: "CIR",
        text: "The Current Instruction Register stores the instruction currently being decoded and executed."
      },
      mdr: {
        label: "MDR",
        text: "The Memory Data Register stores data being transferred to or from RAM."
      },
      acc: {
        label: "ACC",
        text: "The Accumulator stores the result of a calculation while the CPU is processing."
      },
      pc: {
        label: "PC",
        text: "The Program Counter stores the address of the next instruction to fetch from RAM."
      },
      mar: {
        label: "MAR",
        text: "The Memory Address Register stores the address of the memory location currently being used."
      },
      "data-bus": {
        label: "Data bus",
        text: "The data bus carries instructions or data between the CPU and RAM."
      },
      "address-bus": {
        label: "Address bus",
        text: "The address bus carries the memory address that tells RAM which location to use."
      },
      ram: {
        label: "RAM",
        text: "RAM stores the instructions and data the CPU needs while a program is running."
      },
      "gp-registers": {
        label: "General purpose registers",
        text: "General purpose registers temporarily hold values the CPU is using right now."
      }
    };

    function showComponent(name) {
      const detail = explanations[name] || explanations.control;
      nodes.forEach((node) => node.classList.toggle("is-active", node.dataset.cpuComponent === name));
      panel.className = `teaching-explanation-card TextPanel component-explanation-panel is-${name}`;
      panel.innerHTML = `<span class="component-explanation-label">${detail.label}</span><p>${detail.text}</p>`;
    }

    nodes.forEach((node) => {
      const name = node.dataset.cpuComponent;
      node.addEventListener("mouseenter", () => showComponent(name));
      node.addEventListener("focus", () => showComponent(name));
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        showComponent(name);
      });
      node.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        showComponent(name);
      });
    });

    showComponent("control");
  }

  function initFetchSequenceSorter() {
    const slide = document.querySelector('[data-template="activity-application-card-preview"] [data-sequence-sorter]')?.closest("section");
    const list = slide?.querySelector("[data-sequence-list]");
    const feedback = slide?.querySelector("[data-sequence-feedback]");
    const resetButton = slide?.querySelector("[data-sequence-reset]");
    if (!slide || !list || !feedback) return;

    const correctOrder = ["fetch", "decode", "execute", "repeat"];
    let draggedCard = null;

    function slots() {
      return Array.from(list.querySelectorAll(".sequence-card-slot"));
    }

    function cards() {
      return slots().map((slot) => slot.querySelector("[data-sequence-card]")).filter(Boolean);
    }

    const startingOrder = cards();

    function setCardOrder(orderedCards) {
      slots().forEach((slot, index) => {
        if (orderedCards[index]) slot.appendChild(orderedCards[index]);
      });
    }

    function updateMoveButtons() {
      const allCards = cards();
      allCards.forEach((card, index) => {
        const up = card.querySelector('[data-sequence-move="up"]');
        const down = card.querySelector('[data-sequence-move="down"]');
        if (up) up.disabled = index === 0;
        if (down) down.disabled = index === allCards.length - 1;
      });
    }

    function assessOrder() {
      const currentOrder = cards().map((card) => card.dataset.stage);
      const correctCount = currentOrder.filter((stage, index) => stage === correctOrder[index]).length;
      const isCorrect = correctCount === correctOrder.length;

      cards().forEach((card, index) => {
        const isPositionCorrect = card.dataset.stage === correctOrder[index];
        card.classList.toggle("is-position-correct", isPositionCorrect);
        card.classList.toggle("is-position-incorrect", !isPositionCorrect);
      });

      feedback.classList.toggle("is-correct", isCorrect);
      feedback.classList.toggle("is-incorrect", !isCorrect);
      feedback.innerHTML = `<p class="clickable-hinge-status sequence-feedback-status">You have ${correctCount} of ${correctOrder.length} correct.</p>`;
    }

    function moveCard(card, direction) {
      const orderedCards = cards();
      const currentIndex = orderedCards.indexOf(card);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= orderedCards.length) return;
      [orderedCards[currentIndex], orderedCards[targetIndex]] = [orderedCards[targetIndex], orderedCards[currentIndex]];
      setCardOrder(orderedCards);
      updateMoveButtons();
      assessOrder();
      card.focus();
    }

    function resetActivity() {
      setCardOrder(startingOrder);
      cards().forEach((card) => card.classList.remove("is-dragging", "is-over"));
      draggedCard = null;
      updateMoveButtons();
      assessOrder();
    }

    cards().forEach((card) => {
      card.addEventListener("dragstart", (event) => {
        draggedCard = card;
        card.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", card.dataset.stage);
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("is-dragging");
        cards().forEach((item) => item.classList.remove("is-over"));
        draggedCard = null;
        updateMoveButtons();
        assessOrder();
      });

      card.addEventListener("dragover", (event) => {
        event.preventDefault();
        if (!draggedCard || draggedCard === card) return;
        card.classList.add("is-over");
        const orderedCards = cards();
        const draggedIndex = orderedCards.indexOf(draggedCard);
        const targetIndex = orderedCards.indexOf(card);
        if (draggedIndex < 0 || targetIndex < 0) return;
        const cardMiddle = card.getBoundingClientRect().top + card.offsetHeight / 2;
        orderedCards.splice(draggedIndex, 1);
        const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        const insertIndex = event.clientY < cardMiddle ? adjustedTargetIndex : adjustedTargetIndex + 1;
        orderedCards.splice(insertIndex, 0, draggedCard);
        setCardOrder(orderedCards);
        assessOrder();
      });

      card.addEventListener("dragleave", () => card.classList.remove("is-over"));
      card.querySelectorAll("[data-sequence-move]").forEach((button) => {
        button.addEventListener("click", () => moveCard(card, button.dataset.sequenceMove));
      });
    });

    resetButton?.addEventListener("click", resetActivity);
    updateMoveButtons();
    assessOrder();
  }

  function initFdeCycleInteractive() {
    const svgElement = document.getElementById("fde-cycle-interactive-d3");
    const explanation = document.querySelector("[data-fde-explanation]");
    if (!svgElement || !explanation) return;

    const stageDetails = {
      fetch: {
        label: "Fetch",
        text: "The CPU gets the next instruction from memory. The Program Counter holds the address of that next instruction, and the instruction is copied into the CPU so it can be worked on.",
        colour: "#315fc8"
      },
      decode: {
        label: "Decode",
        text: "The Control Unit decodes the instruction. This means it works out what the instruction is asking the CPU to do and which CPU parts will be needed.",
        colour: "#8a4cc2"
      },
      execute: {
        label: "Execute",
        text: "The CPU carries out the instruction. The ALU may perform a calculation or comparison, and registers may temporarily hold data or results.",
        colour: "#c56a00"
      }
    };

    function showStage(stageName) {
      const detail = stageDetails[stageName] || stageDetails.fetch;
      svgElement.querySelectorAll("[data-fde-stage]").forEach((node) => {
        const isActive = node.dataset.fdeStage === stageName;
        node.classList.toggle("is-active", isActive);
        node.setAttribute("aria-pressed", String(isActive));
      });
      explanation.className = `teaching-explanation-card TextPanel fde-cycle-explanation is-${stageName}`;
      explanation.innerHTML = `<span class="component-explanation-label">${detail.label}</span><p>${detail.text}</p>`;
    }

    if (!window.d3) {
      svgElement.insertAdjacentHTML("afterend", "<p class=\"slide-answer\">Hover over or click a stage to explain Fetch, Decode or Execute.</p>");
      showStage("fetch");
      return;
    }

    const svg = d3.select(svgElement);
    const width = 900;
    const height = 470;
    const nodeRadius = 72;
    const stages = [
      { key: "fetch", number: "1", x: 450, y: 100, label: "Fetch" },
      { key: "decode", number: "2", x: 630, y: 330, label: "Decode" },
      { key: "execute", number: "3", x: 270, y: 330, label: "Execute" }
    ];

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "fde-cycle-arrow")
      .attr("markerWidth", 13)
      .attr("markerHeight", 13)
      .attr("refX", 11.5)
      .attr("refY", 6.5)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M0,0 L13,6.5 L0,13 Z")
      .attr("fill", "#315fc8");

    function edgePoint(from, to, offset = 0) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      return {
        x: from.x + (dx / length) * (nodeRadius + offset),
        y: from.y + (dy / length) * (nodeRadius + offset)
      };
    }

    function linkPath(from, to, bend) {
      const start = edgePoint(from, to, 4);
      const end = edgePoint(to, from, 10);
      const mx = (start.x + end.x) / 2;
      const my = (start.y + end.y) / 2;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      const control = {
        x: mx + (-dy / length) * bend,
        y: my + (dx / length) * bend
      };
      return `M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`;
    }

    const linkPaths = [
      linkPath(stages[0], stages[1], 30),
      linkPath(stages[1], stages[2], 82),
      linkPath(stages[2], stages[0], 30)
    ];

    svg.selectAll(".fde-cycle-loop")
      .data(linkPaths)
      .enter()
      .append("path")
      .attr("class", "fde-cycle-loop")
      .attr("d", (path) => path)
      .attr("marker-end", "url(#fde-cycle-arrow)");

    const pulse = svg.append("circle")
      .attr("class", "fde-cycle-pulse")
      .attr("r", 7);
    pulse.append("animateMotion")
      .attr("dur", "6s")
      .attr("repeatCount", "indefinite")
      .attr("path", linkPaths.join(" "));

    const stageGroups = svg.selectAll(".fde-cycle-stage")
      .data(stages)
      .enter()
      .append("g")
      .attr("class", "fde-cycle-stage")
      .attr("data-fde-stage", (stage) => stage.key)
      .attr("role", "button")
      .attr("tabindex", 0)
      .attr("aria-pressed", "false")
      .attr("aria-label", (stage) => `${stage.label} stage`)
      .attr("transform", (stage) => `translate(${stage.x} ${stage.y})`);

    stageGroups.append("circle")
      .attr("class", "fde-cycle-stage-ring")
      .attr("r", nodeRadius + 8);

    stageGroups.append("circle")
      .attr("class", "fde-cycle-stage-core")
      .attr("r", nodeRadius - 7)
      .attr("fill", (stage) => stageDetails[stage.key].colour);

    stageGroups.append("circle")
      .attr("class", "fde-cycle-stage-number-badge")
      .attr("cx", -43)
      .attr("cy", -43)
      .attr("r", 17);

    stageGroups.append("text")
      .attr("class", "fde-cycle-stage-number")
      .attr("x", -43)
      .attr("y", -37)
      .attr("text-anchor", "middle")
      .text((stage) => stage.number);

    stageGroups.append("text")
      .attr("class", "fde-cycle-stage-label")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .text((stage) => stage.label);

    stageGroups.on("click", (event, stage) => showStage(stage.key));
    stageGroups.on("mouseenter", (event, stage) => showStage(stage.key));
    stageGroups.on("focus", (event, stage) => showStage(stage.key));
    stageGroups.on("keydown", (event, stage) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      showStage(stage.key);
    });

    showStage("fetch");
  }

  function initFdeCycleAction() {
    const slide = document.querySelector(".fde-cycle-action-slide");
    const svgElement = document.getElementById("fde-cycle-action-d3");
    const explanation = slide?.querySelector("[data-fde-action-explanation]");
    if (!slide || !svgElement || !explanation || !window.d3) return;

    const steps = [
      {
        title: "Step 1: PC points to the next instruction",
        text: "The Program Counter stores address 1, so the CPU knows which RAM address to fetch from next.",
        values: { CU: "-", ALU: "-", PC: "1", MAR: "-", MDR: "-", CIR: "-", ACC: "-" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 2: PC is copied into MAR",
        text: "The address 1 is copied from the Program Counter into the Memory Address Register.",
        values: { CU: "Fetch", ALU: "-", PC: "1", MAR: "1", MDR: "-", CIR: "-", ACC: "-" },
        activeCpu: "MAR",
        activeRam: null,
        activeBus: "address",
        packet: { bus: "address", label: "1", direction: "cpu-to-ram" }
      },
      {
        title: "Step 3: RAM returns the instruction",
        text: "RAM uses address 1 and sends the instruction LDA 10 back to the CPU on the data bus.",
        values: { CU: "Fetch", ALU: "-", PC: "1", MAR: "1", MDR: "LDA 10", CIR: "-", ACC: "-" },
        activeCpu: "MDR",
        activeRam: "1",
        activeBus: "data",
        packet: { bus: "data", label: "LDA 10", direction: "ram-to-cpu" }
      },
      {
        title: "Step 4: PC increments by 1",
        text: "The Program Counter increases from 1 to 2, so it points to the next instruction for the next cycle.",
        values: { CU: "Fetch", ALU: "-", PC: "2", MAR: "1", MDR: "LDA 10", CIR: "-", ACC: "-" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 5: MDR is copied into CIR",
        text: "The instruction LDA 10 is copied into the Current Instruction Register, ready for the Control Unit to inspect.",
        values: { CU: "Fetch", ALU: "-", PC: "2", MAR: "1", MDR: "LDA 10", CIR: "LDA 10", ACC: "-" },
        activeCpu: "CIR",
        activeRam: "1",
        activeBus: null,
        packet: null
      },
      {
        title: "Step 6: The instruction is decoded",
        text: "Now that LDA 10 is in the CIR, the Control Unit decodes it and identifies that address 10 is needed.",
        values: { CU: "Decode", ALU: "-", PC: "2", MAR: "1", MDR: "LDA 10", CIR: "LDA 10", ACC: "-" },
        activeCpu: "CU",
        activeRam: null,
        activeBus: "control",
        packet: { bus: "control", label: "Decode", direction: "cpu-to-ram" }
      },
      {
        title: "Step 7: Operand address is placed in MAR",
        text: "The instruction needs the value stored at address 10, so address 10 is placed into the MAR.",
        values: { CU: "Fetch data", ALU: "-", PC: "2", MAR: "10", MDR: "LDA 10", CIR: "LDA 10", ACC: "-" },
        activeCpu: "MAR",
        activeRam: null,
        activeBus: "address",
        packet: { bus: "address", label: "10", direction: "cpu-to-ram" }
      },
      {
        title: "Step 8: Data is loaded into ACC",
        text: "RAM sends the value 8 from address 10 to the CPU, and the Accumulator stores the result.",
        values: { CU: "Execute", ALU: "-", PC: "2", MAR: "10", MDR: "8", CIR: "LDA 10", ACC: "8" },
        activeCpu: "ACC",
        activeRam: "10",
        activeBus: "data",
        packet: { bus: "data", label: "8", direction: "ram-to-cpu" }
      },
      {
        title: "Step 9: PC points to the next instruction",
        text: "The first instruction is complete, so the CPU begins the next fetch from the address now held in the Program Counter.",
        values: { CU: "Fetch", ALU: "-", PC: "2", MAR: "10", MDR: "8", CIR: "LDA 10", ACC: "8" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 10: PC is copied into MAR",
        text: "Address 2 is copied into the MAR so RAM can find the next instruction.",
        values: { CU: "Fetch", ALU: "-", PC: "2", MAR: "2", MDR: "8", CIR: "LDA 10", ACC: "8" },
        activeCpu: "MAR",
        activeRam: null,
        activeBus: "address",
        packet: { bus: "address", label: "2", direction: "cpu-to-ram" }
      },
      {
        title: "Step 11: RAM returns ADD #4",
        text: "RAM sends the instruction ADD #4 from address 2 back to the CPU.",
        values: { CU: "Fetch", ALU: "-", PC: "2", MAR: "2", MDR: "ADD #4", CIR: "LDA 10", ACC: "8" },
        activeCpu: "MDR",
        activeRam: "2",
        activeBus: "data",
        packet: { bus: "data", label: "ADD #4", direction: "ram-to-cpu" }
      },
      {
        title: "Step 12: PC increments by 1",
        text: "The Program Counter increases from 2 to 3, ready for the following instruction.",
        values: { CU: "Fetch", ALU: "-", PC: "3", MAR: "2", MDR: "ADD #4", CIR: "LDA 10", ACC: "8" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 13: MDR is copied into CIR",
        text: "ADD #4 is copied into the Current Instruction Register so it can be decoded.",
        values: { CU: "Fetch", ALU: "-", PC: "3", MAR: "2", MDR: "ADD #4", CIR: "ADD #4", ACC: "8" },
        activeCpu: "CIR",
        activeRam: "2",
        activeBus: null,
        packet: null
      },
      {
        title: "Step 14: ADD #4 is decoded",
        text: "The Control Unit decodes ADD #4 and identifies that the ALU must add 4 to the accumulator.",
        values: { CU: "Decode", ALU: "-", PC: "3", MAR: "2", MDR: "ADD #4", CIR: "ADD #4", ACC: "8" },
        activeCpu: "CU",
        activeRam: null,
        activeBus: "control",
        packet: { bus: "control", label: "Decode", direction: "cpu-to-ram" }
      },
      {
        title: "Step 15: The ALU adds 4",
        text: "The ALU calculates 8 + 4, and the Accumulator is updated to store the result 12.",
        values: { CU: "Execute", ALU: "8 + 4", PC: "3", MAR: "2", MDR: "ADD #4", CIR: "ADD #4", ACC: "12" },
        activeCpu: "ALU",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 16: PC points to the next instruction",
        text: "The CPU starts another fetch cycle using the address 3 now held in the Program Counter.",
        values: { CU: "Fetch", ALU: "-", PC: "3", MAR: "2", MDR: "ADD #4", CIR: "ADD #4", ACC: "12" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 17: PC is copied into MAR",
        text: "Address 3 is copied into the MAR so RAM can locate the next instruction.",
        values: { CU: "Fetch", ALU: "-", PC: "3", MAR: "3", MDR: "ADD #4", CIR: "ADD #4", ACC: "12" },
        activeCpu: "MAR",
        activeRam: null,
        activeBus: "address",
        packet: { bus: "address", label: "3", direction: "cpu-to-ram" }
      },
      {
        title: "Step 18: RAM returns STO 11",
        text: "RAM sends the instruction STO 11 from address 3 back to the CPU.",
        values: { CU: "Fetch", ALU: "-", PC: "3", MAR: "3", MDR: "STO 11", CIR: "ADD #4", ACC: "12" },
        activeCpu: "MDR",
        activeRam: "3",
        activeBus: "data",
        packet: { bus: "data", label: "STO 11", direction: "ram-to-cpu" }
      },
      {
        title: "Step 19: PC increments by 1",
        text: "The Program Counter increases from 3 to 4, so it now points at the Halt instruction.",
        values: { CU: "Fetch", ALU: "-", PC: "4", MAR: "3", MDR: "STO 11", CIR: "ADD #4", ACC: "12" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 20: MDR is copied into CIR",
        text: "STO 11 is copied into the CIR so the Control Unit can decode the store instruction.",
        values: { CU: "Fetch", ALU: "-", PC: "4", MAR: "3", MDR: "STO 11", CIR: "STO 11", ACC: "12" },
        activeCpu: "CIR",
        activeRam: "3",
        activeBus: null,
        packet: null
      },
      {
        title: "Step 21: STO 11 is decoded",
        text: "The Control Unit decodes STO 11 and identifies that the accumulator value must be stored at address 11.",
        values: { CU: "Decode", ALU: "-", PC: "4", MAR: "3", MDR: "STO 11", CIR: "STO 11", ACC: "12" },
        activeCpu: "CU",
        activeRam: null,
        activeBus: "control",
        packet: { bus: "control", label: "Decode", direction: "cpu-to-ram" }
      },
      {
        title: "Step 22: Address 11 is placed in MAR",
        text: "The store instruction needs RAM address 11, so that address is placed into the MAR.",
        values: { CU: "Execute", ALU: "-", PC: "4", MAR: "11", MDR: "12", CIR: "STO 11", ACC: "12" },
        activeCpu: "MAR",
        activeRam: null,
        activeBus: "address",
        packet: { bus: "address", label: "11", direction: "cpu-to-ram" }
      },
      {
        title: "Step 23: ACC is stored in RAM",
        text: "The value 12 is sent from the Accumulator to RAM and stored at address 11.",
        values: { CU: "Execute", ALU: "-", PC: "4", MAR: "11", MDR: "12", CIR: "STO 11", ACC: "12" },
        ramValues: { "11": "12" },
        activeCpu: "ACC",
        activeRam: "11",
        activeBus: "data",
        packet: { bus: "data", label: "12", direction: "cpu-to-ram" }
      },
      {
        title: "Step 24: PC points to address 4",
        text: "The CPU continues the cycle by fetching the next instruction from the address in the Program Counter.",
        values: { CU: "Fetch", ALU: "-", PC: "4", MAR: "11", MDR: "12", CIR: "STO 11", ACC: "12" },
        ramValues: { "11": "12" },
        activeCpu: "PC",
        activeRam: null,
        activeBus: null,
        packet: null
      },
      {
        title: "Step 25: PC is copied into MAR",
        text: "Address 4 is copied into the MAR so RAM can return the instruction stored there.",
        values: { CU: "Fetch", ALU: "-", PC: "4", MAR: "4", MDR: "12", CIR: "STO 11", ACC: "12" },
        ramValues: { "11": "12" },
        activeCpu: "MAR",
        activeRam: null,
        activeBus: "address",
        packet: { bus: "address", label: "4", direction: "cpu-to-ram" }
      },
      {
        title: "Step 26: RAM returns Halt",
        text: "RAM sends the Halt instruction from address 4 back to the CPU.",
        values: { CU: "Fetch", ALU: "-", PC: "4", MAR: "4", MDR: "Halt", CIR: "STO 11", ACC: "12" },
        ramValues: { "11": "12" },
        activeCpu: "MDR",
        activeRam: "4",
        activeBus: "data",
        packet: { bus: "data", label: "Halt", direction: "ram-to-cpu" }
      },
      {
        title: "Step 27: Halt is copied into CIR",
        text: "The Halt instruction is copied into the CIR, ready for the Control Unit to decode.",
        values: { CU: "Fetch", ALU: "-", PC: "4", MAR: "4", MDR: "Halt", CIR: "Halt", ACC: "12" },
        ramValues: { "11": "12" },
        activeCpu: "CIR",
        activeRam: "4",
        activeBus: null,
        packet: null
      },
      {
        title: "Step 28: Halt stops the program",
        text: "The Control Unit decodes Halt and stops the fetch-decode-execute cycle.",
        values: { CU: "Halt", ALU: "-", PC: "4", MAR: "4", MDR: "Halt", CIR: "Halt", ACC: "12" },
        ramValues: { "11": "12" },
        activeCpu: "CU",
        activeRam: "4",
        activeBus: "control",
        packet: { bus: "control", label: "Halt", direction: "cpu-to-ram" }
      }
    ];

    const ramRows = [
      ["1", "LDA 10"],
      ["2", "ADD #4"],
      ["3", "STO 11"],
      ["4", "Halt"],
      ["5", "LDA 9"],
      ["6", "SUB #179"],
      ["7", "STO 12"],
      ["8", "Halt"],
      ["9", "546"],
      ["10", "8"],
      ["11", "-"],
      ["12", "-"]
    ];
    const ramDefaultValues = Object.fromEntries(ramRows.map(([address, contents]) => [address, contents]));
    const cpuRows = ["CU", "ALU", "PC", "MAR", "MDR", "CIR", "ACC"];
    const busY = { address: 172, control: 260, data: 348 };
    const busColours = { address: "#111827", control: "#dc2626", data: "#2456dc" };
    const width = 1180;
    const height = 520;
    const svg = d3.select(svgElement);
    let stepIndex = 0;
    let autoplayTimer = null;

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    Object.entries(busColours).forEach(([name, colour]) => {
      defs.append("marker")
        .attr("id", `fde-action-arrow-${name}`)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("refX", 10)
        .attr("refY", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,0 L12,6 L0,12 Z")
        .attr("fill", colour);
    });

    defs.append("linearGradient")
      .attr("id", "fde-action-cpu-fill")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "100%")
      .html('<stop offset="0%" stop-color="#06284a"/><stop offset="100%" stop-color="#0d5a98"/>');
    defs.append("linearGradient")
      .attr("id", "fde-action-ram-fill")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "100%")
      .html('<stop offset="0%" stop-color="#145214"/><stop offset="100%" stop-color="#207a26"/>');

    svg.append("g")
      .attr("class", "fde-action-bg")
      .selectAll("path")
      .data(d3.range(12))
      .enter()
      .append("path")
      .attr("d", (index) => `M${80 + index * 85} 40 L${150 + index * 85} 110 L${150 + index * 85} 480`)
      .attr("class", "fde-action-circuit");

    function drawCard(group, x, y, w, h, title, gradientId) {
      group.append("rect").attr("x", x).attr("y", y).attr("width", w).attr("height", h).attr("rx", 24).attr("class", "fde-action-card-shell");
      group.append("rect").attr("x", x + 13).attr("y", y + 13).attr("width", w - 26).attr("height", h - 26).attr("rx", 16).attr("fill", `url(#${gradientId})`).attr("class", "fde-action-card-face");
      group.append("text").attr("x", x + w / 2).attr("y", y + 54).attr("text-anchor", "middle").attr("class", "fde-action-card-title").text(title);
    }

    const cpu = svg.append("g").attr("class", "fde-action-cpu-card");
    drawCard(cpu, 40, 44, 420, 430, "CPU", "fde-action-cpu-fill");
    cpu.append("rect").attr("x", 62).attr("y", 116).attr("width", 376).attr("height", 274).attr("rx", 10).attr("class", "fde-action-table-panel");
    cpu.append("rect").attr("x", 62).attr("y", 116).attr("width", 376).attr("height", 48).attr("rx", 10).attr("class", "fde-action-cpu-table-head-bg");
    cpu.append("rect").attr("x", 62).attr("y", 140).attr("width", 376).attr("height", 24).attr("class", "fde-action-cpu-table-head-bg");
    cpu.append("text").attr("x", 150).attr("y", 140).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("class", "fde-action-table-head").text("Component");
    cpu.append("text").attr("x", 333).attr("y", 140).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("class", "fde-action-table-head").text("Value / Action");
    cpu.append("line").attr("x1", 62).attr("x2", 438).attr("y1", 164).attr("y2", 164).attr("class", "fde-action-table-line");
    cpu.append("line").attr("x1", 224).attr("x2", 224).attr("y1", 116).attr("y2", 390).attr("class", "fde-action-table-line");

    const cpuRowGroups = cpu.selectAll(".fde-action-cpu-row")
      .data(cpuRows)
      .enter()
      .append("g")
      .attr("class", "fde-action-cpu-row")
      .attr("data-register", (row) => row)
      .attr("transform", (row, index) => `translate(62 ${164 + index * 32})`);
    cpuRowGroups.append("rect").attr("width", 376).attr("height", 32).attr("class", "fde-action-row-highlight");
    cpuRowGroups.append("line").attr("x1", 0).attr("x2", 376).attr("y1", 32).attr("y2", 32).attr("class", "fde-action-table-line");
    cpuRowGroups.append("text").attr("x", 81).attr("y", 16).attr("text-anchor", "middle").attr("class", "fde-action-register-name").text((row) => row);
    cpuRowGroups.append("text").attr("x", 271).attr("y", 16).attr("text-anchor", "middle").attr("class", "fde-action-register-value").text("-");

    const ram = svg.append("g").attr("class", "fde-action-ram-card");
    drawCard(ram, 755, 44, 385, 430, "RAM", "fde-action-ram-fill");
    ram.append("rect").attr("x", 785).attr("y", 116).attr("width", 325).attr("height", 324).attr("rx", 10).attr("class", "fde-action-ram-panel");
    ram.append("rect").attr("x", 785).attr("y", 116).attr("width", 325).attr("height", 44).attr("rx", 10).attr("class", "fde-action-ram-table-head-bg");
    ram.append("rect").attr("x", 785).attr("y", 138).attr("width", 325).attr("height", 22).attr("class", "fde-action-ram-table-head-bg");
    ram.append("text").attr("x", 850).attr("y", 138).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("class", "fde-action-table-head").text("Address");
    ram.append("text").attr("x", 1000).attr("y", 138).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("class", "fde-action-table-head").text("Contents");
    ram.append("line").attr("x1", 785).attr("x2", 1110).attr("y1", 160).attr("y2", 160).attr("class", "fde-action-ram-line");
    ram.append("line").attr("x1", 915).attr("x2", 915).attr("y1", 116).attr("y2", 440).attr("class", "fde-action-ram-line");

    const ramRowGroups = ram.selectAll(".fde-action-ram-row")
      .data(ramRows)
      .enter()
      .append("g")
      .attr("class", "fde-action-ram-row")
      .attr("data-address", (row) => row[0])
      .attr("transform", (row, index) => `translate(785 ${160 + index * 23})`);
    ramRowGroups.append("rect").attr("width", 325).attr("height", 23).attr("class", "fde-action-row-highlight");
    ramRowGroups.append("line").attr("x1", 0).attr("x2", 325).attr("y1", 23).attr("y2", 23).attr("class", "fde-action-ram-line");
    ramRowGroups.append("text").attr("x", 65).attr("y", 11.5).attr("text-anchor", "middle").attr("class", "fde-action-ram-text fde-action-ram-address").text((row) => row[0]);
    ramRowGroups.append("text").attr("x", 220).attr("y", 11.5).attr("text-anchor", "middle").attr("class", "fde-action-ram-text fde-action-ram-contents").text((row) => row[1]);

    const bus = svg.append("g").attr("class", "fde-action-buses");
    [
      ["address", "Address bus", 472, 732],
      ["control", "Control bus", 472, 732],
      ["data", "Data bus", 732, 472]
    ].forEach(([name, label, x1, x2]) => {
      bus.append("line")
        .attr("x1", x1).attr("x2", x2)
        .attr("y1", busY[name]).attr("y2", busY[name])
        .attr("class", `fde-action-bus fde-action-bus-${name}`)
        .attr("marker-end", `url(#fde-action-arrow-${name})`);
      bus.append("text")
        .attr("x", 602)
        .attr("y", busY[name] - 14)
        .attr("text-anchor", "middle")
        .attr("class", `fde-action-bus-label fde-action-bus-label-${name}`)
        .text(label);
    });

    const packet = svg.append("g").attr("class", "fde-action-packet");
    packet.append("rect").attr("x", -36).attr("y", -16).attr("width", 72).attr("height", 32).attr("rx", 8);
    packet.append("text").attr("y", 5).attr("text-anchor", "middle");

    function updateStep(index) {
      stepIndex = Math.max(0, Math.min(steps.length - 1, index));
      const step = steps[stepIndex];
      const currentRamValues = { ...ramDefaultValues, ...(step.ramValues || {}) };
      cpuRowGroups.classed("is-active", (row) => row === step.activeCpu);
      ramRowGroups.classed("is-active", (row) => row[0] === step.activeRam);
      ramRowGroups
        .select(".fde-action-ram-contents")
        .text((row) => currentRamValues[row[0]] ?? row[1]);
      Object.entries(step.values).forEach(([register, value]) => {
        cpuRowGroups
          .filter((row) => row === register)
          .select(".fde-action-register-value")
          .text(value);
      });
      svg.selectAll(".fde-action-bus").classed("is-active", function () {
        return this.classList.contains(`fde-action-bus-${step.activeBus}`);
      });

      if (step.packet) {
        const y = busY[step.packet.bus];
        const startX = step.packet.direction === "ram-to-cpu" ? 720 : 485;
        const endX = step.packet.direction === "ram-to-cpu" ? 490 : 715;
        const packetWidth = Math.max(76, step.packet.label.length * 9 + 28);
        packet.interrupt();
        packet.select("rect")
          .attr("x", -packetWidth / 2)
          .attr("width", packetWidth);
        packet.style("display", null).attr("transform", `translate(${startX} ${y})`);
        packet.select("text").text(step.packet.label);
        packet.transition().duration(750).attr("transform", `translate(${endX} ${y})`);
      } else {
        packet.style("display", "none");
      }

      explanation.innerHTML = `<span class="component-explanation-label">${step.title}</span><p>${step.text}</p>`;
    }

    function setAutoplay(isPlaying) {
      const button = slide.querySelector('[data-fde-action="play"]');
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
      if (isPlaying) {
        autoplayTimer = window.setInterval(() => {
          if (stepIndex >= steps.length - 1) {
            setAutoplay(false);
            return;
          }
          updateStep(stepIndex + 1);
          if (stepIndex >= steps.length - 1) setAutoplay(false);
        }, 2200);
      }
      if (button) {
        button.textContent = isPlaying ? "Pause" : "Autoplay";
        button.setAttribute("aria-pressed", String(isPlaying));
      }
    }

    slide.querySelector('[data-fde-action="next"]')?.addEventListener("click", () => {
      setAutoplay(false);
      updateStep(stepIndex + 1);
    });
    slide.querySelector('[data-fde-action="previous"]')?.addEventListener("click", () => {
      setAutoplay(false);
      updateStep(stepIndex - 1);
    });
    slide.querySelector('[data-fde-action="reset"]')?.addEventListener("click", () => {
      setAutoplay(false);
      updateStep(0);
    });
    slide.querySelector('[data-fde-action="play"]')?.addEventListener("click", (event) => {
      setAutoplay(event.currentTarget.getAttribute("aria-pressed") !== "true");
    });

    updateStep(0);
  }

  function initTermMatchActivity() {
    document.querySelectorAll("[data-term-match]").forEach((slide) => {
      if (slide.dataset.termMatchReady === "true") return;
      slide.dataset.termMatchReady = "true";

      const bank = slide.querySelector("[data-keyword-bank]");
      const slots = Array.from(slide.querySelectorAll("[data-term-slot]"));
      const feedback = slide.querySelector("[data-term-match-feedback]");
      const resetButton = slide.querySelector("[data-term-match-reset]");
      if (!bank || !slots.length || !feedback) return;

      let draggedToken = null;
      let selectedToken = null;
      const startingOrder = Array.from(bank.querySelectorAll("[data-keyword]"));

      function tokens() {
        return Array.from(slide.querySelectorAll("[data-keyword]"));
      }

      function assess() {
        const correctCount = slots.filter((slot) => slot.querySelector("[data-keyword]")?.dataset.keyword === slot.dataset.answer).length;
        const isCorrect = correctCount === slots.length;

        slots.forEach((slot) => {
          const token = slot.querySelector("[data-keyword]");
          const hasToken = Boolean(token);
          const isSlotCorrect = hasToken && token.dataset.keyword === slot.dataset.answer;
          slot.classList.toggle("is-correct", isSlotCorrect);
          slot.classList.toggle("is-incorrect", hasToken && !isSlotCorrect);
        });

        feedback.classList.toggle("is-correct", isCorrect);
        feedback.classList.toggle("is-incorrect", !isCorrect);
        feedback.innerHTML = `<p class="clickable-hinge-status sequence-feedback-status">You have ${correctCount} of ${slots.length} correct.</p>`;
      }

      function placeToken(token, slot) {
        if (!token || !slot) return;
        const sourceSlot = token.closest("[data-term-slot]");
        const existingToken = slot.querySelector("[data-keyword]");
        if (existingToken && existingToken !== token) {
          if (sourceSlot) {
            sourceSlot.appendChild(existingToken);
          } else {
            bank.appendChild(existingToken);
          }
        }
        slot.appendChild(token);
        token.classList.remove("is-selected", "is-dragging");
        selectedToken = null;
        assess();
      }

      function resetActivity() {
        startingOrder.forEach((token) => {
          token.classList.remove("is-selected", "is-dragging");
          bank.appendChild(token);
        });
        slots.forEach((slot) => slot.classList.remove("is-over", "is-correct", "is-incorrect"));
        draggedToken = null;
        selectedToken = null;
        assess();
      }

      function prepareToken(token) {
        token.addEventListener("dragstart", (event) => {
          draggedToken = token;
          token.classList.add("is-dragging");
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", token.dataset.keyword);
        });

        token.addEventListener("dragend", () => {
          token.classList.remove("is-dragging");
          draggedToken = null;
          slots.forEach((slot) => slot.classList.remove("is-over"));
        });

        token.addEventListener("click", () => {
          tokens().forEach((item) => item.classList.remove("is-selected"));
          selectedToken = selectedToken === token ? null : token;
          token.classList.toggle("is-selected", selectedToken === token);
        });
      }

      tokens().forEach(prepareToken);

      slots.forEach((slot) => {
        slot.addEventListener("dragover", (event) => {
          event.preventDefault();
          slot.classList.add("is-over");
        });
        slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
        slot.addEventListener("drop", (event) => {
          event.preventDefault();
          slot.classList.remove("is-over");
          placeToken(draggedToken, slot);
        });
        slot.addEventListener("click", () => placeToken(selectedToken, slot));
        slot.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          placeToken(selectedToken, slot);
        });
      });

      resetButton?.addEventListener("click", resetActivity);
      assess();
    });
  }

  function initThinkLightboxes() {
    let lastTrigger = null;

    function closeLightbox(lightbox) {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.classList.remove("think-lightbox-open");
      lastTrigger?.focus();
    }

    function openLightbox(trigger) {
      const lightbox = document.getElementById(trigger.dataset.thinkLightboxOpen);
      if (!lightbox) return;
      lastTrigger = trigger;
      lightbox.hidden = false;
      document.body.classList.add("think-lightbox-open");
      lightbox.querySelector("[data-think-lightbox-close]")?.focus();
    }

    if (document.body.dataset.thinkLightboxOpenReady !== "true") {
      document.body.dataset.thinkLightboxOpenReady = "true";
      document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-think-lightbox-open]");
        if (!trigger) return;
        openLightbox(trigger);
      });
    }

    document.querySelectorAll("[data-think-lightbox-open]").forEach((trigger) => {
      if (trigger.dataset.thinkLightboxReady === "true") return;
      if (!document.getElementById(trigger.dataset.thinkLightboxOpen)) return;
      trigger.dataset.thinkLightboxReady = "true";
    });

    document.querySelectorAll(".think-lightbox").forEach((lightbox) => {
      if (lightbox.dataset.thinkLightboxCloseReady === "true") return;
      lightbox.dataset.thinkLightboxCloseReady = "true";
      lightbox.addEventListener("click", (event) => {
        if (event.target.closest("[data-think-lightbox-close]")) closeLightbox(lightbox);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeLightbox(document.querySelector(".think-lightbox:not([hidden])"));
    });
  }

  function initClickableHingeQuestions() {
    document.querySelectorAll("[data-clickable-hinge]").forEach((slide) => {
      if (slide.dataset.clickableHingeReady === "true") return;
      slide.dataset.clickableHingeReady = "true";

      const options = Array.from(slide.querySelectorAll("[data-hinge-option]"));
      const panel = slide.querySelector(".clickable-answer-panel");
      const placeholder = slide.querySelector("[data-clickable-hinge-placeholder]");
      const result = slide.querySelector("[data-clickable-hinge-result]");
      const status = slide.querySelector("[data-clickable-hinge-status]");
      const reason = slide.querySelector("[data-clickable-hinge-reason]");
      const resetButton = slide.querySelector("[data-clickable-hinge-reset]");
      if (!options.length || !panel || !placeholder || !result || !status) return;
      const defaultReason = reason?.textContent || "";

      function resetHinge() {
        options.forEach((item) => {
          item.classList.remove("is-selected", "is-correct", "is-incorrect");
          item.setAttribute("aria-pressed", "false");
        });
        panel.classList.remove("is-correct", "is-incorrect");
        placeholder.hidden = false;
        result.hidden = true;
        status.textContent = "";
        if (reason) reason.textContent = defaultReason;
      }

      options.forEach((option) => {
        option.addEventListener("click", () => {
          const isCorrect = option.dataset.correct === "true";
          const selectedFeedback = option.dataset.feedback || "";
          options.forEach((item) => {
            item.classList.remove("is-selected", "is-correct", "is-incorrect");
            item.setAttribute("aria-pressed", "false");
          });

          option.classList.add("is-selected", isCorrect ? "is-correct" : "is-incorrect");
          option.setAttribute("aria-pressed", "true");
          panel.classList.toggle("is-correct", isCorrect);
          panel.classList.toggle("is-incorrect", !isCorrect);
          placeholder.hidden = true;
          result.hidden = false;
          status.textContent = option.dataset.feedbackStatus || (isCorrect ? "Correct" : "Incorrect");
          if (reason) reason.textContent = selectedFeedback;
        });
      });

      resetButton?.addEventListener("click", resetHinge);
    });
  }

  function initRevealAnswerResetControls() {
    document.querySelectorAll("[data-reveal-reset]").forEach((button) => {
      if (button.dataset.revealResetReady === "true") return;
      const target = document.getElementById(button.dataset.revealReset);
      const revealButton = Array.from(document.querySelectorAll(".reveal-button"))
        .find((item) => item.getAttribute("aria-controls") === button.dataset.revealReset);
      if (!target || !revealButton) return;

      button.dataset.revealResetReady = "true";
      button.addEventListener("click", () => {
        target.hidden = true;
        target.classList.remove("visible", "is-visible");
        revealButton.setAttribute("aria-expanded", "false");
        revealButton.textContent = revealButton.dataset.showLabel || "Show answer";
      });
    });
  }

  initCpuMemoryFlow();
  initCpuArchitectureDiagram();
  initCpuComponentExplorer();
  initFetchSequenceSorter();
  initFdeCycleInteractive();
  initFdeCycleAction();
  initTermMatchActivity();
  initThinkLightboxes();
  initClickableHingeQuestions();
  initRevealAnswerResetControls();
})();
