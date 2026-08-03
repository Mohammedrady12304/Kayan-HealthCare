import { Request, Response, NextFunction } from 'express';
import {
  requestVisitSchema,
  rejectVisitSchema,
  addTreatmentSchema,
  completeVisitSchema,
  updateTreatmentSchema,
} from './visits.validation';
import {
  requestVisit,
  approveVisit,
  rejectVisit,
  cancelVisit,
  startVisit,
  addTreatment,
  completeVisit,
  getPatientVisits,
  getDoctorVisits,
  updateTreatment,
  deleteTreatment,
} from './visits.service';
import { setMeetingLinkSchema } from './visits.validation';
import { setMeetingLink } from './visits.service';

export async function request(req: Request, res: Response, next: NextFunction) {
  try {
    const { slotId } = requestVisitSchema.parse(req.body);
    const patientId = req.user!.profileId;
    const visit = await requestVisit(patientId, slotId);
    res.status(201).json(visit);
  } catch (err) {
    next(err);
  }
}

export async function approve(req: Request, res: Response, next: NextFunction) {
  try {
    const doctorId = req.user!.profileId;
    const visit = await approveVisit(doctorId, req.params.visitId!.toString());
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = rejectVisitSchema.parse(req.body);
    const doctorId = req.user!.profileId;
    const visit = await rejectVisit(doctorId, req.params.visitId!.toString(), reason);
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = req.user!.profileId;
    const visit = await cancelVisit(patientId, req.params.visitId!.toString());
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const doctorId = req.user!.profileId;
    const visit = await startVisit(doctorId, req.params.visitId!.toString());
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function addTreatmentToVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, value } = addTreatmentSchema.parse(req.body);
    const doctorId = req.user!.profileId;
    const visit = await addTreatment(doctorId, req.params.visitId!.toString(), name, value);
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function complete(req: Request, res: Response, next: NextFunction) {
  try {
    const { notes } = completeVisitSchema.parse(req.body);
    const doctorId = req.user!.profileId;
    const visit = await completeVisit(doctorId, req.params.visitId!.toString(), notes);
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function myVisits(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = req.user!.profileId;
    const visits = await getPatientVisits(patientId);
    res.json(visits);
  } catch (err) {
    next(err);
  }
}

export async function doctorVisits(req: Request, res: Response, next: NextFunction) {
  try {
    const doctorId = req.user!.profileId;
    const visits = await getDoctorVisits(doctorId);
    res.json(visits);
  } catch (err) {
    next(err);
  }
}
export async function updateTreatmentOnVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, value } = updateTreatmentSchema.parse(req.body);
    const doctorId = req.user!.profileId;
    const visit = await updateTreatment(doctorId, req.params.visitId!.toString(), req.params.treatmentId!.toString(), name, value);
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function deleteTreatmentFromVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const doctorId = req.user!.profileId;
    const visit = await deleteTreatment(doctorId, req.params.visitId!.toString(), req.params.treatmentId!.toString());
    res.json(visit);
  } catch (err) {
    next(err);
  }
}
export async function setMeetingLinkOnVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const { meetingLink } = setMeetingLinkSchema.parse(req.body);
    const doctorId = req.user!.profileId;
    const visit = await setMeetingLink(doctorId, req.params.visitId!.toString(), meetingLink);
    res.json(visit);
  } catch (err) {
    next(err);
  }
}