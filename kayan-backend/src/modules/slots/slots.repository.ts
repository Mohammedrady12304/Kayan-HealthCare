import prisma from '../../database/prisma';
import { SlotStatus } from '@prisma/client';

export async function createManySlots(doctorId: string, startTimes: Date[]) {
  const existing = await prisma.slot.findMany({
    where: { doctorId, startTime: { in: startTimes } },
  });
  const existingMap = new Map(existing.map((s) => [s.startTime.getTime(), s]));

  let createdCount = 0;
  let reactivatedCount = 0;

  for (const startTime of startTimes) {
    const found = existingMap.get(startTime.getTime());

    if (!found) {
      await prisma.slot.create({ data: { doctorId, startTime, status: SlotStatus.AVAILABLE } });
      createdCount++;
    } else if (found.status === SlotStatus.CANCELLED || found.status === SlotStatus.EXPIRED) {
      await prisma.slot.update({ where: { id: found.id }, data: { status: SlotStatus.AVAILABLE } });
      reactivatedCount++;
    }
    
  }

  return { createdCount, reactivatedCount };
}

export function findSlotById(slotId: string) {
  return prisma.slot.findUnique({ where: { id: slotId } });
}



export async function findAvailableSlotsByDoctor(doctorId: string) {
  await prisma.slot.updateMany({
    where: { doctorId, status: SlotStatus.AVAILABLE, startTime: { lt: new Date() } },
    data: { status: SlotStatus.EXPIRED },
  });

  return prisma.slot.findMany({
    where: { doctorId, status: SlotStatus.AVAILABLE, startTime: { gt: new Date() } },
    orderBy: { startTime: 'asc' },
  });
}


export async function reserveSlotIfAvailable(slotId: string) {
  const result = await prisma.slot.updateMany({
    where: { id: slotId, status: SlotStatus.AVAILABLE },
    data: { status: SlotStatus.RESERVED },
  });
  return result.count === 1; 
}

export function releaseSlot(slotId: string) {

  return prisma.slot.findUnique({ where: { id: slotId } }).then((slot) => {
    if (!slot) return null;
    const newStatus = slot.startTime > new Date() ? SlotStatus.AVAILABLE : SlotStatus.EXPIRED;
    return prisma.slot.update({ where: { id: slotId }, data: { status: newStatus } });
  });
}


export function findPatientVisitAtTime(patientId: string, startTime: Date) {
  return prisma.visit.findFirst({
    where: {
      patientId,
      status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS'] },
      slot: { startTime },
    },
  });
}

export async function findMyAvailableSlots(doctorId: string) {
  await prisma.slot.updateMany({
    where: { doctorId, status: SlotStatus.AVAILABLE, startTime: { lt: new Date() } },
    data: { status: SlotStatus.EXPIRED },
  });

  return prisma.slot.findMany({
    where: { doctorId, status: SlotStatus.AVAILABLE },
    orderBy: { startTime: 'asc' },
  });
}

export async function cancelSlotIfAvailable(doctorId: string, slotId: string) {
  const result = await prisma.slot.updateMany({
    where: { id: slotId, doctorId, status: SlotStatus.AVAILABLE },
    data: { status: SlotStatus.CANCELLED },
  });
  return result.count === 1;
}