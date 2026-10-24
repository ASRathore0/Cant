import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  PlusCircle,
  Palette,
  Users,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Layers,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  activeSection?: 'directory' | 'onboard' | 'studio' | 'managers';
  onSelectSection?: (section: 'directory' | 'onboard' | 'studio' | 'managers') => void;
  title?: string;
  subtitle?: string;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  children,
  activeSection = 'directory',
  onSelectSection,
  title = 'Multi-Establishment Command Hub',
  subtitle = 'Manage restaurants, cafes, themes, custom branding and manager credentials',
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      id: 'directory' as const,
      label: 'All Establishments',
      icon: Building2,
      description: 'Restaurants, Cafes & Canteens directory',
    },
    {
      id: 'onboard' as const,
      label: 'Onboard New Venue',
      icon: PlusCircle,
      description: 'Add new restaurant & manager credentials',
      badge: 'Quick Add',
    },
    {
      id: 'studio' as const,
      label: 'Design & Hero Studio',
      icon: Palette,
      description: 'Live customize themes, colors & hero stickers',
    },
    {
      id: 'managers' as const,
      label: 'Managers & Staff',
      icon: Users,
      description: 'Outlet managers login accounts & security',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#E2E8F0] flex flex-col font-sans selection:bg-[#10B981] selection:text-black">
      {/* Top Super Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0F1420]/95 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Portal Tag */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center shadow-lg shadow-[#10B981]/20 ring-1 ring-white/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight font-serif">
                    CANT CORE
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] hidden sm:block">
                  Enterprise Restaurant & Cafe Management Platform
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/menu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white bg-[#1E293B]/60 hover:bg-[#1E293B] border border-[#334155]/60 transition-colors"
              >
                <span>Live Public Menu</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#34D399]" />
              </Link>

              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white bg-[#1E293B]/60 hover:bg-[#1E293B] border border-[#334155]/60 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Single Outlet Hub</span>
              </Link>

              <div className="h-6 w-px bg-[#1E293B]" />

              {/* Super Admin Badge & Logout */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <div className="text-xs font-bold text-white">{user?.name || 'Platform Administrator'}</div>
                  <div className="text-[10px] text-[#64748B]">{user?.email || 'admin@canteen.com'}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out of Super Admin"
                  className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#94A3B8] hover:text-white rounded-lg bg-[#1E293B]"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 bg-[#0F1420] border-b border-[#1E293B] space-y-2">
            <div className="px-2 py-2 text-xs text-[#94A3B8] border-b border-[#1E293B]">
              Logged in as <strong className="text-white">{user?.email}</strong> (Super Admin)
            </div>
            <Link
              to="/menu"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-[#1E293B]/60 text-white"
            >
              <span>Customer Menu ↗</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#34D399]" />
            </Link>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[#1E293B]/60 text-white"
            >
              <LayoutDashboard className="w-4 h-4 text-[#60A5FA]" />
              <span>Switch to Single Outlet Admin</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Portal Breadcrumb & Master Title */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-2">
            <span>Platform Core</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#34D399]">Super Admin Studio</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
                {title}
              </h1>
              {subtitle && <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">{subtitle}</p>}
            </div>

            {/* Quick Action Buttons */}
            {onSelectSection && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectSection('onboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-black bg-[#10B981] hover:bg-[#059669] shadow-lg shadow-[#10B981]/25 transition-all transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Onboard New Establishment</span>
                </button>
              </div>
            )}
          </div>

          {/* Master Tabs Bar */}
          {onSelectSection && (
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#1E293B]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/10 rounded-t-lg'
                        : 'border-transparent text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-t-lg'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="relative">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-6 bg-[#0B0F17] text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Cant Enterprise Multi-Tenant Engine • Platform Version 2.0</span>
          <span className="text-[#10B981] flex items-center gap-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Availability Infrastructure Active
          </span>
        </div>
      </footer>
    </div>
  );
};
export default SuperAdminLayout;
