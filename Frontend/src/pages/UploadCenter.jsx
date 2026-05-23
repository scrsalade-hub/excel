import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2, Trash2, AlertCircle, FileImage } from 'lucide-react';
import { api } from '../context/AuthContext';

export default function UploadCenter() {
  const navigate = useNavigate();
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchPDFs(); }, []);

  const fetchPDFs = async () => {
    try { const res = await api.get('/api/upload'); setPdfs(res.data.pdfs || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const isAllowed = f => {
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    return f.type === 'application/pdf' || f.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || ext === '.pptx';
  };

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDrag(false);
    const dropped = [...e.dataTransfer.files].filter(isAllowed);
    setFiles(prev => [...prev, ...dropped.map(f => ({ file: f, id: Date.now() + Math.random() }))]);
  }, []);

  const selectFiles = e => {
    const sel = [...e.target.files].filter(isAllowed);
    setFiles(prev => [...prev, ...sel.map(f => ({ file: f, id: Date.now() + Math.random() }))]);
  };

  const upload = async () => {
    if (!files.length) return;
    setUploading(true);
    let success = 0;
    for (const f of files) {
      const fd = new FormData();
      fd.append('file', f.file);
      try { await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); success++; }
      catch (e) { console.error(e); }
    }
    setFiles([]);
    setUploading(false);
    fetchPDFs();
    if (success > 0) navigate('/study');
  };

  const del = async (id) => {
    setDeletingId(id);
    try { await api.delete(`/api/upload/${id}`); fetchPDFs(); }
    catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-[#1e293b] mb-3">Upload Center</h1>
        <p className="text-sm text-[#94a3b8]">Upload PDFs or PowerPoint files for AI-powered quiz generation</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`card p-16 text-center cursor-pointer mb-12 transition-all border-[2px] ${drag ? 'border-[#DC2626] bg-[#FEF2F2] scale-[1.01]' : 'border-dashed border-[#e2e8f0] hover:border-[#DC2626]'}`}
      >
        <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Upload size={28} strokeWidth={1.5} className="text-[#DC2626]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1e293b] mb-3">
          {drag ? 'Drop files here' : 'Drag & drop or click to browse'}
        </h3>
        <p className="text-sm text-[#94a3b8] mb-6">Supports PDF and PPTX files</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['PDF', 'PPTX'].map(t => <span key={t} className="px-4 py-2 bg-[#F1F5F9] rounded-lg text-xs text-[#64748b] font-medium">{t}</span>)}
        </div>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.pptx" className="hidden" onChange={selectFiles} />
      </div>

      {/* Selected Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="card p-8 mb-12">
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-widest mb-5">Selected Files</p>
            <div className="space-y-3 mb-8">
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-xl">
                  <div className="flex items-center gap-4 min-w-0">
                    <FileText size={16} strokeWidth={1.5} className="text-[#DC2626] flex-shrink-0" />
                    <span className="text-sm text-[#1e293b] truncate">{f.file.name}</span>
                    <span className="text-xs text-[#94a3b8] flex-shrink-0">{(f.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFiles(p => p.filter(x => x.id !== f.id)); }} className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0">
                    <X size={14} strokeWidth={1.5} className="text-[#94a3b8]" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); upload(); }} disabled={uploading} className="btn-red w-full">
              {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <>Upload {files.length} file{files.length > 1 ? 's' : ''}</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Materials List */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-base font-semibold text-[#1e293b]">Your Materials</h3>
          <span className="text-xs text-[#94a3b8]">{pdfs.length} file{pdfs.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32"><Loader2 size={20} className="animate-spin text-[#94a3b8]" /></div>
        ) : pdfs.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText size={28} strokeWidth={1.5} className="text-[#e2e8f0] mx-auto mb-4" />
            <p className="text-sm text-[#94a3b8] mb-1">No materials uploaded yet</p>
            <p className="text-xs text-[#cbd5e1]">Upload your first PDF or PPTX file above</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {pdfs.map(p => (
              <div key={p.id} className="card p-6 flex items-start gap-5 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${p.status === 'processed' ? 'bg-[#ECFDF5]' : p.status === 'image_pdf' ? 'bg-red-50' : 'bg-[#F1F5F9]'}`}>
                  {p.status === 'image_pdf' ? <FileImage size={20} strokeWidth={1.5} className="text-[#DC2626]" /> : <FileText size={20} strokeWidth={1.5} className={p.status === 'processed' ? 'text-[#10b981]' : 'text-[#94a3b8]'} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-medium text-[#1e293b] truncate">{p.name}</p>
                    <span className="px-2 py-0.5 bg-[#F1F5F9] rounded text-[10px] text-[#64748b] uppercase font-bold">{p.fileType || 'pdf'}</span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">{p.size} · {p.topics || 0} topics</p>
                  {p.status === 'image_pdf' && (
                    <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={14} strokeWidth={1.5} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[#DC2626] leading-relaxed">Image-based PDF. Upload the original .pptx file instead.</p>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => del(p.id)} disabled={deletingId === p.id}
                  className="p-2.5 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 opacity-0 group-hover:opacity-100">
                  {deletingId === p.id ? <Loader2 size={14} className="animate-spin text-[#DC2626]" /> : <Trash2 size={14} strokeWidth={1.5} className="text-[#94a3b8] hover:text-[#DC2626]" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
