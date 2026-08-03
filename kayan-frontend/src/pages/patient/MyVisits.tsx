import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyVisits, cancelVisit } from '../../api/visits.api';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function MyVisits() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: visits, isLoading } = useQuery({
    queryKey: ['my-visits'],
    queryFn: getMyVisits,
  });

  const cancelMutation = useMutation({
    mutationFn: (visitId: string) => cancelVisit(visitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-visits'] }),
    onError: (err: any) => {
      showToast(err.response?.data?.message ?? 'Failed to cancel', 'error');
    },
  });

  const { showToast } = useToast();

  return (
    <div>
      <PageHeader title="My visits" subtitle="A record of your appointments and treatments." />

      {isLoading && <p className="text-sm text-ink/50">Loading...</p>}

      {!isLoading && visits?.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink/50">No visits yet. Book one to get started.</p>
        </Card>
      )}

      <div className="space-y-3">
        {visits?.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink text-sm">{v.doctor?.fullName}</p>
                <p className="text-xs text-ink/50 font-mono mt-0.5">
                  {v.startTime ? new Date(v.startTime).toLocaleString() : '—'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-ink">${v.totalAmount}</span>
                <StatusBadge status={v.status} />



  <Button variant="secondary" onClick={() => navigate(`/patient/visit/${v.id}`)}>
    View details
  </Button>
  {v.status === 'PENDING' && (
    <Button
      variant="danger"
      onClick={() => cancelMutation.mutate(v.id)}
      disabled={cancelMutation.isPending}
    >
      Cancel
    </Button>
  )}




                
              </div>
            </div>
              {v.status === 'IN_PROGRESS' && v.meetingLink && (
  <a
    href={v.meetingLink}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-3 px-4 py-2 rounded-lg bg-teal text-white text-xs font-medium hover:bg-teal/90 transition"
  >
    Join visit
  </a>
)}

            {v.status === 'REJECTED' && v.rejectionReason && (
              <p className="mt-3 text-xs text-coral bg-coral-light px-3 py-2 rounded-lg">
                Rejected: {v.rejectionReason}
              </p>
            )}

            {v.treatments.length > 0 && (
              <p className="mt-3 text-xs text-ink/50">
                Treatments: {v.treatments.map((t) => t.name).join(', ')}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}