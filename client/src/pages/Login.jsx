import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const Login = () => {
  const { login: loginUser, user, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // If redirected from expirable token handler
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      showToast('Your session has expired. Please sign in again.', 'warning');
    }
  }, [location.search, showToast]);

  // If already logged in, redirect
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await loginUser(data.email, data.password);
    setLoading(false);
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-navy-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-radial-glow -z-10" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block text-3xl mb-2">🎯</Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-navy-400">Sign in to manage your job applications</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-400">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
                <FiMail />
              </span>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full pl-10 pr-4 glass-input ${errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </div>
            {errors.email && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-400">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
                <FiLock />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 glass-input ${errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
            </div>
            {errors.password && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full glass-btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-lg" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Redirect Link */}
        <div className="text-center text-sm pt-2">
          <span className="text-navy-400">Don't have an account? </span>
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
