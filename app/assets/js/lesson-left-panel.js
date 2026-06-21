(() => {
  window.CSRevision = window.CSRevision || {};
  if (window.CSRevision.leftPanel) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function create({ panels, topicTitle, alarmSrc, panelTitle }) {
    const toolbar = document.createElement("aside");
    toolbar.className = "lesson-toolbar";
    toolbar.setAttribute("aria-label", "Lesson navigation and teacher tools");

    const navItems = panels.map((panel, index) => `
      <li>
        <button class="lesson-toolbar-nav-item${index === 0 ? " is-active" : ""}" type="button" data-lesson-panel-target="${index}">
          <span class="lesson-toolbar-number">${index + 1}</span>
          <span>${escapeHtml(panelTitle(panel, index))}</span>
        </button>
      </li>
    `).join("");

    toolbar.innerHTML = `
      <header class="lesson-toolbar-header">
        <h2 class="lesson-toolbar-title">${escapeHtml(topicTitle || "GCSE lesson")}</h2>
      </header>

      <div class="lesson-toolbar-scroll">
        <details class="lesson-toolbar-section" data-left-panel-section="navigation" open>
          <summary class="lesson-toolbar-section-title">Lesson navigation</summary>
          <ol class="lesson-toolbar-nav-list">${navItems}</ol>
        </details>

        <details class="lesson-toolbar-section" data-left-panel-section="lesson-tools">
          <summary class="lesson-toolbar-section-title">Lesson tools</summary>
          <div class="lesson-tools-grid">
            <button class="lesson-tool-button utility" type="button" data-lesson-tool-action="glossary" aria-label="Open glossary"><span class="lesson-tool-icon">G</span><span class="lesson-tool-label">Glossary</span></button>
            <button class="lesson-tool-button utility" type="button" data-lesson-tool-action="print" aria-label="Print lesson"><span class="lesson-tool-icon">P</span><span class="lesson-tool-label">Print</span></button>
          </div>
        </details>

        <details class="lesson-toolbar-section" data-left-panel-section="teacher-tools">
          <summary class="lesson-toolbar-section-title">Teacher tools</summary>
          <div class="lesson-tool-grid">
            <button class="lesson-tool-button countdown" type="button" data-panel-action="countdown" data-alarm-src="${escapeHtml(alarmSrc)}" aria-label="Open Count Down"><span class="lesson-tool-icon">CD</span><span class="lesson-tool-label">Count Down</span></button>
            <button class="lesson-tool-button stopwatch" type="button" data-panel-action="stopwatch" aria-label="Open Stopwatch"><span class="lesson-tool-icon">SW</span><span class="lesson-tool-label">Stopwatch</span></button>
            <button class="lesson-tool-button board" type="button" data-panel-action="draw-board" aria-label="Open Draw board"><span class="lesson-tool-icon">DB</span><span class="lesson-tool-label">Draw board</span></button>
            <button class="lesson-tool-button sound" type="button" data-panel-action="sound-board" aria-label="Open Sound board"><span class="lesson-tool-icon">SB</span><span class="lesson-tool-label">Sound board</span></button>
          </div>
        </details>
      </div>

      <a class="lesson-toolbar-back" href="../index.html">Back to topics</a>
    `;

    toolbar.querySelectorAll(".lesson-toolbar-section").forEach((section) => {
      section.addEventListener("toggle", () => {
        if (!section.open) return;
        toolbar.querySelectorAll(".lesson-toolbar-section[open]").forEach((openSection) => {
          if (openSection !== section) openSection.open = false;
        });
      });
    });

    return toolbar;
  }

  function openGlossary() {
    const existingButton = document.querySelector("[data-glossary-open]");
    if (existingButton) {
      existingButton.click();
      return;
    }

    document.dispatchEvent(new CustomEvent("lesson:left-panel:glossary"));
  }

  function handleLessonTool(action) {
    if (action === "print") {
      window.print();
      return;
    }

    if (action === "glossary") {
      openGlossary();
    }
  }

  function init() {
    if (init.done) return;
    init.done = true;

    document.addEventListener("click", (event) => {
      const lessonTool = event.target.closest("[data-lesson-tool-action]");
      if (lessonTool) {
        event.preventDefault();
        handleLessonTool(lessonTool.dataset.lessonToolAction);
        return;
      }

      const panelTool = event.target.closest("[data-panel-action]");
      if (!panelTool) return;

      document.dispatchEvent(new CustomEvent("lesson:left-panel:tool", {
        detail: {
          action: panelTool.dataset.panelAction,
          button: panelTool
        }
      }));
    });
  }

  window.CSRevision.leftPanel = { create, init };
})();
