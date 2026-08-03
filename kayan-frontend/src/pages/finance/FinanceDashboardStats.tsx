import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/finance.api';

export default function FinanceDashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading || !data) return <p>Loading dashboard...</p>;

  return (
    <div style={{ marginBottom: 30 }}>
      <h3>Overview</h3>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <StatCard label="Total Visits" value={data.totalVisits} />
        <StatCard label="Total Revenue" value={data.totalRevenue.toFixed(2)} />
        <StatCard label="Avg. Visit Value" value={data.averageVisitValue.toFixed(2)} />
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        <div>
          <h4>Visits by Status</h4>
          <ul>
            {data.visitsByStatus.map((s) => (
              <li key={s.status}>
                {s.status}: {s.count}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Top Doctors</h4>
          <ul>
            {data.topDoctors.map((d) => (
              <li key={d.doctorName}>
                {d.doctorName}: {d.visitsCount} visits
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        minWidth: 150,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#666' }}>{label}</div>
    </div>
  );
}