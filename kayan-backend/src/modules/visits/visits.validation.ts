import { z } from 'zod';

export const requestVisitSchema = z.object({
  slotId: z.string().uuid(),
});

export const rejectVisitSchema = z.object({
  reason: z.string().min(3),
});

export const addTreatmentSchema = z.object({
  name: z.string().min(2),
  value: z.number().positive(),
});

export const completeVisitSchema = z.object({
  notes: z.string().optional(),
});

export const updateTreatmentSchema = z.object({
  name: z.string().min(2),
  value: z.number().positive(),
});

export const setMeetingLinkSchema = z.object({
  meetingLink: z.string().url('Must be a valid URL'),
});