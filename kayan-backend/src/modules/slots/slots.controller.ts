import { Request, Response, NextFunction } from 'express';
import { generateSlotsSchema } from './slots.validation';
import { cancelSlot, generateSlots, getMySlots, listAvailableSlots } from './slots.service';

export async function generate(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, startHour, endHour, durationMinutes } = generateSlotsSchema.parse(req.body);
    const doctorId = req.user!.profileId;
    const result = await generateSlots(doctorId, date, startHour, endHour, durationMinutes);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listByDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    const slots = await listAvailableSlots(req.params.doctorId!.toString() ?? null);
    res.json(slots);
  } catch (err) {
    next(err);
  }
}

export async function mySlots(req: Request, res: Response, next: NextFunction) {
  try {
    const doctorId = req.user!.profileId;
    const slots = await getMySlots(doctorId);
    res.json(slots);
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const doctorId = req.user!.profileId;
    await cancelSlot(doctorId, req.params.slotId!.toString());
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}