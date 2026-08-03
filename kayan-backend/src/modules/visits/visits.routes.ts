import { Router } from 'express';
import { Role } from '@prisma/client';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';
import {
  request,
  approve,
  reject,
  cancel,
  start,
  addTreatmentToVisit,
  complete,
  myVisits,
  doctorVisits,
  updateTreatmentOnVisit,
  deleteTreatmentFromVisit,
  setMeetingLinkOnVisit,
} from './visits.controller';

const router = Router();

router.use(authMiddleware);

// Patient
router.post('/', requireRole(Role.PATIENT), request);
router.get('/my-visits', requireRole(Role.PATIENT), myVisits);
router.patch('/:visitId/cancel', requireRole(Role.PATIENT), cancel);

// Doctor
router.get('/doctor-visits', requireRole(Role.DOCTOR), doctorVisits);
router.patch('/:visitId/approve', requireRole(Role.DOCTOR), approve);
router.patch('/:visitId/reject', requireRole(Role.DOCTOR), reject);
router.patch('/:visitId/start', requireRole(Role.DOCTOR), start);
router.post('/:visitId/treatments', requireRole(Role.DOCTOR), addTreatmentToVisit);
router.patch('/:visitId/complete', requireRole(Role.DOCTOR), complete);
router.patch('/:visitId/treatments/:treatmentId', requireRole(Role.DOCTOR), updateTreatmentOnVisit);
router.delete('/:visitId/treatments/:treatmentId', requireRole(Role.DOCTOR), deleteTreatmentFromVisit);
router.patch('/:visitId/meeting-link', requireRole(Role.DOCTOR), setMeetingLinkOnVisit);

export default router;