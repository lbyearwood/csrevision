(() => {
  window.CSRevision = window.CSRevision || {};

  const app = window.CSRevision;

  function pageType() {
    if (document.body.dataset.pageType) return document.body.dataset.pageType;
    const path = window.location.pathname.replace(/\\/g, "/");
    if (/\/courses\/gcse-j277\/lessons\/[^/]+\.html$/i.test(path)) return "lesson";
    if (/\/courses\/gcse-j277\/quizzes\/[^/]+\.html$/i.test(path)) return "quiz";
    if (/\/courses\/gcse-j277\/exams\/[^/]+\.html$/i.test(path)) return "exam";
    if (/\/courses\/gcse-j277\/tasks\/[^/]+\.html$/i.test(path)) return "tasks";
    if (/\/courses\/gcse-j277\/(?:index\.html)?$/i.test(path)) return "gcse-dashboard";
    if (/\/(?:index\.html)?$/i.test(path)) return "home";
    return "content";
  }

  function initModule(label, init) {
    if (typeof init !== "function") return;
    try {
      init();
    } catch (error) {
      console.error(`CS Revision ${label} initialisation failed`, error);
    }
  }

  function init() {
    const type = pageType();

    initModule("layout", app.layout?.init);

    if (type === "gcse-dashboard") {
      initModule("GCSE dashboard", app.dashboard?.initGCSEDashboard);
    }

    if (type === "lesson") {
      initModule("lesson components", app.lessonComponents?.init);
      initModule("lesson left panel", app.leftPanel?.init);
      initModule("lesson shell", app.lessons?.initLessonShell);
      initModule("code display", app.codeDisplay?.init);
    }

    if (type === "quiz") {
      initModule("quiz engine", app.quizzes?.init);
      initModule("code display", app.codeDisplay?.init);
    }

    if (type === "exam") {
      initModule("exam page", app.examPage?.init);
      initModule("code display", app.codeDisplay?.init);
    }

    if (type === "tasks") {
      initModule("tasks page", app.tasksPage?.init);
      initModule("code display", app.codeDisplay?.init);
    }

    if (type === "content" || type === "course" || type === "home") {
      initModule("code display", app.codeDisplay?.init);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
