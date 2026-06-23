export type DevWidgetDefinition = {
  title: string;
  slug: string;
  href?: string;
  complete?: boolean;
};

const widgetHref = (slug: string) => `/dev-dashboard/widgets/${slug}/`;

export const devWidgetDefinitions: DevWidgetDefinition[] = [
  {
    title: "TimerDisplay",
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
    title: "DrawBoard",
    slug: "draw-board",
    href: widgetHref("draw-board"),
    complete: true,
  },
  {
    title: "ProgressIndicator",
    slug: "progress-indicator",
    href: widgetHref("progress-indicator"),
    complete: true,
  },
  {
    title: "ScoreCounter",
    slug: "score-counter",
    href: widgetHref("score-counter"),
    complete: true,
  },
  {
    title: "AudioPlayButton",
    slug: "audio-play-button",
    href: widgetHref("audio-play-button"),
    complete: true,
  },
];
