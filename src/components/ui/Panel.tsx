import type { HTMLAttributes, ReactNode } from 'react';

type PanelTone = 'dark' | 'light';

const tones: Record<PanelTone, string> = {
  dark: 'border-[#6876df] bg-[linear-gradient(135deg,#202a6f_0%,#3c3190_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
  light: 'border-[#dedbf0] bg-[linear-gradient(135deg,#ffffff_0%,#f9f7ff_100%)] text-ink',
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
