import { expect, test } from "@playwright/test";

test("dev dashboard loads", async ({ page }) => {
  await page.goto("/dev-dashboard/");

  await expect(page.getByRole("heading", { name: "Dev dashboard" })).toBeVisible();
});

test("draw board accepts pasted images", async ({ context, page }) => {
  await page.goto("/dev-dashboard/widgets/draw-board/");

  const canvas = page.locator("[data-draw-canvas]");
  await expect(canvas).toBeVisible();

  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:4321",
  });
  await page.evaluate(async () => {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = 48;
    sourceCanvas.height = 36;
    const sourceContext = sourceCanvas.getContext("2d");
    if (!sourceContext) throw new Error("Source canvas context missing");
    sourceContext.fillStyle = "#ff0000";
    sourceContext.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      sourceCanvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Image blob could not be created"));
      }, "image/png");
    });
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
  });
  await page.getByRole("button", { name: "Paste image" }).click();

  await expect(page.locator(".draw-board-header-note")).toHaveText("Image pasted");
  await expect.poll(async () => page.evaluate(() => {
    const drawCanvas = document.querySelector("[data-draw-canvas]");
    if (!(drawCanvas instanceof HTMLCanvasElement)) return false;
    const context = drawCanvas.getContext("2d");
    if (!context) return false;
    const pixels = context.getImageData(0, 0, drawCanvas.width, drawCanvas.height).data;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] > 200 && pixels[index + 1] < 80 && pixels[index + 2] < 80 && pixels[index + 3] > 200) {
        return true;
      }
    }
    return false;
  })).toBe(true);
});
