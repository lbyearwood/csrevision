(() => {
  window.CSRevision = window.CSRevision || {};

  function routesForSite() {
    return window.CSRevision.routes || window.siteRoutes;
  }

  function siteLink(path) {
    const routeTo = window.CSRevision.routeTo || window.routeTo;
    return routeTo ? routeTo(path) : path;
  }

  function currentPage() {
    const pageType = document.body.dataset.pageType;
    if (pageType === "home") return "home";
    if (pageType === "info") return "info";
    if (pageType === "gcse-dashboard" || pageType === "course") return "course";
    return "topic";
  }

  function currentCourseLabel() {
    const course = document.body.dataset.course;
    if (course === "gcse-j277") return "GCSE Computer Science";
    if (course === "btec-it") return "BTEC IT";
    if (course === "ks3") return "KS3 Computer Science";
    return "";
  }

  function init() {
    const routes = routesForSite();
    if (!routes) return;

    const homeHref = siteLink(routes.home);
    const page = currentPage();
    const courseLabel = currentCourseLabel();
    const isCourseArea = Boolean(courseLabel);
    const headerMount = document.getElementById("site-header");
    const footerMount = document.getElementById("site-footer");

    if (headerMount) {
      headerMount.className = "site-header";
      headerMount.innerHTML = `
        <div class="header-inner">
            <a class="brand" href="${homeHref}" aria-label="CS Revision Platform home">
                <span class="brand-mark" aria-hidden="true"></span>
                <span class="brand-title">CS Revision Platform${courseLabel ? ` <span class="brand-course-wrap"><span class="brand-separator" aria-hidden="true">&gt;</span> <span class="brand-course">${courseLabel}</span></span>` : ""}</span>
            </a>
            <nav class="site-nav" aria-label="Primary navigation">
                <a class="nav-link${page === "home" ? " active" : ""}" href="${homeHref}"${page === "home" ? ' aria-current="page"' : ""}>
                    <span class="nav-icon nav-icon-home" aria-hidden="true"></span>
                    Home
                </a>
                <details class="course-menu">
                    <summary class="nav-link${isCourseArea ? " active" : ""}"${isCourseArea ? ' aria-current="page"' : ""}>
                        <span class="nav-icon nav-icon-courses" aria-hidden="true"></span>
                        Courses
                    </summary>
                    <div class="course-menu-list">
                        <a href="${siteLink(routes.courses.gcseJ277)}">GCSE Computer Science</a>
                        <a href="${siteLink(routes.courses.btecIt)}">BTEC IT</a>
                        <a href="${siteLink(routes.courses.ks3)}">KS3 Computer Science</a>
                    </div>
                </details>
            </nav>
        </div>`;
    }

    if (footerMount) {
      footerMount.innerHTML = page === "home"
        ? `<p>CS Revision Platform</p>`
        : courseLabel === "BTEC IT"
          ? `<p>BTEC IT revision content for classroom practice and assessment preparation.</p>`
          : `<p>OCR GCSE Computer Science J277 content is independent and not an official OCR website. <a href="${siteLink(routes.gcseJ277.specification)}">Course specification</a>.</p>`;
    }
  }

  window.CSRevision.layout = { init };
})();
