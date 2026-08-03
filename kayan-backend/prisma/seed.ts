import { PrismaClient, Role, VisitStatus, SlotStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

 
  await prisma.treatment.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.finance.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456Bb!@#', 10);

  // ==========================
  // Doctor
  // ==========================

  const doctorUser = await prisma.user.create({
    data: {
      fullName: 'Dr. Ahmed Mohamed',
      email: 'doctor@test.com',
      passwordHash,
      role: Role.DOCTOR,
    },
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      specialty: 'Cardiology',
    },
  });

  // ==========================
  // Finance
  // ==========================

  const financeUser = await prisma.user.create({
    data: {
      fullName: 'Finance User',
      email: 'finance@test.com',
      passwordHash,
      role: Role.FINANCE,
    },
  });

  await prisma.finance.create({
    data: {
      userId: financeUser.id,
    },
  });

  // ==========================
  // Patients
  // ==========================

  const patients = [];

  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        fullName: `Patient ${i}`,
        email: `patient${i}@test.com`,
        passwordHash,
        role: Role.PATIENT,
      },
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
      },
    });

    patients.push(patient);
  }

  // ==========================
  // Slots
  // ==========================

  const slots = [];

  for (let i = 0; i < 10; i++) {
    const slot = await prisma.slot.create({
      data: {
        doctorId: doctor.id,
        startTime: new Date(Date.now() + i * 60 * 60 * 1000),
        status: SlotStatus.AVAILABLE,
      },
    });

    slots.push(slot);
  }

  // ==========================
  // Pending Visit
  // ==========================

  await prisma.visit.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctor.id,
      slotId: slots[0].id,
      status: VisitStatus.PENDING,
    },
  });

  // ==========================
  // Scheduled Visit
  // ==========================

  await prisma.visit.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctor.id,
      slotId: slots[1].id,
      status: VisitStatus.SCHEDULED,
      meetingLink: 'https://meet.google.com/test',
    },
  });

  // ==========================
  // In Progress Visit
  // ==========================

  await prisma.visit.create({
    data: {
      patientId: patients[2].id,
      doctorId: doctor.id,
      slotId: slots[2].id,
      status: VisitStatus.IN_PROGRESS,
      startedAt: new Date(),
      meetingLink: 'https://meet.google.com/live',
    },
  });

  // ==========================
  // Completed Visit
  // ==========================

  const completedVisit = await prisma.visit.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctor.id,
      slotId: slots[3].id,
      status: VisitStatus.COMPLETED,
      startedAt: new Date(Date.now() - 1000 * 60 * 30),
      completedAt: new Date(),
      totalAmount: 500,
      notes: 'Patient is doing well.',
    },
  });

  await prisma.treatment.createMany({
    data: [
      {
        visitId: completedVisit.id,
        name: 'ECG',
        value: 250,
      },
      {
        visitId: completedVisit.id,
        name: 'Medication',
        value: 250,
      },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });