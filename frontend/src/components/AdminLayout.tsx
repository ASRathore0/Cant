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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Menu Items', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Super Admin & Canteens', path: '/admin/canteens', icon: Building2 },
    { name: 'Settings & QR', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col md:flex-row text-[#20251F]">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#063D29] text-white px-4 py-3 flex items-center justify-between border-b border-[#075C35]">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Annapoorna" className="w-8 h-8 rounded-full bg-white p-0.5" />
          <span className="font-serif font-bold text-base">Annapoorna Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-white hover:text-[#E8C928]"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-[#063D29] text-stone-200 flex flex-col justify-between p-4 shadow-xl transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header in sidebar */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 px-2">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 shadow-md flex-shrink-0">
              <img src="/logo.png" alt="Annapoorna Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white leading-tight">Annapoorna</h2>
              <span className="text-[11px] font-semibold text-[#E8C928] tracking-wider uppercase">
                Control Hub
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
                        ? 'bg-[#075C35] text-white shadow-md border-l-4 border-[#E8C928]'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#E8C928]" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Shortcut to Customer View */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              <span className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#E8C928]" />
                <span>View Public Menu</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-white/10">
          <div className="px-3 py-2 flex items-center gap-3 rounded-xl bg-white/5 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#075C35] flex items-center justify-center text-white font-bold text-xs">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-stone-400 truncate">{user?.email || 'admin@annapoorna.com'}</p>
            </div>
          </div>

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
