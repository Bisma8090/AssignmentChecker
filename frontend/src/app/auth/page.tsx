'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';
import API_URL from '@/lib/api';

function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full bg-white/10 animate-float" style={style} />;
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Mobile: show hero for 2.5s then slide to form
    const timer = setTimeout(() => setShowHero(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = `${API_URL}/api/auth/${mode}`;
      const payload = mode === 'signup'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      const { data } = await axios.post(url, payload);
      login(data.token, data.user);
      router.push('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const particles = [
    { width: 70,  height: 70,  top: '8%',  left: '6%',  animationDelay: '0s',   animationDuration: '6s' },
    { width: 45,  height: 45,  top: '20%', left: '72%', animationDelay: '1s',   animationDuration: '8s' },
    { width: 100, height: 100, top: '55%', left: '4%',  animationDelay: '2s',   animationDuration: '7s' },
    { width: 35,  height: 35,  top: '78%', left: '78%', animationDelay: '0.5s', animationDuration: '5s' },
    { width: 55,  height: 55,  top: '42%', left: '58%', animationDelay: '1.5s', animationDuration: '9s' },
  ];

  const inputClass =
    'w-full bg-blue-50/40 border border-blue-100 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200';

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(4deg); }
          66%       { transform: translateY(9px) rotate(-3deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-float       { animation: float var(--dur, 6s) ease-in-out infinite; }
        .animate-slide-left  { animation: slideInLeft 0.55s cubic-bezier(.22,1,.36,1) both; }
        .animate-slide-right { animation: slideInRight 0.55s cubic-bezier(.22,1,.36,1) both; }
        .animate-fade-up     { animation: fadeInUp 0.4s ease both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-out-left   { animation: slideOutLeft 0.4s cubic-bezier(.22,1,.36,1) both; }
        .animate-slide-in-bottom  { animation: slideInFromBottom 0.5s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      {/* Full viewport */}
      <div className="min-h-screen flex">

        {/* ── Left Panel: desktop always visible, mobile hero intro ── */}
        <div className={`
          relative overflow-hidden flex-col justify-center py-10
          lg:flex lg:w-[45%] lg:pl-16 lg:pr-10
          ${showHero
            ? 'flex w-full fixed inset-0 z-20 px-8 ' + (mounted ? 'animate-slide-left' : 'opacity-0')
            : 'hidden lg:flex ' + (mounted ? 'animate-slide-left' : 'opacity-0')
          }
        `}>

          {/* Background image + overlay */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg, rgba(10,20,50,0.88) 0%, rgba(30,64,175,0.80) 55%, rgba(37,99,235,0.72) 100%)' }} />
          </div>

          {/* Particles */}
          {particles.map((p, i) => (
            <Particle key={i} style={{
              width: p.width, height: p.height,
              top: p.top, left: p.left,
              animationDelay: p.animationDelay,
              ['--dur' as string]: p.animationDuration,
            }} />
          ))}

          {/* All left content in one block */}
          <div className="relative z-10 flex flex-col gap-5">

            {/* Logo */}
            <div className={mounted ? 'animate-slide-left' : 'opacity-0'}>
              <div className="[&_span]:!text-white [&_.text-gray-900]:!text-white [&_.text-brand-500]:!text-blue-300">
                <AppLogo size="md" />
              </div>
            </div>

            {/* Badge */}
            <div className={mounted ? 'animate-slide-left delay-100' : 'opacity-0'}>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/85 text-xs">Trusted by thousands of educators</span>
              </div>
            </div>

            {/* Heading + description */}
            <div className={mounted ? 'animate-slide-left delay-200' : 'opacity-0'}>
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-2">
                Grade smarter,<br />
                <span className="text-blue-300">not harder.</span>
              </h2>
              <p className="text-blue-100/80 text-sm leading-relaxed max-w-xs">
                Upload student PDFs and let AI evaluate, score, and provide detailed feedback in seconds.
              </p>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-4 pt-4 border-t border-white/15 ${mounted ? 'animate-fade-up delay-400' : 'opacity-0'}`}>
              {[['500+', 'Assignments'], ['24/7', 'AI Support'], ['100%', 'Secure']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-white font-bold text-xl">{val}</p>
                  <p className="text-blue-300 text-xs">{lbl}</p>
                </div>
              ))}
            </div>

            {/* Mobile CTA — skip hero */}
            <button
              onClick={() => setShowHero(false)}
              className="lg:hidden mt-2 w-full py-3 rounded-xl font-semibold text-sm text-white border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all animate-fade-up"
            >
              Get Started →
            </button>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className={`flex-1 flex items-center justify-center px-5 py-8 sm:px-8 bg-[#f8faff] ${showHero ? 'hidden lg:flex' : 'flex'}`}>
          <div className={`w-full max-w-sm ${mounted ? 'animate-slide-in-bottom' : 'opacity-0'}`}>

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-5 lg:hidden">
              <AppLogo size="md" />
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-100/60 border border-blue-50 p-5 sm:p-8">

              {/* Tab toggle */}
              <div className="flex bg-blue-50 rounded-xl p-1 mb-7">
                {(['login', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(''); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      mode === m
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Welcome back 👋' : 'Create account'}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {mode === 'login' ? 'Sign in to continue your journey' : 'Start grading with AI today'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="animate-fade-up">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Password</label>
                    {mode === 'login' && (
                      <span className="text-xs text-blue-500 cursor-pointer hover:text-blue-700 transition-colors">Forgot password?</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className={inputClass + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {showPass
                          ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-500 text-xs rounded-lg px-3 py-2 animate-fade-up">
                    <span className="shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>{mode === 'login' ? 'Sign In' : 'Create Account'} →</>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-blue-100" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-blue-100" />
              </div>

              <p className="text-center text-sm text-gray-500 pb-1">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              By continuing, you agree to our{' '}
              <span className="text-blue-500 cursor-pointer hover:underline">Terms</span> and{' '}
              <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
