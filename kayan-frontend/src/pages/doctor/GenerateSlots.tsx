import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateSlots } from '../../api/slots.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export function GenerateSlots() {
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [duration, setDuration] = useState(30);
  const { showToast } = useToast();

 const mutation = useMutation({
  mutationFn: () =>
    generateSlots({ date, startHour, endHour, durationMinutes: duration }),
  onError: (err: any) => showToast(err.response?.data?.message ?? 'Failed to generate slots', 'error'),
});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!date) return;
    mutation.mutate();
  }

  return (
    <Card className="p-5 mb-6">
      <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">
        Generate today's availability
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1.5">Start hour</label>
          <input
            type="number"
            min={0}
            max={23}
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1.5">End hour</label>
          <input
            type="number"
            min={1}
            max={24}
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1.5">Duration (min)</label>
          <input
            type="number"
            min={5}
            max={240}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-lg border border-black/10 bg-canvas text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition"
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Generating...' : 'Generate slots'}
        </Button>
      </form>

  {mutation.isSuccess && (
  <p className="mt-3 text-xs text-teal bg-teal-light inline-block px-3 py-2 rounded-lg">
    {mutation.data.createdCount} new, {mutation.data.reactivatedCount} reactivated.
  </p>
)}
    </Card>
  );
}