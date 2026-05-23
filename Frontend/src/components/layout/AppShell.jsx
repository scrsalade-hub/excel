import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Upload, BookOpen, ClipboardCheck, BarChart3, User, Menu, X, LogOut, Settings } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { logout } from "@/lib/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Uploads", href: "/uploads" },
  { icon: BookOpen, label: "Study", href: "/study" },
  { icon: ClipboardCheck, label: "Mock Exam", href: "/exam" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isActive = (href) => location.pathname === href;

  const sidebarLink = (active) => `flex items-center gap-4 px-5 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${active ? "bg-[#DC2626] text-white" : "text-[#737373] hover:text-white hover:bg-white/5"}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0A0A0A] fixed h-screen left-0 top-0 z-30">
        <div className="p-8">
          <Link to="/dashboard"><Logo textClassName="text-white" size={28} /></Link>
        </div>

        <nav className="flex-1 px-5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href} className={sidebarLink(isActive(item.href))}>
                <Icon size={18} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 space-y-1">
          <Link to="/profile" className={sidebarLink(isActive("/profile"))}>
            <User size={18} strokeWidth={1.5} /> Profile
          </Link>
          <Link to="/settings" className={sidebarLink(isActive("/settings"))}>
            <Settings size={18} strokeWidth={1.5} /> Settings
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[14px] font-medium text-[#737373] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all mt-2">
            <LogOut size={18} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 h-screen w-[260px] bg-[#0A0A0A] z-50 flex flex-col lg:hidden">
              <div className="p-6 flex items-center justify-between">
                <Logo textClassName="text-white" size={28} />
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-[#737373] hover:text-white"><X size={20} /></button>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.label} to={item.href} onClick={() => setSidebarOpen(false)} className={sidebarLink(isActive(item.href))}>
                      <Icon size={18} strokeWidth={1.5} /> {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4">
                <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[14px] font-medium text-[#737373] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all">
                  <LogOut size={18} strokeWidth={1.5} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-[#F5F5F5]"><Menu size={20} /></button>
          <Logo size={28} />
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#DC2626] to-[#EF4444] flex items-center justify-center text-white text-sm font-bold">U</div>
        </div>

        <div className="p-8 sm:p-10 lg:p-14 max-w-[1100px]">
          {children}
        </div>
      </main>
    </div>
  );
}
