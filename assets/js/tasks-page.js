(() => {
  window.CSRevision = window.CSRevision || {};
  function setupRevealButtons() {
    document.querySelectorAll(".reveal-button").forEach((button) => {
      const targetId = button.getAttribute("aria-controls");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target || button.dataset.tasksRevealReady === "true") return;

      button.dataset.tasksRevealReady = "true";
      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        const showLabel = button.dataset.showLabel || "Show answer";
        const hideLabel = button.dataset.hideLabel || "Hide answer";
        button.setAttribute("aria-expanded", String(!isExpanded));
        target.hidden = isExpanded;
        target.classList.toggle("visible", !isExpanded);
        button.textContent = isExpanded ? showLabel : hideLabel;
      });
    });
  }

  function init() {
  setupRevealButtons();
  function getPreviousTask(answerBlock) {
    let sibling = answerBlock.previousElementSibling;
    while (sibling) {
      if ((sibling.classList.contains("workbook-task") || sibling.classList.contains("task-block")) && !sibling.classList.contains("answers")) {
        return sibling;
      }
      sibling = sibling.previousElementSibling;
    }
    return null;
  }

  function getMatchingAnswerCell(answerTable, targetCell) {
    const targetRow = targetCell.parentElement;
    const targetBody = targetRow ? targetRow.parentElement : null;
    const rowIndex = targetBody ? Array.from(targetBody.children).indexOf(targetRow) : -1;
    const cellIndex = targetRow ? Array.from(targetRow.children).indexOf(targetCell) : -1;
    const answerRows = answerTable ? Array.from(answerTable.querySelectorAll("tbody tr")) : [];
    const answerRow = answerRows[rowIndex];
    return answerRow ? answerRow.children[cellIndex] : null;
  }

  function createInlineAnswerContainer(taskBlock) {
    const container = document.createElement("div");
    container.className = "inline-workbook-answer";
    taskBlock.appendChild(container);
    return container;
  }

  document.querySelectorAll(".workbook-lesson .answers, .workbook-tasks .answers").forEach((answerBlock) => {
    answerBlock.hidden = true;
    answerBlock.classList.remove("visible");

    const taskBlock = getPreviousTask(answerBlock);
    if (!taskBlock || taskBlock.dataset.inlineAnswersReady === "true") return;

    const taskTable = taskBlock.querySelector("table:not(.answer-lines)");
    const answerTable = answerBlock.querySelector("table");
    const blankCells = taskTable && answerTable
      ? Array.from(taskTable.querySelectorAll("tbody td")).filter((cell) => cell.textContent.trim() === "")
      : [];

    taskBlock.dataset.inlineAnswersReady = "true";

    if (blankCells.length) {
      let nextIndex = 0;
      const controls = document.createElement("div");
      const previousButton = document.createElement("button");
      const nextButton = document.createElement("button");
      const status = document.createElement("span");

      controls.className = "workbook-answer-controls";
      previousButton.className = "reveal-button workbook-answer-button";
      nextButton.className = "reveal-button workbook-answer-button";
      previousButton.type = "button";
      nextButton.type = "button";
      previousButton.textContent = "Hide previous answer";
      nextButton.textContent = blankCells.length === 1 ? "Show answer" : "Reveal next answer";
      status.className = "workbook-answer-status";

      function updateControls() {
        previousButton.disabled = nextIndex === 0;
        nextButton.disabled = nextIndex >= blankCells.length;
        status.textContent = `${nextIndex} of ${blankCells.length} answers shown`;
      }

      nextButton.addEventListener("click", () => {
        const targetCell = blankCells[nextIndex];
        const answerCell = getMatchingAnswerCell(answerTable, targetCell);
        if (!targetCell || !answerCell) return;

        targetCell.textContent = answerCell.textContent.trim();
        targetCell.classList.add("inline-revealed-answer");
        nextIndex += 1;
        updateControls();
      });

      previousButton.addEventListener("click", () => {
        if (nextIndex === 0) return;
        nextIndex -= 1;
        const targetCell = blankCells[nextIndex];
        targetCell.textContent = "";
        targetCell.classList.remove("inline-revealed-answer");
        updateControls();
      });

      updateControls();
      controls.append(previousButton, nextButton, status);
      taskBlock.appendChild(controls);
      return;
    }

    const button = document.createElement("button");
    button.className = "reveal-button workbook-answer-button";
    button.type = "button";
    const container = createInlineAnswerContainer(taskBlock);
    const answerLines = taskBlock.querySelector(".answer-lines");
    Array.from(answerBlock.children).forEach((child) => {
      if (child.matches("h4")) return;
      container.appendChild(child.cloneNode(true));
    });
    container.hidden = true;
    button.textContent = "Show answer";
    button.addEventListener("click", () => {
      const isHidden = container.hidden;
      container.hidden = !isHidden;
      if (answerLines) answerLines.hidden = isHidden;
      button.textContent = isHidden ? "Hide answer" : "Show answer";
    });
    taskBlock.appendChild(button);
  });
}

  window.CSRevision.tasksPage = { init };
})();
