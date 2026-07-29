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
  primary: 'border-[#4559e3] bg-[linear-gradient(135deg,#3857df_0%,#6952dc_100%)] text-white shadow-[0_8px_18px_rgba(56,87,223,0.22)] hover:border-[#314dcf] hover:bg-[linear-gradient(135deg,#2d4cc9_0%,#5944ca_100%)] hover:shadow-[0_10px_22px_rgba(56,87,223,0.3)]',
  secondary: 'border-[#dcd9f0] bg-[linear-gradient(135deg,#ffffff_0%,#f5f3ff_100%)] text-ink shadow-[0_5px_14px_rgba(54,68,163,0.07)] hover:border-blue hover:text-blue',
  ghost: 'bg-transparent text-blue border-transparent hover:bg-[#eef0ff]',
  danger: 'bg-[#fff1f1] text-danger border-[#ffd2d2] hover:bg-[#ffe7e7]',
  dark: 'border-[#6978e9] bg-[linear-gradient(135deg,#202a6f_0%,#40339b_100%)] text-white shadow-[0_8px_18px_rgba(32,42,111,0.2)] hover:bg-[linear-gradient(135deg,#2d3d9b_0%,#5140b4_100%)]',
  outlineLight: 'bg-transparent text-ink border-line hover:border-blue hover:bg-[#f5f1ff] hover:text-blue',
  outlineDark: 'bg-transparent text-white border-[#6575df] hover:border-[#aeb9ff] hover:bg-[#2d3d9b]',
  utilityDark: 'bg-transparent text-[#e3e7ff] border-transparent hover:bg-[#2d3d9b] hover:text-white',
  dangerOutline: 'bg-transparent text-[#ffd0d7] border-[#b95570] hover:border-[#ffd0d7] hover:bg-[#52263f]',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-app border px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/25 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
