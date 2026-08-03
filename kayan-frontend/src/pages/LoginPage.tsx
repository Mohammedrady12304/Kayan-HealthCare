import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { loginSchema, extractFieldErrors } from '../validation/auth.validation';
import { PasswordInput } from '../components/ui/PasswordInput';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(extractFieldErrors(result.error));
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const { token, user } = await loginApi(result.data.email, result.data.password);
      login(user, token);
      const roleRoutes: Record<string, string> = {
        PATIENT: '/patient',
        DOCTOR: '/doctor',
        FINANCE: '/finance',
      };
      navigate(roleRoutes[user.role]);
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded bg-ink flex items-center justify-center">
            <span className="font-display font-bold text-white text-base">K</span>
          </div>
          <span className="font-display font-semibold text-xl text-ink">Kayan</span>
        </div>

        <div className="bg-surface rounded-2xl border border-black/5 shadow-sm p-8">
          <h1 className="font-display font-semibold text-xl text-ink mb-1">Welcome back</h1>
          <p className="text-sm text-ink/50 mb-6">Sign in to manage your visits.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border bg-canvas text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 transition ${
                  fieldErrors.email
                    ? 'border-coral focus:ring-coral/30'
                    : 'border-black/10 focus:ring-teal/30 focus:border-teal'
                }`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="text-xs text-coral mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1.5">Password</label>
         <PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  hasError={!!fieldErrors.password}
  placeholder="••••••••"
/>
              {fieldErrors.password && <p className="text-xs text-coral mt-1">{fieldErrors.password}</p>}
            </div>

            {serverError && (
              <p className="text-xs text-coral bg-coral-light px-3 py-2 rounded-lg">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/90 disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/50 mt-6">
          No account?{' '}
          <Link to="/register" className="text-teal font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}