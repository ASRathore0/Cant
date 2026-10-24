import React from 'react';
import { Category } from '../types';

interface CategoryChipsProps {
  categories: Category[];
  activeCategoryId: number | 'all';
  onSelectCategory: (id: number | 'all') => void;
  totalItemCount: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bgColor?: string;
}

const getCategoryIcon = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('special') || n.includes('snack')) return '🥐';
  if (n.includes('paratha')) return '🫓';
  if (n.includes('thali') || n.includes('lunch')) return '🍱';
  if (n.includes('sandwich')) return '🥪';
  if (n.includes('shake') || n.includes('beverage') || n.includes('tea') || n.includes('coffee')) return '🥤';
  return '🍽️';
};

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  totalItemCount,
  primaryColor = '#062D1F',
  secondaryColor = '#075C35',
  accentColor = '#E8C928',
  bgColor = '#FAF8F1',
}) => {
  return (
    <div
      className="sticky top-[53px] sm:top-[61px] lg:top-[69px] z-30 backdrop-blur-md border-b border-stone-200/90 py-2 sm:py-2.5 shadow-2xs w-full transition-colors"
      style={{ backgroundColor: `${bgColor}f5` }}
    >
      <div className="max-w-xl lg:max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
        {/* All Items chip */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 active:scale-95 ${
            activeCategoryId === 'all'
              ? 'text-white shadow-sm ring-1'
              : 'bg-white text-[#1A1D1A] hover:bg-stone-100 border border-stone-200'
          }`}
          style={activeCategoryId === 'all' ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
        >
          <span>🍽️</span>
          <span>All Menu</span>
          <span
            className="text-[10px] lg:text-xs px-1.5 py-0.2 rounded-full font-bold transition-colors"
            style={
              activeCategoryId === 'all'
                ? { backgroundColor: accentColor, color: primaryColor }
                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
            }
          >
            {totalItemCount}
          </span>
        </button>

        {/* Category chips */}
        {categories.map((cat) => {
          const count = cat.items ? cat.items.length : (cat.items_count ?? 0);
          const isActive = activeCategoryId === cat.id;
          const icon = getCategoryIcon(cat.name);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-white shadow-sm ring-1'
                  : 'bg-white text-[#1A1D1A] hover:bg-stone-100 border border-stone-200'
              }`}
              style={isActive ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
            >
              <span>{icon}</span>
              <span className="whitespace-nowrap">{cat.name}</span>
              {count > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors"
                  style={
                    isActive
                      ? { backgroundColor: accentColor, color: primaryColor }
                      : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                  }
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
