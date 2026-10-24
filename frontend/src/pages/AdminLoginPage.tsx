import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, publicApi } from '../services/api';
import { Canteen } from '../types';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const canteenSlug = searchParams.get('canteen');
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [isLoadingCanteen, setIsLoadingCanteen] = useState(Boolean(canteenSlug));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Fetch entity details if canteen param is present in URL
  useEffect(() => {
    let isMounted = true;
    if (!canteenSlug) {
      setIsLoadingCanteen(false);
      return;
    }

    const fetchEntity = async () => {
      try {
        const list = await publicApi.getCanteens();
        if (!isMounted) return;
        const matched = list.find(
          (c) => c.slug === canteenSlug || String(c.id) === canteenSlug
        );
        if (matched) {
          setCanteen(matched);
        }
      } catch (err) {
        console.error('Failed to load entity details for login:', err);
      } finally {
        if (isMounted) setIsLoadingCanteen(false);
      }
    };

    fetchEntity();
    return () => {
      isMounted = false;
    };
  }, [canteenSlug]);

  // Synchronize document title & browser favicon with entity branding
  useEffect(() => {
    if (canteen) {
      const title = canteen.page_title 
        ? `${canteen.page_title} - Staff Login`
        : `${canteen.name} - Staff Login`;
      document.title = title;

      const faviconUrl = canteen.favicon_url || canteen.full_favicon_url || canteen.full_logo_url || canteen.logo_url;
      if (faviconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = faviconUrl;
      }
    } else {
      document.title = 'Staff Portal Sign In';
    }
  }, [canteen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setErrors({});

    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
        canteen_slug: canteen?.slug,
      });

      login(response.token, response.user);

      // Automatically route according to account role and restaurant
      if (response.user.role === 'super_admin' || response.user.role === 'superadmin') {
        navigate('/super-admin', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 429) {
          setErrorMessage(err.response.data.message || 'Too many attempts. Please try again later.');
        } else if (err.response.status === 403) {
          setErrorMessage(
            err.response.data.message ||
              'Access denied. Your credentials are not authorized for this specific restaurant.'
          );
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

  const primaryColor = canteen?.primary_color || '#063D29';
  const accentColor = canteen?.accent_color || '#E8C928';
  const logoUrl = canteen?.full_logo_url || canteen?.logo_url || '/logo.png';
  const entityName = canteen?.name || (isLoadingCanteen ? 'Loading...' : 'Portal Sign In');
  const subtitle = canteen
    ? `${canteen.name} Staff & Manager Portal`
    : isLoadingCanteen
    ? 'Fetching venue details...'
    : 'Enter your credentials to access your restaurant or administration hub';
  const pageBgColor = canteen?.bg_color || '#FAF8F1';

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{ backgroundColor: pageBgColor }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Entity Logo & Title */}
        <div className="flex justify-center">
          {isLoadingCanteen ? (
            <div className="w-20 h-20 rounded-full bg-stone-200 animate-pulse border-2 border-stone-300" />
          ) : (
            <div
              className="w-20 h-20 rounded-full overflow-hidden p-1 shadow-lg transition-all duration-300"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 0 0 4px ${accentColor}60`,
              }}
            >
              <img
                src={logoUrl}
                alt={canteen?.name || 'Portal'}
                className="w-full h-full object-cover rounded-full bg-white"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/logo.png')) {
                    target.src = '/logo.png';
                  }
                }}
              />
            </div>
          )}
        </div>

        <h2 
          className="mt-4 text-center text-2xl sm:text-3xl font-extrabold font-serif tracking-tight"
          style={{ color: primaryColor }}
        >
          {entityName}
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-[#72776F]">
          {subtitle}
        </p>

        {canteen && (canteen.pure_veg_label || canteen.tagline) && (
          <div className="mt-2 flex justify-center">
            <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-stone-100 text-stone-700 border border-stone-200">
              {canteen.pure_veg_label || canteen.tagline}
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-[#E3E0D6]">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
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
                  placeholder={canteen ? `staff@${canteen.slug}.com` : 'manager@restaurant.com'}
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
                style={{ backgroundColor: primaryColor }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 hover:brightness-110"
              >
                {isLoading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>{canteen ? `Enter ${canteen.name} Hub` : 'Sign In to Control Hub'}</span>
                    <ArrowRight className="w-4 h-4 text-[#E8C928]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Links */}
        <div className="mt-6 text-center text-xs">
          <Link
            to={canteen?.slug ? `/menu?canteen=${canteen.slug}` : '/menu'}
            className="font-semibold text-[#075C35] hover:text-[#063D29] transition-colors underline"
          >
            ← Return to {canteen ? `${canteen.name} Menu` : 'Customer Menu'}
          </Link>
        </div>
      </div>
    </div>
  );
};
