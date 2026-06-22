export type DevShellDefinition = {
  title: string;
  slug: string;
  label: string;
  brief: string;
  href: string;
  reviewPoints: string[];
};

const shellHref = (slug: string) => `/dev-dashboard/shells/${slug}/`;

export const devShellDefinitions: DevShellDefinition[] = [
  {
    title: "Standard numbered lesson slide shell",
    slug: "standard-numbered-lesson-slide-shell",
    label: "Slide shell",
    brief: "The default outer wrapper for every numbered lesson slide. It owns the slide number, label, heading, scroll target spacing and consistent canvas rhythm, but not the card layout inside the slide.",
    href: shellHref("standard-numbered-lesson-slide-shell"),
    reviewPoints: [
      "Every normal lesson slide should sit inside this shell.",
      "The shell is not a 2 by 2 card layout.",
      "Inner card structure should come from the Layouts catalogue.",
    ],
  },
];

