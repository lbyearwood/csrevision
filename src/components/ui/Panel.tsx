import type { HTMLAttributes, ReactNode } from 'react';

type PanelTone = 'dark' | 'light';

const tones: Record<PanelTone, string> = {
  dark: 'border-[#2a3a50] bg-[#14243a] text-white',
  light: 'border-line bg-white text-ink',
};

export function Panel({
  children,
  className = '',
  tone = 'dark',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; tone?: PanelTone }) {
  return (
    <section
      className={`rounded-app border shadow-panel ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
