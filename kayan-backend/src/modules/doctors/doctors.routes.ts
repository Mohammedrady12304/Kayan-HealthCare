import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { getDoctors } from './doctors.controller';

const router = Router();

router.use(authMiddleware); router.get('/', getDoctors);

export default router;