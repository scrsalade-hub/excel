import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, FileText, X, Loader2, Trash2, CheckCircle, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";

export default function UploadPage() {
  const navigate = useNavigate();
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await apiFetch("/api/upload");
      setMaterials(data.pdfs || []);
    } catch {
      // silently fail on load
    } finally {
      setLoading(false);
    }
  };

  const isAllowed = (f) => f.type === "application/pdf" || f.name.endsWith(".pptx") || f.name.endsWith(".pdf");

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const dropped = [...e.dataTransfer.files].filter(isAllowed);
    setFiles((p) => [...p, ...dropped.map((f) => ({ file: f, id: Date.now() + Math.random().toString() }))]);
  }, []);

  const selectFiles = (e) => {
    const sel = [...(e.target.files || [])].filter(isAllowed);
    setFiles((p) => [...p, ...sel.map((f) => ({ file: f, id: Date.now() + Math.random().toString() }))]);
  };

  const uploadAll = async () => {
    if (!files.length) return;
    setUploading(true);
    setError("");
    setSuccessMsg("");

    try {
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f.file);
        await apiFetch("/api/upload", { method: "POST", body: formData });
      }
      setFiles([]);
      await fetchMaterials();
      setSuccessMsg("Upload successful! Redirecting to study...");
      setTimeout(() => {
        navigate("/study?from=upload");
      }, 1500);
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const del = async (id) => {
    try {
      await apiFetch(`/api/upload/${id}`, { method: "DELETE" });
      setMaterials((p) => p.filter((m) => m.id !== id));
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  return (
    <AppShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#171717] mb-3">Upload Materials</h1>
        <p className="text-[#737373]">Add your lecture slides, notes, and textbooks for AI analysis.</p>
      </div>

      {error && (
        <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3.5 rounded-2xl mb-6 border border-[#DC2626]/10 flex items-center justify-between">
          {error}
          <button onClick={() => setError("")} className="p-1 hover:bg-[#DC2626]/10 rounded-lg"><X size={16} /></button>
        </div>
      )}

      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#ECFDF5] text-[#10B981] text-sm px-5 py-3.5 rounded-2xl mb-6 border border-[#10B981]/15 flex items-center gap-3">
          <CheckCircle size={16} /> {successMsg}
        </motion.div>
      )}

      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-8 ${drag ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E5E5E5] bg-white hover:border-[#DC2626]/40 hover:bg-[#FEF2F2]/30"}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Upload size={28} className="text-[#DC2626]" strokeWidth={1.5} />
        </div>
        <p className="text-lg font-semibold text-[#171717] mb-2">Drop your files here</p>
        <p className="text-sm text-[#737373] mb-6">PDF or PPTX files up to 20MB each</p>
        <input ref={fileRef} type="file" multiple accept=".pdf,.pptx,application/pdf" className="hidden" onChange={selectFiles} />
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
          Browse Files
        </button>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#171717]">Ready to upload ({files.length})</h3>
              <button onClick={uploadAll} disabled={uploading} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all disabled:opacity-50">
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : "Upload All"}
              </button>
            </div>
            <div className="space-y-2">
              {files.map((f) => (
                <motion.div key={f.id} layout className="flex items-center justify-between bg-white rounded-xl px-5 py-3.5 border border-[#E5E5E5]">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#DC2626]" />
                    <span className="text-sm text-[#171717]">{f.file.name}</span>
                    <span className="text-xs text-[#A3A3A3]">{(f.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <button onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))} className="p-1.5 hover:bg-[#F5F5F5] rounded-lg"><X size={16} className="text-[#A3A3A3]" /></button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg font-semibold text-[#171717] mb-5">Your Materials</h3>

      {loading ? (
        <div className="text-center py-12"><Loader2 size={28} className="text-[#DC2626] animate-spin mx-auto mb-3" /><p className="text-sm text-[#737373]">Loading...</p></div>
      ) : materials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E5E5]">
          <FileText size={32} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-[#737373]">No materials yet. Upload your first file above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => (
            <div key={m.id} className="flex items-center justify-between bg-white rounded-2xl p-5 border border-[#E5E5E5] hover:border-[#DC2626]/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-[#DC2626]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#171717]">{m.name}</p>
                  <p className="text-xs text-[#737373]">{m.size} {m.topics > 0 && `\u00B7 ${m.topics} topics`} {m.status && `\u00B7 ${m.status}`}</p>
                </div>
              </div>
              <button onClick={() => del(m.id)} className="p-2.5 hover:bg-[#FEF2F2] rounded-xl transition-colors group">
                <Trash2 size={18} className="text-[#A3A3A3] group-hover:text-[#DC2626]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
