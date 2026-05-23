import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (href) => location.pathname === href;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBase = "px-5 py-2.5 text-[15px] font-medium rounded-xl transition-all duration-300";
  const navActive = "text-[#DC2626]";
  const navInactive = "text-[#525252] hover:text-[#171717]";

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/85 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-[#E5E5E5]/50" : "bg-transparent"}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/"><Logo textClassName="text-[#171717]" /></Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href} className={`${navBase} ${isActive(link.href) ? navActive : navInactive}`}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] font-medium text-[#525252] rounded-xl hover:bg-[#F5F5F5] hover:text-[#171717] transition-all">
                Sign In
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-all">
                Get Started
              </Link>
            </div>

            <button className="md:hidden p-2.5 rounded-xl hover:bg-black/5 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl p-8 pt-24" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.label} to={link.href} onClick={() => setMobileOpen(false)} className={`px-5 py-4 text-[16px] font-medium rounded-xl transition-all ${isActive(link.href) ? "text-[#DC2626] bg-[#FEF2F2]" : "text-[#171717] hover:bg-[#F5F5F5]"}`}>
                    {link.label}
                  </Link>
                ))}
                <hr className="border-[#E5E5E5] my-6" />
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-5 py-4 text-[16px] font-medium text-[#525252] hover:bg-[#F5F5F5] rounded-xl transition-all">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-2 px-6 py-4 text-[15px] font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] transition-all text-center mt-3">
                  Get Started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
