'use client';
import { Fragment, useState } from 'react';

export default function ResultsStep({ results }: { results: any[] }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const downloadCSV = () => {
    const header = 'Student Name,Roll Number,Score,Remarks\n';
    const rows = results.map(r =>
      `"${r.studentName}","${r.rollNumber}",${r.score},"${(r.remarks || '').replace(/"/g, "'")}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'marks_sheet.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length)
    : 0;
  const highest = results.length ? Math.max(...results.map(r => r.score || 0)) : 0;
  const passed = results.filter(r => r.status !== 'failed').length;

  const filtered = results.filter(r =>
    !search ||
    r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    r.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Evaluation Complete</h2>
          <p className="text-sm text-gray-500 mt-1">
            {results.length} submission{results.length !== 1 ? 's' : ''} graded by AI
          </p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', val: results.length, color: 'text-brand-600',  bg: 'bg-brand-50',  border: 'border-brand-100' },
          { label: 'Class Average',  val: `${avg}%`,      color: 'text-brand-500', bg: 'bg-brand-50',  border: 'border-brand-200' },
          { label: 'Highest Score',  val: highest,         color: 'text-brand-700', bg: 'bg-brand-100', border: 'border-brand-200' },
          { label: 'Passed',         val: passed,          color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 font-medium mt-1.5 tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Submissions</h3>
          <div className="relative">
            <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 w-56 transition"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['#', 'Student Name', 'Roll No.', 'Score', 'Feedback'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r, i) => {
              const score = r.score ?? 0;
              const scoreBadge =
                score >= 70 ? 'bg-emerald-100 text-emerald-700' :
                score >= 40 ? 'bg-brand-100 text-brand-700' :
                'bg-red-100 text-red-600';
              const isExpanded = expandedRow === i;

              return (
                <Fragment key={i}>
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : i)}
                    className={`cursor-pointer transition-colors ${isExpanded ? 'bg-brand-50/40' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-5 py-3.5 text-gray-400 text-xs w-8">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                          {(r.studentName || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{r.studentName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{r.rollNumber || 'N/A'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreBadge}`}>
                        {score}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate max-w-[200px]">{r.remarks || '—'}</span>
                        <svg
                          className={`w-3.5 h-3.5 text-gray-300 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && r.remarks && (
                    <tr className="bg-brand-50/30">
                      <td colSpan={5} className="px-5 py-3.5 text-xs text-gray-600 border-t border-brand-100">
                        <p className="font-semibold text-gray-500 mb-1 uppercase tracking-wide text-[10px]">Full Feedback</p>
                        <p className="leading-relaxed text-gray-700">{r.remarks}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-14 text-center text-gray-400 text-sm">No results match your search</div>
        )}
      </div>
    </div>
  );
}
