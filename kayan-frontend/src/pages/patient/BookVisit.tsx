import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctors } from '../../api/doctors.api';
import { getAvailableSlots, type Slot } from '../../api/slots.api';
import { requestVisit } from '../../api/visits.api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SlotBoard } from '../../components/ui/SlotBoard';

const SLOTS_PER_PAGE = 6;

function groupSlotsByDate(slots: Slot[]) {
  const groups: Record<string, Slot[]> = {};
  for (const slot of slots) {
    const dateKey = new Date(slot.startTime).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(slot);
  }
  return groups;
}

export default function BookVisit() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['available-slots', selectedDoctorId],
    queryFn: () => getAvailableSlots(selectedDoctorId!),
    enabled: !!selectedDoctorId,
  });

  const groupedSlots = useMemo(() => groupSlotsByDate(slots ?? []), [slots]);
  const dateKeys = Object.keys(groupedSlots);
  const totalPages = Math.ceil(dateKeys.length / SLOTS_PER_PAGE);
  const visibleDateKeys = dateKeys.slice(page * SLOTS_PER_PAGE, (page + 1) * SLOTS_PER_PAGE);

  const mutation = useMutation({
    mutationFn: (slotId: string) => requestVisit(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-visits'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots', selectedDoctorId] });
      showToast('Visit requested — waiting for doctor approval.', 'success');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message ?? 'Failed to request visit', 'error');
    },
  });

  function handleSelectDoctor(doctorId: string) {
    setSelectedDoctorId(doctorId);
    setPage(0); 
    }

  return (
    <div>
      <PageHeader title="Book a visit" subtitle="Choose a doctor, then pick an available time." />

      {doctorsLoading && <p className="text-sm text-ink/50">Loading doctors...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {doctors?.map((doc) => (
          <Card
            key={doc.id}
            onClick={() => handleSelectDoctor(doc.id)}
            className={`p-5 cursor-pointer transition ${
              selectedDoctorId === doc.id ? 'ring-2 ring-teal' : 'hover:border-teal/40'
            }`}
          >
            <p className="font-medium text-ink text-sm">{doc.fullName}</p>
            <p className="text-xs text-ink/50 mt-0.5 font-mono uppercase tracking-wide">
              {doc.specialty ?? 'General'}
            </p>
          </Card>
        ))}
      </div>

    {selectedDoctorId && (
  <SlotBoard
    slots={slots ?? []}
    isLoading={slotsLoading}
    emptyMessage="No available slots for this doctor right now."
    renderAction={(slot) => (
      <Button onClick={() => mutation.mutate(slot.id)} disabled={mutation.isPending} className="px-3 py-1">
        Book
      </Button>
    )}
  />
)}
    </div>
  );
}