(() => {
  const WIDGET_ID = "lesson-draw-board-widget";
  const colours = ["#071638", "#ffffff", "#2f57d6", "#00856f", "#c56a00", "#a83b3b", "#7d4bc1"];
  let widget;
  let canvas;
  let context;
  let activeTool = "pen";
  let activeColour = colours[0];
  let drawing = false;
  let startPoint = null;
  let snapshot = null;
  let dragging = null;
  let normalPosition = null;
  let transparentBoard = false;
  let canvasBackground = "#ffffff";

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
      cssX: event.clientX - rect.left,
      cssY: event.clientY - rect.top
    };
  }

  function resizeCanvas() {
    if (!canvas || !context) return;
    const rect = canvas.getBoundingClientRect();
    const previous = document.createElement("canvas");
    previous.width = canvas.width || rect.width;
    previous.height = canvas.height || rect.height;
    previous.getContext("2d").drawImage(canvas, 0, 0);

    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * scale));
    canvas.height = Math.max(1, Math.floor(rect.height * scale));
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.clearRect(0, 0, rect.width, rect.height);
    if (previous.width && previous.height) {
      context.drawImage(previous, 0, 0, rect.width, rect.height);
    }
  }

  function setTransparentBoard(enabled) {
    transparentBoard = enabled;
    widget.classList.toggle("is-transparent", transparentBoard);
    const button = widget.querySelector("[data-draw-transparent]");
    button.classList.toggle("is-active", transparentBoard);
    button.setAttribute("aria-pressed", String(transparentBoard));
    button.textContent = transparentBoard ? "Opaque" : "Transparent";
  }

  function setCanvasBackground(colour) {
    canvasBackground = colour;
    widget.style.setProperty("--draw-board-bg", canvasBackground);
    const button = widget.querySelector("[data-draw-bg]");
    button.textContent = canvasBackground === "#ffffff" ? "Black bg" : "White bg";
    button.setAttribute("aria-label", `Switch canvas background to ${canvasBackground === "#ffffff" ? "black" : "white"}`);
  }

  function setTool(tool) {
    activeTool = tool;
    widget.querySelectorAll("[data-draw-tool]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.drawTool === tool);
    });
  }

  function setColour(colour) {
    activeColour = colour;
    widget.querySelectorAll("[data-draw-colour]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.drawColour === colour);
    });
  }

  function beginDraw(event) {
    if (activeTool === "text") {
      addTextInput(event);
      return;
    }

    drawing = true;
    const point = canvasPoint(event);
    startPoint = point;
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);

    if (activeTool === "pen" || activeTool === "eraser") {
      context.beginPath();
      context.moveTo(point.cssX, point.cssY);
    }
  }

  function moveDraw(event) {
    if (!drawing || !startPoint) return;
    const point = canvasPoint(event);

    if (activeTool === "line") {
      context.putImageData(snapshot, 0, 0);
      context.beginPath();
      context.strokeStyle = activeColour;
      context.lineWidth = 4;
      context.moveTo(startPoint.cssX, startPoint.cssY);
      context.lineTo(point.cssX, point.cssY);
      context.stroke();
      return;
    }

    context.strokeStyle = activeTool === "eraser" ? canvasBackground : activeColour;
    context.lineWidth = activeTool === "eraser" ? 24 : 4;
    context.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    context.lineTo(point.cssX, point.cssY);
    context.stroke();
    context.globalCompositeOperation = "source-over";
  }

  function endDraw() {
    drawing = false;
    startPoint = null;
    snapshot = null;
  }

  function addTextInput(event) {
    event.preventDefault();
    const wrap = widget.querySelector(".draw-board-canvas-wrap");
    const point = canvasPoint(event);
    const input = document.createElement("input");
    input.className = "draw-board-text-input";
    input.type = "text";
    input.placeholder = "Type text";
    input.style.left = `${point.cssX}px`;
    input.style.top = `${point.cssY}px`;
    input.style.color = activeColour;
    wrap.appendChild(input);
    input.addEventListener("pointerdown", (pointerEvent) => pointerEvent.stopPropagation());
    window.setTimeout(() => input.focus(), 0);

    let finished = false;
    function commit() {
      if (finished) return;
      finished = true;
      const text = input.value.trim();
      if (text) {
        context.fillStyle = activeColour;
        context.font = "800 24px Arial, Helvetica, sans-serif";
        context.fillText(text, point.cssX, point.cssY + 24);
      }
      input.remove();
    }

    input.addEventListener("blur", commit, { once: true });
    input.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Enter") {
        keyEvent.preventDefault();
        input.blur();
      }
      if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        finished = true;
        input.remove();
      }
    });
  }

  function clearBoard() {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
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

  function rememberNormalPosition() {
    if (!widget || widget.classList.contains("is-fullscreen") || widget.classList.contains("is-minimised")) return;
    const rect = widget.getBoundingClientRect();
    normalPosition = keepOnScreen(rect.left, rect.top);
  }

  function applyNormalPosition() {
    if (!normalPosition) {
      widget.style.left = "";
      widget.style.top = "";
      widget.style.right = "";
      return;
    }

    const next = keepOnScreen(normalPosition.left, normalPosition.top);
    normalPosition = next;
    widget.style.left = `${next.left}px`;
    widget.style.top = `${next.top}px`;
    widget.style.right = "auto";
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
    if (dragging) rememberNormalPosition();
    dragging = null;
  }

  function minimiseBoard() {
    rememberNormalPosition();
    widget.classList.remove("is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.classList.add("is-minimised");
    widget.querySelector("[data-draw-fullscreen]").hidden = false;
    widget.querySelector("[data-draw-normal]").hidden = false;
    widget.querySelector("[data-draw-minimise]").hidden = true;
  }

  function normalSizeBoard() {
    widget.classList.remove("is-hidden", "is-minimised", "is-fullscreen");
    applyNormalPosition();
    widget.querySelector("[data-draw-fullscreen]").hidden = false;
    widget.querySelector("[data-draw-normal]").hidden = true;
    widget.querySelector("[data-draw-minimise]").hidden = false;
    window.setTimeout(resizeCanvas, 50);
  }

  function fullscreenBoard() {
    rememberNormalPosition();
    widget.classList.remove("is-hidden", "is-minimised");
    widget.classList.add("is-fullscreen");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.querySelector("[data-draw-fullscreen]").hidden = true;
    widget.querySelector("[data-draw-normal]").hidden = false;
    widget.querySelector("[data-draw-minimise]").hidden = false;
    window.setTimeout(resizeCanvas, 50);
  }

  function closeBoard() {
    dragging = null;
    drawing = false;
    widget.classList.remove("is-fullscreen", "is-minimised");
    widget.style.left = "";
    widget.style.top = "";
    widget.style.right = "";
    widget.classList.add("is-hidden");
  }

  function createWidget() {
    const element = document.createElement("section");
    element.id = WIDGET_ID;
    element.className = "draw-board-widget is-hidden";
    element.setAttribute("aria-label", "Draw board");
    element.tabIndex = -1;
    element.innerHTML = `
      <header class="draw-board-header" data-draw-drag>
        <h2 class="draw-board-title">Draw board</h2>
        <span class="draw-board-header-note">Pen</span>
        <div class="draw-board-window-controls">
          <button class="draw-board-icon-button" type="button" data-draw-minimise aria-label="Minimise Draw board">Min</button>
          <button class="draw-board-icon-button" type="button" data-draw-normal aria-label="Normal size Draw board" hidden>Normal</button>
          <button class="draw-board-icon-button" type="button" data-draw-fullscreen aria-label="Full screen Draw board">Full</button>
          <button class="draw-board-icon-button" type="button" data-draw-close aria-label="Close Draw board">x</button>
        </div>
      </header>
      <div class="draw-board-body">
        <div class="draw-board-toolbar" aria-label="Draw board tools">
          <button class="draw-board-tool-button is-active" type="button" data-draw-tool="pen">Pen</button>
          <button class="draw-board-tool-button" type="button" data-draw-tool="text">Text</button>
          <button class="draw-board-tool-button" type="button" data-draw-tool="line">Line</button>
          <button class="draw-board-tool-button" type="button" data-draw-tool="eraser">Eraser</button>
          <button class="draw-board-tool-button" type="button" data-draw-transparent aria-pressed="false">Transparent</button>
          <button class="draw-board-tool-button" type="button" data-draw-bg aria-label="Switch canvas background to black">Black bg</button>
          <div class="draw-board-palette" aria-label="Colour palette">
            ${colours.map((colour, index) => `<button class="draw-board-swatch${index === 0 ? " is-active" : ""}" type="button" data-draw-colour="${colour}" style="background:${colour}" aria-label="Use colour ${colour}"></button>`).join("")}
          </div>
          <button class="draw-board-clear-button" type="button" data-draw-clear>Clear board</button>
        </div>
        <div class="draw-board-canvas-wrap">
          <canvas class="draw-board-canvas" data-draw-canvas></canvas>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    widget = element;
    canvas = widget.querySelector("[data-draw-canvas]");
    context = canvas.getContext("2d");

    widget.querySelectorAll("[data-draw-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        setTool(button.dataset.drawTool);
        widget.querySelector(".draw-board-header-note").textContent = button.textContent.trim();
      });
    });
    widget.querySelectorAll("[data-draw-colour]").forEach((button) => {
      button.addEventListener("click", () => setColour(button.dataset.drawColour));
    });
    widget.querySelector("[data-draw-transparent]").addEventListener("click", () => {
      setTransparentBoard(!transparentBoard);
    });
    widget.querySelector("[data-draw-bg]").addEventListener("click", () => {
      setCanvasBackground(canvasBackground === "#ffffff" ? "#050816" : "#ffffff");
    });
    widget.querySelector("[data-draw-clear]").addEventListener("click", clearBoard);
    widget.querySelector("[data-draw-minimise]").addEventListener("click", minimiseBoard);
    widget.querySelector("[data-draw-normal]").addEventListener("click", normalSizeBoard);
    widget.querySelector("[data-draw-fullscreen]").addEventListener("click", fullscreenBoard);
    widget.querySelector("[data-draw-close]").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeBoard();
    });
    widget.querySelector("[data-draw-drag]").addEventListener("mousedown", startDrag);

    canvas.addEventListener("pointerdown", (event) => {
      if (activeTool === "text") {
        beginDraw(event);
        return;
      }
      canvas.setPointerCapture(event.pointerId);
      beginDraw(event);
    });
    canvas.addEventListener("pointermove", moveDraw);
    canvas.addEventListener("pointerup", endDraw);
    canvas.addEventListener("pointercancel", endDraw);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);
    window.addEventListener("resize", resizeCanvas);

    window.setTimeout(() => {
      setCanvasBackground(canvasBackground);
      resizeCanvas();
      clearBoard();
    }, 50);
    return widget;
  }

  function openBoard() {
    if (!widget) createWidget();
    normalSizeBoard();
    widget.focus();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-panel-action="draw-board"]');
    if (!button) return;
    event.preventDefault();
    openBoard();
  });
})();
