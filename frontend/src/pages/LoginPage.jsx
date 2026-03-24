import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      nextErrors.email = 'Invalid email format';
    }
    if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    const success = await login(formData);
    if (success) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="glass panel w-full max-w-md rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          <span className="text-gradient">Welcome back</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue managing your tasks.</p>

        <div className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              className="field w-full rounded-xl px-4 py-2.5"
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              className="field w-full rounded-xl px-4 py-2.5"
            />
            {errors.password ? <p className="mt-1 text-xs text-rose-500">{errors.password}</p> : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gradient-btn mt-6 w-full rounded-xl px-4 py-2.5 font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link className="font-semibold text-indigo-600 dark:text-indigo-300" to="/signup">
            Create account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default LoginPage;
