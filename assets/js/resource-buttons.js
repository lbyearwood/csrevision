(() => {
  window.CSRevision = window.CSRevision || {};

  const order = Object.freeze(["lesson", "tasks", "exam", "quiz"]);
  const labels = Object.freeze({
    lesson: "Lesson",
    tasks: "Tasks",
    exam: "Exam",
    quiz: "Quiz"
  });
  const classNames = Object.freeze({
    lesson: "lesson-button",
    tasks: "tasks-button",
    exam: "exam-button",
    quiz: "quiz-button"
  });

  function create({ type, href, topicTitle, disabled = false }) {
    const label = labels[type];
    const className = `action-button ${classNames[type]}${disabled ? " unavailable-resource-button" : ""}`;
    const actionName = type === "quiz" ? "self-marking quiz" : `${label.toLowerCase()} page`;
    const ariaSuffix = disabled ? `${label.toLowerCase()} coming soon` : actionName;

    if (disabled) {
      const button = document.createElement("button");
      button.className = className;
      button.type = "button";
      button.disabled = true;
      button.textContent = label;
      button.title = "Resource coming soon.";
      button.setAttribute("aria-label", `${topicTitle} ${ariaSuffix}`);
      return button;
    }

    const link = document.createElement("a");
    link.className = className;
    link.href = href;
    link.textContent = label;
    link.setAttribute("aria-label", `${topicTitle} ${ariaSuffix}`);
    return link;
  }

  window.CSRevision.resourceButtons = { order, labels, classNames, create };
})();
