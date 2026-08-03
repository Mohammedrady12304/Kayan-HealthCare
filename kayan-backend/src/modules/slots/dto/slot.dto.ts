import { Slot } from '@prisma/client';

export interface SlotDto {
  id: string;
  startTime: Date;
  status: string;
}

export function toSlotDto(slot: Slot): SlotDto {
  return { id: slot.id, startTime: slot.startTime, status: slot.status };
}

export function toSlotDtoList(slots: Slot[]): SlotDto[] {
  return slots.map(toSlotDto);
}