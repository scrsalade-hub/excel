import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Award, BookOpen, TrendingUp } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function Profile() {
  const [form, setForm] = useState({ name: "Alex Student", email: "alex@example.com", bio: "Pre-med student passionate about learning." });
  const [saved, setSaved] = useState(false);

  const update = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setSaved(false); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <AppShell>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#171717] mb-3">Profile</h1>
        <p className="text-[#737373]">Manage your account and view your stats.</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-[#E5E5E5] h-fit">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#DC2626] to-[#EF4444] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-5">
            {form.name[0]}
          </div>
          <h2 className="text-xl font-bold text-[#171717] text-center mb-1">{form.name}</h2>
          <p className="text-sm text-[#737373] text-center mb-6">{form.email}</p>

          <div className="space-y-4 pt-6 border-t border-[#F5F5F5]">
            {[
              { icon: Award, label: "Member Since", value: "2024" },
              { icon: BookOpen, label: "Materials", value: "12" },
              { icon: TrendingUp, label: "Avg Score", value: "78%" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-[#A3A3A3]" strokeWidth={1.5} />
                    <span className="text-sm text-[#737373]">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#171717]">{s.value}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#E5E5E5] space-y-6">
            <h3 className="text-lg font-semibold text-[#171717] mb-2">Account Settings</h3>

            <div>
              <label className="text-sm font-medium text-[#171717] block mb-2.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full h-14 pl-14 pr-5 text-[15px] text-[#171717] bg-white border-[1.5px] border-[#E5E5E5] rounded-2xl outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#171717] block mb-2.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full h-14 pl-14 pr-5 text-[15px] text-[#171717] bg-white border-[1.5px] border-[#E5E5E5] rounded-2xl outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#171717] block mb-2.5">Bio</label>
              <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={4} className="w-full px-5 py-4 text-[15px] text-[#171717] bg-white border-[1.5px] border-[#E5E5E5] rounded-xl outline-none focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.08)] transition-all resize-none" />
            </div>

            <div className="pt-4 flex items-center justify-between">
              {saved && <p className="text-sm text-[#10B981] font-medium">Changes saved!</p>}
              <div className="ml-auto">
                <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">Save Changes</button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AppShell>
  );
}
