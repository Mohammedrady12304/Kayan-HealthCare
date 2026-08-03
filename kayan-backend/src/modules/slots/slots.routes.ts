import { Router } from 'express';
import { Role } from '@prisma/client';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';
import { cancel, generate, listByDoctor, mySlots } from './slots.controller';

const router = Router();

router.use(authMiddleware);

router.post('/generate', requireRole(Role.DOCTOR), generate);
router.get('/my-slots', requireRole(Role.DOCTOR), mySlots);
router.delete('/:slotId', requireRole(Role.DOCTOR), cancel);
router.get('/doctor/:doctorId', listByDoctor);
export default router;