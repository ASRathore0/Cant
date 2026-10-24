import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Lock, Menu, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RestaurantSettings } from '../types';

interface NavbarProps {
  settings: RestaurantSettings | null;
  activeCanteenSlug?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, activeCanteenSlug }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const phone = settings?.phone || '+91 98765 43210';
  const whatsapp = settings?.whatsapp || '+91 98765 43210';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const primaryColor = settings?.primary_color || '#062D1F';
  const secondaryColor = settings?.secondary_color || '#07402A';
  const accentColor = settings?.accent_color || '#E8C928';
  const logoUrl = settings?.full_logo_url || settings?.logo_url || '/logo.png';
  const restaurantName = settings?.restaurant_name || 'Annapoorna Canteen';
  const pureVegLabel = settings?.pure_veg_label || 'Pure Veg';
  const landmark = settings?.location_landmark || settings?.address || 'Gaur City Mall, Basement';

  return (
    <>
      <header
        className="sticky top-0 z-40 text-white shadow-app-bar border-b border-black/10 w-full max-w-full transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-xl lg:max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 w-full">
          {/* Brand identity (Left: Logo 'O', Center: Name 'XYZ') */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 lg:flex-initial">
            <Link
              to={activeCanteenSlug ? `/menu?canteen=${activeCanteenSlug}` : '/menu'}
              className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white p-0.5 shadow-xs shrink-0 hover:scale-105 transition-transform"
              style={{ border: `2px solid ${accentColor}` }}
              title={restaurantName}
            >
              <img
                src={logoUrl}
                alt={restaurantName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/logo.png')) {
                    target.src = '/logo.png';
                  }
                }}
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Link
                  to={activeCanteenSlug ? `/menu?canteen=${activeCanteenSlug}` : '/menu'}
                  className="text-sm sm:text-base lg:text-lg font-extrabold font-serif text-white tracking-tight truncate leading-none hover:underline"
                >
                  {restaurantName}
                </Link>
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase shrink-0 shadow-2xs"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {pureVegLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-stone-300 mt-0.5 truncate">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: accentColor }} />
                <span className="truncate">{landmark}</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="hidden sm:inline font-bold text-[9px] sm:text-xs shrink-0 uppercase" style={{ color: accentColor }}>Open Daily</span>
              </div>
            </div>
          </div>

          {/* Center badge on desktop: Timings */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Kitchen: <strong>{settings?.opening_hours || '08:00 AM – 10:30 PM'}</strong></span>
          </div>

          {/* Right Action Buttons & Mobile Hamburger ('≡') */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop Action Buttons */}
            {phone && (
              <a
                href={`tel:${cleanPhone}`}
                className="hidden md:inline-flex h-8 lg:h-9 px-2.5 lg:px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 items-center justify-center gap-1.5 transition-all active:scale-95 text-xs font-bold"
                style={{ color: accentColor }}
                title="Call Counter"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="text-white/90">Call:</span>
                <span style={{ color: accentColor }}>{phone}</span>
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello ${restaurantName}, I would like to inquire about today's fresh menu or place an order.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 lg:h-9 px-2.5 lg:px-3.5 rounded-full text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs font-bold shadow-xs hover:brightness-110"
                style={{ backgroundColor: secondaryColor }}
                title="WhatsApp Order"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">WhatsApp Order</span>
              </a>
            )}

            {/* Staff / Manager Login */}
            <Link
              to={activeCanteenSlug || settings?.slug ? `/admin/login?canteen=${activeCanteenSlug || settings?.slug}` : '/admin/login'}
              className="hidden lg:inline-flex h-8 lg:h-9 px-2 lg:px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-300 items-center justify-center gap-1 transition-colors text-xs font-medium"
              title="Staff Login"
            >
              <Lock className="w-3.5 h-3.5 text-stone-300" />
              <span>Staff</span>
            </Link>

            {/* Hamburger Button ('≡' as in user sketch) */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all active:scale-90"
              title="Open Navigation Menu"
              aria-label="Navigation Menu"
            >
              <Menu className="w-4 h-4" style={{ color: accentColor }} />
            </button>
          </div>
        </div>
      </header>

      {/* Slideout Navigation Drawer (From Hamburger '≡') */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-80 max-w-[85vw] h-full text-white p-5 flex flex-col justify-between shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300"
            style={{ backgroundColor: primaryColor }}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5"
                    style={{ border: `1.5px solid ${accentColor}` }}
                  >
                    <img
                      src={logoUrl}
                      alt={restaurantName}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/logo.png')) {
                          target.src = '/logo.png';
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-sm text-white">{restaurantName}</h4>
                    <span className="text-[10px] font-bold uppercase" style={{ color: accentColor }}>{pureVegLabel}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions List */}
              <div className="py-4 space-y-2.5">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Contact & Assistance
                </div>

                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all"
                >
                  <div className="p-2 rounded-lg bg-amber-400 text-stone-950">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-300">Call Front Counter</div>
                    <div>{phone}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Annapoorna Canteen, I would like to inquire about today\'s fresh menu or place an order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#15803d]/80 hover:bg-[#15803d] text-white text-xs font-bold transition-all"
                >
                  <div className="p-2 rounded-lg bg-white text-[#15803d]">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-200">Instant Chat & Order</div>
                    <div>WhatsApp Counter</div>
                  </div>
                </a>

                <div className="px-3 py-2.5 rounded-xl bg-white/5 text-stone-300 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-200 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kitchen Hours</span>
                  </div>
                  <div className="text-[11px] text-stone-300 pl-5.5">
                    {settings?.opening_hours || '08:00 AM – 10:30 PM (Everyday)'}
                  </div>
                  <div className="flex items-center gap-2 text-stone-200 font-bold pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>Location</span>
                  </div>
                  <div className="text-[11px] text-stone-300 pl-5.5">
                    {landmark}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Staff Login */}
            <div className="pt-4 border-t border-white/10">
              <Link
                to={activeCanteenSlug || settings?.slug ? `/admin/login?canteen=${activeCanteenSlug || settings?.slug}` : '/admin/login'}
                onClick={() => setIsDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white text-xs font-bold transition-all border border-white/10"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff & Management Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
