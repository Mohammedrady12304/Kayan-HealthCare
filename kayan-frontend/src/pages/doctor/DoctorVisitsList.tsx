import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDoctorVisits, startVisit, approveVisit, rejectVisit } from '../../api/visits.api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { GenerateSlots } from './GenerateSlots';

export default function DoctorVisitsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const { data: visits, isLoading } = useQuery({
    queryKey: ['doctor-visits'],
    queryFn: getDoctorVisits,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['doctor-visits'] });

  const startMutation = useMutation({
    mutationFn: (visitId: string) => startVisit(visitId),
    onSuccess: (visit) => {
      invalidate();
      navigate(`/doctor/visit/${visit.id}`);
    },
    onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to start visit', 'error'),
  });

  const approveMutation = useMutation({
    mutationFn: (visitId: string) => approveVisit(visitId),
    onSuccess: invalidate,
    onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to approve', 'error'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ visitId, reason }: { visitId: string; reason: string }) =>
      rejectVisit(visitId, reason),
    onSuccess: () => {
      invalidate();
      setRejectingId(null);
      setReason('');
    },
    onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to reject', 'error'),
  });

  return (
    <div>
      <PageHeader title="My visits" subtitle="Review requests, start visits, and manage your schedule." />

      <GenerateSlots />

      {isLoading && <p className="text-sm text-ink/50">Loading...</p>}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left">
              <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Patient</th>
              <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Time</th>
              <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide">Total</th>
              <th className="px-5 py-3 text-xs font-medium text-ink/50 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody>
            {visits?.map((v) => {
              const canStart = v.startTime ? new Date(v.startTime) <= new Date() : true;

              return (
                <React.Fragment key={v.id}>
                  <tr className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3.5 text-ink font-medium">{v.patient?.fullName}</td>
                    <td className="px-5 py-3.5 text-ink/60 font-mono text-xs">
                      {v.startTime ? new Date(v.startTime).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-ink">${v.totalAmount}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {v.status === 'PENDING' && (
                        <>
                          <Button onClick={() => approveMutation.mutate(v.id)} disabled={approveMutation.isPending}>
                            Approve
                          </Button>
                          <Button variant="danger" onClick={() => setRejectingId(v.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                      {v.status === 'SCHEDULED' &&
                        (canStart ? (
                          <Button onClick={() => startMutation.mutate(v.id)} disabled={startMutation.isPending}>
                            Start visit
                          </Button>
                        ) : (
                          <Button disabled title={`Available at ${new Date(v.startTime!).toLocaleTimeString()}`}>
                            Not yet time
                          </Button>
                        ))}
                      {v.status === 'IN_PROGRESS' && (
                        <Button variant="secondary" onClick={() => navigate(`/doctor/visit/${v.id}`)}>
                          Continue
                        </Button>
                      )}
                    </td>
                  </tr>
                  {rejectingId === v.id && (
                    <tr className="bg-coral-light/30">
                      <td colSpan={5} className="px-5 py-3">
                        <div className="flex gap-2 items-center">
                          <input
                            placeholder="Reason for rejection"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-black/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
                          />
                          <Button
                            variant="danger"
                            disabled={!reason || rejectMutation.isPending}
                            onClick={() => rejectMutation.mutate({ visitId: v.id, reason })}
                          >
                            Confirm reject
                          </Button>
                          <Button variant="secondary" onClick={() => setRejectingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}