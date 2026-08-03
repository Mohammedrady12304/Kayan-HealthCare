import prisma from '../../database/prisma';
import { Role } from '@prisma/client';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserByEmailWithProfile(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { patient: true, doctor: true, finance: true },
  });
}

export async function createUserWithProfile(data: {
  fullName: string;
  email: string;
  passwordHash: string;
  role: Role;
  specialty?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });

    if (data.role === Role.PATIENT) {
      await tx.patient.create({ data: { userId: user.id } });
    } else if (data.role === Role.DOCTOR) {
      await tx.doctor.create({ data: { userId: user.id, specialty: data.specialty ?? null } });
    } else if (data.role === Role.FINANCE) {
      await tx.finance.create({ data: { userId: user.id } });
    }

    return user;
  });
}