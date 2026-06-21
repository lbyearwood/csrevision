(() => {
  window.CSRevision = window.CSRevision || {};
  window.CSRevision.lessons = window.CSRevision.lessons || {};

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

function isGcseLessonPage() {
  return /\/courses\/gcse-j277\/lessons\/[^/]+\.html$/i.test(window.location.pathname.replace(/\\/g, "/"));
}

function lessonPanelTitle(panel, fallbackIndex) {
  const heading = panel.querySelector("h1, h2, h3");
  if (heading && heading.textContent.trim()) return heading.textContent.trim();
  const label = panel.querySelector(".slide-kicker, .eyebrow");
  if (label && label.textContent.trim()) return label.textContent.trim();
  return `Lesson panel ${fallbackIndex + 1}`;
}

function lessonAssetUrl(path) {
  const siteScript = document.querySelector('script[src*="site.js"]');
  if (siteScript?.src) return new URL(path, siteScript.src).toString();
  return path;
}

function slideIndexFromHash(hash, slideCount) {
  const match = /^#slide-(\d+)$/i.exec(hash || "");
  if (!match) return null;

  const slideNumber = Number(match[1]);
  if (!Number.isInteger(slideNumber) || slideNumber < 1 || slideNumber > slideCount) return null;

  return slideNumber - 1;
}

function ensureLessonToolAssets() {
  const stylesheets = [
    lessonAssetUrl("assets/css/lesson-shell.css?v=19"),
    lessonAssetUrl("assets/css/lesson-components.css?v=189"),
    lessonAssetUrl("assets/css/lesson-slide-footer.css?v=19"),
    lessonAssetUrl("assets/css/lesson-left-panel.css?v=8"),
    lessonAssetUrl("assets/css/lesson-tools.css?v=3")
  ];

  stylesheets.forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });

}

function updateLessonViewportWidth() {
  const visibleWidth = window.visualViewport?.width || window.innerWidth;
  document.documentElement.style.setProperty("--lesson-viewport-width", `${visibleWidth}px`);
}

function normaliseSlideGridHeaders(source) {
  source.querySelectorAll(".slide-grid > .slide-copy").forEach((copy) => {
    const grid = copy.parentElement;
    if (!grid) return;

    const headerNodes = [];
    let cursor = copy.firstElementChild;
    while (cursor?.matches(".slide-kicker, .ActivityBadge")) {
      headerNodes.push(cursor);
      cursor = cursor.nextElementSibling;
    }
    if (cursor?.matches("h1, h2, .SlideTitle")) {
      headerNodes.push(cursor);
    }

    headerNodes.forEach((node) => {
      node.classList.add(node.matches(".slide-kicker, .ActivityBadge") ? "ActivityBadge" : "SlideTitle");
      grid.insertBefore(node, copy);
    });
  });
}

function convertToLessonSlides(sourcePanels) {
  return sourcePanels.map((source, index) => {
    const slide = document.createElement("section");
    const sourceId = source.id || source.dataset.slide || `lesson-panel-${index + 1}`;
    const title = lessonPanelTitle(source, index);
    slide.className = "lesson-slide LessonSlidePage";
    slide.id = sourceId;
    slide.dataset.lessonPanel = String(index);
    slide.setAttribute("aria-label", title);

    source.removeAttribute("id");
    source.removeAttribute("data-slide");
    source.classList.remove("lesson-slide", "is-active");
    source.classList.add("lesson-slide-source");
    normaliseSlideGridHeaders(source);

    const inner = document.createElement("div");
    inner.className = "lesson-slide-inner SlideCanvas";
    inner.appendChild(source);

    const footer = document.createElement("footer");
    footer.className = "lesson-slide-footer SlideNavigationBar";
    footer.innerHTML = `
      <button class="lesson-slide-nav-button PreviousSlideButton" type="button" data-lesson-direction="prev"${index === 0 ? " disabled" : ""}>Back</button>
      <p class="lesson-slide-progress SlideProgressLabel"><span class="lesson-slide-progress-count">Slide ${index + 1} of ${sourcePanels.length}</span><span class="lesson-slide-progress-title">: ${escapeHtml(title)}</span></p>
      <button class="lesson-slide-nav-button NextSlideButton" type="button" data-lesson-direction="next"${index === sourcePanels.length - 1 ? " disabled" : ""}>Next</button>
    `;

    slide.append(inner, footer);
    return slide;
  });
}

function setupGcseLessonShell() {
  if (!isGcseLessonPage() || document.body.classList.contains("lesson-shell-active")) return;

  const originalMain = document.querySelector("main");
  if (!originalMain) return;

  const existingSlideSources = Array.from(originalMain.querySelectorAll("[data-slide]"));
  const directSections = Array.from(originalMain.children).filter((child) => {
    return child.matches("section, article") && !child.matches(".resource-actions");
  });
  const sourcePanels = existingSlideSources.length ? existingSlideSources : directSections;
  if (!sourcePanels.length) return;
  ensureLessonToolAssets();
  updateLessonViewportWidth();

  const title = document.querySelector("title")?.textContent?.trim()
    || originalMain.querySelector("h1, h2")?.textContent?.trim()
    || "GCSE lesson";
  const slides = convertToLessonSlides(sourcePanels);
  const layout = document.createElement("div");
  layout.className = "lesson-layout";

  const toolbar = window.CSRevision.leftPanel?.create?.({
    panels: slides,
    topicTitle: title.replace(/\s+Lesson$/i, ""),
    alarmSrc: lessonAssetUrl("assets/audio/alarm-beep.mp3"),
    panelTitle: lessonPanelTitle
  });
  if (!toolbar) return;

  const lessonMain = document.createElement("main");
  lessonMain.className = "lesson-main";
  lessonMain.setAttribute("aria-label", "Lesson slides");
  const initialIndex = slideIndexFromHash(window.location.hash, slides.length) ?? 0;

  slides.forEach((slide, index) => {
    if (index === initialIndex) slide.classList.add("is-active");
    lessonMain.appendChild(slide);
  });

  layout.append(toolbar, lessonMain);
  document.body.classList.add("lesson-shell-active");
  document.querySelector("#site-header")?.setAttribute("hidden", "");
  document.querySelector("#site-footer")?.setAttribute("hidden", "");
  originalMain.replaceWith(layout);

  let activeIndex = initialIndex;
  const navButtons = Array.from(toolbar.querySelectorAll("[data-lesson-panel-target]"));

  function syncNavButtons(index) {
    navButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function keepActiveNavButtonVisible(button) {
    const navList = button?.closest(".lesson-toolbar-nav-list");
    if (!button || !navList) return;

    requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      navList.scrollTo({
        top: button.offsetTop - (navList.clientHeight / 2) + (button.offsetHeight / 2),
        left: button.offsetLeft - (navList.clientWidth / 2) + (button.offsetWidth / 2),
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  function fitSlideToViewport(slide) {
    const source = slide?.querySelector(".lesson-slide-source");
    if (!source) return;
    source.style.transform = "";
    source.style.width = "";
    source.style.height = "";
  }

  function updateSlideHash(index) {
    const nextHash = `#slide-${index + 1}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }

  function setPanel(index, options = {}) {
    if (index < 0 || index >= slides.length) return;
    slides[activeIndex].classList.remove("is-active");
    activeIndex = index;
    slides[activeIndex].classList.add("is-active");
    syncNavButtons(activeIndex);
    keepActiveNavButtonVisible(navButtons[activeIndex]);
    slides[activeIndex].querySelector(".lesson-slide-inner")?.scrollTo({ top: 0, behavior: "smooth" });
    fitSlideToViewport(slides[activeIndex]);
    if (options.updateHash !== false) updateSlideHash(activeIndex);
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => setPanel(Number(button.dataset.lessonPanelTarget)));
  });

  lessonMain.querySelectorAll("[data-lesson-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      setPanel(activeIndex + (button.dataset.lessonDirection === "next" ? 1 : -1));
    });
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    if (isTyping) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPanel(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPanel(activeIndex - 1);
    }
  });

  window.addEventListener("hashchange", () => {
    const hashIndex = slideIndexFromHash(window.location.hash, slides.length);
    setPanel(hashIndex ?? 0, { updateHash: false });
  });

  syncNavButtons(activeIndex);
  keepActiveNavButtonVisible(navButtons[activeIndex]);
  fitSlideToViewport(slides[activeIndex]);
  window.addEventListener("resize", () => {
    updateLessonViewportWidth();
    fitSlideToViewport(slides[activeIndex]);
  });
  window.visualViewport?.addEventListener("resize", updateLessonViewportWidth);
}

  window.CSRevision.lessons.initLessonShell = setupGcseLessonShell;
})();
