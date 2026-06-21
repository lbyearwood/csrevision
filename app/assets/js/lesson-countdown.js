(() => {
  const WIDGET_ID = "lesson-countdown-widget";
  let widget;
  let audio;
  let intervalId = null;
  let remainingSeconds = 0;
  let running = false;
  let complete = false;
  let dragging = null;

  const pad = (value) => String(value).padStart(2, "0");
  const clamp = (value, min, max) => {
    const number = Number.parseInt(value, 10);
    if (Number.isNaN(number)) return min;
    return Math.min(max, Math.max(min, number));
  };

  function enteredSeconds() {
    const minutes = clamp(widget.querySelector("[data-countdown-minutes]").value, 0, 99);
    const seconds = clamp(widget.querySelector("[data-countdown-seconds]").value, 0, 59);
    return (minutes * 60) + seconds;
  }

  function setStatus(message = "") {
    widget.querySelector("[data-countdown-status]").textContent = message;
  }

  function setPauseButton(label, disabled = false) {
    const button = widget.querySelector("[data-countdown-pause]");
    button.textContent = label;
    button.disabled = disabled;
  }

  function updateDisplay(seconds = remainingSeconds) {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const displaySeconds = safeSeconds % 60;
    const formatted = `${pad(minutes)}:${pad(displaySeconds)}`;
    widget.querySelector("[data-countdown-display]").textContent = formatted;
    widget.querySelector("[data-countdown-header-display]").textContent = formatted;
  }

  function stopAlarm() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  function stopInterval() {
    if (intervalId) window.clearInterval(intervalId);
    intervalId = null;
    running = false;
  }

  function setCompleteState(isComplete) {
    complete = isComplete;
    widget.classList.toggle("is-complete", isComplete);
    setStatus(isComplete ? "Time is up" : "");
  }

  function syncFromInputs() {
    const minuteInput = widget.querySelector("[data-countdown-minutes]");
    const secondInput = widget.querySelector("[data-countdown-seconds]");
    minuteInput.value = clamp(minuteInput.value, 0, 99);
    secondInput.value = clamp(secondInput.value, 0, 59);
    if (running) return;
    remainingSeconds = enteredSeconds();
    setCompleteState(false);
    updateDisplay();
  }

  function playAlarm() {
    if (!audio) return;
    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch(() => {
      setStatus("Time is up");
    });
  }

  function finishCountdown() {
    stopInterval();
    remainingSeconds = 0;
    updateDisplay();
    setCompleteState(true);
    setPauseButton("Start");
    playAlarm();
  }

  function tick() {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      finishCountdown();
      return;
    }
    updateDisplay();
  }

  function startCountdown() {
    if (complete) setCompleteState(false);
    if (!running) remainingSeconds = remainingSeconds || enteredSeconds();
    if (remainingSeconds <= 0) {
      setStatus("Set a time first.");
      updateDisplay(0);
      return;
    }
    stopAlarm();
    setStatus("");
    widget.classList.add("is-started");
    setPauseButton("Pause");
    running = true;
    if (intervalId) window.clearInterval(intervalId);
    intervalId = window.setInterval(tick, 1000);
  }

  function pauseCountdown() {
    stopInterval();
    setPauseButton("Resume");
  }

  function togglePauseStart() {
    if (running) {
      pauseCountdown();
      return;
    }
    startCountdown();
  }

  function resetCountdown() {
    stopInterval();
    stopAlarm();
    setCompleteState(false);
    remainingSeconds = enteredSeconds();
    updateDisplay();
    const hasStarted = widget.classList.contains("is-started");
    setPauseButton(hasStarted ? "Start" : "Pause", !hasStarted);
  }

  function closeCountdown() {
    resetCountdown();
    widget.classList.remove("is-started", "is-fullscreen", "is-minimised");
    widget.classList.add("is-hidden");
  }

  function minimiseCountdown() {
    widget.classList.remove("is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.classList.add("is-minimised");
    widget.querySelector("[data-countdown-fullscreen]").hidden = false;
    widget.querySelector("[data-countdown-normal]").hidden = false;
    widget.querySelector("[data-countdown-minimise]").hidden = true;
  }

  function normalSizeCountdown() {
    widget.classList.remove("is-hidden", "is-minimised", "is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.querySelector("[data-countdown-fullscreen]").hidden = false;
    widget.querySelector("[data-countdown-normal]").hidden = true;
    widget.querySelector("[data-countdown-minimise]").hidden = false;
  }

  function fullscreenCountdown() {
    widget.classList.remove("is-hidden", "is-minimised");
    widget.classList.add("is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.querySelector("[data-countdown-fullscreen]").hidden = true;
    widget.querySelector("[data-countdown-normal]").hidden = false;
    widget.querySelector("[data-countdown-minimise]").hidden = false;
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

  function createWidget(alarmSrc) {
    const element = document.createElement("section");
    element.id = WIDGET_ID;
    element.className = "countdown-widget is-hidden";
    element.setAttribute("aria-label", "Count Down");
    element.tabIndex = -1;
    element.innerHTML = `
      <header class="countdown-header" data-countdown-drag>
        <h2 class="countdown-title">Count Down</h2>
        <span class="countdown-header-time" data-countdown-header-display>00:00</span>
        <div class="countdown-window-controls">
          <button class="countdown-icon-button" type="button" data-countdown-minimise aria-label="Minimise Count Down">Min</button>
          <button class="countdown-icon-button" type="button" data-countdown-normal aria-label="Normal size Count Down" hidden>Normal</button>
          <button class="countdown-icon-button" type="button" data-countdown-fullscreen aria-label="Full screen Count Down">Full</button>
          <button class="countdown-icon-button" type="button" data-countdown-close aria-label="Close Count Down">x</button>
        </div>
      </header>
      <div class="countdown-body">
        <output class="countdown-time" data-countdown-display aria-live="polite">00:00</output>
        <p class="countdown-status" data-countdown-status aria-live="polite"></p>
        <div class="countdown-inputs">
          <label class="countdown-field">Minutes
            <input type="number" min="0" max="99" step="1" value="0" inputmode="numeric" data-countdown-minutes />
          </label>
          <label class="countdown-field">Seconds
            <input type="number" min="0" max="59" step="1" value="0" inputmode="numeric" data-countdown-seconds />
          </label>
        </div>
        <div class="countdown-actions">
          <button class="countdown-button primary" type="button" data-countdown-start>Start</button>
          <button class="countdown-button" type="button" data-countdown-pause disabled>Pause</button>
          <button class="countdown-button" type="button" data-countdown-reset>Reset</button>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    widget = element;
    audio = alarmSrc ? new Audio(alarmSrc) : null;

    widget.querySelector("[data-countdown-start]").addEventListener("click", startCountdown);
    widget.querySelector("[data-countdown-pause]").addEventListener("click", togglePauseStart);
    widget.querySelector("[data-countdown-reset]").addEventListener("click", resetCountdown);
    widget.querySelector("[data-countdown-close]").addEventListener("click", closeCountdown);
    widget.querySelector("[data-countdown-minimise]").addEventListener("click", minimiseCountdown);
    widget.querySelector("[data-countdown-normal]").addEventListener("click", normalSizeCountdown);
    widget.querySelector("[data-countdown-fullscreen]").addEventListener("click", fullscreenCountdown);
    widget.querySelectorAll("[data-countdown-minutes], [data-countdown-seconds]").forEach((input) => {
      input.addEventListener("input", syncFromInputs);
      input.addEventListener("change", syncFromInputs);
    });

    widget.addEventListener("click", () => {
      if (complete) stopAlarm();
    });

    widget.querySelector("[data-countdown-drag]").addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);

    return widget;
  }

  function openCountdown(button) {
    const isNew = !widget;
    if (isNew) createWidget(button.dataset.alarmSrc || "");
    const wasHidden = widget.classList.contains("is-hidden");
    normalSizeCountdown();
    if (isNew || wasHidden) {
      widget.classList.remove("is-started");
      resetCountdown();
    }
    widget.focus();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-panel-action="countdown"]');
    if (!button) return;
    event.preventDefault();
    openCountdown(button);
  });
})();
