import React from 'react';
import { Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface SpotlightSectionProps {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bgColor?: string;
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  items,
  onSelect,
  primaryColor = '#062D1F',
  secondaryColor = '#075C35',
  accentColor = '#E8C928',
  bgColor = '#FAF8F1',
}) => {
  const featuredItems = items.filter((item) => item.is_featured);

  if (featuredItems.length === 0) return null;

  return (
    <div className="w-full max-w-full overflow-hidden pt-2.5 pb-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <h3 className="font-serif font-black text-xs sm:text-sm tracking-tight" style={{ color: primaryColor }}>
            Customer Favourites
          </h3>
          <span
            className="text-[9px] font-bold px-1.5 py-0.2 rounded-full border"
            style={{
              color: secondaryColor,
              backgroundColor: `${accentColor}25`,
              borderColor: `${accentColor}50`,
            }}
          >
            Top Picks
          </span>
        </div>
        <span className="text-[10px] text-[#72776F] font-semibold">Swipe →</span>
      </div>

      {/* Horizontal Carousel */}
      <div className="w-full max-w-full flex items-stretch gap-2.5 sm:gap-3.5 lg:gap-4 overflow-x-auto no-scrollbar pb-1.5 pt-0.5 snap-x-mandatory">
        {featuredItems.map((item) => {
          const isAvailable = item.is_available;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="snap-start shrink-0 w-36 sm:w-44 lg:w-52 bg-white rounded-2xl border border-stone-200/90 shadow-app-card hover:shadow-spotlight transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-95 group hover:-translate-y-1"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      !isAvailable ? 'grayscale contrast-75' : ''
                    }`}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-serif font-bold text-sm"
                    style={{ backgroundColor: bgColor, color: primaryColor }}
                  >
                    {item.name[0]}
                  </div>
                )}

                {/* Pure Veg Badge */}
                <div className="absolute top-1.5 left-1.5 z-10 bg-white/95 backdrop-blur-xs p-0.5 rounded shadow-xs">
                  <div className="w-3 h-3 border-[1.5px] border-[#15803d] rounded-[2px] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                  </div>
                </div>

                {/* Unavailable overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                    <span className="bg-red-600 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-md">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#1A1D1A] group-hover:text-stone-900 transition-colors line-clamp-1 leading-snug">
                    {item.name}
                  </h4>
                  {item.serving_info && (
                    <p className="text-[9px] text-[#72776F] line-clamp-1 mt-0.5">
                      {item.serving_info}
                    </p>
                  )}
                </div>

                {/* Price & Action Row */}
                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-serif font-black text-xs" style={{ color: secondaryColor }}>
                    {item.formatted_price}
                  </span>

                  <span
                    className="px-1.5 py-0.5 rounded border border-stone-200 text-[9px] font-bold transition-all group-hover:text-white"
                    style={{
                      backgroundColor: bgColor,
                      color: primaryColor,
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
