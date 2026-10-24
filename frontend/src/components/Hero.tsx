import React from 'react';
import { RestaurantSettings, HeroTrioItem } from '../types';

export const DEFAULT_HERO_TRIO: HeroTrioItem[] = [
  {
    id: 'left',
    name: 'Burger',
    price: '₹85',
    searchTerm: 'burger',
    stickerUrl: '/stickers/burger.jpg',
  },
  {
    id: 'center',
    name: 'Hot Chai',
    price: '₹20',
    searchTerm: 'tea',
    stickerUrl: '/stickers/tea.jpg',
    showSteam: true,
  },
  {
    id: 'right',
    name: 'Samosa',
    price: '₹25 / pc',
    searchTerm: 'samosa',
    stickerUrl: '/stickers/samosa.jpg',
  },
];

interface HeroProps {
  settings: RestaurantSettings | null;
  onSelectCraving?: (searchQuery: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onSelectCraving }) => {
  const rawTrio = settings?.hero_trio;
  const trioList: HeroTrioItem[] = Array.isArray(rawTrio) && rawTrio.length >= 3
    ? rawTrio
    : DEFAULT_HERO_TRIO;

  const leftItem = trioList.find((i) => i.id === 'left') || trioList[0] || DEFAULT_HERO_TRIO[0];
  const centerItem = trioList.find((i) => i.id === 'center') || trioList[1] || DEFAULT_HERO_TRIO[1];
  const rightItem = trioList.find((i) => i.id === 'right') || trioList[2] || DEFAULT_HERO_TRIO[2];

  const heroHeading = settings?.hero_heading || 'Freshly Cooked & Brewed Daily';
  const heroBadge = settings?.hero_badge || "Today's Specials";

  const primaryColor = settings?.primary_color || '#062D1F';
  const secondaryColor = settings?.secondary_color || '#07402A';
  const accentColor = settings?.accent_color || '#E8C928';

  const handleSelectItem = (item: HeroTrioItem) => {
    if (onSelectCraving && item.searchTerm) {
      onSelectCraving(item.searchTerm);
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden pt-2.5 pb-1 lg:pt-3 lg:pb-2">
      <div className="max-w-xl lg:max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
        {/* ========================================================================= */}
        {/* TRIO HERO STAGE (Matching User Sketch: Delicacy 1 + Center + Delicacy 3)  */}
        {/* ========================================================================= */}
        <div
          className="relative rounded-3xl lg:rounded-[36px] overflow-hidden border border-black/10 shadow-app-card transition-all duration-500 py-3.5 sm:py-5 lg:py-6 px-3 sm:px-6"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${accentColor}28 0%, ${secondaryColor}f2 70%, ${primaryColor} 100%)`,
          }}
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          {/* Minimalist Top Bar: Fresh Canteen Quality */}
          <div className="relative z-10 flex items-center justify-between px-2 mb-1.5 sm:mb-2 text-stone-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide uppercase font-serif">
                {heroHeading}
              </span>
            </div>
            {heroBadge && (
              <span
                className="text-[10px] sm:text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/10"
                style={{ color: accentColor }}
              >
                {heroBadge}
              </span>
            )}
          </div>

          {/* THE TRIO COMPOSITION: (Left, Center, Right) */}
          <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 lg:gap-12 py-1.5 sm:py-2.5">
            {/* LEFT: Round Delicacy */}
            <div
              id="hero-trio-left"
              onClick={() => handleSelectItem(leftItem)}
              role="button"
              tabIndex={0}
              className="flex-1 max-w-[105px] sm:max-w-[150px] lg:max-w-[190px] flex flex-col items-center cursor-pointer group active:scale-95 transition-transform select-none"
              title={`Filter ${leftItem.name} in Menu`}
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 flex items-center justify-center animate-food-float-delayed transform -rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/35 border border-white/15 shadow-xl flex items-center justify-center p-1 group-hover:border-white/40 transition-colors">
                  <img
                    src={leftItem.stickerUrl || '/stickers/burger.jpg'}
                    alt={leftItem.name}
                    className="w-full h-full object-cover filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                  />
                </div>
              </div>
              {/* Pill Label */}
              <div
                className="mt-1.5 sm:mt-2.5 inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 rounded-full border border-white/20 transition-colors shadow-2xs"
                style={{ color: accentColor }}
              >
                {leftItem.price && <span>{leftItem.price}</span>}
                {leftItem.price && <span className="text-white/60">•</span>}
                <span>{leftItem.name}</span>
              </div>
            </div>

            {/* CENTER: Steaming Center Delicacy */}
            <div
              id="hero-trio-center"
              onClick={() => handleSelectItem(centerItem)}
              role="button"
              tabIndex={0}
              className="flex-1 max-w-[125px] sm:max-w-[180px] lg:max-w-[230px] flex flex-col items-center cursor-pointer group active:scale-95 transition-transform select-none z-20"
              title={`Filter ${centerItem.name} in Menu`}
            >
              {/* Optional Animated Rising Steam Wisps */}
              <div className="relative w-24 h-24 sm:w-34 sm:h-34 lg:w-44 lg:h-44 flex items-center justify-center animate-food-float transform group-hover:scale-105 transition-all duration-300">
                {centerItem.showSteam !== false && (
                  <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 sm:gap-1.5 pointer-events-none z-30">
                    <span className="w-1.5 sm:w-2 h-5 sm:h-8 bg-gradient-to-t from-white/70 via-amber-100/50 to-transparent rounded-full blur-[1px] animate-steam-1" />
                    <span className="w-2 sm:w-2.5 h-7 sm:h-11 bg-gradient-to-t from-white/85 via-amber-100/60 to-transparent rounded-full blur-[1px] animate-steam-2" />
                    <span className="w-1.5 sm:w-2 h-4 sm:h-7 bg-gradient-to-t from-white/70 via-amber-100/50 to-transparent rounded-full blur-[1px] animate-steam-3" />
                  </div>
                )}

                {/* Glowing Aura Behind Center Item */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                />

                <div
                  className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/45 border shadow-2xl flex items-center justify-center p-1 transition-colors"
                  style={{ borderColor: `${accentColor}60` }}
                >
                  <img
                    src={centerItem.stickerUrl || '/stickers/tea.jpg'}
                    alt={centerItem.name}
                    className="w-full h-full object-cover filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>

              {/* Pill Label for Center Delicacy */}
              <div
                className="mt-1.5 sm:mt-2.5 inline-flex items-center gap-1 text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-0.5 rounded-full shadow-md ring-2"
                style={{
                  backgroundColor: accentColor,
                  color: primaryColor,
                  boxShadow: `0 0 12px ${accentColor}60`,
                }}
              >
                {centerItem.price && <span>{centerItem.price}</span>}
                {centerItem.price && <span className="opacity-70">•</span>}
                <span>{centerItem.name}</span>
              </div>
            </div>

            {/* RIGHT: Delicacy 3 */}
            <div
              id="hero-trio-right"
              onClick={() => handleSelectItem(rightItem)}
              role="button"
              tabIndex={0}
              className="flex-1 max-w-[105px] sm:max-w-[150px] lg:max-w-[190px] flex flex-col items-center cursor-pointer group active:scale-95 transition-transform select-none"
              title={`Filter ${rightItem.name} in Menu`}
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 flex items-center justify-center animate-food-float transform rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black/35 border border-white/15 shadow-xl flex items-center justify-center p-1 group-hover:border-white/40 transition-colors">
                  <img
                    src={rightItem.stickerUrl || '/stickers/samosa.jpg'}
                    alt={rightItem.name}
                    className="w-full h-full object-cover filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                  />
                </div>
              </div>
              {/* Pill Label */}
              <div
                className="mt-1.5 sm:mt-2.5 inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 rounded-full border border-white/20 transition-colors shadow-2xs"
                style={{ color: accentColor }}
              >
                {rightItem.price && <span>{rightItem.price}</span>}
                {rightItem.price && <span className="text-white/60">•</span>}
                <span>{rightItem.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
