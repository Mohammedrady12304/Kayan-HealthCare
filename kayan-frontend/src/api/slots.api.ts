import axiosClient from './axiosClient';

export interface Slot {
  id: string;
  startTime: string;
  status: string;
}

export const generateSlots = (data: {
  date: string;
  startHour: number;
  endHour: number;
  durationMinutes: number;
}) =>
  axiosClient
    .post<{ createdCount: number; reactivatedCount: number }>('/slots/generate', data)
    .then((r) => r.data);

export const getAvailableSlots = (doctorId: string) =>
  axiosClient.get<Slot[]>(`/slots/doctor/${doctorId}`).then((r) => r.data);

export const getMySlots = () =>
  axiosClient.get<Slot[]>('/slots/my-slots').then((r) => r.data);

export const cancelSlot = (slotId: string) =>
  axiosClient.delete(`/slots/${slotId}`).then((r) => r.data);