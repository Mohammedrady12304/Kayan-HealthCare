import { z } from 'zod';

export const searchVisitsSchema = z.object({
  doctorName: z.string().optional(),
  patientName: z.string().optional(),
  visitId: z.string().uuid().optional(),
});