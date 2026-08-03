import { useState } from 'react';
import type {FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { searchVisits } from '../../api/finance.api';
import type { Visit } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function FinanceSearchPage() {
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [visitId, setVisitId] = useState('');
  const [results, setResults] = useState<Visit[]>([]);
  const [searched, setSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: searchVisits,
    onSuccess: (data) => {
      setResults(data);
      setSearched(true);
    },
  });

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    searchMutation.mutate({
      doctorName: doctorName || undefined,
      patientName: patientName || undefined,
      visitId: visitId || undefined,
    });
  }

  return (
    <div>
      <PageHeader title="Search visits" subtitle="Filter by doctor, patient, or visit ID — combine any of them." />

      <Card className="p-5 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-ink/70 mb-1.5">Doctor name</label>
            <input
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-ink/70 mb-1.5">Patient name</label>
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-ink/70 mb-1.5">Visit ID</label>
            <input
              value={visitId}
              onChange={(e) => setVisitId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
            />
          </div>
          <Button type="submit" disabled={searchMutation.isPending}>
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Card>

      {searched && results.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink/50">No visits match these filters.</p>
        </Card>
      )}

      {results.length > 0 && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left">
                <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Visit ID</th>
                <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Doctor</th>
                <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Patient</th>
                <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((v) => (
                <tr key={v.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/50">{v.id.slice(0, 8)}…</td>
                  <td className="px-5 py-3.5 text-ink font-medium">{v.doctor?.fullName}</td>
                  <td className="px-5 py-3.5 text-ink">{v.patient?.fullName}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-5 py-3.5 font-mono text-ink">${v.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}