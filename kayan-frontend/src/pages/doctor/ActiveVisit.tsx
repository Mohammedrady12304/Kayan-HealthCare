import { useState } from 'react';
import type {FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorVisits, addTreatment, completeVisit } from '../../api/visits.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { updateTreatment, deleteTreatment } from '../../api/visits.api';

import { setMeetingLink } from '../../api/visits.api';


export default function ActiveVisit() {

  const [meetingLinkInput, setMeetingLinkInput] = useState('');  
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
const [editName, setEditName] = useState('');
const [editValue, setEditValue] = useState('');
  
  const { data: visits, isLoading } = useQuery({
    queryKey: ['doctor-visits'], //اسم ال cache
    queryFn: getDoctorVisits,
  });
  
  const visit = visits?.find((v) => v.id === visitId);
  
  const addTreatmentMutation = useMutation({
    mutationFn: () => addTreatment(visitId!, name, Number(value)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-visits'] });
      setName('');
      setValue('');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message ?? 'Failed to add treatment', 'error');
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => completeVisit(visitId!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-visits'] });
      navigate('/doctor');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message ?? 'Failed to complete visit', 'error');
    },
  });

  const updateMutation = useMutation({
  mutationFn: ({ treatmentId, name, value }: { treatmentId: string; name: string; value: number }) =>
    updateTreatment(visitId!, treatmentId, name, value),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['doctor-visits'] });
    setEditingId(null);
    showToast('Treatment updated', 'success');
  },
  onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to update treatment', 'error'),
});

const deleteMutation = useMutation({
  mutationFn: (treatmentId: string) => deleteTreatment(visitId!, treatmentId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['doctor-visits'] });
    showToast('Treatment removed', 'success');
  },
  onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to delete treatment', 'error'),
});


const meetingLinkMutation = useMutation({
  mutationFn: (link: string) => setMeetingLink(visitId!, link),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['doctor-visits'] });
    showToast('Meeting link saved', 'success');
  },
  onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to save link', 'error'),
});
function handleAddTreatment(e: FormEvent) {
    e.preventDefault();//ميعملش refresh
    if (!name || !value) return;
    addTreatmentMutation.mutate();
  }
  

  if (isLoading) return <p className="text-sm text-ink/50">Loading...</p>;
  if (!visit) return <p className="text-sm text-ink/50">Visit not found.</p>;



function startEditing(treatmentId: string, currentName: string, currentValue: number) {
  setEditingId(treatmentId);
  setEditName(currentName);
  setEditValue(String(currentValue));
}
  return (
    
    <div className="max-w-2xl">
      <Card className="p-5 mb-4 bg-teal-light/40">
  <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">
    Meeting link
  </h2>
  <div className="flex gap-2">
    <input
      placeholder="https://meet.google.com/..."
      defaultValue={visit.meetingLink ?? ''}
      onChange={(e) => setMeetingLinkInput(e.target.value)}
      className="flex-1 px-3 py-2 rounded-lg border border-black/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
    />
    <Button
      onClick={() => meetingLinkMutation.mutate(meetingLinkInput || visit.meetingLink!)}
      disabled={meetingLinkMutation.isPending || (!meetingLinkInput && !visit.meetingLink)}
    >
      {visit.meetingLink ? 'Update' : 'Save'}
    </Button>
  </div>
</Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">
            {visit.patient?.fullName}
          </h1>
          <div className="mt-2">
            <StatusBadge status={visit.status} />
          </div>
        </div>
        {/* الإجمالي بارز في أعلى الشاشة، مش مدفون في الجدول — أهم رقم في الصفحة دي */}
        <div className="text-right">
          <p className="text-xs text-ink/50 uppercase tracking-wide font-mono">Total</p>
          <p className="font-mono font-semibold text-3xl text-teal">${visit.totalAmount}</p>
        </div>
      </div>

      {/* قائمة العلاجات */}
      <Card className="p-5 mb-4">
        <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">Treatments</h2>
        {visit.treatments.length === 0 ? (
  <p className="text-sm text-ink/40">No treatments added yet.</p>
) : (
  <ul className="space-y-2 mb-4">
    {visit.treatments.map((t) =>
      editingId === t.id ? (
        <li key={t.id} className="flex gap-2 items-center pb-2">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg border border-black/10 bg-canvas text-sm"
          />
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-24 px-2 py-1.5 rounded-lg border border-black/10 bg-canvas text-sm font-mono"
          />
          <Button
            onClick={() =>
              updateMutation.mutate({ treatmentId: t.id, name: editName, value: Number(editValue) })
            }
            disabled={updateMutation.isPending}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={() => setEditingId(null)}>
            Cancel
          </Button>
        </li>
      ) : (
        <li
          key={t.id}
          className="flex items-center justify-between text-sm border-b border-black/5 pb-2 last:border-0 last:pb-0"
        >
          <span className="text-ink">{t.name}</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-ink/70">${t.value}</span>
            <button
              onClick={() => startEditing(t.id, t.name, t.value)}
              className="text-xs text-slate hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => deleteMutation.mutate(t.id)}
              disabled={deleteMutation.isPending}
              className="text-xs text-coral hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      )
    )}
  </ul>
)}

        <form onSubmit={handleAddTreatment} className="flex gap-2 pt-2">
          <input
            placeholder="Treatment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
          />
          <input
            placeholder="Value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-28 px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
          />
          <Button type="submit" disabled={addTreatmentMutation.isPending}>
            Add
          </Button>
        </form>
      </Card>

      {/* الملاحظات الطبية + إنهاء الزيارة */}
      <Card className="p-5">
        <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">Medical notes</h2>
        <textarea
          placeholder="Write your notes about this visit..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-black/10 bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition resize-none mb-4"
        />
        <Button onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending}>
          {completeMutation.isPending ? 'Completing...' : 'Complete visit'}
        </Button>
      </Card>
    </div>
  );
}