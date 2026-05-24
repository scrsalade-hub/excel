import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { apiFetch, setToken } from "@/lib/api";

function SoftBlob({ className, style }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M44.5,-76.3C58.2,-69.3,70.6,-59.1,79.6,-46.8C88.6,-34.5,94.1,-20.1,93.2,-5.8C92.3,8.5,85,22.7,75.8,35.3C66.6,47.9,55.5,58.9,42.8,66.8C30.1,74.7,15.8,79.5,0.8,78.1C-14.2,76.7,-29.9,69.1,-43.8,59.5C-57.7,49.9,-69.8,38.3,-77.4,24.4C-85,10.5,-88.1,-5.7,-84.8,-20.4C-81.5,-35.1,-71.8,-48.3,-59.7,-56.6C-47.6,-64.9,-33.1,-68.3,-19.1,-74.6C-5.1,-80.9,8.4,-90.1,22.1,-89.8C35.8,-89.5,49.7,-79.7,44.5,-76.3Z" transform="translate(100 100)" />
    </svg>
  );
}

function WaveDivider() {
  return (
    <svg className="absolute top-0 right-0 h-full w-[120px] lg:w-[180px] z-10 pointer-events-none" viewBox="0 0 100 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,0 C30,80 80,200 20,400 L100,400 Z" fill="#FAFAFA" />
      <path d="M100,0 C40,100 70,200 35,400" fill="none" stroke="rgba(220,38,38,0.08)" strokeWidth="1.5" />
      <path d="M100,20 C50,110 75,210 45,400" fill="none" stroke="rgba(220,38,38,0.05)" strokeWidth="1" />
    </svg>
  );
}

function DotGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dotGridReg" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#171717" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGridReg)" />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const next = () => {
    if (!form.name || !form.email || !form.password) { setError("Fill in all fields"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-[#0A0A0A] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <SoftBlob className="absolute -top-20 -left-16 w-[320px] h-[320px] text-[#DC2626]/[0.07]" />
        <SoftBlob className="absolute bottom-10 left-10 w-[200px] h-[200px] text-[#DC2626]/[0.05]" style={{ transform: "rotate(120deg)" }} />
        <SoftBlob className="absolute top-1/3 right-0 w-[180px] h-[180px] text-[#DC2626]/[0.04]" style={{ transform: "rotate(240deg)" }} />
        <div className="absolute bottom-[15%] right-[20%] w-[140px] h-[140px] rounded-full border border-[#DC2626]/[0.08]" />
        <div className="absolute top-[18%] right-[30%] w-[80px] h-[80px] rounded-full border border-[#DC2626]/[0.06]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 60%)", filter: "blur(80px)" }} />
        <WaveDivider />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-20 max-w-[380px] px-8">
          <div className="mb-10"><Logo textClassName="text-white" size={32} /></div>
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Start</h2>
          <h2 className="text-5xl font-bold bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent mb-6 tracking-tight">Learning.</h2>
          <p className="text-[#A3A3A3] text-base leading-relaxed">
            Create your account and unlock AI-powered study tools tailored to your materials.
          </p>
          <div className="mt-12 flex items-center gap-3">
            <div className="w-8 h-[2px] bg-[#DC2626]/40 rounded-full" />
            <span className="text-xs text-[#737373] uppercase tracking-widest">Excel AI</span>
          </div>
        </motion.div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-[#FAFAFA] relative overflow-hidden">
        {/* Mobile SVG decorations */}
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <DotGrid />
          <SoftBlob className="absolute -top-16 -right-16 w-[200px] h-[200px] text-[#DC2626]/[0.04]" />
          <SoftBlob className="absolute bottom-10 -left-10 w-[150px] h-[150px] text-[#DC2626]/[0.03]" style={{ transform: "rotate(180deg)" }} />
          <div className="absolute top-20 right-10 w-3 h-3 rounded-full bg-[#DC2626]/10" />
          <div className="absolute bottom-32 right-20 w-2 h-2 rounded-full bg-[#DC2626]/8" />
          <div className="absolute top-1/3 right-[5%] w-[250px] h-[250px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 60%)", filter: "blur(60px)" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-[420px] relative z-10">
          <div className="lg:hidden mb-8 flex items-center gap-3"><Logo size={32} /></div>

          {/* Mobile welcome text */}
          <div className="lg:hidden mb-8">
            <h2 className="text-3xl font-bold text-[#171717] tracking-tight">Start <span className="text-[#DC2626]">Learning.</span></h2>
          </div>

          <div className="hidden lg:block flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`} />
          </div>

          {/* Mobile progress dots */}
          <div className="lg:hidden flex gap-2 mb-6">
            <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`} />
            <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`} />
          </div>

          <h1 className="hidden lg:block text-2xl font-bold text-[#171717] mb-1 tracking-tight">{step === 1 ? "Create account" : "Confirm details"}</h1>
          <p className="hidden lg:block text-[#737373] text-sm mb-10">{step === 1 ? "Start your learning journey today." : "Review and create your account."}</p>

          {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3.5 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="relative">
                <User size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                <input type="text" placeholder="Full name" value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full h-[52px] pl-13 pr-5 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
              </div>
              <div className="relative">
                <Mail size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                <input type="email" placeholder="Email address" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full h-[52px] pl-13 pr-5 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                <input type={showPass ? "text" : "password"} placeholder="Min 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)}
                  className="w-full h-[52px] pl-13 pr-14 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#525252] transition-colors"><Eye size={16} /></button>
              </div>
              <button onClick={next} className="w-full h-[52px] inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all mt-2">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] space-y-4">
                <div className="flex justify-between items-center"><span className="text-sm text-[#737373]">Name</span><span className="text-sm text-[#171717] font-medium">{form.name}</span></div>
                <div className="h-px bg-[#F5F5F5]" />
                <div className="flex justify-between items-center"><span className="text-sm text-[#737373]">Email</span><span className="text-sm text-[#171717] font-medium">{form.email}</span></div>
                <div className="h-px bg-[#F5F5F5]" />
                <div className="flex justify-between items-center"><span className="text-sm text-[#737373]">Plan</span><span className="text-sm text-[#DC2626] font-semibold">Free</span></div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#171717] bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-all flex-1 h-[48px]">
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all flex-[2] h-[48px] disabled:opacity-60">
                  {loading ? "Creating..." : "Create Account"} {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-[#737373] mt-8">
            Already have an account? <Link to="/login" className="text-[#DC2626] font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
