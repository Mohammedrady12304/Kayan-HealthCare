import type { VisitStatus } from '../../types';

const STATUS_STYLES: Record<VisitStatus, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-amber-light', text: 'text-amber', label: 'Pending' },
  SCHEDULED: { bg: 'bg-slate-light', text: 'text-slate', label: 'Scheduled' },
  IN_PROGRESS: { bg: 'bg-amber-light', text: 'text-amber', label: 'In Progress' },
  COMPLETED: { bg: 'bg-teal-light', text: 'text-teal', label: 'Completed' },
  CANCELLED: { bg: 'bg-coral-light', text: 'text-coral', label: 'Cancelled' },
  REJECTED: { bg: 'bg-coral-light', text: 'text-coral', label: 'Rejected' },
};

export function StatusBadge({ status }: { status: VisitStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-mono uppercase tracking-wide ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}