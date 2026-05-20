(() => {
    const modelConfigs = {
        ido: {
            finalAnswer: "10000001",
            steps: [
                { column: 7, result: "1", carryTo: null, text: "Step 1: In the 1s column, 0 + 1 + carry 0 = 1. Drop 1 into the result row. There is no carry." },
                { column: 6, result: "0", carryTo: 5, text: "Step 2: In the 2s column, 1 + 1 + carry 0 = 10 in binary. Drop 0 and carry 1 into the 4s column." },
                { column: 5, result: "0", carryTo: 4, text: "Step 3: In the 4s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 8s column." },
                { column: 4, result: "0", carryTo: 3, text: "Step 4: In the 8s column, 0 + 1 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 16s column." },
                { column: 3, result: "0", carryTo: 2, text: "Step 5: In the 16s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 32s column." },
                { column: 2, result: "0", carryTo: 1, text: "Step 6: In the 32s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 64s column." },
                { column: 1, result: "0", carryTo: 0, text: "Step 7: In the 64s column, 0 + 1 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 128s column." },
                { column: 0, result: "1", carryTo: null, text: "Step 8: In the 128s column, 0 + 0 + carry 1 = 1. Drop 1 into the result row. The final answer is 10000001." },
            ],
        },
        wedo: {
            finalAnswer: "00111100",
            steps: [
                { column: 7, result: "0", carryTo: 6, text: "Step 1: In the 1s column, 1 + 1 + carry 0 = 10 in binary. Drop 0 and carry 1 into the 2s column." },
                { column: 6, result: "0", carryTo: 5, text: "Step 2: In the 2s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 4s column." },
                { column: 5, result: "1", carryTo: 4, text: "Step 3: In the 4s column, 1 + 1 + carry 1 = 11 in binary. Drop 1 and carry 1 into the 8s column." },
                { column: 4, result: "1", carryTo: null, text: "Step 4: In the 8s column, 0 + 0 + carry 1 = 1. Drop 1 into the result row. There is no new carry." },
                { column: 3, result: "1", carryTo: null, text: "Step 5: In the 16s column, 1 + 0 + carry 0 = 1. Drop 1 into the result row." },
                { column: 2, result: "1", carryTo: null, text: "Step 6: In the 32s column, 0 + 1 + carry 0 = 1. Drop 1 into the result row." },
                { column: 1, result: "0", carryTo: null, text: "Step 7: In the 64s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 0, result: "0", carryTo: null, text: "Step 8: In the 128s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row. The final answer is 00111100." },
            ],
        },
        youdo: {
            finalAnswer: "01000110",
            steps: [
                { column: 7, result: "0", carryTo: null, text: "Step 1: In the 1s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 6, result: "1", carryTo: null, text: "Step 2: In the 2s column, 1 + 0 + carry 0 = 1. Drop 1 into the result row." },
                { column: 5, result: "1", carryTo: null, text: "Step 3: In the 4s column, 0 + 1 + carry 0 = 1. Drop 1 into the result row." },
                { column: 4, result: "0", carryTo: 3, text: "Step 4: In the 8s column, 1 + 1 + carry 0 = 10 in binary. Drop 0 and carry 1 into the 16s column." },
                { column: 3, result: "0", carryTo: 2, text: "Step 5: In the 16s column, 0 + 1 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 32s column." },
                { column: 2, result: "0", carryTo: 1, text: "Step 6: In the 32s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 64s column." },
                { column: 1, result: "1", carryTo: null, text: "Step 7: In the 64s column, 0 + 0 + carry 1 = 1. Drop 1 into the result row. There is no new carry." },
                { column: 0, result: "0", carryTo: null, text: "Step 8: In the 128s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row. The final answer is 01000110." },
            ],
        },
        "overflow-ido": {
            finalAnswer: "100100000",
            steps: [
                { column: 8, result: "0", carryTo: null, text: "Step 1: In the 1s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 7, result: "0", carryTo: null, text: "Step 2: In the 2s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 6, result: "0", carryTo: null, text: "Step 3: In the 4s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 5, result: "0", carryTo: null, text: "Step 4: In the 8s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 4, result: "0", carryTo: 3, text: "Step 5: In the 16s column, 1 + 1 + carry 0 = 10 in binary. Drop 0 and carry 1 into the 32s column." },
                { column: 3, result: "1", carryTo: 2, text: "Step 6: In the 32s column, 1 + 1 + carry 1 = 11 in binary. Drop 1 and carry 1 into the 64s column." },
                { column: 2, result: "0", carryTo: 1, text: "Step 7: In the 64s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the 128s column." },
                { column: 1, result: "0", carryTo: 0, text: "Step 8: In the 128s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the extra 9th bit." },
                { column: 0, result: "1", carryTo: null, text: "Step 9: The carry has moved into the 9th bit. That gives the full result 100100000, so the 8-bit addition has overflowed." },
            ],
        },
        "overflow-wedo": {
            finalAnswer: "100000000",
            steps: [
                { column: 8, result: "0", carryTo: null, text: "Step 1: In the 1s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 7, result: "0", carryTo: null, text: "Step 2: In the 2s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 6, result: "0", carryTo: null, text: "Step 3: In the 4s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 5, result: "0", carryTo: null, text: "Step 4: In the 8s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 4, result: "0", carryTo: null, text: "Step 5: In the 16s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 3, result: "0", carryTo: null, text: "Step 6: In the 32s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 2, result: "0", carryTo: 1, text: "Step 7: In the 64s column, 1 + 1 + carry 0 = 10 in binary. Drop 0 and carry 1 into the 128s column." },
                { column: 1, result: "0", carryTo: 0, text: "Step 8: In the 128s column, 1 + 0 + carry 1 = 10 in binary. Drop 0 and carry 1 into the extra 9th bit." },
                { column: 0, result: "1", carryTo: null, text: "Step 9: The carry has moved into the 9th bit. The full result is 100000000, so the 8-bit answer overflows." },
            ],
        },
        "overflow-youdo": {
            finalAnswer: "100000000",
            steps: [
                { column: 8, result: "0", carryTo: null, text: "Step 1: In the 1s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 7, result: "0", carryTo: null, text: "Step 2: In the 2s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 6, result: "0", carryTo: null, text: "Step 3: In the 4s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 5, result: "0", carryTo: null, text: "Step 4: In the 8s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 4, result: "0", carryTo: null, text: "Step 5: In the 16s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 3, result: "0", carryTo: null, text: "Step 6: In the 32s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 2, result: "0", carryTo: null, text: "Step 7: In the 64s column, 0 + 0 + carry 0 = 0. Drop 0 into the result row." },
                { column: 1, result: "0", carryTo: 0, text: "Step 8: In the 128s column, 1 + 1 + carry 0 = 10 in binary. Drop 0 and carry 1 into the extra 9th bit." },
                { column: 0, result: "1", carryTo: null, text: "Step 9: The carry has moved into the 9th bit. The full result is 100000000, so the 8-bit answer overflows." },
            ],
        },
    };

    const setupModel = (model) => {
        const config = modelConfigs[model.dataset.binaryAdditionModel];
        const card = model.closest(".model-card");

        if (!config || !card) {
            return;
        }

        const carryBoxes = Array.from(model.querySelectorAll(".carry-row .bit-box"));
        const resultBoxes = Array.from(model.querySelectorAll(".result-row .bit-box"));
        const bitCount = resultBoxes.length;
        const placeValueBoxes = Array.from(model.querySelectorAll(".place-value-row .place-value-box"));
        const addendRows = Array.from(model.querySelectorAll(".addition-model-row:not(.place-value-row):not(.carry-row):not(.result-row)"));
        const addendBoxes = addendRows.flatMap((row) => Array.from(row.querySelectorAll(".bit-box")));
        const backButton = card.querySelector("[data-step-back]");
        const nextButton = card.querySelector("[data-step-next]");
        const stepCount = card.querySelector("[data-step-count]");
        const explanation = card.querySelector("[data-step-explanation]");

        if (!backButton || !nextButton || !stepCount || !explanation) {
            return;
        }

        let currentStep = 0;

        const setActiveColumn = (column) => {
            placeValueBoxes.forEach((box, index) => box.classList.toggle("is-active", index === column));
            addendBoxes.forEach((box, index) => box.classList.toggle("is-active", index % bitCount === column));
            carryBoxes.forEach((box, index) => box.classList.toggle("is-active", index === column));
            resultBoxes.forEach((box, index) => box.classList.toggle("is-active", index === column));
        };

        const renderStep = () => {
            carryBoxes.forEach((box) => {
                box.textContent = "";
            });
            resultBoxes.forEach((box) => {
                box.textContent = "";
            });

            config.steps.slice(0, currentStep).forEach((step) => {
                resultBoxes[step.column].textContent = step.result;

                if (step.carryTo !== null) {
                    carryBoxes[step.carryTo].textContent = "1";
                }
            });

            stepCount.textContent = `${currentStep} out of ${config.steps.length} steps`;
            backButton.disabled = currentStep === 0;
            nextButton.disabled = currentStep === config.steps.length;

            if (currentStep === 0) {
                setActiveColumn(null);
                explanation.textContent = "Use Next to model the binary addition from the rightmost bit.";
                return;
            }

            const activeStep = config.steps[currentStep - 1];
            setActiveColumn(activeStep.column);
            explanation.textContent = activeStep.text;
        };

        backButton.addEventListener("click", () => {
            currentStep = Math.max(0, currentStep - 1);
            renderStep();
        });

        nextButton.addEventListener("click", () => {
            currentStep = Math.min(config.steps.length, currentStep + 1);
            renderStep();
        });

        renderStep();
    };

    document.querySelectorAll("[data-binary-addition-model]").forEach(setupModel);

    const steppedModelConfigs = {
        "overflow-ido": [
            "Step 1: Start with 11110000, which is 240 in denary.",
            "Step 2: Add 00110000, which is 48 in denary.",
            "Step 3: 240 + 48 = 288.",
            "Step 4: An unsigned 8-bit number can only store up to 255.",
            "Step 5: The full binary answer is 100100000, which needs 9 bits. That means overflow has happened.",
        ],
        "overflow-wedo": [
            "Step 1: Start with 11000000, which is 192 in denary.",
            "Step 2: Add 01000000, which is 64 in denary.",
            "Step 3: 192 + 64 = 256.",
            "Step 4: The largest unsigned 8-bit value is 255.",
            "Step 5: 256 needs 9 bits as 100000000, so this causes overflow.",
        ],
        "overflow-youdo": [
            "Step 1: Start with 10000000, which is 128 in denary.",
            "Step 2: Add another 10000000, which is also 128.",
            "Step 3: 128 + 128 = 256.",
            "Step 4: 256 is bigger than the 8-bit limit of 255.",
            "Step 5: The 9-bit result is 100000000, so the 8-bit answer overflows.",
        ],
        "shift-ido": [
            "Step 1: Place 00010100 inside the 8-bit window from 128 down to 1. Its value is 20.",
            "Step 2: A left shift by 1 moves each bit one place towards the larger place values.",
            "Step 3: The empty 1s position is filled with 0.",
            "Step 4: Inside the 8-bit window, the result is 00101000, which is 40.",
            "Step 5: Moving left by one place has multiplied the value by 2.",
        ],
        "shift-wedo": [
            "Step 1: Place 00101000 inside the 8-bit window from 128 down to 1. Its value is 40.",
            "Step 2: A right shift by 1 moves each bit one place towards the smaller place values.",
            "Step 3: The empty 128s position is filled with 0.",
            "Step 4: Inside the 8-bit window, the result is 00010100, which is 20.",
            "Step 5: Moving right by one place has divided the value by 2.",
        ],
        "shift-youdo": [
            "Step 1: Place 00000111 inside the 8-bit window. Its value is 7.",
            "Step 2: Left shift by 2 places to get 00011100, which is 28.",
            "Step 3: Now place 00110000 inside the 8-bit window. Its value is 48.",
            "Step 4: Right shift by 2 places to get 00001100, which is 12.",
            "Step 5: Two left shifts multiply by 4; two right shifts divide by 4.",
        ],
    };

    const setupSteppedModel = (card) => {
        const steps = steppedModelConfigs[card.dataset.steppedModel];
        const items = Array.from(card.querySelectorAll("[data-step-item]"));
        const backButton = card.querySelector("[data-step-back]");
        const nextButton = card.querySelector("[data-step-next]");
        const stepCount = card.querySelector("[data-step-count]");
        const explanation = card.querySelector("[data-step-explanation]");

        if (!steps || !items.length || !backButton || !nextButton || !stepCount || !explanation) {
            return;
        }

        let currentStep = 0;

        const renderStep = () => {
            items.forEach((item, index) => {
                item.classList.toggle("is-visible", index < currentStep);
                item.classList.toggle("is-active", index === currentStep - 1);
            });

            stepCount.textContent = `${currentStep} out of ${steps.length} steps`;
            backButton.disabled = currentStep === 0;
            nextButton.disabled = currentStep === steps.length;
            explanation.textContent = currentStep === 0
                ? "Use Next to model the process one step at a time."
                : steps[currentStep - 1];
        };

        backButton.addEventListener("click", () => {
            currentStep = Math.max(0, currentStep - 1);
            renderStep();
        });

        nextButton.addEventListener("click", () => {
            currentStep = Math.min(steps.length, currentStep + 1);
            renderStep();
        });

        renderStep();
    };

    document.querySelectorAll("[data-stepped-model]").forEach(setupSteppedModel);

    const emptyShiftRow = () => Array.from({ length: 16 }, () => "");
    const withBits = (bits) => emptyShiftRow().map((bit, index) => Object.hasOwn(bits, index) ? bits[index] : bit);

    const shiftModelConfigs = {
        "shift-ido": {
            steps: [
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "1", 8: "0", 9: "1", 10: "0", 11: "0" }),
                    red: [],
                    text: "Start: 00010100 has denary value 20.",
                },
                {
                    bits: withBits({ 3: "0", 4: "0", 5: "0", 6: "1", 7: "0", 8: "1", 9: "0", 10: "0", 11: "0" }),
                    red: [3, 11],
                    text: "Step 1: Shift left by 1 to get 00101000. The denary value changes from 20 to 40, so it has multiplied by 2.",
                },
            ],
        },
        "shift-wedo": {
            steps: [
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "1", 7: "0", 8: "1", 9: "0", 10: "0", 11: "0" }),
                    red: [],
                    text: "Start: 00101000 has denary value 40.",
                },
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "1", 8: "0", 9: "1", 10: "0", 11: "0", 12: "0" }),
                    red: [4, 12],
                    text: "Step 1: Shift right by 1 to get 00010100. The denary value changes from 40 to 20, so it has divided by 2.",
                },
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "0", 8: "1", 9: "0", 10: "1", 11: "0", 12: "0", 13: "0" }),
                    red: [4, 5, 12, 13],
                    text: "Step 2: Shift right again to get 00001010. The denary value changes from 20 to 10.",
                },
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "0", 8: "0", 9: "1", 10: "0", 11: "1", 12: "0", 13: "0", 14: "0" }),
                    red: [4, 5, 6, 12, 13, 14],
                    text: "Step 3: Shift right a third time to get 00000101. The denary value changes from 10 to 5.",
                },
            ],
        },
        "shift-ido-right-3": {
            steps: [
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "1", 7: "0", 8: "1", 9: "1", 10: "1", 11: "1" }),
                    red: [],
                    text: "Start: 00101111 has denary value 47.",
                },
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "1", 8: "0", 9: "1", 10: "1", 11: "1", 12: "1" }),
                    red: [4, 12],
                    text: "Step 1: Shift right by 1 to get 00010111. The denary value changes from 47 to 23 because the shifted-out 1 is lost.",
                },
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "0", 8: "1", 9: "0", 10: "1", 11: "1", 12: "1", 13: "1" }),
                    red: [4, 5, 12, 13],
                    text: "Step 2: Shift right again to get 00001011. The denary value changes from 23 to 11.",
                },
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "0", 7: "0", 8: "0", 9: "1", 10: "0", 11: "1", 12: "1", 13: "1", 14: "1" }),
                    red: [4, 5, 6, 12, 13, 14],
                    text: "Step 3: Shift right a third time to get 00000101. The denary value changes from 11 to 5; shifted-out bits are shown in red.",
                },
            ],
        },
        "shift-ido-left-4": {
            steps: [
                {
                    bits: withBits({ 4: "1", 5: "0", 6: "0", 7: "0", 8: "1", 9: "1", 10: "1", 11: "1" }),
                    red: [],
                    text: "Start: 10001111 has denary value 143.",
                },
                {
                    bits: withBits({ 3: "1", 4: "0", 5: "0", 6: "0", 7: "1", 8: "1", 9: "1", 10: "1", 11: "0" }),
                    red: [3, 11],
                    text: "Step 1: Shift left by 1. Inside the 8-bit window this gives 00011110, which is 30. The full shifted value would be 286, so the bit beyond 128 is outside the 8-bit storage.",
                },
                {
                    bits: withBits({ 2: "1", 3: "0", 4: "0", 5: "0", 6: "1", 7: "1", 8: "1", 9: "1", 10: "0", 11: "0" }),
                    red: [2, 3, 10, 11],
                    text: "Step 2: Shift left again. Inside the 8-bit window this gives 00111100, which is 60, while more of the full value is now outside the 8-bit range.",
                },
                {
                    bits: withBits({ 1: "1", 2: "0", 3: "0", 4: "0", 5: "1", 6: "1", 7: "1", 8: "1", 9: "0", 10: "0", 11: "0" }),
                    red: [1, 2, 3, 9, 10, 11],
                    text: "Step 3: Shift left a third time. Inside the 8-bit window this gives 01111000, which is 120.",
                },
                {
                    bits: withBits({ 0: "1", 1: "0", 2: "0", 3: "0", 4: "1", 5: "1", 6: "1", 7: "1", 8: "0", 9: "0", 10: "0", 11: "0" }),
                    red: [0, 1, 2, 3, 8, 9, 10, 11],
                    text: "Step 4: Shift left a fourth time. Inside the 8-bit window this gives 11110000, which is 240, but the red bits show that the full shifted value no longer fits in 8 bits.",
                },
            ],
        },
        "shift-youdo": {
            steps: [
                {
                    bits: withBits({ 4: "0", 5: "0", 6: "1", 7: "1", 8: "0", 9: "0", 10: "1", 11: "1" }),
                    red: [],
                    text: "Start: 00110011 has denary value 51.",
                },
                {
                    bits: withBits({ 3: "0", 4: "0", 5: "1", 6: "1", 7: "0", 8: "0", 9: "1", 10: "1", 11: "0" }),
                    red: [3, 11],
                    text: "Step 1: Shift left by 1 to get 01100110. The denary value changes from 51 to 102.",
                },
                {
                    bits: withBits({ 2: "0", 3: "0", 4: "1", 5: "1", 6: "0", 7: "0", 8: "1", 9: "1", 10: "0", 11: "0" }),
                    red: [2, 3, 10, 11],
                    text: "Step 2: Shift left again to get 11001100. The denary value changes from 102 to 204.",
                },
            ],
        },
    };

    const setupShiftModel = (card) => {
        const config = shiftModelConfigs[card.dataset.shiftModel];
        const numberCells = Array.from(card.querySelectorAll("[data-shift-number] .shift-cell"));
        const backButton = card.querySelector("[data-step-back]");
        const nextButton = card.querySelector("[data-step-next]");
        const stepCount = card.querySelector("[data-step-count]");
        const explanation = card.querySelector("[data-step-explanation]");

        if (!config || !numberCells.length || !backButton || !nextButton || !stepCount || !explanation) {
            return;
        }

        let currentStep = 0;
        const maxStep = config.steps.length - 1;

        const renderStep = () => {
            const state = config.steps[currentStep];
            numberCells.forEach((cell, index) => {
                cell.textContent = state.bits[index] || "";
                cell.classList.toggle("has-bit", Boolean(state.bits[index]));
                cell.classList.toggle("outside-range", state.red?.includes(index));
            });

            stepCount.textContent = `${currentStep} out of ${maxStep} steps`;
            backButton.disabled = currentStep === 0;
            nextButton.disabled = currentStep === maxStep;
            explanation.textContent = state.text;
        };

        backButton.addEventListener("click", () => {
            currentStep = Math.max(0, currentStep - 1);
            renderStep();
        });

        nextButton.addEventListener("click", () => {
            currentStep = Math.min(maxStep, currentStep + 1);
            renderStep();
        });

        renderStep();
    };

    document.querySelectorAll("[data-shift-model]").forEach(setupShiftModel);
})();
