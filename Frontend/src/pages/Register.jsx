import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';

import api from '../api/axios';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) return false;
    if (!agree) return false;
    return true;
  }, [agree, confirmPassword, email, name, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Please fill all fields and accept the terms');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api.post('/auth/register', {
        username: email.trim(),
        password,
        email: email.trim(),
        name: name.trim(),
      });

      const loginResponse = await api.post('/auth/login', {
        username: email.trim(),
        password,
      });

      const { access, user } = loginResponse.data || {};

      if (!access || !user) {
        setError('Registration succeeded, but login failed');
        return;
      }

      login(access, { ...user, office: '401', theme: 'light' });
      navigate('/workspace');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  if (isAuth) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="flex items-center justify-end gap-3 border-b border-slate-100 bg-white/70 px-6 py-4 backdrop-blur">
        <p className="text-sm text-slate-600">Already have an account?</p>
        <Link
          to="/login"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Sign in
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_520px] lg:py-14">
        <section className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-3 max-w-md text-base text-slate-600">
            Join and manage your workspace seamlessly.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiUser />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Book desks and meeting rooms</p>
                <p className="mt-1 text-sm text-slate-600">Find and reserve the perfect space in seconds.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiLock />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Track your workspace usage</p>
                <p className="mt-1 text-sm text-slate-600">Get insights and optimize your productivity.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiMail />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Stay updated in real-time</p>
                <p className="mt-1 text-sm text-slate-600">Receive instant notifications and important updates.</p>
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
              <FiUser className="text-2xl" />
            </div>
          </div>

          <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Fill in the details below to get started.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="sr-only">Full name</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus-within:border-blue-500">
                <FiUser className="text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  className="h-full w-full bg-transparent text-sm outline-none"
                  autoComplete="name"
                />
              </div>
            </label>

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
                  autoComplete="new-password"
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

            <label className="block">
              <span className="sr-only">Confirm password</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus-within:border-blue-500">
                <FiLock className="text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  className="h-full w-full bg-transparent text-sm outline-none"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="text-slate-400 transition hover:text-slate-600"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-3 pt-1 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) => setAgree(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I agree to the{' '}
                <a className="font-medium text-blue-600 hover:underline" href="#">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a className="font-medium text-blue-600 hover:underline" href="#">
                  Privacy Policy
                </a>
              </span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Create Account
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Register;
