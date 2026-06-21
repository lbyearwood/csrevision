import { devLayoutDefinitions } from "./devLayouts";
import { devCardDefinitions } from "./devCards";

export type DevModuleItem = {
  title: string;
  href?: string;
  complete?: boolean;
};

export type DevModuleGroup = {
  title: string;
  items: DevModuleItem[];
};

const moduleItems = (items: string[]): DevModuleItem[] => items.map((title) => ({ title }));

export const devModuleGroups: DevModuleGroup[] = [
  {
    title: "Layouts",
    items: devLayoutDefinitions.map(({ title, href }) => ({ title, href })),
  },
  {
    title: "Cards",
    items: devCardDefinitions.map(({ title, href, complete }) => ({ title, href, complete })),
  },
  {
    title: "Components",
    items: moduleItems([
      "Reveal button",
      "Reset button",
      "Multiple-choice option",
      "Correct marker",
      "Incorrect marker",
      "Feedback state",
      "Hint toggle",
      "Expand/collapse panel",
      "Step connector",
      "Flow connector",
      "Label badge",
      "Tooltip",
      "Diagram label",
      "Image hotspot",
      "Drag handle",
      "Timer display",
      "Progress indicator",
      "Score counter",
      "Audio play button",
      "Mark scheme bullet",
    ]),
  },
];
