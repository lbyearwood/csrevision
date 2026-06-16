(() => {
    function closeSoundModals() {
        document.querySelectorAll("[data-sound-modal]").forEach((modal) => {
            modal.hidden = true;
        });
    }

    document.querySelectorAll("[data-sound-modal-open]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.soundModalOpen);
            if (!modal) return;

            closeSoundModals();
            modal.hidden = false;
            modal.querySelector("[data-sound-modal-close]")?.focus();
        });
    });

    document.querySelectorAll("[data-sound-modal-close]").forEach((button) => {
        button.addEventListener("click", closeSoundModals);
    });

    document.querySelectorAll("[data-sound-flip-card]").forEach((card) => {
        card.addEventListener("click", () => {
            const isFlipped = card.classList.toggle("is-flipped");
            card.setAttribute("aria-pressed", String(isFlipped));
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeSoundModals();
    });

    document.querySelectorAll("[data-sound-mcq-set]").forEach((set) => {
        set.querySelectorAll("[data-sound-choice]").forEach((button) => {
            button.addEventListener("click", () => {
                const card = button.closest(".sound-mcq-row, .sound-mcq-card");
                const feedback = card?.querySelector("[data-sound-feedback]");
                const isCorrect = button.dataset.soundChoice === "correct";

                card?.querySelectorAll("[data-sound-choice]").forEach((choice) => {
                    choice.classList.remove("is-correct", "is-wrong");
                    choice.setAttribute("aria-pressed", "false");
                });

                button.classList.add(isCorrect ? "is-correct" : "is-wrong");
                button.setAttribute("aria-pressed", "true");

                if (feedback) {
                    feedback.textContent = button.dataset.feedback || "";
                    feedback.classList.toggle("is-correct", isCorrect);
                    feedback.classList.toggle("is-wrong", !isCorrect);
                }
            });
        });

        set.querySelector("[data-sound-reset]")?.addEventListener("click", () => {
            set.querySelectorAll("[data-sound-choice]").forEach((choice) => {
                choice.classList.remove("is-correct", "is-wrong");
                choice.removeAttribute("aria-pressed");
            });

            set.querySelectorAll("[data-sound-feedback]").forEach((feedback) => {
                feedback.textContent = "Choose an option.";
                feedback.classList.remove("is-correct", "is-wrong");
            });
        });
    });

    function setStepper(stepper, step) {
        const items = Array.from(stepper.querySelectorAll("[data-sound-step]"));
        const previous = stepper.querySelector("[data-sound-prev]");
        const next = stepper.querySelector("[data-sound-next]");
        const current = Math.min(Math.max(step, 0), items.length);

        stepper.dataset.currentStep = String(current);

        items.forEach((item, index) => {
            item.hidden = index >= current;
        });

        if (previous) previous.disabled = current === 0;
        if (next) next.disabled = current === items.length;
    }

    document.querySelectorAll("[data-sound-stepper]").forEach((stepper) => {
        setStepper(stepper, 0);

        stepper.querySelector("[data-sound-prev]")?.addEventListener("click", () => {
            setStepper(stepper, Number(stepper.dataset.currentStep || 0) - 1);
        });

        stepper.querySelector("[data-sound-next]")?.addEventListener("click", () => {
            setStepper(stepper, Number(stepper.dataset.currentStep || 0) + 1);
        });

        stepper.querySelector("[data-sound-reset-stepper]")?.addEventListener("click", () => {
            setStepper(stepper, 0);
        });
    });
})();
