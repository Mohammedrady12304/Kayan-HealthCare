import { User, Role } from '@prisma/client';

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export function toAuthUserDto(user: User): AuthUserDto {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}