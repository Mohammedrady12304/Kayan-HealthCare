import axiosClient from './axiosClient';
import type { Visit } from '../types';

export interface SearchFilters {
  doctorName?: string;
  patientName?: string;
  visitId?: string;
}

   export interface DashboardStats {
  totalVisits: number;
  visitsByStatus: { status: string; count: number }[];
  totalRevenue: number;
  averageVisitValue: number;
  topDoctors: { doctorName: string; visitsCount: number }[];
}

export const searchVisits = (filters: SearchFilters) =>
  axiosClient
    .get<Visit[]>('/finance/visits', {
      params: Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      ),
    })
    .then((r) => r.data);

 

export const getDashboardStats = () =>
  axiosClient.get<DashboardStats>('/finance/dashboard').then((r) => r.data);