import { z } from 'zod';

export const generateSlotsSchema = z.object({
  date: z.coerce.date(), 
  startHour: z.number().min(0).max(23), 
  endHour: z.number().min(1).max(24), 
  durationMinutes: z.number().min(5).max(240), 
});