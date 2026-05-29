import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, Loader2, XCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { apiFetch } from "@/lib/api";

function SoftBlob({ className, style }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M44.5,-76.3C58.2,-69.3,70.6,-59.1,79.6,-46.8C88.6,-34.5,94.1,-20.1,93.2,-5.8C92.3,8.5,85,22.7,75.8,35.3C66.6,47.9,55.5,58.9,42.8,66.8C30.1,74.7,15.8,79.5,0.8,78.1C-14.2,76.7,-29.9,69.1,-43.8,59.5C-57.7,49.9,-69.8,38.3,-77.4,24.4C-85,10.5,-88.1,-5.7,-84.8,-20.4C-81.5,-35.1,-71.8,-48.3,-59.7,-56.6C-47.6,-64.9,-33.1,-68.3,-19.1,-74.6C-5.1,-80.9,8.4,-90.1,22.1,-89.8C35.8,-89.5,49.7,-79.7,44.5,-76.3Z" transform="translate(100 100)" />
    </svg>
  );
}

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const data = await apiFetch(`/api/password/verify/${token}`);
      setValid(data.valid);
    } catch (err) {
      setError(err.message || "Invalid or expired reset link.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await apiFetch(`/api/password/reset/${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 size={28} className="text-[#DC2626] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#737373]">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!valid && !done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-[400px]">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle size={32} className="text-[#DC2626]" />
          </div>
          <h2 className="text-xl font-bold text-[#171717] mb-2">Link Expired</h2>
          <p className="text-sm text-[#737373] mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
          <Link to="/forgot-password" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all">
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-[#0A0A0A] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <SoftBlob className="absolute -top-20 -left-16 w-[320px] h-[320px] text-[#DC2626]/[0.07]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 60%)", filter: "blur(80px)" }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-20 max-w-[380px] px-8">
          <div className="mb-10"><Logo textClassName="text-white" size={32} /></div>
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">New</h2>
          <h2 className="text-5xl font-bold bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent mb-6 tracking-tight">Password.</h2>
          <p className="text-[#A3A3A3] text-base leading-relaxed">Create a strong password to keep your account secure.</p>
          <div className="mt-12 flex items-center gap-3">
            <div className="w-8 h-[2px] bg-[#DC2626]/40 rounded-full" />
            <span className="text-xs text-[#737373] uppercase tracking-widest">Excel AI</span>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-[#FAFAFA] relative overflow-hidden">
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotGridRP" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#171717" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotGridRP)" />
          </svg>
          <SoftBlob className="absolute -top-16 -right-16 w-[200px] h-[200px] text-[#DC2626]/[0.04]" />
          <div className="absolute top-1/3 right-[5%] w-[250px] h-[250px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 60%)", filter: "blur(60px)" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-[420px] relative z-10">
          <div className="lg:hidden mb-8 flex items-center gap-3"><Logo size={32} /></div>
          <div className="lg:hidden mb-8"><h2 className="text-3xl font-bold text-[#171717] tracking-tight">New <span className="text-[#DC2626]">Password.</span></h2></div>

          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2">Password Reset</h3>
              <p className="text-sm text-[#737373] mb-6">Your password has been reset successfully. Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <h1 className="hidden lg:block text-2xl font-bold text-[#171717] mb-1 tracking-tight">Create new password</h1>
              <p className="hidden lg:block text-[#737373] text-sm mb-10">Enter a new password for your account.</p>

              {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3.5 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                  <input type={showPass ? "text" : "password"} placeholder="New password (min 6 characters)" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[52px] pl-13 pr-14 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#525252]">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <div className="relative">
                  <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                  <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    className="w-full h-[52px] pl-13 pr-14 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#525252]">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-[52px] inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all disabled:opacity-60">
                  {loading ? "Resetting..." : "Reset Password"} {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
