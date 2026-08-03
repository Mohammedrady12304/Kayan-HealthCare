export function StatCard({ label, value, accent = 'ink' }: { label: string; value: string | number; accent?: 'ink' | 'teal' | 'amber' }) {
  const accentColor = { ink: 'text-ink', teal: 'text-teal', amber: 'text-amber' }[accent];

  return (
    <div className="bg-surface rounded-2xl border border-black/5 shadow-sm p-5">
      <p className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-2">{label}</p>
      <p className={`font-mono font-semibold text-3xl ${accentColor}`}>{value}</p>
    </div>
  );
}