import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <main className="ml-64 p-8 max-w-5xl">{children}</main>
    </div>
  );
}