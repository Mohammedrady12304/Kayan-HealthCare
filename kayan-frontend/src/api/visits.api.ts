import axiosClient from './axiosClient';
import type { Visit } from '../types';

export const requestVisit = (slotId: string) =>
  axiosClient.post<Visit>('/visits', { slotId }).then((r) => r.data);

export const cancelVisit = (visitId: string) =>
  axiosClient.patch<Visit>(`/visits/${visitId}/cancel`).then((r) => r.data);

export const approveVisit = (visitId: string) =>
  axiosClient.patch<Visit>(`/visits/${visitId}/approve`).then((r) => r.data);

export const rejectVisit = (visitId: string, reason: string) =>
  axiosClient.patch<Visit>(`/visits/${visitId}/reject`, { reason }).then((r) => r.data);

export const getMyVisits = () =>
  axiosClient.get<Visit[]>('/visits/my-visits').then((r) => r.data);

export const getDoctorVisits = () =>
  axiosClient.get<Visit[]>('/visits/doctor-visits').then((r) => r.data);

export const startVisit = (visitId: string) =>
  axiosClient.patch<Visit>(`/visits/${visitId}/start`).then((r) => r.data);

export const addTreatment = (visitId: string, name: string, value: number) =>
  axiosClient.post<Visit>(`/visits/${visitId}/treatments`, { name, value }).then((r) => r.data);

export const completeVisit = (visitId: string, notes?: string) =>
  axiosClient.patch<Visit>(`/visits/${visitId}/complete`, { notes }).then((r) => r.data);

export const updateTreatment = (visitId: string, treatmentId: string, name: string, value: number) =>
  axiosClient
    .patch<Visit>(`/visits/${visitId}/treatments/${treatmentId}`, { name, value })
    .then((r) => r.data);

export const deleteTreatment = (visitId: string, treatmentId: string) =>
  axiosClient.delete<Visit>(`/visits/${visitId}/treatments/${treatmentId}`).then((r) => r.data);

export const setMeetingLink = (visitId: string, meetingLink: string) =>
  axiosClient.patch<Visit>(`/visits/${visitId}/meeting-link`, { meetingLink }).then((r) => r.data);