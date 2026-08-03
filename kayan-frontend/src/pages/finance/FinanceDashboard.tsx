import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import FinanceStatsPage from './FinanceStatsPage';
import FinanceSearchPage from './FinanceSearchPage';

export default function FinanceDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<FinanceStatsPage />} />
        <Route path="search" element={<FinanceSearchPage />} />
      </Routes>
    </DashboardLayout>
  );
}