export type DevWidgetDefinition = {
  title: string;
  slug: string;
  href?: string;
  complete?: boolean;
};

const widgetHref = (slug: string) => `/dev-dashboard/widgets/${slug}/`;

export const devWidgetDefinitions: DevWidgetDefinition[] = [
  {
    title: "Timer display",
    slug: "timer-display",
    href: widgetHref("timer-display"),
    complete: true,
  },
  {
    title: "Stopwatch",
    slug: "stopwatch",
    href: widgetHref("stopwatch"),
    complete: true,
  },
  {
    title: "Draw board",
    slug: "draw-board",
    href: widgetHref("draw-board"),
    complete: true,
  },
  {
    title: "Progress indicator",
    slug: "progress-indicator",
    href: widgetHref("progress-indicator"),
    complete: true,
  },
  {
    title: "Score counter",
    slug: "score-counter",
    href: widgetHref("score-counter"),
    complete: true,
  },
  {
    title: "Audio play button",
    slug: "audio-play-button",
    href: widgetHref("audio-play-button"),
    complete: true,
  },
];
