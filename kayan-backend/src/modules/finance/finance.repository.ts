import prisma from '../../database/prisma';
import { Prisma } from '@prisma/client';

interface SearchFilters {
  doctorName?: string;
  patientName?: string;
  visitId?: string;
}

export function searchVisits(filters: SearchFilters) {
  const where: Prisma.VisitWhereInput = {};

  if (filters.visitId) where.id = filters.visitId;

  if (filters.doctorName) {
    where.doctor = {
      user: { fullName: { contains: filters.doctorName, mode: 'insensitive' } },
    };
  }

  if (filters.patientName) {
    where.patient = {
      user: { fullName: { contains: filters.patientName, mode: 'insensitive' } },
    };
  }

  return prisma.visit.findMany({
    where,
    include: {
      doctor: { include: { user: true } },
      patient: { include: { user: true } },
      slot: true,
      treatments: true,
    },
    orderBy: { slot: { startTime: 'desc' } },
  });
}
export function getVisitCountsByStatus() {
  return prisma.visit.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
}

export function getCompletedVisitsAmounts() {
  return prisma.visit.findMany({
    where: { status: 'COMPLETED' },
    select: { totalAmount: true },
  });
}

export function getTopDoctorsRaw() {
  return prisma.visit.groupBy({
    by: ['doctorId'],
    _count: { _all: true },
    orderBy: { _count: { doctorId: 'desc' } },
    take: 5,
  });
}

export function findDoctorsByIds(ids: string[]) {
  return prisma.doctor.findMany({
    where: { id: { in: ids } },
    include: { user: true },
  });
}