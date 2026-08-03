import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import { errorMiddleware } from './common/middlewares/error.middleware';
import doctorsRoutes from './modules/doctors/doctors.routes';
import visitsRoutes from './modules/visits/visits.routes';
import financeRoutes from './modules/finance/finance.routes';
import slotsRoutes from './modules/slots/slots.routes';





const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);

app.use('/api/doctors', doctorsRoutes);
app.use('/api/visits', visitsRoutes);

app.use('/api/finance', financeRoutes);
app.use('/api/slots', slotsRoutes);




app.use(errorMiddleware);

export default app;