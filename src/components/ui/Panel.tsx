import type { HTMLAttributes, ReactNode } from 'react';

export function Panel({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section
      className={`rounded-app border border-line bg-white shadow-panel ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
