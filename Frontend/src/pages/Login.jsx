import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';

import api from '../api/axios';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(
    () => Boolean(email.trim()) && Boolean(password.trim()),
    [email, password],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        username: email.trim(),
        password,
      });

      const { access, user } = response.data || {};

      if (!access || !user) {
        setError('Login failed');
        return;
      }

      login(access, { ...user, office: '401', theme: 'light' });
      navigate('/workspace');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  if (isAuth) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="flex items-center justify-end gap-3 border-b border-slate-100 bg-white/70 px-6 py-4 backdrop-blur">
        <p className="text-sm text-slate-600">Don&apos;t have an account?</p>
        <Link
          to="/register"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Sign up
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_520px] lg:py-14">
        <section className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-3 max-w-md text-base text-slate-600">
            Sign in and manage your workspace seamlessly.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiMail />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Stay organized</p>
                <p className="mt-1 text-sm text-slate-600">Keep your bookings and schedule in one place.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiLock />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Secure access</p>
                <p className="mt-1 text-sm text-slate-600">Your account helps keep your workspace data safe.</p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none mt-10 select-none lg:mt-14">
            <img
              src="/img/qe.png"
              alt=""
              className="w-full max-w-xl opacity-90 drop-shadow-[0_20px_35px_rgba(15,23,42,0.12)]"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <FiLock className="text-2xl" />
            </div>
          </div>

          <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Enter your details below to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="sr-only">Email address</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus-within:border-blue-500">
                <FiMail className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="h-full w-full bg-transparent text-sm outline-none"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus-within:border-blue-500">
                <FiLock className="text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="h-full w-full bg-transparent text-sm outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Sign in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
