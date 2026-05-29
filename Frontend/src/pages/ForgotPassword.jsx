import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { apiFetch } from "@/lib/api";

function SoftBlob({ className, style }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M44.5,-76.3C58.2,-69.3,70.6,-59.1,79.6,-46.8C88.6,-34.5,94.1,-20.1,93.2,-5.8C92.3,8.5,85,22.7,75.8,35.3C66.6,47.9,55.5,58.9,42.8,66.8C30.1,74.7,15.8,79.5,0.8,78.1C-14.2,76.7,-29.9,69.1,-43.8,59.5C-57.7,49.9,-69.8,38.3,-77.4,24.4C-85,10.5,-88.1,-5.7,-84.8,-20.4C-81.5,-35.1,-71.8,-48.3,-59.7,-56.6C-47.6,-64.9,-33.1,-68.3,-19.1,-74.6C-5.1,-80.9,8.4,-90.1,22.1,-89.8C35.8,-89.5,49.7,-79.7,44.5,-76.3Z" transform="translate(100 100)" />
    </svg>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password, 4=done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/password/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter all 6 digits."); return; }
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/password/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: code }),
      });
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/password/reset", {
        method: "POST",
        body: JSON.stringify({ email, otp: otp.join(""), password }),
      });
      setStep(4);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (step === 2 && otp.join("").length === 6) handleVerifyOTP();
  }, [otp, step]);

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-[#0A0A0A] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <SoftBlob className="absolute -top-20 -left-16 w-[320px] h-[320px] text-[#DC2626]/[0.07]" />
        <SoftBlob className="absolute bottom-10 left-10 w-[200px] h-[200px] text-[#DC2626]/[0.05]" style={{ transform: "rotate(120deg)" }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 60%)", filter: "blur(80px)" }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-20 max-w-[380px] px-8">
          <div className="mb-10"><Logo textClassName="text-white" size={32} /></div>
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Reset</h2>
          <h2 className="text-5xl font-bold bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent mb-6 tracking-tight">Password.</h2>
          <p className="text-[#A3A3A3] text-base leading-relaxed">Enter your email, verify with the code we send, and set a new password.</p>
          <div className="mt-12 flex items-center gap-3">
            <div className="w-8 h-[2px] bg-[#DC2626]/40 rounded-full" />
            <span className="text-xs text-[#737373] uppercase tracking-widest">Excel</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-[#FAFAFA] relative overflow-hidden">
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotGridFP" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#171717" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotGridFP)" />
          </svg>
          <SoftBlob className="absolute -top-16 -right-16 w-[200px] h-[200px] text-[#DC2626]/[0.04]" />
          <div className="absolute top-1/3 right-[5%] w-[250px] h-[250px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 60%)", filter: "blur(60px)" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-[420px] relative z-10">
          <div className="lg:hidden mb-6 flex items-center gap-3"><Logo size={32} /></div>

          {/* Progress dots */}
          {step < 4 && (
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-[#DC2626]" : "bg-[#E5E5E5]"}`} />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-bold text-[#171717] mb-1 tracking-tight">Forgot password?</h1>
                <p className="text-[#737373] text-sm mb-8">Enter your email and we will send you a 6-digit code.</p>
                {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="relative">
                    <Mail size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                    <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[52px] pl-13 pr-5 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-[52px] inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all disabled:opacity-60">
                    {loading ? "Sending..." : "Send Code"} {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
                <p className="text-center text-sm text-[#737373] mt-8">
                  <Link to="/login" className="text-[#DC2626] font-semibold hover:underline">Back to login</Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound size={18} className="text-[#DC2626]" />
                  <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Enter the code</h1>
                </div>
                <p className="text-[#737373] text-sm mb-8">We sent a 6-digit code to <span className="font-semibold text-[#171717]">{email}</span></p>
                {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}

                <div className="flex gap-2 sm:gap-3 mb-6 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl font-bold text-[#171717] bg-white border-2 border-[#E5E5E5] rounded-xl outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                    />
                  ))}
                </div>

                <button onClick={handleVerifyOTP} disabled={loading || otp.join("").length !== 6}
                  className="w-full h-[52px] inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all disabled:opacity-50 mb-4">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify Code"}
                </button>

                <div className="text-center">
                  <button onClick={() => { setOtp(["", "", "", "", "", ""]); setError(""); handleSendOTP({ preventDefault: () => {} }); }}
                    className="text-sm text-[#DC2626] font-medium hover:underline">
                    Resend code
                  </button>
                </div>
                <p className="text-center text-sm text-[#737373] mt-4">
                  <button onClick={() => setStep(1)} className="text-[#737373] hover:text-[#171717]">Use different email</button>
                </p>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-bold text-[#171717] mb-1 tracking-tight">New password</h1>
                <p className="text-[#737373] text-sm mb-8">Create a strong password for your account.</p>
                {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}
                <form onSubmit={handleReset} className="space-y-5">
                  <div className="relative">
                    <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                    <input type={showPass ? "text" : "password"} placeholder="New password (min 6)" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[52px] pl-13 pr-14 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#525252]">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <div className="relative">
                    <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3] z-10" />
                    <input type={showPass ? "text" : "password"} placeholder="Confirm password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      className="w-full h-[52px] pl-13 pr-14 text-[14px] text-[#171717] bg-white border border-[#E5E5E5] rounded-full outline-none transition-all focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.06)]" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-[52px] inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all disabled:opacity-60">
                    {loading ? "Resetting..." : "Reset Password"} {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Done */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-[#171717] mb-2">Password Reset</h3>
                <p className="text-sm text-[#737373] mb-8">Your password has been reset successfully.</p>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all">
                  <ArrowLeft size={16} /> Log In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
