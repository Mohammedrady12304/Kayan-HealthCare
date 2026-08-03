import prisma from '../../database/prisma';

export function findAllDoctors() {
  return prisma.doctor.findMany({
    include: { user: true },
  });
}