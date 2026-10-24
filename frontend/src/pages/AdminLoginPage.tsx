import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setErrors({});

    try {
      const response = await authApi.login({ email, password });
      login(response.token, response.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 429) {
          setErrorMessage(err.response.data.message || 'Too many attempts. Please try again later.');
        } else if (err.response.data.errors) {
          setErrors(err.response.data.errors);
          setErrorMessage(err.response.data.message || 'Validation failed.');
        } else {
          setErrorMessage(err.response.data.message || 'Invalid email or password.');
        }
      } else {
        setErrorMessage('Cannot connect to API server. Please ensure the backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Title */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#063D29] p-1 shadow-lg ring-4 ring-[#E8C928]/40">
            <img src="/logo.png" alt="Annapoorna Canteen" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold font-serif text-[#063D29] tracking-tight">
          Annapoorna Canteen
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-[#72776F]">
          Authorized Administrator Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-[#E3E0D6]">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72776F]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@annapoornacanteen.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075C35] focus:border-transparent transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.email[0]}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72776F]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075C35] focus:border-transparent transition-all"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.password[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#063D29] hover:bg-[#075C35] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Control Hub</span>
                    <ArrowRight className="w-4 h-4 text-[#E8C928]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick hint for initial seeded administrator */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-[11px] text-[#72776F]">
              Default Seeded Administrator: <br />
              <code className="text-[#075C35] font-semibold bg-[#FAF8F1] px-1.5 py-0.5 rounded border border-[#E3E0D6]">
                admin@annapoornacanteen.com
              </code>
              <span className="mx-1.5 text-stone-400">|</span>
              <code className="text-[#075C35] font-semibold bg-[#FAF8F1] px-1.5 py-0.5 rounded border border-[#E3E0D6]">
                Annapoorna@2026
              </code>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/menu"
            className="text-xs font-semibold text-[#075C35] hover:text-[#063D29] transition-colors underline"
          >
            ← Return to Customer Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
