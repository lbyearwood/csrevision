(function () {
  const routes = Object.freeze({
    home: "index.html",
    courses: Object.freeze({
      gcseJ277: "courses/gcse-j277/index.html",
      btecIt: "courses/btec-it/index.html",
      ks3: "courses/ks3/index.html"
    }),
    gcseJ277: Object.freeze({
      specification: "courses/gcse-j277/specification.html",
      topic: (topicId) => `courses/gcse-j277/topics/${topicId}.html`,
      quiz: (topicId) => `courses/gcse-j277/quizzes/${topicId}.html`,
      lesson: (topicId) => `courses/gcse-j277/teachesheets/${topicId}.html`,
      worksheet: (topicId) => `courses/gcse-j277/worksheets/${topicId}.html`
    }),
    btecIt: Object.freeze({
      unit6: "courses/btec-it/unit-6/index.html"
    })
  });

  function scriptBasePath() {
    const script = document.currentScript || document.querySelector('script[src*="routes.js"]');
    const src = script ? script.getAttribute("src") || "" : "";
    const match = src.match(/^(.*)routes\.js/);
    return match ? match[1] : "";
  }

  function routeTo(path) {
    if (window.location.protocol === "file:") return `${scriptBasePath()}${path}`;
    return `/${path}`;
  }

  window.siteRoutes = routes;
  window.routeTo = routeTo;
})();
