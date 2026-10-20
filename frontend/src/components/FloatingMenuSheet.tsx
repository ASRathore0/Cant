import React from 'react';
import { X, Utensils, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface FloatingMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategoryId: number | 'all';
  onSelectCategory: (id: number | 'all') => void;
  totalItemCount: number;
}

export const FloatingMenuSheet: React.FC<FloatingMenuSheetProps> = ({
  isOpen,
  onClose,
  categories,
  activeCategoryId,
  onSelectCategory,
  totalItemCount,
}) => {
  if (!isOpen) return null;

  const handleSelect = (id: number | 'all') => {
    onSelectCategory(id);
    onClose();

    if (id !== 'all') {
      const el = document.getElementById(`category-section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-stone-200 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FAF8F1] text-[#075C35]">
              <Utensils className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#063D29]">Browse Menu Sections</h4>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 max-h-80 overflow-y-auto py-1">
          {/* All Items */}
          <button
            onClick={() => handleSelect('all')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeCategoryId === 'all'
                ? 'bg-[#063D29] text-white shadow-sm'
                : 'bg-[#FAF8F1] hover:bg-[#F3EFE3] text-[#20251F]'
            }`}
          >
            <span>All Dishes</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeCategoryId === 'all' ? 'bg-[#E8C928] text-[#063D29]' : 'bg-stone-200 text-[#72776F]'
              }`}
            >
              {totalItemCount}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const count = cat.items ? cat.items.length : (cat.items_count ?? 0);
            const isActive = activeCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#063D29] text-white shadow-sm'
                    : 'bg-[#FAF8F1] hover:bg-[#F3EFE3] text-[#20251F]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#E8C928] text-[#063D29]' : 'bg-stone-200 text-[#72776F]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
