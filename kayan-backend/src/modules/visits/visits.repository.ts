import prisma from '../../database/prisma';
import { VisitStatus } from '@prisma/client';

export function findActiveVisitByDoctor(doctorId: string) {
  return prisma.visit.findFirst({
    where: { doctorId, status: VisitStatus.IN_PROGRESS },
  });
}

export function findVisitById(visitId: string) {
  return prisma.visit.findUnique({ where: { id: visitId } });
}

export function createVisit(data: { patientId: string; doctorId: string; slotId: string }) {
  return prisma.visit.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      slotId: data.slotId,
      status: VisitStatus.PENDING,
    },
  });
}
export function updateVisitStatus(
  visitId: string,
  data: Partial<{
    status: VisitStatus;
    startedAt: Date;
    completedAt: Date;
    notes: string | undefined;
    rejectionReason: string | undefined;
    meetingLink: string | undefined;
  }>
) {
  return prisma.visit.update({ where: { id: visitId }, data });
}

export function findVisitsByPatient(patientId: string) {
  return prisma.visit.findMany({
    where: { patientId },
    include: {
      doctor: { include: { user: true } },
      slot: true,
      treatments: true,
    },
    orderBy: { slot: { startTime: 'desc' } },
  });
}

export function findVisitsByDoctor(doctorId: string) {
  return prisma.visit.findMany({
    where: { doctorId },
    include: {
      patient: { include: { user: true } },
      slot: true,
      treatments: true,
    },
    orderBy: { slot: { startTime: 'desc' } },
  });
}

export async function addTreatmentAndRecalculate(visitId: string, name: string, value: number) {
  return prisma.$transaction(async (tx) => {
    await tx.treatment.create({ data: { visitId, name, value } });

    const aggregate = await tx.treatment.aggregate({
      where: { visitId },
      _sum: { value: true },
    });

    return tx.visit.update({
      where: { id: visitId },
      data: { totalAmount: aggregate._sum.value ?? 0 },
      include: { treatments: true },
    });
  });
}

export function findVisitByIdWithDetails(visitId: string) {
  return prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      doctor: { include: { user: true } },
      patient: { include: { user: true } },
      slot: true,
      treatments: true,
    },
  });
}
export function findPendingVisitByPatient(patientId: string) {
  return prisma.visit.findFirst({
    where: { patientId, status: VisitStatus.PENDING },
  });
}

export function findTreatmentById(treatmentId: string) {
  return prisma.treatment.findUnique({ where: { id: treatmentId } });
}

export async function updateTreatmentAndRecalculate(
  visitId: string,
  treatmentId: string,
  name: string,
  value: number
) {
  return prisma.$transaction(async (tx) => {
    await tx.treatment.update({ where: { id: treatmentId }, data: { name, value } });

    const aggregate = await tx.treatment.aggregate({
      where: { visitId },
      _sum: { value: true },
    });

    return tx.visit.update({
      where: { id: visitId },
      data: { totalAmount: aggregate._sum.value ?? 0 },
      include: { treatments: true },
    });
  });
}

export async function deleteTreatmentAndRecalculate(visitId: string, treatmentId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.treatment.delete({ where: { id: treatmentId } });

    const aggregate = await tx.treatment.aggregate({
      where: { visitId },
      _sum: { value: true },
    });

    return tx.visit.update({
      where: { id: visitId },
      data: { totalAmount: aggregate._sum.value ?? 0 },
      include: { treatments: true },
    });
  });
}