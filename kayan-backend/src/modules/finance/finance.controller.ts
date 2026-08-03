import { Request, Response, NextFunction } from 'express';
import { searchVisitsSchema } from './finance.validation';
import { searchVisits, getVisitDetails, getDashboardStats } from './finance.service';
import { ApiError } from '../../common/utils/ApiError';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
       const filters = searchVisitsSchema.parse(req.query);
    const visits = await searchVisits(filters);
    res.json(visits);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const visit = await getVisitDetails(req.params.visitId?.toString()!);
    if (!visit) throw new ApiError(404, 'Visit not found');
    res.json(visit);
  } catch (err) {
    next(err);
  }
}

export async function dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}