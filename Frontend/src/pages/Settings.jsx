import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Globe, Shield } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  return (
    <AppShell>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#171717] mb-3">Settings</h1>
        <p className="text-[#737373]">Customize your learning experience.</p>
      </div>

      <div className="max-w-[600px] space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
              <Bell size={18} className="text-[#DC2626]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#171717]">Notifications</h3>
              <p className="text-xs text-[#737373]">Get notified about study reminders</p>
            </div>
            <button onClick={() => setNotifications(!notifications)} className={`ml-auto w-12 h-7 rounded-full transition-all relative ${notifications ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${notifications ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
              <Moon size={18} className="text-[#DC2626]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#171717]">Dark Mode</h3>
              <p className="text-xs text-[#737373]">Switch between light and dark theme</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`ml-auto w-12 h-7 rounded-full transition-all relative ${darkMode ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${darkMode ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
              <Globe size={18} className="text-[#DC2626]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#171717]">Language</h3>
              <p className="text-xs text-[#737373]">Choose your preferred language</p>
            </div>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-sm text-[#171717] outline-none">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-[#DC2626]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#171717]">Delete Account</h3>
              <p className="text-xs text-[#737373]">Permanently delete your account and data</p>
            </div>
            <button className="ml-auto px-4 py-2 text-sm font-medium text-[#DC2626] bg-[#FEF2F2] rounded-xl hover:bg-[#DC2626] hover:text-white transition-all">
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
