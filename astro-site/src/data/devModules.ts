import { devShellDefinitions } from "./devShells";
import { devLayoutDefinitions } from "./devLayouts";
import { devCardDefinitions } from "./devCards";
import { devComponentDefinitions } from "./devComponents";
import { devWidgetDefinitions } from "./devWidgets";

export type DevModuleItem = {
  title: string;
  href?: string;
  complete?: boolean;
};

export type DevModuleGroup = {
  title: string;
  items: DevModuleItem[];
};

export const devModuleGroups: DevModuleGroup[] = [
  {
    title: "Shells",
    items: devShellDefinitions.map(({ title, href }) => ({ title, href })),
  },
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
    items: devComponentDefinitions.map(({ title, href, complete }) => ({ title, href, complete })),
  },
  {
    title: "Widgets",
    items: devWidgetDefinitions.map(({ title, href, complete }) => ({ title, href, complete })),
  },
];
