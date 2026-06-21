(() => {
    window.CSRevision = window.CSRevision || {};
    window.CSRevision.lessonGlossaries = window.CSRevision.lessonGlossaries || {};

    document.querySelectorAll(".lesson-slide-source .slide-grid > .slide-copy").forEach((copy) => {
        const grid = copy.parentElement;
        if (!grid || grid.dataset.singleLessonHeadersNormalised === "true") return;

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
        grid.dataset.singleLessonHeadersNormalised = "true";
    });

    window.CSRevision.lessonComponents?.init?.();

    document.querySelectorAll("[data-lesson-glossary-trigger]").forEach((button) => {
        if (button.dataset.singleLessonGlossaryReady === "true") return;
        button.dataset.singleLessonGlossaryReady = "true";
        button.addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent("lesson:left-panel:glossary"));
        });
    });
})();
