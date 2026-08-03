import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyVisits } from '../../api/visits.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function PatientVisitDetails() {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();

 
  const { data: visits, isLoading } = useQuery({
    queryKey: ['my-visits'],
    queryFn: getMyVisits,
  });

  const visit = visits?.find((v) => v.id === visitId);

  if (isLoading) return <p className="text-sm text-ink/50">Loading...</p>;
  if (!visit) return <p className="text-sm text-ink/50">Visit not found.</p>;

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/patient/my-visits')}
        className="text-xs text-ink/50 hover:text-ink mb-4 inline-block"
      >
        ← Back to my visits
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">
            {visit.doctor?.fullName}
          </h1>
          <p className="text-xs text-ink/50 font-mono mt-1">
            {visit.startTime ? new Date(visit.startTime).toLocaleString() : '—'}
          </p>
          <div className="mt-2">
            <StatusBadge status={visit.status} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink/50 uppercase tracking-wide font-mono">Total</p>
          <p className="font-mono font-semibold text-3xl text-teal">${visit.totalAmount}</p>
        </div>
      </div>

      {visit.status === 'IN_PROGRESS' && visit.meetingLink && (
        <Card className="p-5 mb-4 bg-teal-light/40">
          <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">
            Meeting link
          </h2>
          <a
            href={visit.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-lg bg-teal text-white text-xs font-medium hover:bg-teal/90 transition"
          >
            Join visit
          </a>
        </Card>
      )}

      <Card className="p-5 mb-4">
        <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">Treatments</h2>
        {visit.treatments.length === 0 ? (
          <p className="text-sm text-ink/40">No treatments added yet.</p>
        ) : (
          <ul className="space-y-2">
            {visit.treatments.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between text-sm border-b border-black/5 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-ink">{t.name}</span>
                <span className="font-mono text-ink/70">${t.value}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {visit.notes && (
        <Card className="p-5 mb-4">
          <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">
            Doctor's notes
          </h2>
          <p className="text-sm text-ink/70 whitespace-pre-wrap">{visit.notes}</p>
        </Card>
      )}

      {visit.status === 'REJECTED' && visit.rejectionReason && (
        <Card className="p-5">
          <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">
            Rejection reason
          </h2>
          <p className="text-sm text-coral">{visit.rejectionReason}</p>
        </Card>
      )}
    </div>
  );
}