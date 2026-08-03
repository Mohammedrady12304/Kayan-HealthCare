import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import DoctorVisitsList from './DoctorVisitsList';
import ActiveVisit from './ActiveVisit';
import MySlots from './MySlots';

export default function DoctorDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DoctorVisitsList />} />
        <Route path="slots" element={<MySlots />} />
        <Route path="visit/:visitId" element={<ActiveVisit />} />
      </Routes>
    </DashboardLayout>
  );
}