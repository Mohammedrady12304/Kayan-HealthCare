import { Router } from 'express';
import { Role } from '@prisma/client';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';
import { search, getOne, dashboard } from './finance.controller';

const router = Router();

router.use(authMiddleware, requireRole(Role.FINANCE));

router.get('/visits', search);
router.get('/visits/:visitId', getOne);

router.get('/dashboard', dashboard);

export default router;