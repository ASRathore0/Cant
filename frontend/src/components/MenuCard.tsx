import React from 'react';
import { Sparkles, Info, ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bgColor?: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onSelect,
  primaryColor = '#062D1F',
  secondaryColor = '#075C35',
  accentColor = '#E8C928',
  bgColor = '#FAF8F1',
}) => {
  const isAvailable = item.is_available;

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className={`group relative bg-white rounded-2xl lg:rounded-3xl border transition-all duration-200 p-3 sm:p-3.5 lg:p-4 flex items-start gap-2.5 sm:gap-3.5 lg:gap-4 cursor-pointer active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-md ${
        isAvailable
          ? 'border-stone-200/90 shadow-app-card'
          : 'border-stone-200 bg-stone-50/70 opacity-75'
      }`}
    >
      {/* Left Details Column */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div>
          {/* Top Indicators: Veg Dot & Badges */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {/* Pure Veg Green Dot Icon */}
            <div className="w-3.5 h-3.5 border-[1.5px] border-[#15803d] rounded-[2px] flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
            </div>

            {item.is_featured && isAvailable && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold border"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: primaryColor,
                  borderColor: `${accentColor}50`,
                }}
              >
                <Sparkles className="w-2.5 h-2.5" style={{ color: primaryColor }} />
                Bestseller
              </span>
            )}

            {item.category_name && (
              <span className="text-[9px] sm:text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded truncate max-w-[140px]">
                {item.category_name}
              </span>
            )}

            {!isAvailable && (
              <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded uppercase">
                Sold Out
              </span>
            )}
          </div>

          {/* Item Name */}
          <h4 className="font-serif font-bold text-xs sm:text-[15px] lg:text-base text-[#1A1D1A] group-hover:text-stone-900 transition-colors leading-snug line-clamp-2">
            {item.name}
          </h4>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-black text-xs sm:text-[15px] lg:text-base" style={{ color: secondaryColor }}>
              {item.formatted_price}
            </span>
            {item.price_type === 'mrp' && (
              <span className="text-[9px] sm:text-[10px] text-[#72776F] font-semibold">Sold on MRP</span>
            )}
          </div>

          {/* Short Description */}
          {item.description && (
            <p className="mt-1 text-[11px] sm:text-xs text-[#72776F] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Pricing Note (for ranges or flags like Poha, Chai/Coffee, Shakes) */}
          {item.pricing_note && (
            <div
              className="mt-1.5 inline-flex items-center gap-1 text-[9px] sm:text-[10px] rounded px-1.5 py-0.5 max-w-full font-medium border"
              style={{
                color: primaryColor,
                backgroundColor: bgColor,
                borderColor: `${primaryColor}20`,
              }}
            >
              <Info className="w-2.5 h-2.5 shrink-0" style={{ color: accentColor }} />
              <span className="truncate">{item.pricing_note}</span>
            </div>
          )}
        </div>

        {/* Portion Badge & Action */}
        <div className="mt-2 pt-1 flex items-center justify-between text-[10px] sm:text-xs">
          {item.serving_info ? (
            <span className="text-[10px] sm:text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
              {item.serving_info}
            </span>
          ) : (
            <span className="text-[10px] sm:text-xs text-stone-400">Fresh Preparation</span>
          )}

          <span
            className="text-[10px] sm:text-xs font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
            style={{ color: secondaryColor }}
          >
            <span>View Dish</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Right Thumbnail Column */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 shrink-0 rounded-xl sm:rounded-2xl lg:rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              !isAvailable ? 'grayscale contrast-75' : ''
            }`}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FAF8F1] text-xs font-serif font-bold text-[#062D1F]/50">
            {item.name[0]}
          </div>
        )}

        {/* Sold Out Badge Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-1">
            <span className="bg-red-600 text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-md text-center">
              Sold Out
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
