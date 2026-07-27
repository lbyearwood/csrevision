import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dark'
  | 'outlineLight'
  | 'outlineDark'
  | 'utilityDark'
  | 'dangerOutline';

const variants: Record<Variant, string> = {
  primary: 'bg-blue text-white border-blue hover:bg-[#084f9f]',
  secondary: 'bg-white text-ink border-line hover:border-blue hover:text-blue',
  ghost: 'bg-transparent text-blue border-transparent hover:bg-[#e9f3ff]',
  danger: 'bg-[#fff1f1] text-danger border-[#ffd2d2] hover:bg-[#ffe7e7]',
  dark: 'bg-[#14243a] text-white border-[#2a3a50] hover:bg-[#20344f]',
  outlineLight: 'bg-transparent text-ink border-line hover:border-blue hover:bg-[#f4f8fb] hover:text-blue',
  outlineDark: 'bg-transparent text-white border-[#4b607a] hover:border-[#7f95b0] hover:bg-[#20344f]',
  utilityDark: 'bg-transparent text-[#dbe8f6] border-transparent hover:bg-[#20344f] hover:text-white',
  dangerOutline: 'bg-transparent text-[#ffb4b4] border-[#7e3e4a] hover:border-[#ffb4b4] hover:bg-[#3a2030]',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-app border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue/25 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
