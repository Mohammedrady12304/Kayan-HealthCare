export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display font-semibold text-2xl text-ink">{title}</h1>
      {subtitle && <p className="text-sm text-ink/50 mt-1">{subtitle}</p>}
    </div>
  );
}