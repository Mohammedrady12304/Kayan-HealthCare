import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface JwtPayload extends BaseJwtPayload {
  userId: string;
  role: Role;
  profileId: string;
}