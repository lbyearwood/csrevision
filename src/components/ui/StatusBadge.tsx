const toneClass = {
  green: 'bg-[#e7f7ef] text-green border-[#c7ead8]',
  amber: 'bg-[#fff6dc] text-amber border-[#f4df95]',
  red: 'bg-[#fff0f0] text-danger border-[#ffd0d0]',
  blue: 'bg-[#eaf4ff] text-blue border-[#cfe3ff]',
  neutral: 'bg-mist text-muted border-line',
};

export function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: string | number;
  tone?: keyof typeof toneClass;
}) {
  return (
    <span className={`inline-flex items-center rounded-[6px] border px-2 py-1 text-xs font-semibold ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
