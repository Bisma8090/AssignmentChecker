'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';
import API_URL from '@/lib/api';

interface Assignment {
  _id: string;
  title: string;
  totalMarks: number;
  passingMarks: number;
  markingMode: string;
  createdAt: string;
}

interface Submission {
  _id: string;
  studentName: string;
  rollNumber: string;
  score: number;
  status: string;
}

export default function HistoryPage() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/auth'); return; }
    axios.get(`${API_URL}/api/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => setAssignments(r.data)).finally(() => setLoadingAssignments(false));
  }, [token, router]);

  const openAssignment = async (a: Assignment) => {
    setSelected(a);
    setSidebarOpen(false);
    setLoadingSubmissions(true);
    const { data } = await axios.get(`${API_URL}/api/submissions/results/${a._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubmissions(data);
    setLoadingSubmissions(false);
  };

  const downloadCSV = () => {
    if (!selected) return;
    const header = 'Student Name,Roll Number,Score,Status\n';
    const rows = submissions.map(s =>
      `"${s.studentName}","${s.rollNumber}",${s.score},"${s.status}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selected.title}_marks.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const avg = submissions.length
    ? Math.round(submissions.reduce((s, r) => s + r.score, 0) / submissions.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 mr-1">
              <AppLogo size="md" />
            </div>
            <span className="text-gray-300 hidden sm:inline">›</span>
            <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-brand-600 transition hidden sm:inline">
              Dashboard
            </button>
            <span className="text-gray-300 hidden sm:inline">›</span>
            <span className="text-sm font-semibold text-gray-800">History</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/')}
              className="bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg font-semibold transition"
            >
              <span className="hidden sm:inline">+ New Assignment</span>
              <span className="sm:hidden">+ New</span>
            </button>
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
              <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 font-medium hidden sm:inline">{user?.name}</span>
              <button
                onClick={() => { logout(); router.push('/auth'); }}
                className="text-xs text-gray-400 hover:text-red-500 transition ml-1"
              >
                <span className="hidden sm:inline">Sign out</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-14 h-[calc(100vh-56px)] z-30 md:z-auto
          w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loadingAssignments ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-14 skeleton rounded-lg" />)}
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400 mt-4">No assignments yet</div>
          ) : (
            <div className="p-2 space-y-0.5">
              {assignments.map(a => (
                <button
                  key={a._id}
                  onClick={() => openAssignment(a)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    selected?._id === a._id
                      ? 'bg-brand-50 border border-brand-100 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-xs font-semibold truncate">{a.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(a.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 min-w-0">
          {!selected ? (
            <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
              <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-2xl mb-4">🗂️</div>
              <p className="font-semibold text-gray-700">Select an assignment</p>
              <p className="text-sm text-gray-400 mt-1">
                <span className="md:hidden">Tap the menu icon to browse assignments</span>
                <span className="hidden md:inline">Click any assignment in the sidebar to view results</span>
              </p>
            </div>
          ) : loadingSubmissions ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading results...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl space-y-4 sm:space-y-5 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-brand-600 transition">
                      ← Back
                    </button>
                    <span className="text-gray-300">·</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      selected.markingMode === 'strict' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selected.markingMode} mode
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(selected.createdAt).toLocaleDateString('en-PK', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })} · Passing: {selected.passingMarks}/{selected.totalMarks}
                  </p>
                </div>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm px-4 py-2 rounded-lg font-semibold transition shrink-0 self-start"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Submissions',   val: submissions.length,                                               color: 'text-brand-600',  bg: 'bg-brand-50',  border: 'border-brand-100' },
                  { label: 'Class Average', val: `${avg}%`,                                                        color: 'text-brand-500',  bg: 'bg-brand-50',  border: 'border-brand-200' },
                  { label: 'Passing',       val: submissions.filter(s => s.score >= selected.passingMarks).length, color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-lg p-3 sm:p-4 text-center`}>
                    <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              {submissions.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <p className="text-gray-400 text-sm">No submissions found</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[400px]">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          {['#', 'Student name', 'Roll No.', 'Score', 'Status'].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {submissions.map((s, i) => (
                          <tr key={s._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                                  {(s.studentName || 'U')[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-800">{s.studentName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.rollNumber}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                                s.score >= selected.passingMarks
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {s.score}/{selected.totalMarks}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                s.status === 'evaluated'
                                  ? 'bg-brand-50 text-brand-600'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
