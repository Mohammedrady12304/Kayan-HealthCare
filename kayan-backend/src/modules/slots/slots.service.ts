import { ApiError } from '../../common/utils/ApiError';
import * as slotsRepo from './slots.repository';
import { toSlotDtoList } from './dto';

export async function generateSlots(
  doctorId: string,
  date: Date,
  startHour: number,
  endHour: number,
  durationMinutes: number
) {
  if (startHour >= endHour) {
    throw new ApiError(400, 'startHour must be before endHour');
  }

  const startTimes: Date[] = [];
  const cursor = new Date(date);
  cursor.setHours(startHour, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(endHour, 0, 0, 0);

  while (cursor < dayEnd) {
    startTimes.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + durationMinutes);
  }

  const now = new Date();
  const futureStartTimes = startTimes.filter((t) => t > now);

  if (futureStartTimes.length === 0) {
    throw new ApiError(400, 'All selected times have already passed. Choose a future date or time.');
  }

  const result = await slotsRepo.createManySlots(doctorId, futureStartTimes);
  return result; 
}
export async function listAvailableSlots(doctorId: string) {
  const slots = await slotsRepo.findAvailableSlotsByDoctor(doctorId);
  return toSlotDtoList(slots);
}

export async function getMySlots(doctorId: string) {
  const slots = await slotsRepo.findMyAvailableSlots(doctorId);
  return toSlotDtoList(slots);
}

export async function cancelSlot(doctorId: string, slotId: string) {
  const cancelled = await slotsRepo.cancelSlotIfAvailable(doctorId, slotId);
  if (!cancelled) {
    throw new ApiError(409, 'This slot cannot be cancelled — it may already be booked or expired');
  }
}