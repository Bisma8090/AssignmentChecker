'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import API_URL from '@/lib/api';

export default function SetupStep({ onNext }: { onNext: (id: string) => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '', instructions: '', totalMarks: 100,
    passingMarks: 50, markingMode: 'strict',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.instructions.trim()) {
      setError('Please fill in title and instructions.');
      return;
    }
    if (!token) { setError('Not authenticated.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/assignments`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onNext(data._id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Assignment Setup</h2>
        <p className="text-sm text-gray-500 mt-1">Configure the details for AI-powered grading</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-7 space-y-6 shadow-sm">

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">
            Assignment Title
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Mental Health Essay — Week 5"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Instructions / Rubric
            </label>
            <span className="text-xs text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full font-medium">
              🤖 AI uses this to grade
            </span>
          </div>
          <textarea
            className={`${inputClass} resize-none`}
            rows={6}
            placeholder="Write a 500-word essay on the impact of social media on mental health. Include at least 3 references..."
            value={form.instructions}
            onChange={e => setForm({ ...form, instructions: e.target.value })}
          />
        </div>

        {/* Marks */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">
              Total Marks
            </label>
            <input
              type="number"
              className={inputClass}
              value={form.totalMarks}
              onChange={e => setForm({ ...form, totalMarks: +e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">
              Passing Marks
            </label>
            <input
              type="number"
              className={inputClass}
              value={form.passingMarks}
              onChange={e => setForm({ ...form, passingMarks: +e.target.value })}
            />
          </div>
        </div>

        {/* Marking Mode */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">
            Marking Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                mode: 'strict',
                label: 'Strict Grading',
                desc: 'Penalizes off-topic and incomplete answers',
              },
              {
                mode: 'loose',
                label: 'Lenient Grading',
                desc: 'Rewards partial understanding and effort',
              },
            ].map(({ mode, label, desc }) => {
              const isActive = form.markingMode === mode;
              return (
                <div
                  key={mode}
                  onClick={() => setForm({ ...form, markingMode: mode })}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    isActive
                      ? 'border-brand-400 bg-brand-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <p className={`font-semibold text-sm mb-1 ${isActive ? 'text-brand-700' : 'text-gray-800'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white py-3.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Creating Assignment...
          </>
        ) : (
          <>
            Continue to Upload PDFs
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
