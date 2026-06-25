import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login as loginApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { LoginPayload } from '../types';
import styles from './AuthPage.module.css';

/**
 * Login page — allows existing users to authenticate and receive a JWT token.
 * On success, stores the token in localStorage and redirects to the home page.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data);
      toast.success(`Welcome back, ${data.username}!`);
      navigate('/');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Invalid email or password.';
      toast.error(message);
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}><BookOpen size={24} strokeWidth={2} /></div>
          <h1 className={styles.logoText}>LibraryMS</h1>
        </div>

        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.subheading}>Sign in to manage your library collection</p>

        <form
          className={styles.form}
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          noValidate
        >
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className={styles.inputWrap}>
              <Mail size={15} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`form-input ${styles.inputPadded} ${errors.email ? 'error' : ''}`}
                {...register('email', {
                  required: 'Email is required.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
                })}
              />
            </div>
            {errors.email && <span className="form-error" role="alert">⚠ {errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                className={`form-input ${styles.inputPaddedBoth} ${errors.password ? 'error' : ''}`}
                {...register('password', { required: 'Password is required.' })}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="form-error" role="alert">⚠ {errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles.submitBtn}`}
            disabled={mutation.isPending}
            id="login-submit-btn"
          >
            {mutation.isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account?{' '}
            <Link to="/auth/register" className={styles.switchLink}>Create one</Link>
          </p>
          <div className={styles.divider} />
          <p className={styles.guestHint}>
            Or{' '}
            <Link to="/" className={styles.switchLink}>browse the library as a guest</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
