import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMySlots, cancelSlot } from '../../api/slots.api';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { SlotBoard } from '../../components/ui/SlotBoard';
import { Button } from '../../components/ui/Button';

export default function MySlots() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: slots, isLoading } = useQuery({
    queryKey: ['my-slots'],
    queryFn: getMySlots,
  });

  const cancelMutation = useMutation({
    mutationFn: (slotId: string) => cancelSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-slots'] });
      showToast('Slot cancelled', 'success');
    },
    onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to cancel slot', 'error'),
  });

  return (
    <div>
      <PageHeader title="My available slots" subtitle="Cancel a slot before it gets booked." />

      <SlotBoard
        slots={slots ?? []}
        isLoading={isLoading}
        emptyMessage="No available slots. Generate some from the visits page."
        renderAction={(slot) => (
          <Button
            variant="danger"
            onClick={() => cancelMutation.mutate(slot.id)}
            disabled={cancelMutation.isPending}
            className="px-3 py-1"
          >
            Cancel
          </Button>
        )}
      />
    </div>
  );
}