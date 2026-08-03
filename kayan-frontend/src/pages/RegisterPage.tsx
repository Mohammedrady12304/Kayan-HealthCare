import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth.api';
import type { Role } from '../types';
import { registerSchema, extractFieldErrors } from '../validation/auth.validation';
import { PasswordInput } from '../components/ui/PasswordInput';

const ROLES: { value: Role; label: string }[] = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'FINANCE', label: 'Finance' },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('PATIENT');
  const [specialty, setSpecialty] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    const result = registerSchema.safeParse({
      fullName,
      email,
      password,
      specialty: role === 'DOCTOR' ? specialty : undefined,
    });

    if (!result.success) {
      setFieldErrors(extractFieldErrors(result.error));
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      await register({ ...result.data, role });
      navigate('/login');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  function inputClass(field: string) {
    return `w-full px-3 py-2.5 rounded-lg border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 transition ${
      fieldErrors[field]
        ? 'border-coral focus:ring-coral/30'
        : 'border-black/10 focus:ring-teal/30 focus:border-teal'
    }`;
  }

  function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${met ? 'text-teal' : 'text-ink/40'}`}>
      <span>{met ? '✓' : '○'}</span>
      <span>{label}</span>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded bg-ink flex items-center justify-center">
            <span className="font-display font-bold text-white text-base">K</span>
          </div>
          <span className="font-display font-semibold text-xl text-ink">Kayan</span>
        </div>

        <div className="bg-surface rounded-2xl border border-black/5 shadow-sm p-8">
          <h1 className="font-display font-semibold text-xl text-ink mb-1">Create account</h1>
          <p className="text-sm text-ink/50 mb-6">Choose your role to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1.5">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`py-2 rounded-lg text-xs font-medium border transition ${
                      role === r.value
                        ? 'bg-teal text-white border-teal'
                        : 'bg-canvas text-ink/60 border-black/10 hover:border-teal/40'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1.5">Full name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass('fullName')} />
              {fieldErrors.fullName && <p className="text-xs text-coral mt-1">{fieldErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass('email')} />
              {fieldErrors.email && <p className="text-xs text-coral mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1.5">Password</label>
             <PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  hasError={!!fieldErrors.password}
/>
{password.length > 0 && (
  <div className="mt-2 space-y-1">
    <PasswordRule met={password.length >= 8} label="At least 8 characters" />
    <PasswordRule met={/[a-z]/.test(password)} label="One lowercase letter" />
    <PasswordRule met={/[A-Z]/.test(password)} label="One uppercase letter" />
    <PasswordRule met={/[0-9]/.test(password)} label="One number" />
  </div>
)}
              {fieldErrors.password && <p className="text-xs text-coral mt-1">{fieldErrors.password}</p>}
            </div>

            {role === 'DOCTOR' && (
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5">Specialty</label>
                <input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className={inputClass('specialty')}
                  placeholder="e.g. Cardiology"
                />
              </div>
            )}

            {serverError && (
              <p className="text-xs text-coral bg-coral-light px-3 py-2 rounded-lg">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/90 disabled:opacity-50 transition"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/50 mt-6">
          Have an account?{' '}
          <Link to="/login" className="text-teal font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}