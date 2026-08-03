import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../utils/ApiError';
import { JwtPayload as AppJwtPayload } from '../../modules/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'No token provided');
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded === 'string' ||
      !('userId' in decoded) ||
      !('role' in decoded) ||
      !('profileId' in decoded)
    ) {
      throw new ApiError(401, 'Invalid token');
    }

    req.user = decoded as AppJwtPayload;
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
}