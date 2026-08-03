import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  PATIENT: [
    { label: 'Book a Visit', path: '/patient' },
    { label: 'My Visits', path: '/patient/my-visits' },
  ],
  DOCTOR: [
  { label: 'My Visits', path: '/doctor' },
  { label: 'My Slots', path: '/doctor/slots' },
],
  FINANCE: [
    { label: 'Dashboard', path: '/finance' },
    { label: 'Search Visits', path: '/finance/search' },
  ],
};

const ROLE_STYLES: Record<Role, { accent: string; bg: string; label: string }> = {
  PATIENT: { accent: 'bg-slate', bg: 'bg-slate-light', label: 'text-slate' },
  DOCTOR: { accent: 'bg-teal', bg: 'bg-teal-light', label: 'text-teal' },
  FINANCE: { accent: 'bg-amber', bg: 'bg-amber-light', label: 'text-amber' },
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;
  const items = NAV_ITEMS[user.role];
  const roleStyle = ROLE_STYLES[user.role];

  return (
    <aside className="w-64 h-screen bg-surface border-r border-black/5 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-ink flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">K</span>
          </div>
          <span className="font-display font-semibold text-lg text-ink">Kayan</span>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-6 py-4">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${roleStyle.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${roleStyle.accent}`} />
          <span className={`text-xs font-medium font-mono uppercase tracking-wide ${roleStyle.label}`}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                isActive
                  ? `${roleStyle.bg} ${roleStyle.label}`
                  : 'text-ink/60 hover:bg-canvas hover:text-ink'
              }`}
            >
              {isActive && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r ${roleStyle.accent}`} />
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-6 py-4 border-t border-black/5">
        <p className="text-sm font-medium text-ink truncate">{user.fullName}</p>
        <p className="text-xs text-ink/50 truncate mb-3">{user.email}</p>
        <button
          onClick={logout}
          className="text-xs font-medium text-coral hover:underline"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}