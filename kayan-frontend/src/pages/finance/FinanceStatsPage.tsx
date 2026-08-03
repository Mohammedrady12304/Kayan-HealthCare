import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/finance.api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';

export default function FinanceStatsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading || !data) return <p className="text-sm text-ink/50">Loading dashboard...</p>;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A snapshot of visits and revenue across the clinic." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total visits" value={data.totalVisits} />
        <StatCard label="Total revenue" value={`$${data.totalRevenue.toFixed(2)}`} accent="teal" />
        <StatCard label="Avg. visit value" value={`$${data.averageVisitValue.toFixed(2)}`} accent="amber" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-4">Visits by status</h2>
          <ul className="space-y-3">
            {data.visitsByStatus.map((s) => (
              <li key={s.status} className="flex items-center justify-between text-sm">
                <span className="text-ink/70">{s.status}</span>
                <span className="font-mono font-medium text-ink">{s.count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-4">Top doctors</h2>
          <ul className="space-y-3">
            {data.topDoctors.map((d) => (
              <li key={d.doctorName} className="flex items-center justify-between text-sm">
                <span className="text-ink/70">{d.doctorName}</span>
                <span className="font-mono font-medium text-ink">{d.visitsCount} visits</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}