(() => {
  window.CSRevision = window.CSRevision || {};

  const order = Object.freeze(["lesson", "tasks", "exam", "quiz"]);
  const labels = Object.freeze({
    lesson: "Lesson",
    tasks: "Tasks",
    exam: "Exam",
    quiz: "Quiz"
  });
  const subtitles = Object.freeze({
    lesson: "Learn the content",
    tasks: "Learning Activities",
    exam: "Past paper questions",
    quiz: "Quick test"
  });
  const icons = Object.freeze({
    lesson: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v18H6.5A2.5 2.5 0 0 0 4 23V5.5Z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18h4.5A2.5 2.5 0 0 1 20 23V5.5Z"></path></svg>',
    tasks: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h6"></path><path d="M9 3h6v4H9z"></path><rect x="5" y="5" width="14" height="16" rx="2"></rect><path d="m8.5 12 1.5 1.5 3-3"></path><path d="M14.5 12.5H17"></path><path d="m8.5 17 1.5 1.5 3-3"></path><path d="M14.5 17.5H17"></path></svg>',
    exam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"></path><path d="M15 3v4h4"></path><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>',
    quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M7 6H4v2a3 3 0 0 0 3 3"></path><path d="M17 6h3v2a3 3 0 0 1-3 3"></path></svg>'
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

    function appendContent(element) {
      const icon = document.createElement("span");
      icon.className = "action-button-icon";
      icon.innerHTML = icons[type];

      const text = document.createElement("span");
      text.className = "action-button-text";

      const title = document.createElement("span");
      title.className = "action-button-label";
      title.textContent = label;

      const subtitle = document.createElement("span");
      subtitle.className = "action-button-subtitle";
      subtitle.textContent = subtitles[type];

      text.append(title, subtitle);
      element.append(icon, text);
    }

    if (disabled) {
      const button = document.createElement("button");
      button.className = className;
      button.type = "button";
      button.disabled = true;
      appendContent(button);
      button.title = "Resource coming soon.";
      button.setAttribute("aria-label", `${topicTitle} ${ariaSuffix}`);
      return button;
    }

    const link = document.createElement("a");
    link.className = className;
    link.href = href;
    appendContent(link);
    link.setAttribute("aria-label", `${topicTitle} ${ariaSuffix}`);
    return link;
  }

  window.CSRevision.resourceButtons = { order, labels, classNames, create };
})();
