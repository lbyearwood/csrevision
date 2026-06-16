(() => {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    function parseStepData(container, selector) {
        const script = container.querySelector(selector);
        if (!script) return [];

        try {
            return JSON.parse(script.textContent || "[]");
        } catch {
            return [];
        }
    }

    function setStepperStep(stepper, nextStep) {
        const total = Number(stepper.dataset.total || 1);
        const step = clamp(nextStep, 0, total);
        const steps = parseStepData(stepper, "[data-step-data]");
        const status = stepper.querySelector("[data-step-status]");
        const text = stepper.querySelector("[data-step-text]");
        const complete = stepper.querySelector("[data-step-complete]");
        const previous = stepper.querySelector("[data-step-prev]");
        const next = stepper.querySelector("[data-step-next]");

        stepper.dataset.currentStep = String(step);

        stepper.querySelectorAll("[data-show-step]").forEach((cell) => {
            const showStep = Number(cell.dataset.showStep || 0);
            cell.classList.toggle("is-hidden", step < showStep);
        });

        const activeColumn = step === 0 ? null : total - step;
        stepper.querySelectorAll("[data-step-column]").forEach((cell) => {
            cell.classList.toggle("is-active", activeColumn !== null && Number(cell.dataset.stepColumn) === activeColumn);
        });

        if (status) {
            status.textContent = step === 0 ? "Press next step to begin." : `Step ${step} of ${total}`;
        }

        if (text) {
            text.textContent = step === 0 ? (steps[0] || "Press next step to begin.") : (steps[step - 1] || steps.at(-1) || "");
        }

        if (complete) {
            complete.hidden = step !== total;
        }

        if (previous) {
            previous.disabled = step === 0;
        }

        if (next) {
            next.disabled = step === total;
        }
    }

    function setShiftStep(stepper, nextStep) {
        const total = Number(stepper.dataset.total || 1);
        const step = clamp(nextStep, 0, total);
        const steps = parseStepData(stepper, "[data-shift-data]");
        const status = stepper.querySelector("[data-shift-status]");
        const text = stepper.querySelector("[data-shift-text]");
        const complete = stepper.querySelector("[data-shift-complete]");
        const previous = stepper.querySelector("[data-shift-prev]");
        const next = stepper.querySelector("[data-shift-next]");

        stepper.dataset.currentStep = String(step);
        stepper.classList.toggle("is-complete", step === total);

        if (status) {
            status.textContent = step === 0 ? "Press next step to begin." : `Step ${step} of ${total}`;
        }

        if (text) {
            text.textContent = step === 0 ? (steps[0] || "Press next step to begin.") : (steps[step - 1] || steps.at(-1) || "");
        }

        if (complete) {
            complete.hidden = step !== total;
        }

        if (previous) {
            previous.disabled = step === 0;
        }

        if (next) {
            next.disabled = step === total;
        }
    }

    document.querySelectorAll("[data-binary-stepper]").forEach((stepper) => {
        setStepperStep(stepper, 0);

        stepper.querySelector("[data-step-prev]")?.addEventListener("click", () => {
            setStepperStep(stepper, Number(stepper.dataset.currentStep || 0) - 1);
        });

        stepper.querySelector("[data-step-next]")?.addEventListener("click", () => {
            setStepperStep(stepper, Number(stepper.dataset.currentStep || 0) + 1);
        });

        stepper.querySelector("[data-step-reset]")?.addEventListener("click", () => {
            setStepperStep(stepper, 0);
        });
    });

    document.querySelectorAll("[data-shift-stepper]").forEach((stepper) => {
        setShiftStep(stepper, 0);

        stepper.querySelector("[data-shift-prev]")?.addEventListener("click", () => {
            setShiftStep(stepper, Number(stepper.dataset.currentStep || 0) - 1);
        });

        stepper.querySelector("[data-shift-next]")?.addEventListener("click", () => {
            setShiftStep(stepper, Number(stepper.dataset.currentStep || 0) + 1);
        });

        stepper.querySelector("[data-shift-reset]")?.addEventListener("click", () => {
            setShiftStep(stepper, 0);
        });
    });

    function renderShiftBoard(board) {
        const bits = board.dataset.start || "";
        const cells = Array.from(board.querySelectorAll("[data-shift-board-cell]"));
        const maxIndex = Math.max(0, cells.length - bits.length);
        const targetIndex = Number(board.dataset.targetIndex || board.dataset.startIndex || 0);
        const currentIndex = clamp(Number(board.dataset.currentIndex || board.dataset.startIndex || 0), 0, maxIndex);
        const isCorrect = currentIndex === targetIndex;
        const status = board.querySelector("[data-shift-board-status]");
        const left = board.querySelector("[data-shift-board-left]");
        const right = board.querySelector("[data-shift-board-right]");

        board.dataset.currentIndex = String(currentIndex);
        board.classList.toggle("is-correct", isCorrect);

        cells.forEach((cell, index) => {
            const bitIndex = index - currentIndex;
            const hasBit = bitIndex >= 0 && bitIndex < bits.length;
            cell.textContent = hasBit ? bits[bitIndex] : "";
            cell.classList.toggle("is-binary", hasBit);
            cell.classList.toggle("is-correct", hasBit && isCorrect);
        });

        if (status) {
            status.classList.toggle("is-correct", isCorrect);
            status.textContent = isCorrect
                ? "Correct. The binary string is in the right place."
                : "Use the left shift and right shift buttons to move the binary string.";
        }

        if (left) left.disabled = currentIndex <= 0;
        if (right) right.disabled = currentIndex >= maxIndex;
    }

    document.querySelectorAll("[data-shift-board]").forEach((board) => {
        board.dataset.currentIndex = board.dataset.startIndex || "0";
        renderShiftBoard(board);

        board.querySelector("[data-shift-board-left]")?.addEventListener("click", () => {
            board.dataset.currentIndex = String(Number(board.dataset.currentIndex || 0) - 1);
            renderShiftBoard(board);
        });

        board.querySelector("[data-shift-board-right]")?.addEventListener("click", () => {
            board.dataset.currentIndex = String(Number(board.dataset.currentIndex || 0) + 1);
            renderShiftBoard(board);
        });
    });

    document.querySelectorAll("[data-binary-reveal]").forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.binaryReveal);
            if (!target) return;

            const nextHidden = !target.hidden;
            target.hidden = nextHidden;
            button.textContent = nextHidden
                ? (button.dataset.showLabel || "Show answer")
                : (button.dataset.hideLabel || "Hide answer");
        });
    });

    document.querySelectorAll("[data-binary-choice-group]").forEach((group) => {
        const feedback = group.querySelector("[data-choice-feedback]");
        group.querySelectorAll("[data-binary-choice]").forEach((button) => {
            button.addEventListener("click", () => {
                group.querySelectorAll("[data-binary-choice]").forEach((choice) => {
                    choice.classList.toggle("is-selected", choice === button);
                });

                const isCorrect = button.dataset.binaryChoice === "correct";
                if (feedback) {
                    feedback.classList.toggle("is-correct", isCorrect);
                    feedback.textContent = isCorrect
                        ? "Correct. The result is 10000111, which fits inside 8 bits."
                        : "Not this time. Overflow only occurs if the result needs more than 8 bits.";
                }
            });
        });
    });

    function closeModals() {
        document.querySelectorAll("[data-binary-modal]").forEach((modal) => {
            modal.hidden = true;
        });
    }

    document.querySelectorAll("[data-binary-modal-open]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.binaryModalOpen);
            if (!modal) return;
            closeModals();
            modal.hidden = false;
            modal.querySelector("[data-binary-modal-close]")?.focus();
        });
    });

    document.querySelectorAll("[data-binary-modal-close]").forEach((button) => {
        button.addEventListener("click", closeModals);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModals();
        }
    });

    document.querySelectorAll("[data-binary-reset]").forEach((button) => {
        button.addEventListener("click", () => {
            const section = button.closest("[data-single-lesson-section]") || document;
            section.querySelectorAll("[data-binary-reveal]").forEach((revealButton) => {
                const target = document.getElementById(revealButton.dataset.binaryReveal);
                if (target) target.hidden = true;
                revealButton.textContent = revealButton.dataset.showLabel || "Show answer";
            });
            section.querySelectorAll("[data-binary-stepper]").forEach((stepper) => setStepperStep(stepper, 0));
            section.querySelectorAll("[data-shift-stepper]").forEach((stepper) => setShiftStep(stepper, 0));
            section.querySelectorAll("[data-shift-board]").forEach((board) => {
                board.dataset.currentIndex = board.dataset.startIndex || "0";
                renderShiftBoard(board);
            });
            section.querySelectorAll("[data-binary-choice-group]").forEach((group) => {
                group.querySelectorAll("[data-binary-choice]").forEach((choice) => choice.classList.remove("is-selected"));
                const feedback = group.querySelector("[data-choice-feedback]");
                if (feedback) {
                    feedback.classList.remove("is-correct");
                    feedback.textContent = "Choose whether the answer fits inside 8 bits.";
                }
            });
        });
    });
})();
