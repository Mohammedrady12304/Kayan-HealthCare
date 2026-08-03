import { Request, Response, NextFunction } from 'express';
import { listDoctors } from './doctors.service';

export async function getDoctors(_req: Request, res: Response, next: NextFunction) {
  try {
    const doctors = await listDoctors();
    res.json(doctors);
  } catch (err) {
    next(err);
  }
}