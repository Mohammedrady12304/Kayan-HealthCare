export type Role = 'PATIENT' | 'DOCTOR' | 'FINANCE';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export type VisitStatus =
  | 'PENDING'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';


export interface Treatment {
  id: string;
  name: string;
  value: number;
}

export interface Visit {
  id: string;
  status: VisitStatus;
  totalAmount: number;
  notes?: string;
  rejectionReason?: string;
  meetingLink?: string;
  startTime?: string;
  startedAt?: string;
  completedAt?: string;
  doctor?: { fullName: string };
  patient?: { fullName: string };
  treatments: Treatment[];
}
