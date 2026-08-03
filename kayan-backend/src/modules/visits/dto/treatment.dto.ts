import { Treatment } from '@prisma/client';

export interface TreatmentDto {
  id: string;
  name: string;
  value: number;
}

export function toTreatmentDto(treatment: Treatment): TreatmentDto {
  return {
    id: treatment.id,
    name: treatment.name,
    value: Number(treatment.value),
  };
}

export function toTreatmentDtoList(treatments: Treatment[]): TreatmentDto[] {
  return treatments.map(toTreatmentDto);
}