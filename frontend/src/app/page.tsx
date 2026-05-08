'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SetupStep from '@/components/SetupStep';
import UploadStep from '@/components/UploadStep';
import EvaluatingStep from '@/components/EvaluatingStep';
import ResultsStep from '@/components/ResultsStep';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';
import axios from 'axios';
import API_URL from '@/lib/api';

const STEPS = [
  { label: 'Setup' },
  { label: 'Upload' },
  { label: 'Evaluating' },
  { label: 'Results' },
];

interface Assignment {
  _id: string; title: string; totalMarks: number;
  passingMarks: number; markingMode: string; createdAt: string;
}

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'new'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [assignmentId, setAssignmentId] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) router.push('/auth');
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/api/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => setAssignments(r.data)).finally(() => setLoadingData(false));
  }, [token]);

  const startNew = () => { setStep(1); setAssignmentId(''); setResults([]); setView('new'); setSidebarOpen(false); };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen tems-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand--500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading Evalio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen z-30 lg:z-10
        w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <AppLogo size="md" />
            <span className="text-[9px] bg-brand-100 text-brand-500 font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">Pro</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {[
            {
              label: 'Dashboard', onClick: () => { setView('dashboard'); setSidebarOpen(false); }, active: view === 'dashboard',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
            },
            {
              label: 'New Assignment', onClick: startNew, active: view === 'new',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
            },
            {
              label: 'History', onClick: () => { router.push('/history'); setSidebarOpen(false); }, active: false,
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
            },
          ].map(({ label, onClick, active, icon }) => (
            <button
              key={label}
              onClick={onClick}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-50 text-brand-700 border border-brand-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {icon}
              </svg>
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400">Teacher</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/auth'); }}
              title="Sign out"
              className="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              {view === 'dashboard' ? (
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Dashboard</h1>
                  <p className="text-xs text-gray-400 hidden sm:block">Welcome back, {user.name.split(' ')[0]}</p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                  <button onClick={() => setView('dashboard')} className="hover:text-brand-600 transition font-medium">Dashboard</button>
                  <span className="text-gray-300">›</span>
                  <span className="font-semibold text-gray-800">New Assignment</span>
                  <span className="text-gray-300 hidden sm:inline">›</span>
                  <span className="text-brand-600 font-semibold hidden sm:inline">{STEPS[step - 1].label}</span>
                </div>
              )}
            </div>
          </div>
          {view === 'dashboard' && (
            <button
              onClick={startNew}
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Assignment</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {view === 'dashboard' ? (
            <DashboardView
              assignments={assignments}
              loading={loadingData}
              onNew={startNew}
              onHistory={() => router.push('/history')}
            />
          ) : (
            <WizardView
              step={step} setStep={setStep}
              assignmentId={assignmentId} setAssignmentId={setAssignmentId}
              results={results} setResults={setResults}
              onDone={() => setView('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* Dashboard View */
function DashboardView({ assignments, loading, onNew, onHistory }: {
  assignments: any[]; loading: boolean; onNew: () => void; onHistory: () => void;
}) {
  const total = assignments.length;
  const thisMonth = assignments.filter(a => {
    const d = new Date(a.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      label: 'Total Assignments', value: total,
      tag: 'Assignments',
      accent: 'border-l-brand-500',
      valueColor: 'text-brand-600',
      tagBg: 'bg-brand-50 text-brand-500',
    },
    {
      label: 'This Month', value: thisMonth,
      tag: 'Monthly',
      accent: 'border-l-brand-400',
      valueColor: 'text-brand-500',
      tagBg: 'bg-brand-50 text-brand-500',
    },
    {
      label: 'AI Evaluations', value: total,
      tag: 'AI',
      accent: 'border-l-brand-600',
      valueColor: 'text-brand-700',
      tagBg: 'bg-brand-100 text-brand-600',
    },
    {
      label: 'Avg. Turnaround', value: '< 1 min',
      tag: 'Speed',
      accent: 'border-l-emerald-500',
      valueColor: 'text-emerald-600',
      tagBg: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white border border-gray-200 border-l-4 ${s.accent} rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow`}>
            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${s.tagBg}`}>
              {s.tag}
            </span>
            <div className={`text-2xl sm:text-3xl font-extrabold ${s.valueColor} leading-none`}>
              {loading ? <div className="skeleton h-8 w-14 rounded" /> : s.value}
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent assignments */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-4 bg-brand-500 rounded-full" />
            <h3 className="font-bold text-gray-800 text-sm tracking-tight">Recent Assignments</h3>
          </div>
          <button
            onClick={onHistory}
            className="text-[11px] font-semibold text-brand-500 hover:text-brand-700 border border-brand-200 hover:border-brand-400 px-2.5 py-1 rounded-lg transition-all"
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-14 h-14 bg-brand-50 border-2 border-dashed border-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-[10px] font-extrabold text-brand-300 uppercase tracking-widest">None</span>
            </div>
            <p className="font-semibold text-gray-700 text-sm">No assignments yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">Create your first assignment to get started</p>
            <button onClick={onNew} className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-sm">
              + Create Assignment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    { label: 'Assignment', w: 'w-[40%]' },
                    { label: 'Mode', w: 'w-[15%]' },
                    { label: 'Total Marks', w: 'w-[15%]' },
                    { label: 'Created', w: 'w-[20%]' },
                    { label: '', w: 'w-[10%]' },
                  ].map(h => (
                    <th key={h.label} className={`${h.w} px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignments.slice(0, 6).map((a, idx) => (
                  <tr
                    key={a._id}
                    className={`border-b border-gray-50 hover:bg-brand-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-sm font-extrabold text-white uppercase">{a.title?.[0] ?? 'A'}</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">{a.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        a.markingMode === 'strict'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {a.markingMode}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-gray-700">{a.totalMarks}</span>
                      <span className="text-[10px] text-gray-400 ml-1">pts</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={onHistory}
                        className="text-[10px] font-bold text-brand-500 hover:text-white hover:bg-brand-500 border border-brand-200 hover:border-brand-500 px-2.5 py-1 rounded-lg transition-all"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* Wizard View */
function WizardView({ step, setStep, assignmentId, setAssignmentId, results, setResults, onDone }: any) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-6 sm:mb-8">
        {STEPS.map((s, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isDone = step > num;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-1.5 sm:gap-2 transition-all ${isActive ? 'opacity-100' : isDone ? 'opacity-80' : 'opacity-30'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone   ? 'bg-emerald-500 text-white' :
                  isActive ? 'bg-brand-500 text-white shadow-sm' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isDone ? (
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : num}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-brand-600' : isDone ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 sm:mx-3 transition-all ${step > i + 1 ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div>
        {step === 1 && <SetupStep onNext={(id: string) => { setAssignmentId(id); setStep(2); }} />}
        {step === 2 && <UploadStep assignmentId={assignmentId} onNext={(r: any[]) => { setResults(r); setStep(3); }} />}
        {step === 3 && <EvaluatingStep onDone={() => setStep(4)} />}
        {step === 4 && (
          <div className="space-y-4">
            <ResultsStep results={results} />
            <button
              onClick={onDone}
              className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 hover:text-gray-700 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
