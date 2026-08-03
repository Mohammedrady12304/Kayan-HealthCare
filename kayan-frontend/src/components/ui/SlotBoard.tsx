import { useState, useMemo } from 'react';
import type { Slot } from '../../api/slots.api';
import { Card } from './Card';

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

interface Props {
  slots: Slot[];
  isLoading: boolean;
  renderAction: (slot: Slot) => React.ReactNode;
  emptyMessage?: string;
}

export function SlotBoard({ slots, isLoading, renderAction, emptyMessage }: Props) {
  const [page, setPage] = useState(0);

  const groupedSlots = useMemo(() => groupSlotsByDate(slots), [slots]);
  const dateKeys = Object.keys(groupedSlots);
  const totalPages = Math.ceil(dateKeys.length / SLOTS_PER_PAGE);
  const visibleDateKeys = dateKeys.slice(page * SLOTS_PER_PAGE, (page + 1) * SLOTS_PER_PAGE);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-ink/50 uppercase tracking-wide">Available times</h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-7 h-7 rounded-lg border border-black/10 text-ink/60 text-xs disabled:opacity-30 hover:bg-canvas transition"
            >
              ‹
            </button>
            <span className="text-xs font-mono text-ink/50">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-7 h-7 rounded-lg border border-black/10 text-ink/60 text-xs disabled:opacity-30 hover:bg-canvas transition"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {isLoading && <p className="text-sm text-ink/50">Loading...</p>}
      {!isLoading && dateKeys.length === 0 && (
        <p className="text-sm text-ink/40">{emptyMessage ?? 'No slots to show.'}</p>
      )}

      <div className="space-y-5">
        {visibleDateKeys.map((dateKey) => (
          <div key={dateKey}>
            <p className="text-xs font-mono text-ink/50 mb-2 uppercase tracking-wide">
              {new Date(dateKey).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {groupedSlots[dateKey].map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 bg-canvas"
                >
                  <span className="text-sm font-mono text-ink">
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {renderAction(slot)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}