(() => {
  window.CSRevision = window.CSRevision || {};
function normalisedValues(values) {
  return values.map((value) => value.trim()).filter(Boolean).sort().join(",");
}

function normalisedInputAnswer(value) {
  return value.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
}

function formatElapsedTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds} sec`;
  return `${minutes} min ${String(seconds).padStart(2, "0")} sec`;
}

function createQuizTimer(form) {
  const timer = document.createElement("aside");
  const label = document.createElement("span");
  const value = document.createElement("strong");
  let startTime = performance.now();
  let endTime = null;
  let intervalId = null;

  timer.className = "quiz-timer quiz-timer-floating";
  timer.setAttribute("aria-live", "polite");
  label.textContent = "Duration";
  value.textContent = "0 sec";
  timer.append(label, value);
  document.body.appendChild(timer);

  function elapsedMilliseconds() {
    return (endTime || performance.now()) - startTime;
  }

  function update() {
    value.textContent = formatElapsedTime(elapsedMilliseconds());
  }

  function start() {
    endTime = null;
    startTime = performance.now();
    update();
    clearInterval(intervalId);
    intervalId = window.setInterval(update, 1000);
  }

  function stop() {
    if (!endTime) {
      endTime = performance.now();
      clearInterval(intervalId);
      update();
    }
    return formatElapsedTime(elapsedMilliseconds());
  }

  start();
  form.quizTimer = { start, stop, elapsed: () => formatElapsedTime(elapsedMilliseconds()) };
  return form.quizTimer;
}

function setupSelfMarkingQuizzes() {
  document.querySelectorAll(".quiz-form").forEach((form) => {
    const result = form.querySelector(".quiz-result, .quiz-score");
    const timer = createQuizTimer(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = Array.from(form.querySelectorAll(".quiz-question"));
      let score = 0;

      questions.forEach((question) => {
        const type = question.dataset.type;
        const answer = question.dataset.answer || "";
        const feedback = question.querySelector(".quiz-feedback");
        let selected = "";

        if (type === "checkbox") {
          selected = normalisedValues(Array.from(question.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value));
        } else if (type === "input") {
          const inputs = Array.from(question.querySelectorAll("input[type='text']"));
          selected = inputs.length > 1
            ? inputs.map((input) => normalisedInputAnswer(input.value)).join("|")
            : inputs[0] ? normalisedInputAnswer(inputs[0].value) : "";
        } else if (type === "slider") {
          const range = question.querySelector("input[type='range']");
          selected = range ? range.value : "";
        } else if (type === "matching") {
          selected = Array.from(question.querySelectorAll("select[data-match]"))
            .map((select) => `${select.dataset.match}:${select.value}`)
            .join("|");
        } else if (type === "drag-match") {
          selected = Array.from(question.querySelectorAll(".match-drop"))
            .map((drop) => {
              return `${drop.dataset.match}:${drop.dataset.value || ""}`;
            })
            .join("|");
        } else if (type === "drag-blank") {
          selected = Array.from(question.querySelectorAll(".drop-blank"))
            .map((blank) => blank.dataset.value || "")
            .join("|");
        } else {
          const checked = question.querySelector("input[type='radio']:checked");
          selected = checked ? checked.value : "";
        }

        const expected = type === "checkbox" ? normalisedValues(answer.split(",")) : answer;
        const isCorrect = type === "input"
          ? question.querySelectorAll("input[type='text']").length > 1
            ? selected === answer.split("|").map(normalisedInputAnswer).join("|")
            : answer.split("|").map(normalisedInputAnswer).includes(selected)
          : selected === expected;
        question.classList.toggle("is-correct", isCorrect);
        question.classList.toggle("is-incorrect", !isCorrect);

        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = isCorrect
            ? `Correct. ${question.dataset.correctFeedback || ""}`.trim()
            : `Not quite. ${question.dataset.incorrectFeedback || `Correct answer: ${answer}.`}`.trim();
        }

        if (isCorrect) score += 1;
      });

      if (result) {
        const elapsed = timer.stop();
        result.hidden = false;
        result.textContent = `Score: ${score} out of ${questions.length}. Time taken: ${elapsed}.`;
      }
    });

    form.addEventListener("reset", () => {
      timer.start();
      form.querySelectorAll(".quiz-question").forEach((question) => {
        question.classList.remove("is-correct", "is-incorrect");
        const feedback = question.querySelector(".quiz-feedback");
        if (feedback) {
          feedback.hidden = true;
          feedback.textContent = "";
        }
      });
      if (result) {
        result.hidden = true;
        result.textContent = "";
      }
      form.querySelectorAll(".drop-blank").forEach((blank) => {
        blank.dataset.value = "";
        blank.textContent = blank.dataset.placeholder || "Drop word";
      });
      form.querySelectorAll(".match-drop").forEach((blank) => {
        blank.dataset.value = "";
        blank.textContent = blank.dataset.placeholder || "Drop keyword";
      });
      form.querySelectorAll(".drag-word").forEach((word) => {
        word.hidden = false;
      });
    });
  });
}

function setupDragBlankQuestions() {
  document.querySelectorAll(".drag-word").forEach((word, index) => {
    if (!word.dataset.dragId) word.dataset.dragId = `drag-${index}`;

    word.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", word.dataset.value || word.textContent.trim());
      event.dataTransfer.setData("application/x-drag-id", word.dataset.dragId);
    });

    word.addEventListener("click", () => {
      const question = word.closest(".quiz-question");
      const blank = question ? Array.from(question.querySelectorAll(".drop-blank, .match-drop")).find((item) => !item.dataset.value) : null;
      if (!blank) return;
      const value = word.dataset.value || word.textContent.trim();
      blank.dataset.value = value;
      blank.textContent = value;
      word.hidden = true;
    });
  });

  document.querySelectorAll(".drop-blank, .match-drop").forEach((blank) => {
    blank.addEventListener("dragover", (event) => {
      event.preventDefault();
      blank.classList.add("is-hovered");
    });

    blank.addEventListener("dragleave", () => {
      blank.classList.remove("is-hovered");
    });

    blank.addEventListener("drop", (event) => {
      event.preventDefault();
      const value = event.dataTransfer.getData("text/plain");
      const dragId = event.dataTransfer.getData("application/x-drag-id");
      const question = blank.closest(".quiz-question");
      const source = dragId && question
        ? question.querySelector(`.drag-word[data-drag-id="${CSS.escape(dragId)}"]`)
        : question ? Array.from(question.querySelectorAll(`.drag-word[data-value="${CSS.escape(value)}"]`)).find((word) => !word.hidden) : null;
      const previous = blank.dataset.value;
      if (previous) {
        const previousWord = question ? Array.from(question.querySelectorAll(`.drag-word[data-value="${CSS.escape(previous)}"]`)).find((word) => word.hidden) : null;
        if (previousWord) previousWord.hidden = false;
      }
      blank.dataset.value = value;
      blank.textContent = value;
      blank.classList.remove("is-hovered");
      if (source) source.hidden = true;
    });

    blank.addEventListener("click", () => {
      const value = blank.dataset.value;
      if (!value) return;
      const question = blank.closest(".quiz-question");
      const word = question ? Array.from(question.querySelectorAll(`.drag-word[data-value="${CSS.escape(value)}"]`)).find((item) => item.hidden) : null;
      if (word) word.hidden = false;
      blank.dataset.value = "";
      blank.textContent = blank.dataset.placeholder || (blank.classList.contains("match-drop") ? "Drop item" : "Drop word");
    });
  });
}

  function init() {
    setupSelfMarkingQuizzes();
    setupDragBlankQuestions();
  }

  window.CSRevision.quizzes = { init };
})();
