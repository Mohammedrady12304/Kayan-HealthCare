import { ApiError } from '../../common/utils/ApiError';
import { VisitStatus } from '@prisma/client';
import * as visitsRepo from './visits.repository';
import * as slotsRepo from '../slots/slots.repository';
import { toVisitDto, toVisitDtoList } from './dto';

export async function requestVisit(patientId: string, slotId: string) {
  const slot = await slotsRepo.findSlotById(slotId);
  if (!slot) throw new ApiError(404, 'Slot not found');
  if (slot.startTime < new Date()) throw new ApiError(400, 'This slot has already passed');

  const pendingVisit = await visitsRepo.findPendingVisitByPatient(patientId);
  if (pendingVisit) {
    throw new ApiError(409, 'You already have a pending visit request. Wait for a response or cancel it first.');
  }
 const conflict = await slotsRepo.findPatientVisitAtTime(patientId, slot.startTime);
  if (conflict) {
    throw new ApiError(409, 'You already have a visit request at this time');
  }

  const reserved = await slotsRepo.reserveSlotIfAvailable(slotId);
  if (!reserved) {
    throw new ApiError(409, 'This slot is no longer available');
  }

  try {
    const visit = await visitsRepo.createVisit({ patientId, doctorId: slot.doctorId, slotId });
    const fullVisit = await visitsRepo.findVisitByIdWithDetails(visit.id);
    return toVisitDto(fullVisit!);
  } catch (err) {
    await slotsRepo.releaseSlot(slotId);
    throw err;
  }
}
export async function approveVisit(doctorId: string, visitId: string) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.PENDING) {
    throw new ApiError(400, 'Only a pending visit can be approved');
  }
  

    await visitsRepo.updateVisitStatus(visitId, { status: VisitStatus.SCHEDULED });
  const fullVisit = await visitsRepo.findVisitByIdWithDetails(visitId);
  return toVisitDto(fullVisit!);
}

export async function rejectVisit(doctorId: string, visitId: string, reason: string) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.PENDING) {
    throw new ApiError(400, 'Only a pending visit can be rejected');
  }

  const updated = await visitsRepo.updateVisitStatus(visitId, {
    status: VisitStatus.REJECTED,
    rejectionReason: reason,
  });
  await slotsRepo.releaseSlot(visit.slotId);

  return toVisitDto(updated);
}

export async function cancelVisit(patientId: string, visitId: string) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.patientId !== patientId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.PENDING) {
    throw new ApiError(400, 'Only a pending visit can be cancelled');
  }

  const updated = await visitsRepo.updateVisitStatus(visitId, { status: VisitStatus.CANCELLED });
  await slotsRepo.releaseSlot(visit.slotId);

  return toVisitDto(updated);
}

export async function startVisit(doctorId: string, visitId: string) {
  const activeVisit = await visitsRepo.findActiveVisitByDoctor(doctorId);
  if (activeVisit) throw new ApiError(409, 'You already have an active visit in progress');

  const visit = await visitsRepo.findVisitByIdWithDetails(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.SCHEDULED) {
    throw new ApiError(400, `Cannot start a visit with status ${visit.status}`);
  }

  if (visit.slot.startTime > new Date()) {
    throw new ApiError(400, 'Cannot start a visit before its scheduled time');
  }

  const updated = await visitsRepo.updateVisitStatus(visitId, {
    status: VisitStatus.IN_PROGRESS,
    startedAt: new Date(),
  });
  const fullVisit = await visitsRepo.findVisitByIdWithDetails(visitId);
  return toVisitDto(fullVisit!);
}

export async function addTreatment(doctorId: string, visitId: string, name: string, value: number) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.IN_PROGRESS) {
    throw new ApiError(400, 'Can only add treatments to a visit in progress');
  }

  const updated = await visitsRepo.addTreatmentAndRecalculate(visitId, name, value);
  return toVisitDto(updated);
}

export async function completeVisit(doctorId: string, visitId: string, notes?: string) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.IN_PROGRESS) {
    throw new ApiError(400, 'Only a visit in progress can be completed');
  }

  const updated = await visitsRepo.updateVisitStatus(visitId, {
    status: VisitStatus.COMPLETED,
    completedAt: new Date(),
    notes,
  });
  return toVisitDto(updated);
}

export async function getPatientVisits(patientId: string) {
  const visits = await visitsRepo.findVisitsByPatient(patientId);
  return toVisitDtoList(visits);
}

export async function getDoctorVisits(doctorId: string) {
  const visits = await visitsRepo.findVisitsByDoctor(doctorId);
  return toVisitDtoList(visits);
}
export async function updateTreatment(
  doctorId: string,
  visitId: string,
  treatmentId: string,
  name: string,
  value: number
) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.IN_PROGRESS) {
    throw new ApiError(400, 'Can only edit treatments while the visit is in progress');
  }

  const treatment = await visitsRepo.findTreatmentById(treatmentId);
  if (!treatment || treatment.visitId !== visitId) {
    throw new ApiError(404, 'Treatment not found on this visit');
  }

  const updated = await visitsRepo.updateTreatmentAndRecalculate(visitId, treatmentId, name, value);
  const fullVisit = await visitsRepo.findVisitByIdWithDetails(updated.id);
  return toVisitDto(fullVisit!);
}

export async function deleteTreatment(doctorId: string, visitId: string, treatmentId: string) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.IN_PROGRESS) {
    throw new ApiError(400, 'Can only delete treatments while the visit is in progress');
  }

  const treatment = await visitsRepo.findTreatmentById(treatmentId);
  if (!treatment || treatment.visitId !== visitId) {
    throw new ApiError(404, 'Treatment not found on this visit');
  }

  const updated = await visitsRepo.deleteTreatmentAndRecalculate(visitId, treatmentId);
  const fullVisit = await visitsRepo.findVisitByIdWithDetails(updated.id);
  return toVisitDto(fullVisit!);
}

export async function setMeetingLink(doctorId: string, visitId: string, meetingLink: string) {
  const visit = await visitsRepo.findVisitById(visitId);
  if (!visit) throw new ApiError(404, 'Visit not found');
  if (visit.doctorId !== doctorId) throw new ApiError(403, 'This visit does not belong to you');
  if (visit.status !== VisitStatus.IN_PROGRESS) {
    throw new ApiError(400, 'Can only set a meeting link while the visit is in progress');
  }

  await visitsRepo.updateVisitStatus(visitId, { meetingLink });
  const fullVisit = await visitsRepo.findVisitByIdWithDetails(visitId);
  return toVisitDto(fullVisit!);
}