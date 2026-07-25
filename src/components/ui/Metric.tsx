export function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  tone?: 'default' | 'green' | 'red' | 'blue';
}) {
  const toneClass = {
    default: 'text-white',
    green: 'text-green',
    red: 'text-danger',
    blue: 'text-blue',
  }[tone];

  return (
    <div className="min-w-0 border-r border-[#2a3a50] px-3 py-2 last:border-r-0">
      <p className="text-xs font-medium text-[#b8c8d9]">{label}</p>
      <p className={`mt-1 whitespace-nowrap text-2xl font-bold tracking-normal ${toneClass}`}>{value}</p>
    </div>
  );
}
