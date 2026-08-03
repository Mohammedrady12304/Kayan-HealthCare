import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../common/utils/ApiError';
import { Role } from '@prisma/client';
import { JwtPayload } from './auth.types';
import * as authRepo from './auth.repository';
import { toAuthUserDto } from './dto';

const SALT_ROUNDS = 10;

export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  specialty?: string;
}) {
  const existing = await authRepo.findUserByEmail(data.email);
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

const user = await authRepo.createUserWithProfile({
  fullName: data.fullName,
  email: data.email,
  passwordHash,
  role: data.role,
  ...(data.specialty !== undefined && {
    specialty: data.specialty,
  }),
});
  return toAuthUserDto(user);
}

export async function loginUser(email: string, password: string) {
  const user = await authRepo.findUserByEmailWithProfile(email);
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new ApiError(401, 'Invalid credentials');

  const profileId = user.patient?.id ?? user.doctor?.id ?? user.finance?.id;
  if (!profileId) throw new ApiError(500, 'User profile not found');

  const payload: JwtPayload = { userId: user.id, role: user.role, profileId };
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });

  return { token, user: toAuthUserDto(user) };
}