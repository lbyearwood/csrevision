(() => {
    const content = document.querySelector(".single-lesson-content");
    const links = Array.from(document.querySelectorAll(".single-lesson-nav-link"));
    const sections = Array.from(document.querySelectorAll("[data-single-lesson-section]"));
    const sidebar = document.querySelector(".single-lesson-sidebar");

    if (!content || !links.length || !sections.length) return;

    const sectionIds = new Set(sections.map((section) => section.id).filter(Boolean));
    const storageKey = `single-lesson:${window.location.pathname}:current-section`;
    let activeSectionId = "";
    let isRestoringSection = false;

    const linkById = new Map(
        links
            .map((link) => [link.getAttribute("href")?.slice(1), link])
            .filter(([id]) => id)
    );

    function singleLessonAssetUrl(path) {
        const script = document.querySelector('script[src*="single-page-lesson.js"]');
        if (script?.src) return new URL(path, script.src).toString();
        return path;
    }

    function ensureAsset(tagName, attribute, url) {
        const selector = `${tagName}[${attribute}="${url}"]`;
        if (document.querySelector(selector)) return;

        const element = document.createElement(tagName);
        element[attribute] = url;
        if (tagName === "link") element.rel = "stylesheet";
        document.head.appendChild(element);
    }

    function ensureSingleLessonToolAssets() {
        ensureAsset("link", "href", singleLessonAssetUrl("../css/lesson-tools.css?v=3"));
        ensureAsset("script", "src", singleLessonAssetUrl("lesson-countdown.js?v=1"));
        ensureAsset("script", "src", singleLessonAssetUrl("lesson-stopwatch.js?v=1"));
        ensureAsset("script", "src", singleLessonAssetUrl("lesson-draw-board.js?v=1"));
    }

    function createToolPanel(title, bodyHtml) {
        const panel = document.createElement("details");
        panel.className = "single-lesson-sidebar-panel";
        panel.innerHTML = `
            <summary>${title}</summary>
            <div class="single-lesson-sidebar-panel-body">${bodyHtml}</div>
        `;
        return panel;
    }

    function setupSidebarTools() {
        if (!sidebar) return;

        ensureSingleLessonToolAssets();

        const existingPanels = Array.from(sidebar.querySelectorAll(".single-lesson-sidebar-panel"));
        existingPanels.forEach((panel) => panel.remove());

        const alarmSrc = singleLessonAssetUrl("../audio/alarm-beep.mp3");
        const lessonTools = createToolPanel("Lesson tools", `
            <div class="lesson-tools-grid">
                <button class="lesson-tool-button utility" type="button" data-single-lesson-tool-action="glossary" aria-label="Open glossary"><span class="lesson-tool-icon">G</span><span class="lesson-tool-label">Glossary</span></button>
                <button class="lesson-tool-button utility" type="button" data-single-lesson-tool-action="print" aria-label="Print lesson"><span class="lesson-tool-icon">P</span><span class="lesson-tool-label">Print</span></button>
            </div>
        `);
        const teacherTools = createToolPanel("Teacher tools", `
            <div class="lesson-tool-grid">
                <button class="lesson-tool-button countdown" type="button" data-panel-action="countdown" data-alarm-src="${alarmSrc}" aria-label="Open Count Down"><span class="lesson-tool-icon">CD</span><span class="lesson-tool-label">Count Down</span></button>
                <button class="lesson-tool-button stopwatch" type="button" data-panel-action="stopwatch" aria-label="Open Stopwatch"><span class="lesson-tool-icon">SW</span><span class="lesson-tool-label">Stopwatch</span></button>
                <button class="lesson-tool-button board" type="button" data-panel-action="draw-board" aria-label="Open Draw board"><span class="lesson-tool-icon">DB</span><span class="lesson-tool-label">Draw board</span></button>
                <button class="lesson-tool-button sound" type="button" data-panel-action="sound-board" aria-label="Open Sound board"><span class="lesson-tool-icon">SB</span><span class="lesson-tool-label">Sound board</span></button>
            </div>
        `);

        const actions = sidebar.querySelector(".single-lesson-sidebar-actions");
        if (actions) {
            sidebar.insertBefore(lessonTools, actions);
            sidebar.insertBefore(teacherTools, actions);
        } else {
            sidebar.append(lessonTools, teacherTools);
        }

        sidebar.addEventListener("click", (event) => {
            const tool = event.target.closest("[data-single-lesson-tool-action]");
            if (!tool) return;

            event.preventDefault();
            const action = tool.dataset.singleLessonToolAction;
            if (action === "print") {
                window.print();
                return;
            }

            if (action === "glossary") {
                const glossaryButton = document.querySelector("[data-glossary-open]");
                if (glossaryButton) {
                    glossaryButton.click();
                    return;
                }
                document.dispatchEvent(new CustomEvent("lesson:left-panel:glossary"));
            }
        });
    }

    function isValidSectionId(id) {
        return Boolean(id && sectionIds.has(id));
    }

    function decodeHash() {
        try {
            return window.decodeURIComponent(window.location.hash.slice(1));
        } catch {
            return window.location.hash.slice(1);
        }
    }

    function getHashSectionId() {
        const id = decodeHash();
        return isValidSectionId(id) ? id : "";
    }

    function getStoredSectionId() {
        try {
            const id = window.sessionStorage.getItem(storageKey);
            return isValidSectionId(id) ? id : "";
        } catch {
            return "";
        }
    }

    function storeSectionId(id) {
        try {
            window.sessionStorage.setItem(storageKey, id);
        } catch {
            // Session storage may be unavailable in some locked-down browsers.
        }
    }

    function updateUrlHash(id, mode = "replace") {
        if (!isValidSectionId(id)) return;

        storeSectionId(id);

        if (decodeHash() === id) return;

        const nextUrl = `${window.location.pathname}${window.location.search}#${window.encodeURIComponent(id)}`;
        const method = mode === "push" ? "pushState" : "replaceState";
        window.history[method](null, "", nextUrl);
    }

    function setActive(id, options = {}) {
        if (!isValidSectionId(id)) return;

        links.forEach((link) => {
            const isActive = link === linkById.get(id);
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        activeSectionId = id;

        if (options.persist) {
            updateUrlHash(id, options.historyMode);
        }
    }

    function usesContentScroller() {
        return content.scrollHeight > content.clientHeight + 2
            && getComputedStyle(content).overflowY !== "visible";
    }

    function getSectionTop(section) {
        const contentRect = content.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const relativeTop = sectionRect.top - contentRect.top;

        if (Number.isFinite(relativeTop) && Math.abs(relativeTop) > 1) {
            return Math.max(0, content.scrollTop + relativeTop);
        }

        const sectionIndex = sections.indexOf(section);
        const fallbackTop = Math.max(0, sectionIndex) * content.clientHeight;
        return Math.max(0, section.offsetTop || fallbackTop);
    }

    function isSectionAtTop(section) {
        if (!section) return false;

        if (usesContentScroller()) {
            const contentRect = content.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            return Math.abs(sectionRect.top - contentRect.top) <= 3;
        }

        return Math.abs(section.getBoundingClientRect().top) <= 3;
    }

    function scrollToSection(id, options = {}) {
        if (!isValidSectionId(id)) return;

        const section = document.getElementById(id);
        if (!section) return;

        const behavior = options.behavior || "auto";

        if (usesContentScroller()) {
            const top = getSectionTop(section);

            if (behavior === "smooth") {
                content.scrollTo({ top, behavior });
            } else {
                content.scrollTop = top;
            }
        } else {
            section.scrollIntoView({
                block: "start",
                behavior
            });
        }

        setActive(id, {
            persist: true,
            historyMode: options.historyMode || "replace"
        });
    }

    function updateActiveFromScroll() {
        if (isRestoringSection) return;

        const contentScroller = usesContentScroller();
        const rootRect = contentScroller
            ? content.getBoundingClientRect()
            : { top: 0, height: window.innerHeight };
        const readingLineRatio = contentScroller ? 0.32 : 0.68;
        const readingLine = rootRect.top + (rootRect.height * readingLineRatio);
        let activeId = sections[0]?.id;

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= readingLine) {
                activeId = section.id;
            }
        });

        if (activeId && activeId !== activeSectionId) {
            setActive(activeId, { persist: true });
        }
    }

    function restoreSection(id) {
        if (!isValidSectionId(id)) return;

        isRestoringSection = true;
        const section = document.getElementById(id);
        const startedAt = Date.now();

        const scrollNow = () => {
            scrollToSection(id, { historyMode: "replace" });

            if (isSectionAtTop(section) || Date.now() - startedAt > 2400) {
                isRestoringSection = false;
                setActive(id, {
                    persist: true,
                    historyMode: "replace"
                });
                return;
            }

            window.setTimeout(scrollNow, 120);
        };

        window.requestAnimationFrame(scrollNow);
    }

    setupSidebarTools();

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href")?.slice(1);
            if (targetId) {
                event.preventDefault();
                scrollToSection(targetId, {
                    behavior: "smooth",
                    historyMode: "push"
                });
                window.setTimeout(updateActiveFromScroll, 520);
            }
        });
    });

    let ticking = false;
    function handleScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveFromScroll();
            ticking = false;
        });
    }

    content.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("hashchange", () => {
        const id = getHashSectionId();
        if (id && id !== activeSectionId) {
            restoreSection(id);
        }
    });

    const initialSectionId = getHashSectionId() || getStoredSectionId();

    if (initialSectionId) {
        restoreSection(initialSectionId);
    } else {
        updateActiveFromScroll();
    }
})();
