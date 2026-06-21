(() => {
  const WIDGET_ID = "lesson-stopwatch-widget";
  let widget;
  let intervalId = null;
  let running = false;
  let elapsedMilliseconds = 0;
  let startedAt = 0;
  let dragging = null;

  const pad = (value) => String(value).padStart(2, "0");

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((milliseconds % 1000) / 100);
    return `${pad(minutes)}:${pad(seconds)}.${tenths}`;
  }

  function updateDisplay() {
    const currentElapsed = running ? elapsedMilliseconds + (Date.now() - startedAt) : elapsedMilliseconds;
    const formatted = formatTime(currentElapsed);
    widget.querySelector("[data-stopwatch-display]").textContent = formatted;
    widget.querySelector("[data-stopwatch-header-display]").textContent = formatted;
  }

  function setStatus(message) {
    widget.querySelector("[data-stopwatch-status]").textContent = message;
  }

  function setPauseButton(label, disabled = false) {
    const button = widget.querySelector("[data-stopwatch-pause]");
    button.textContent = label;
    button.disabled = disabled;
  }

  function stopInterval() {
    if (intervalId) window.clearInterval(intervalId);
    intervalId = null;
  }

  function startStopwatch() {
    if (running) return;
    widget.classList.add("is-started");
    running = true;
    startedAt = Date.now();
    setPauseButton("Pause");
    setStatus("Running");
    stopInterval();
    intervalId = window.setInterval(updateDisplay, 100);
    updateDisplay();
  }

  function pauseStopwatch() {
    if (!running) return;
    elapsedMilliseconds += Date.now() - startedAt;
    running = false;
    stopInterval();
    setPauseButton("Resume");
    setStatus("Paused");
    updateDisplay();
  }

  function togglePauseResume() {
    if (running) {
      pauseStopwatch();
      return;
    }
    startStopwatch();
  }

  function resetStopwatch() {
    running = false;
    elapsedMilliseconds = 0;
    startedAt = 0;
    stopInterval();
    widget.classList.remove("is-started");
    setPauseButton("Pause", true);
    setStatus("Ready");
    updateDisplay();
  }

  function closeStopwatch() {
    resetStopwatch();
    widget.classList.remove("is-fullscreen", "is-minimised");
    widget.classList.add("is-hidden");
  }

  function minimiseStopwatch() {
    widget.classList.remove("is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.classList.add("is-minimised");
    widget.querySelector("[data-stopwatch-fullscreen]").hidden = false;
    widget.querySelector("[data-stopwatch-normal]").hidden = false;
    widget.querySelector("[data-stopwatch-minimise]").hidden = true;
  }

  function normalSizeStopwatch() {
    widget.classList.remove("is-hidden", "is-minimised", "is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.querySelector("[data-stopwatch-fullscreen]").hidden = false;
    widget.querySelector("[data-stopwatch-normal]").hidden = true;
    widget.querySelector("[data-stopwatch-minimise]").hidden = false;
  }

  function fullscreenStopwatch() {
    widget.classList.remove("is-hidden", "is-minimised");
    widget.classList.add("is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.querySelector("[data-stopwatch-fullscreen]").hidden = true;
    widget.querySelector("[data-stopwatch-normal]").hidden = false;
    widget.querySelector("[data-stopwatch-minimise]").hidden = false;
  }

  function keepOnScreen(left, top) {
    const rect = widget.getBoundingClientRect();
    const maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
    const maxTop = Math.max(8, window.innerHeight - rect.height - 8);
    return {
      left: Math.min(maxLeft, Math.max(8, left)),
      top: Math.min(maxTop, Math.max(8, top))
    };
  }

  function startDrag(event) {
    if (event.target.closest("button")) return;
    if (widget.classList.contains("is-fullscreen")) return;
    if (event.button !== 0) return;
    const rect = widget.getBoundingClientRect();
    dragging = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    event.preventDefault();
  }

  function drag(event) {
    if (!dragging) return;
    const next = keepOnScreen(event.clientX - dragging.offsetX, event.clientY - dragging.offsetY);
    widget.style.left = `${next.left}px`;
    widget.style.top = `${next.top}px`;
    widget.style.right = "auto";
  }

  function endDrag() {
    dragging = null;
  }

  function createWidget() {
    const element = document.createElement("section");
    element.id = WIDGET_ID;
    element.className = "stopwatch-widget is-hidden";
    element.setAttribute("aria-label", "Stopwatch");
    element.tabIndex = -1;
    element.innerHTML = `
      <header class="stopwatch-header" data-stopwatch-drag>
        <h2 class="stopwatch-title">Stopwatch</h2>
        <span class="stopwatch-header-time" data-stopwatch-header-display>00:00.0</span>
        <div class="stopwatch-window-controls">
          <button class="stopwatch-icon-button" type="button" data-stopwatch-minimise aria-label="Minimise Stopwatch">Min</button>
          <button class="stopwatch-icon-button" type="button" data-stopwatch-normal aria-label="Normal size Stopwatch" hidden>Normal</button>
          <button class="stopwatch-icon-button" type="button" data-stopwatch-fullscreen aria-label="Full screen Stopwatch">Full</button>
          <button class="stopwatch-icon-button" type="button" data-stopwatch-close aria-label="Close Stopwatch">x</button>
        </div>
      </header>
      <div class="stopwatch-body">
        <output class="stopwatch-time" data-stopwatch-display aria-live="polite">00:00.0</output>
        <p class="stopwatch-status" data-stopwatch-status aria-live="polite">Ready</p>
        <div class="stopwatch-actions">
          <button class="stopwatch-button primary" type="button" data-stopwatch-start>Start</button>
          <button class="stopwatch-button" type="button" data-stopwatch-pause disabled>Pause</button>
          <button class="stopwatch-button" type="button" data-stopwatch-reset>Reset</button>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    widget = element;

    widget.querySelector("[data-stopwatch-start]").addEventListener("click", startStopwatch);
    widget.querySelector("[data-stopwatch-pause]").addEventListener("click", togglePauseResume);
    widget.querySelector("[data-stopwatch-reset]").addEventListener("click", resetStopwatch);
    widget.querySelector("[data-stopwatch-close]").addEventListener("click", closeStopwatch);
    widget.querySelector("[data-stopwatch-minimise]").addEventListener("click", minimiseStopwatch);
    widget.querySelector("[data-stopwatch-normal]").addEventListener("click", normalSizeStopwatch);
    widget.querySelector("[data-stopwatch-fullscreen]").addEventListener("click", fullscreenStopwatch);
    widget.querySelector("[data-stopwatch-drag]").addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);

    updateDisplay();
    return widget;
  }

  function openStopwatch() {
    const isNew = !widget;
    if (isNew) createWidget();
    const wasHidden = widget.classList.contains("is-hidden");
    normalSizeStopwatch();
    if (isNew || wasHidden) resetStopwatch();
    widget.focus();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-panel-action="stopwatch"]');
    if (!button) return;
    event.preventDefault();
    openStopwatch();
  });
})();
