import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Settings,
  QrCode,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  User as UserIcon,
  Building2,
  Palette,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isEmulating = typeof window !== 'undefined' && !!localStorage.getItem('emulating_from_super_admin');

  const handleLogout = async () => {
    localStorage.removeItem('emulating_from_super_admin');
    await logout();
    navigate('/admin/login');
  };

  const handleExitEmulation = () => {
    const raw = localStorage.getItem('emulating_from_super_admin');
    if (raw) {
      try {
        const { token: savedToken, user: savedUser } = JSON.parse(raw);
        localStorage.removeItem('emulating_from_super_admin');
        login(savedToken, savedUser);
        navigate('/super-admin');
        return;
      } catch (e) {
        console.error('Failed to parse super admin session', e);
      }
    }
    localStorage.removeItem('emulating_from_super_admin');
    navigate('/super-admin');
  };

  const isSuperAdminUser = user?.role === 'super_admin' || user?.role === 'superadmin';

  React.useEffect(() => {
    const restaurantName = user?.canteen?.name || 'Restaurant';
    document.title = `${title} | ${restaurantName} Control Hub`;

    const fav = (user?.canteen as any)?.full_favicon_url || (user?.canteen as any)?.favicon_url || user?.canteen?.logo_url;
    if (fav) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = fav;
    }
  }, [user, title]);

  const isBillingEnabled = isSuperAdminUser || ((user?.canteen as any)?.billing_enabled !== false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ...(isBillingEnabled ? [
      { name: 'POS & Billing', path: '/admin/pos', icon: Receipt },
    ] : []),
    { name: 'Menu Items', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    ...(isSuperAdminUser ? [
      { name: 'Super Admin Portal', path: '/super-admin', icon: Building2 }
    ] : []),
    { name: 'Settings & QR', path: '/admin/settings', icon: Settings },
  ];

  const restaurantName = user?.canteen?.name || (isSuperAdminUser ? 'Platform Super Admin' : 'Restaurant Portal');
  const restaurantLogo = user?.canteen?.logo_url || '/logo.png';
  const canteenSlug = user?.canteen?.slug || '';
  const publicMenuUrl = canteenSlug ? `/menu?canteen=${canteenSlug}` : '/menu';
  const primaryColor = user?.canteen?.primary_color || '#063D29';
  const secondaryColor = user?.canteen?.secondary_color || '#075C35';
  const accentColor = user?.canteen?.accent_color || '#E8C928';

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col md:flex-row text-[#20251F]">
      {/* Mobile Top Navbar */}
      <div
        className="md:hidden text-white px-4 py-3 flex items-center justify-between border-b border-black/10"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2.5 truncate">
          <img src={restaurantLogo} alt={restaurantName} className="w-8 h-8 rounded-full bg-white p-0.5 object-cover shrink-0" />
          <span className="font-serif font-bold text-base truncate">{restaurantName}</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-white hover:opacity-80"
          style={{ color: accentColor }}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 text-stone-200 flex flex-col justify-between p-4 shadow-xl transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          {/* Brand header in sidebar */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 px-2">
            <div
              className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 shadow-md flex-shrink-0"
              style={{ border: `2px solid ${accentColor}` }}
            >
              <img src={restaurantLogo} alt={restaurantName} className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="truncate min-w-0">
              <h2 className="font-serif font-bold text-base sm:text-lg text-white leading-tight truncate">
                {restaurantName}
              </h2>
              <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: accentColor }}>
                {isSuperAdminUser ? 'Platform Hub' : 'Manager Hub'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-md border-l-4'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: secondaryColor, borderLeftColor: accentColor } : {}}
                >
                  <Icon className="w-4 h-4" style={{ color: accentColor }} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Shortcut to Customer View */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to={publicMenuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              <span className="flex items-center gap-2 truncate">
                <QrCode className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                <span className="truncate">View Public Menu</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </Link>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-white/10">
          <div className="px-3 py-2 flex items-center gap-3 rounded-xl bg-white/5 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: secondaryColor }}
            >
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-stone-400 truncate">{user?.email || 'admin@canteen.com'}</p>
            </div>
          </div>

          {isEmulating && (
            <button
              onClick={handleExitEmulation}
              className="w-full mb-2 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl transition-all shadow-sm active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Exit Emulation</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Super Admin Emulation Active Notification Bar */}
        {isEmulating && (
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 sm:px-8 py-2.5 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between gap-3 shadow-md z-30">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span>
                <strong>Emulation Active:</strong> Logged in without password as <strong>{user?.name}</strong> for <strong>{restaurantName}</strong>.
              </span>
            </div>
            <button
              onClick={handleExitEmulation}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-stone-900 hover:bg-amber-50 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Exit Emulation & Return to Super Admin</span>
            </button>
          </div>
        )}

        {/* Workspace Top Header */}
        <header className="bg-white border-b border-[#E3E0D6] px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#063D29] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#72776F] mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#72776F]">
            <span className="inline-flex items-center gap-1 bg-[#FAF8F1] px-2.5 py-1 rounded-md border border-[#E3E0D6] font-medium">
              <Shield className="w-3.5 h-3.5 text-[#075C35]" />
              Sanctum Protected Session
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
