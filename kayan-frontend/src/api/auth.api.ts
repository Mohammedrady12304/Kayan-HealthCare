import axiosClient from './axiosClient';
import type { User, Role } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = (email: string, password: string) =>
  axiosClient.post<LoginResponse>('/auth/login', { email, password }).then((response) => response.data);

export const register = (data: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  specialty?: string;
}) => axiosClient.post('/auth/register', data).then((response) => response.data);