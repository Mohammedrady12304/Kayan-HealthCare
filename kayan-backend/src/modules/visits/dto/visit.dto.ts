import { Visit, Treatment, Doctor, Patient, User, Slot } from '@prisma/client';
import { toTreatmentDtoList } from './treatment.dto';
import type { TreatmentDto } from './treatment.dto';

type VisitWithRelations = Visit & {
  doctor?: Doctor & { user: User };
  patient?: Patient & { user: User };
  slot?: Slot;
  treatments?: Treatment[];
};

export interface VisitDto {
  id: string;
  status: string;
  totalAmount: number;
  notes: string | null;
  rejectionReason: string | null;
  meetingLink: string | null;
  startTime?: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  doctor?: { fullName: string };
  patient?: { fullName: string };
  treatments?: TreatmentDto[];
}

export function toVisitDto(visit: VisitWithRelations): VisitDto {
  return {
    id: visit.id,
    status: visit.status,
    totalAmount: Number(visit.totalAmount),
    notes: visit.notes,
    rejectionReason: visit.rejectionReason,
    meetingLink: visit.meetingLink,
    startTime: visit.slot?.startTime,
    startedAt: visit.startedAt,
    completedAt: visit.completedAt,
    doctor: visit.doctor ? { fullName: visit.doctor.user.fullName } : undefined,
    patient: visit.patient ? { fullName: visit.patient.user.fullName } : undefined,
    treatments: visit.treatments ? toTreatmentDtoList(visit.treatments) : undefined,
  };
}
export function toVisitDtoList(visits: VisitWithRelations[]): VisitDto[] {
  return visits.map(toVisitDto);
}