import axiosClient from './axiosClient';

export interface Doctor {
  id: string;
  fullName: string;
  specialty: string | null;
}

export const getDoctors = () =>
  axiosClient.get<Doctor[]>('/doctors').then((r) => r.data);