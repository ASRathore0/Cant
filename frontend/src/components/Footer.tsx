import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Award, Heart } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface FooterProps {
  settings: RestaurantSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const phone = settings?.phone || '+91 98765 43210';
  const whatsapp = settings?.whatsapp || '+91 98765 43210';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const isArmyDiscountActive =
    settings?.discount_badge_enabled === true ||
    settings?.discount_badge_enabled === '1' ||
    settings?.army_discount_enabled === '1' ||
    settings?.army_discount_enabled === true;

  const primaryColor = settings?.primary_color || '#063D29';
  const secondaryColor = settings?.secondary_color || '#075C35';
  const accentColor = settings?.accent_color || '#E8C928';
  const logoUrl = settings?.full_logo_url || settings?.logo_url || (settings?.slug === 'annapoorna' ? '/logo.png' : '');
  const restaurantName = settings?.restaurant_name || 'Digital Menu';
  const tagline = settings?.tagline || 'Good Food • Made Fresh • Served With Respect';

  return (
    <footer
      className="text-stone-200 mt-10 border-t-2 pb-20 sm:pb-8 transition-colors duration-300"
      style={{ backgroundColor: primaryColor, borderTopColor: secondaryColor }}
    >
      <div className="max-w-xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6 lg:space-y-8">
        {/* Brand identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-sm flex-shrink-0 flex items-center justify-center"
              style={{ border: `2px solid ${accentColor}` }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={restaurantName} className="w-full h-full object-cover rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center font-black text-base select-none"
                  style={{ backgroundColor: primaryColor, color: accentColor }}
                >
                  {restaurantName.charAt(0) || '🍽️'}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-serif font-black text-lg sm:text-xl text-white leading-tight">
                {restaurantName}
              </h4>
              <p className="text-xs font-bold" style={{ color: accentColor }}>
                {tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {phone && (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 py-2 px-3.5 hover:bg-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
                style={{ backgroundColor: accentColor, color: primaryColor }}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Counter</span>
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello ${restaurantName}, I would like to place an order or inquire about catering.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-2 px-3.5 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
                style={{ backgroundColor: secondaryColor }}
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp Order</span>
              </a>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Location */}
          <div className="flex items-start gap-2.5 bg-white/5 p-4 rounded-xl border border-white/10">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
            <div>
              <p className="font-bold text-white text-sm">Counter Location</p>
              <p className="text-stone-300 mt-1 leading-relaxed">
                {settings?.address || settings?.location_landmark || 'Fresh food served daily with care & quality ingredients.'}
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-2.5 bg-white/5 p-4 rounded-xl border border-white/10">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
            <div>
              <p className="font-bold text-white text-sm">Kitchen Timings</p>
              <p className="text-stone-300 mt-1 leading-relaxed">
                {settings?.opening_hours || '08:00 AM – 10:30 PM (All 7 Days Open)'}
              </p>
            </div>
          </div>

          {/* Office & Special Offers */}
          <div className="flex items-start gap-2.5 bg-white/5 p-4 rounded-xl border border-white/10 sm:col-span-2 lg:col-span-1">
            <Award className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
            <div>
              <p className="font-bold text-white text-sm">
                {settings?.discount_badge_title || 'Discounts & Offers'}
              </p>
              <p className="text-stone-300 mt-1 leading-relaxed">
                {isArmyDiscountActive
                  ? (settings?.discount_badge_text || settings?.army_discount_text || 'Special discount available at counter.')
                  : (settings?.discount_badge_text || 'Fresh food prepared daily with highest quality ingredients.')}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10 text-center text-[11px] sm:text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {restaurantName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
