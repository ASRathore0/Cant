import React from 'react';
import { X, Sparkles, AlertCircle, MessageCircle, Info } from 'lucide-react';
import { MenuItem, RestaurantSettings } from '../types';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  settings: RestaurantSettings | null;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ item, onClose, settings }) => {
  if (!item) return null;

  const whatsapp = settings?.whatsapp || '+91 98765 43210';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
  const isAvailable = item.is_available;

  const handleInquire = () => {
    const text = encodeURIComponent(
      `Hello Annapoorna Canteen, I am at the counter. Is "${item.name}" available right now?`
    );
    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in slide-in-from-bottom duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className={`w-full h-full object-cover ${!isAvailable ? 'grayscale' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#FAF8F1] text-[#063D29] font-serif font-bold text-2xl">
              {item.name}
            </div>
          )}

          {/* Pure Veg Badge Overlay */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
            <div className="bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-sm border border-stone-200">
              <div className="w-4 h-4 border-[1.5px] border-[#15803d] rounded-[3px] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#15803d]" />
              </div>
            </div>
            <span className="bg-[#063D29] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              100% Pure Veg
            </span>
          </div>

          {/* Unavailable Banner */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Currently Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#20251F] leading-tight">
                  {item.name}
                </h3>
                {item.is_featured && isAvailable && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8C928] text-[#063D29]">
                    <Sparkles className="w-3 h-3" />
                    Bestseller
                  </span>
                )}
              </div>
              <p className="text-xs text-[#72776F] font-semibold mt-1">
                {item.category_name || 'Annapoorna Special'}
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif font-extrabold text-2xl text-[#075C35]">
                {item.formatted_price}
              </div>
              {item.price_type === 'mrp' && (
                <span className="text-[10px] text-[#72776F] block font-medium">Sold on MRP</span>
              )}
            </div>
          </div>

          {/* Serving Portion Badge */}
          {item.serving_info && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF8F1] border border-[#E3E0D6] text-xs font-medium text-[#063D29]">
              <span>Portion:</span>
              <strong className="font-bold">{item.serving_info}</strong>
            </div>
          )}

          {/* Pricing Note */}
          {item.pricing_note && (
            <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E3E0D6] flex items-start gap-2 text-xs text-[#063D29]">
              <Info className="w-4 h-4 text-[#E8C928] shrink-0 mt-0.5" />
              <span>{item.pricing_note}</span>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#72776F] mb-1.5">
                About this Dish
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
            <button
              onClick={handleInquire}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#075C35] hover:bg-[#063D29] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-[#E8C928]" />
              <span>Inquire at Counter on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
