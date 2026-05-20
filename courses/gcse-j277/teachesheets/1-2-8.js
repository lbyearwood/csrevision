(() => {
    const diagrams = Array.from(document.querySelectorAll("[data-interactive-diagram]"));
    if (!diagrams.length) return;

    const stepCopy = {
        "You type A": "You type the visible character A.",
        "Character set": "The computer checks the character set to find the matching code.",
        "Code 65": "The character set maps A to denary code 65.",
        "Binary code": "The code is stored as the 8-bit binary value 01000001.",
        "Display A": "The stored code can be converted back into the character A for display.",
        "1 bit": "1 bit can make 2 different codes: 0 and 1.",
        "2 bits": "2 bits can make 4 different codes.",
        "8 bits": "8 bits can make 256 different codes.",
        "16 bits": "16 bits can make 65,536 different codes, which is why Unicode can represent many more characters."
    };

    function normalise(text) {
        return text.replace(/\s+/g, " ").trim();
    }

    function nodeMatchesStep(node, step) {
        return normalise(node.textContent).includes(step);
    }

    function setDiagramStep(diagram, stepIndex) {
        const steps = diagram.dataset.steps.split("|");
        const currentStep = steps[stepIndex];
        const nodes = Array.from(diagram.querySelectorAll("svg .node"));
        const previousButton = diagram.querySelector("[data-diagram-prev]");
        const nextButton = diagram.querySelector("[data-diagram-next]");
        const stepText = diagram.querySelector("[data-diagram-step]");

        nodes.forEach((node) => {
            node.classList.toggle("is-active", nodeMatchesStep(node, currentStep));
        });

        if (previousButton) previousButton.disabled = stepIndex === 0;
        if (nextButton) nextButton.disabled = stepIndex === steps.length - 1;
        if (stepText) stepText.textContent = stepCopy[currentStep] || currentStep;

        diagram.dataset.currentStep = String(stepIndex);
    }

    function setupDiagramControls() {
        diagrams.forEach((diagram) => {
            const steps = diagram.dataset.steps.split("|");
            const previousButton = diagram.querySelector("[data-diagram-prev]");
            const nextButton = diagram.querySelector("[data-diagram-next]");

            if (previousButton) {
                previousButton.addEventListener("click", () => {
                    const currentStep = Number(diagram.dataset.currentStep || 0);
                    setDiagramStep(diagram, Math.max(0, currentStep - 1));
                });
            }

            if (nextButton) {
                nextButton.addEventListener("click", () => {
                    const currentStep = Number(diagram.dataset.currentStep || 0);
                    setDiagramStep(diagram, Math.min(steps.length - 1, currentStep + 1));
                });
            }

            setDiagramStep(diagram, 0);
        });
    }

    async function renderMermaidDiagrams() {
        if (!window.mermaid) {
            setupDiagramControls();
            return;
        }

        window.mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: "base",
            themeVariables: {
                fontFamily: "Arial, sans-serif",
                primaryColor: "#ffffff",
                primaryTextColor: "#071332",
                primaryBorderColor: "#000000",
                lineColor: "#000000"
            }
        });

        await window.mermaid.run({
            nodes: document.querySelectorAll(".interactive-diagram .mermaid")
        });

        setupDiagramControls();
    }

    renderMermaidDiagrams().catch(() => {
        setupDiagramControls();
    });
})();
