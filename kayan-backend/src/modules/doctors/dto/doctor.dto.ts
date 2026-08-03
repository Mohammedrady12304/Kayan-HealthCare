import { Doctor, User } from '@prisma/client';

type DoctorWithUser = Doctor & { user: User };

export interface DoctorDto {
  id: string;
  fullName: string;
  specialty: string | null;
}

export function toDoctorDto(doctor: DoctorWithUser): DoctorDto {
  return {
    id: doctor.id,
    fullName: doctor.user.fullName,
    specialty: doctor.specialty,
  };
}

export function toDoctorDtoList(doctors: DoctorWithUser[]): DoctorDto[] {
  return doctors.map(toDoctorDto);
}