import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { register as registerApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { RegisterPayload } from '../types';
import styles from './AuthPage.module.css';

/**
 * Registration page — creates a new user account.
 * On success, automatically logs the user in and redirects to home.
 */
export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterPayload & { confirmPassword: string }>();

  const mutation = useMutation({
    mutationFn: (data: RegisterPayload) => registerApi(data),
    onSuccess: (data) => {
      login(data);
      toast.success(`Account created! Welcome, ${data.username}!`);
      navigate('/');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  const handleSubmitForm = (data: RegisterPayload & { confirmPassword: string }) => {
    const { confirmPassword: _cp, ...payload } = data;
    void _cp; // suppress unused variable warning
    mutation.mutate(payload);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}><BookOpen size={24} strokeWidth={2} /></div>
          <h1 className={styles.logoText}>BookVault</h1>
        </div>

        <h2 className={styles.heading}>Create an account</h2>
        <p className={styles.subheading}>Join BookVault</p>

        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)} noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <div className={styles.inputWrap}>
              <User size={15} className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                className={`form-input ${styles.inputPadded} ${errors.username ? 'error' : ''}`}
                {...register('username', {
                  required: 'Username is required.',
                  minLength: { value: 3, message: 'Username must be at least 3 characters.' },
                  maxLength: { value: 50, message: 'Username must be 50 characters or fewer.' },
                })}
              />
            </div>
            {errors.username && <span className="form-error" role="alert">⚠ {errors.username.message}</span>}
          </div>

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
                placeholder="At least 6 characters"
                className={`form-input ${styles.inputPaddedBoth} ${errors.password ? 'error' : ''}`}
                {...register('password', {
                  required: 'Password is required.',
                  minLength: { value: 6, message: 'Password must be at least 6 characters.' },
                })}
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                className={`form-input ${styles.inputPadded} ${errors.confirmPassword ? 'error' : ''}`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password.',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match.',
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="form-error" role="alert">⚠ {errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles.submitBtn}`}
            disabled={mutation.isPending}
            id="register-submit-btn"
          >
            {mutation.isPending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Already have an account?{' '}
            <Link to="/auth/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
