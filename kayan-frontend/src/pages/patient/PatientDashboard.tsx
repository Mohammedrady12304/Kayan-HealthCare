import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import BookVisit from './BookVisit';
import MyVisits from './MyVisits';
import PatientVisitDetails from './PatientVisitDetails';

export default function PatientDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<BookVisit />} />
        <Route path="my-visits" element={<MyVisits />} />
        <Route path="visit/:visitId" element={<PatientVisitDetails />} />
      </Routes>
    </DashboardLayout>
  );
}