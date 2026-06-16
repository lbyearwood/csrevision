(() => {
  window.CSRevision = window.CSRevision || {};
  function init() {
  document.querySelectorAll(".reveal-button").forEach((button) => {
    const targetId = button.getAttribute("aria-controls");
    const markScheme = targetId ? document.getElementById(targetId) : null;
    if (!markScheme) return;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const showLabel = button.dataset.showLabel || "Show mark scheme";
      const hideLabel = button.dataset.hideLabel || "Hide mark scheme";
      button.setAttribute("aria-expanded", String(!isExpanded));
      markScheme.hidden = isExpanded;
      markScheme.classList.toggle("visible", !isExpanded);
      button.textContent = isExpanded ? showLabel : hideLabel;
    });
  });
}

  window.CSRevision.examPage = { init };
})();
