import * as financeRepo from './finance.repository';
import { toVisitDtoList } from '../visits/dto';
import type { DashboardStatsDto } from './dto';

interface SearchFilters {
  doctorName?: string;
  patientName?: string;
  visitId?: string;
}

export async function searchVisits(filters: SearchFilters) {
  const visits = await financeRepo.searchVisits(filters);
  return toVisitDtoList(visits);
}

export async function getDashboardStats(): Promise<DashboardStatsDto> {
  const [totalVisits, visitsByStatus, completedVisits, doctorStats] = await Promise.all([
    financeRepo.getVisitCountsByStatus().then((r) =>
      r.reduce((sum, s) => sum + s._count._all, 0)
    ),
    financeRepo.getVisitCountsByStatus(),
    financeRepo.getCompletedVisitsAmounts(),
    financeRepo.getTopDoctorsRaw(),
  ]);

  const totalRevenue = completedVisits.reduce((sum, v) => sum + Number(v.totalAmount), 0);
  const averageVisitValue = completedVisits.length > 0 ? totalRevenue / completedVisits.length : 0;

  const doctorIds = doctorStats.map((d) => d.doctorId);
  const doctors = await financeRepo.findDoctorsByIds(doctorIds);

  const topDoctors = doctorStats.map((stat) => {
    const doctor = doctors.find((d) => d.id === stat.doctorId);
    return {
      doctorName: doctor?.user.fullName ?? 'Unknown',
      visitsCount: stat._count._all,
    };
  });

  return {
    totalVisits,
    visitsByStatus: visitsByStatus.map((s) => ({ status: s.status, count: s._count._all })),
    totalRevenue,
    averageVisitValue,
    topDoctors,
  };
}