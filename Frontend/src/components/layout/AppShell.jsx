import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Upload, BookOpen, ClipboardCheck, BarChart3, User, Menu, X, LogOut, Settings, Layers, Sparkles } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { apiFetch, logout } from "@/lib/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Uploads", href: "/uploads" },
  { icon: BookOpen, label: "Study", href: "/study" },
  { icon: ClipboardCheck, label: "Mock Exam", href: "/exam" },
  { icon: Layers, label: "Flashcards", href: "/flashcards" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const isActive = (href) => location.pathname === href;

  useEffect(() => {
    apiFetch("/api/auth/me").then((d) => setUserName(d.user?.name || d.name || "")).catch(() => {});
  }, []);

  const sidebarLink = (active) => `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 ${active ? "bg-[#DC2626] text-white" : "text-[#737373] hover:text-white hover:bg-white/5"}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[250px] bg-[#0A0A0A] fixed h-screen left-0 top-0 z-30">
        <div className="p-6 pb-4">
          <Link to="/dashboard"><Logo textClassName="text-white" size={26} /></Link>
        </div>

        {/* User greeting */}
        {userName && (
          <div className="px-5 pb-3">
            <p className="text-[11px] text-[#737373]">Welcome back,</p>
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href} className={sidebarLink(isActive(item.href))}>
                <Icon size={17} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-1">
          {/* Plan badge */}
          <div className="px-4 py-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Sparkles size={10} /> Free Plan
            </span>
          </div>
          <Link to="/profile" className={sidebarLink(isActive("/profile"))}>
            <User size={17} strokeWidth={1.5} /> Profile
          </Link>
          <Link to="/settings" className={sidebarLink(isActive("/settings"))}>
            <Settings size={17} strokeWidth={1.5} /> Settings
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-[#737373] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all mt-1">
            <LogOut size={17} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -250 }} animate={{ x: 0 }} exit={{ x: -250 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[250px] bg-[#0A0A0A] z-50 flex flex-col lg:hidden">
              <div className="p-5 flex items-center justify-between">
                <Logo textClassName="text-white" size={26} />
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-[#737373] hover:text-white"><X size={20} /></button>
              </div>
              {userName && (
                <div className="px-5 pb-3">
                  <p className="text-[11px] text-[#737373]">Welcome back,</p>
                  <p className="text-sm font-semibold text-white">{userName}</p>
                </div>
              )}
              <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.label} to={item.href} onClick={() => setSidebarOpen(false)} className={sidebarLink(isActive(item.href))}>
                      <Icon size={17} strokeWidth={1.5} /> {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4">
                <div className="px-4 py-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-bold uppercase tracking-wider rounded-full">
                    <Sparkles size={10} /> Free Plan
                  </span>
                </div>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-[#737373] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all">
                  <LogOut size={17} strokeWidth={1.5} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[250px] min-h-screen">
        <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5] px-5 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-[#F5F5F5]"><Menu size={20} /></button>
          <Logo size={26} />
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#DC2626]/10 text-[#DC2626] text-[9px] font-bold uppercase rounded-full">Free</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DC2626] to-[#EF4444] flex items-center justify-center text-white text-xs font-bold">
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8 lg:p-10 max-w-[1100px]">
          {children}
        </div>
      </main>
    </div>
  );
}
