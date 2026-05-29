import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl p-8 max-w-[420px] w-full shadow-2xl z-10"
          >
            <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#A3A3A3]">
              <X size={18} />
            </button>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${danger ? "bg-[#FEF2F2]" : "bg-[#FFFBEB]"}`}>
              <AlertTriangle size={24} className={danger ? "text-[#DC2626]" : "text-[#F59E0B]"} />
            </div>
            <h3 className="text-xl font-bold text-[#171717] mb-2">{title}</h3>
            <p className="text-sm text-[#737373] leading-relaxed mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 h-12 rounded-xl text-sm font-medium text-[#171717] bg-[#F5F5F5] hover:bg-[#E5E5E5] transition-all">
                {cancelLabel || "Cancel"}
              </button>
              <button onClick={onConfirm} className={`flex-1 h-12 rounded-xl text-sm font-semibold text-white transition-all ${danger ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#DC2626] hover:bg-[#B91C1C]"}`}>
                {confirmLabel || "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
