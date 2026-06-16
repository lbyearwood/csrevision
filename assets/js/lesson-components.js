(() => {
  window.CSRevision = window.CSRevision || {};

  function setupRevealButtons() {
    document.querySelectorAll(".reveal-button").forEach((button) => {
      const targetId = button.getAttribute("aria-controls");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target || button.dataset.lessonRevealReady === "true") return;

      button.dataset.lessonRevealReady = "true";
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

  function setupTargetRevealControls() {
    document.querySelectorAll("[data-reveal-show], [data-reveal-hide]").forEach((button) => {
      if (button.dataset.targetRevealReady === "true") return;
      const targetId = button.dataset.revealShow || button.dataset.revealHide;
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      button.dataset.targetRevealReady = "true";
      button.addEventListener("click", () => {
        const shouldShow = Boolean(button.dataset.revealShow);
        const panelId = button.dataset.revealPanel;
        const panel = panelId ? document.getElementById(panelId) : button.closest("[data-reveal-panel]");
        const placeholderId = button.dataset.revealPlaceholder;
        const placeholder = placeholderId ? document.getElementById(placeholderId) : null;
        const titleId = button.dataset.revealTitle;
        const title = titleId ? document.getElementById(titleId) : null;
        const pairedRoot = button.closest(".hinge-template") || document;
        const pairedShow = pairedRoot.querySelector(`[data-reveal-show="${targetId}"]`);
        const pairedHide = pairedRoot.querySelector(`[data-reveal-hide="${targetId}"]`);

        target.hidden = !shouldShow;
        target.classList.toggle("is-visible", shouldShow);
        panel?.classList.toggle("is-revealed", shouldShow);
        if (title) title.textContent = shouldShow ? "Answer revealed" : "Answer hidden";
        if (placeholder) placeholder.hidden = shouldShow;
        if (pairedShow) pairedShow.hidden = shouldShow;
        if (pairedHide) pairedHide.hidden = !shouldShow;
      });
    });
  }

  function setupPrintButtons() {
    document.querySelectorAll("[data-print-page]").forEach((button) => {
      if (button.dataset.printReady === "true") return;
      button.dataset.printReady = "true";
      button.addEventListener("click", () => window.print());
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function currentLessonGlossary() {
    const topicId = document.body.dataset.topicId;
    const glossaries = window.CSRevision.lessonGlossaries || {};
    return glossaries[topicId] || window.CSRevision.lessonGlossary || null;
  }

  function setupLessonGlossary() {
    if (setupLessonGlossary.done) return;
    setupLessonGlossary.done = true;

    let glossaryDialog = null;
    let previousFocus = null;

    function closeGlossary() {
      if (!glossaryDialog) return;
      glossaryDialog.remove();
      glossaryDialog = null;
      previousFocus?.focus?.();
    }

    function openGlossary() {
      const glossary = currentLessonGlossary();
      const terms = Array.isArray(glossary?.terms) ? glossary.terms : [];
      if (!terms.length) return;

      closeGlossary();
      previousFocus = document.activeElement;

      const termMarkup = terms.map((term) => `
        <article class="lesson-glossary-entry">
          <h3>${escapeHtml(term.term)}</h3>
          <p>${escapeHtml(term.definition)}</p>
        </article>
      `).join("");

      glossaryDialog = document.createElement("div");
      glossaryDialog.className = "lesson-glossary-layer";
      glossaryDialog.innerHTML = `
        <div class="lesson-glossary-backdrop" data-lesson-glossary-close></div>
        <aside class="lesson-glossary-widget" role="dialog" aria-modal="true" aria-labelledby="lesson-glossary-title">
          <header class="lesson-glossary-header">
            <div>
              <p>Glossary</p>
              <h2 id="lesson-glossary-title">${escapeHtml(glossary.title || "Key terms")}</h2>
            </div>
            <button class="lesson-glossary-close" type="button" data-lesson-glossary-close aria-label="Close glossary">Close</button>
          </header>
          <div class="lesson-glossary-list">${termMarkup}</div>
        </aside>
      `;

      document.body.appendChild(glossaryDialog);
      glossaryDialog.querySelector(".lesson-glossary-close")?.focus();
    }

    document.addEventListener("lesson:left-panel:glossary", openGlossary);
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-lesson-glossary-close]")) closeGlossary();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeGlossary();
    });
  }

  function setupStageGroups() {
    document.querySelectorAll("[data-stage-group]").forEach((group) => {
      if (group.dataset.stageReady === "true") return;
      group.dataset.stageReady = "true";
      const buttons = Array.from(group.querySelectorAll("[data-stage-button]"));
      const panels = Array.from(group.querySelectorAll("[data-stage-panel]"));
      const visuals = Array.from(group.querySelectorAll("[data-stage-visual]"));

      function setStage(stage) {
        buttons.forEach((button) => {
          const isActive = button.dataset.stageButton === stage;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
        panels.forEach((panel) => {
          const isActive = panel.dataset.stagePanel === stage;
          panel.hidden = !isActive;
          panel.classList.remove("is-stage-fetch", "is-stage-decode", "is-stage-execute", "is-stage-repeat");
          if (isActive) panel.classList.add(`is-stage-${stage}`);
        });
        visuals.forEach((visual) => {
          visual.classList.toggle("is-active", visual.dataset.stageVisual === stage);
        });
      }

      buttons.forEach((button) => {
        button.addEventListener("click", () => setStage(button.dataset.stageButton));
      });

      setStage(buttons[0]?.dataset.stageButton || panels[0]?.dataset.stagePanel || "");
    });
  }

  function init() {
    setupRevealButtons();
    setupTargetRevealControls();
    setupStageGroups();
    setupPrintButtons();
    setupLessonGlossary();
  }

  window.CSRevision.lessonComponents = { init };
})();
