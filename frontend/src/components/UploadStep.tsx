'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import API_URL from '@/lib/api';

export default function UploadStep({ assignmentId, onNext }: { assignmentId: string; onNext: (results: any[]) => void }) {
  const { token } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const pdfFiles = Array.from(fileList).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) { setError('Please upload PDF files only.'); return; }
    setFiles(prev => [...prev, ...pdfFiles]);
    setError('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (files.length === 0) { setError('Please upload at least one PDF file.'); return; }
    if (!token) { setError('Not authenticated.'); return; }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('pdfs', file));
      const { data } = await axios.post(
        `${API_URL}/api/submissions/upload/${assignmentId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      onNext(data.results ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Upload Student PDFs</h2>
        <p className="text-sm text-gray-500 mt-1">Upload one or more PDF submissions for AI grading</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-all ${
            dragActive
              ? 'border-brand-400 bg-brand-50'
              : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50/40'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept="application/pdf"
            onChange={e => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pointer-events-none">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700 text-sm mb-1">
              {dragActive ? 'Drop files here' : 'Drag & drop PDF files here'}
            </p>
            <p className="text-xs text-gray-400">or click to browse — PDF only, up to 10MB each</p>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 group">
                  <div className="w-7 h-7 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-xs shrink-0">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || files.length === 0}
        className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Uploading & Processing...
          </>
        ) : (
          <>
            Start AI Grading
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
