import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Upload, BookOpen, ClipboardCheck,
  BarChart3, User, LogOut, Menu, X, GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Materials', icon: Upload },
  { path: '/study', label: 'Study', icon: BookOpen },
  { path: '/exam', label: 'Mock Exam', icon: ClipboardCheck },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── RED SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#DC2626' }}
      >
        <div className="h-[72px] flex items-center px-8 flex-shrink-0">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            <GraduationCap size={20} strokeWidth={1.5} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Excel</span>
          <button className="ml-auto lg:hidden p-2 text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-5 py-8 space-y-2">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white text-[#DC2626] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-white/50 truncate">{user?.course || 'Student'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <LogOut size={16} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-[72px] bg-white flex items-center justify-between px-8 sm:px-10 sticky top-0 z-30 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2.5 text-[#64748b] hover:bg-[#F1F5F9] rounded-xl" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#1e293b]">
              {navItems.find(n => n.path === location.pathname)?.label || 'Excel'}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] rounded-full">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse-soft" />
            <span className="text-xs font-medium text-[#DC2626]">AI Ready</span>
          </div>
        </header>

        <main className="flex-1 p-8 sm:p-10 lg:p-12">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
