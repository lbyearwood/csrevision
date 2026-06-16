(function () {
  window.CSRevision = window.CSRevision || {};

  const routes = Object.freeze({
    home: "index.html",
    courses: Object.freeze({
      gcseJ277: "courses/gcse-j277/index.html",
      btecIt: "courses/btec-it/index.html",
      ks3: "courses/ks3/index.html"
    }),
    gcseJ277: Object.freeze({
      specification: "courses/gcse-j277/specification.html",
      exam: (topicId) => `courses/gcse-j277/exams/${topicId}.html`,
      quiz: (topicId) => `courses/gcse-j277/quizzes/${topicId}.html`,
      lesson: (topicId) => `courses/gcse-j277/lessons/${topicId}.html`,
      tasks: (topicId) => `courses/gcse-j277/tasks/${topicId}.html`
    }),
    btecIt: Object.freeze({
      unit6: "courses/btec-it/unit-6/index.html"
    })
  });

  function scriptBasePath() {
    const currentScript = document.currentScript;
    const script = currentScript && (currentScript.src || currentScript.getAttribute("src") || "").includes("routes.js")
      ? currentScript
      : document.querySelector('script[src*="routes.js"]');
    const src = script ? script.src || script.getAttribute("src") || "" : "";
    const match = src.match(/^(.*)routes\.js/);
    return match ? match[1] : "";
  }

  function routeTo(path) {
    return new URL(path, scriptBasePath()).href;
  }

  window.CSRevision.routes = routes;
  window.CSRevision.routeTo = routeTo;
  window.siteRoutes = routes;
  window.routeTo = routeTo;
})();
