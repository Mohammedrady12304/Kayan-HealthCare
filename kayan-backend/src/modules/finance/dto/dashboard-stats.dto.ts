export interface DashboardStatsDto {
  totalVisits: number;
  visitsByStatus: { status: string; count: number }[];
  totalRevenue: number;
  averageVisitValue: number;
  topDoctors: { doctorName: string; visitsCount: number }[];
}