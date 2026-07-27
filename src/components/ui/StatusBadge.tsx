const toneClass = {
  green: { text: 'text-green', dot: 'bg-green' },
  amber: { text: 'text-amber', dot: 'bg-amber' },
  red: { text: 'text-danger', dot: 'bg-danger' },
  blue: { text: 'text-blue', dot: 'bg-blue' },
  neutral: { text: 'text-muted', dot: 'bg-muted' },
};

export function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: string | number;
  tone?: keyof typeof toneClass;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${toneClass[tone].text}`}>
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${toneClass[tone].dot}`} />
      {children}
    </span>
  );
}
