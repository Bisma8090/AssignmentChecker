'use client';
import { useEffect, useState } from 'react';

const STAGES = [
  { label: 'Parsing PDF content', icon: '📄' },
  { label: 'Analyzing submissions', icon: '🔍' },
  { label: 'AI grading in progress', icon: '🤖' },
  { label: 'Finalizing results', icon: '✅' },
];

export default function EvaluatingStep({ onDone }: { onDone: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 350);
    const done = setTimeout(onDone, 1500);
    return () => { clearInterval(interval); clearTimeout(done); };
  }, [onDone]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">AI Evaluation</h2>
        <p className="text-sm text-gray-500 mt-1">Processing submissions, please wait...</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {STAGES.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= stageIndex ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border transition-all ${
              i < stageIndex  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
              i === stageIndex ? 'bg-brand-50 border-brand-300 text-brand-600' :
              'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              {i < stageIndex ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : s.icon}
            </div>
            <span className={`text-sm font-medium flex-1 ${
              i < stageIndex  ? 'text-emerald-600' :
              i === stageIndex ? 'text-gray-900' :
              'text-gray-400'
            }`}>
              {s.label}
            </span>
            {i === stageIndex && (
              <div className="flex gap-1">
                {[0, 1, 2].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
