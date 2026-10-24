import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, X, RefreshCw, AlertCircle, Utensils, Sparkles, Phone, MessageCircle, ChevronDown, ChevronUp, Compass, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SpotlightSection } from '../components/SpotlightSection';
import { CategoryChips } from '../components/CategoryChips';
import { MenuCard } from '../components/MenuCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { FloatingMenuSheet } from '../components/FloatingMenuSheet';
import { Footer } from '../components/Footer';
import { publicApi } from '../services/api';
import { Category, MenuItem, RestaurantSettings } from '../types';

export const PublicMenuPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');
  const [isAllMenuExpanded, setIsAllMenuExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'bestsellers' | 'budget'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);

  const isFromQr = searchParams.get('from_qr') === '1' || searchParams.get('qr') === '1';
  const canteenParam = slug || searchParams.get('canteen');

  const fetchMenu = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await publicApi.getMenu(isFromQr, canteenParam || undefined);
      setCategories(data.categories || []);
      setSettings(data.settings || null);
    } catch (err: any) {
      console.error('Failed to load menu:', err);
      setError('Unable to load menu right now. Please check your internet connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [canteenParam, isFromQr]);

  // Dynamically update browser tab title and favicon for the active restaurant entity
  useEffect(() => {
    if (settings) {
      if (settings.page_title) {
        document.title = settings.page_title;
      } else if (settings.restaurant_name) {
        document.title = `${settings.restaurant_name} | Digital Menu`;
      }

      const fav = settings.full_favicon_url || settings.favicon_url || settings.full_logo_url || settings.logo_url;
      if (fav) {
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = fav;
      }
    }
  }, [settings]);

  // Compute all items flattened
  const allItems = useMemo(() => {
    const list: MenuItem[] = [];
    categories.forEach((cat) => {
      if (cat.items && cat.items.length > 0) {
        cat.items.forEach((item) => {
          list.push({ ...item, category_name: cat.name });
        });
      }
    });
    return list;
  }, [categories]);

  // Filtered categories and their items
  const displayedCategories = useMemo(() => {
    return categories
      .filter((cat) => activeCategoryId === 'all' || cat.id === activeCategoryId)
      .map((cat) => {
        let items = (cat.items || []).map((item) => ({ ...item, category_name: cat.name }));

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          items = items.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              (item.description && item.description.toLowerCase().includes(q))
          );
        }

        // Quick Filters (Bestsellers / Under ₹50)
        if (quickFilter === 'bestsellers') {
          items = items.filter((item) => item.is_featured);
        } else if (quickFilter === 'budget') {
          items = items.filter((item) => item.price <= 50 && item.price_type !== 'mrp');
        }

        return {
          ...cat,
          filteredItems: items,
        };
      })
      .filter((cat) => cat.filteredItems.length > 0);
  }, [categories, activeCategoryId, searchQuery, quickFilter]);

  // Mixed 12 items for "All Menu" default view (round-robin across categories)
  const mixedAllItems = useMemo(() => {
    const validCategories = categories.filter((c) => c.items && c.items.length > 0);
    if (validCategories.length === 0) return [];

    // Prioritize bestsellers first within each category
    const categoryItemLists = validCategories.map((cat) => ({
      name: cat.name,
      items: [...cat.items].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)),
    }));

    const result: MenuItem[] = [];
    const maxItems = 12;
    let round = 0;
    let added = true;

    while (result.length < maxItems && added) {
      added = false;
      for (const cat of categoryItemLists) {
        if (result.length >= maxItems) break;
        if (cat.items[round]) {
          result.push({ ...cat.items[round], category_name: cat.name });
          added = true;
        }
      }
      round++;
    }
    return result;
  }, [categories]);

  const handleSelectCategory = (id: number | 'all') => {
    setActiveCategoryId(id);
    if (id !== 'all') {
      setIsAllMenuExpanded(false);
    }
  };

  const isShowingCuratedMix =
    activeCategoryId === 'all' &&
    !searchQuery.trim() &&
    quickFilter === 'all' &&
    !isAllMenuExpanded;

  const phone = settings?.phone || '+91 98765 43210';
  const whatsapp = settings?.whatsapp || '+91 98765 43210';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const primaryColor = settings?.primary_color || '#062D1F';
  const secondaryColor = settings?.secondary_color || '#07402A';
  const accentColor = settings?.accent_color || '#E8C928';
  const bgColor = settings?.bg_color || '#FAF8F1';

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Brand App Bar */}
      <Navbar
        settings={settings}
        activeCanteenSlug={canteenParam || settings?.slug}
      />

      {/* Animated Craving Slider (Delicacy Trio Hero Box) */}
      <Hero
        settings={settings}
        onSelectCraving={(term) => {
          setSearchQuery(term);
          setActiveCategoryId('all');
          setQuickFilter('all');
        }}
      />

      {/* Search & Quick Filters (Directly Below Hero Trio) */}
      <div className="max-w-xl lg:max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 pt-2.5 pb-1 lg:pt-3">
        {/* Search Bar matching user sketch */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search samosa, chai, coffee, burger, thali..."
            className="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-white border border-stone-200/90 rounded-2xl text-xs sm:text-sm text-[#1A1D1A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-app-card"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills (3 Rounded Pills: [ All ] [ Bestsellers ] [ Under ₹50 ]) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5 pb-1">
          <button
            onClick={() => setQuickFilter('all')}
            className={`flex-1 min-w-[95px] sm:min-w-0 py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-2xl text-xs font-bold text-center transition-all ${
              quickFilter === 'all'
                ? 'shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
            style={
              quickFilter === 'all'
                ? { backgroundColor: primaryColor, color: '#FFFFFF' }
                : {}
            }
          >
            All Items
          </button>

          <button
            onClick={() => setQuickFilter('bestsellers')}
            className={`flex-1 min-w-[110px] sm:min-w-0 py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-2xl text-xs font-bold text-center inline-flex items-center justify-center gap-1 transition-all ${
              quickFilter === 'bestsellers'
                ? 'shadow-md font-black'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
            style={
              quickFilter === 'bestsellers'
                ? { backgroundColor: accentColor, color: primaryColor }
                : {}
            }
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: quickFilter === 'bestsellers' ? primaryColor : '#D97706' }} />
            <span>Bestsellers</span>
          </button>

          <button
            onClick={() => setQuickFilter('budget')}
            className={`flex-1 min-w-[105px] sm:min-w-0 py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-2xl text-xs font-bold text-center transition-all ${
              quickFilter === 'budget'
                ? 'shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
            style={
              quickFilter === 'budget'
                ? { backgroundColor: secondaryColor, color: '#FFFFFF' }
                : {}
            }
          >
            Under ₹50 🏷️
          </button>
        </div>

        {/* Customer Favourites Spotlight (Only when not actively searching) */}
        {!searchQuery && quickFilter === 'all' && activeCategoryId === 'all' && (
          <SpotlightSection
            items={allItems}
            onSelect={(item) => setSelectedDish(item)}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            bgColor={bgColor}
          />
        )}
      </div>

      {/* Sticky Category Tabs */}
      <CategoryChips
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleSelectCategory}
        totalItemCount={allItems.length}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        bgColor={bgColor}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl lg:max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3.5 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-3.5 border border-stone-200 flex gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-5 bg-stone-200 rounded w-1/2" />
                  <div className="h-3 bg-stone-100 rounded w-3/4" />
                </div>
                <div className="w-20 h-20 bg-stone-200 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-sm mx-auto my-6">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-900 font-serif">Unable to Load Menu</h3>
            <p className="mt-1 text-xs text-red-700">{error}</p>
            <button
              onClick={() => fetchMenu()}
              className="mt-3 px-4 py-1.5 bg-[#062D1F] text-white rounded-full text-xs font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Search Results */}
        {!isLoading && !error && displayedCategories.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-sm mx-auto my-6 shadow-2xs">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-stone-200"
              style={{ backgroundColor: bgColor, color: primaryColor }}
            >
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif" style={{ color: primaryColor }}>No Dishes Found</h3>
            <p className="mt-1 text-xs text-[#72776F]">
              {searchQuery
                ? `No items found matching "${searchQuery}".`
                : 'No items in this category or filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setQuickFilter('all');
                handleSelectCategory('all');
              }}
              className="mt-3 px-4 py-1.5 text-white rounded-full text-xs font-semibold shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 1. Curated Mixed 12 Items View (When on All Menu default) */}
        {!isLoading && !error && isShowingCuratedMix && mixedAllItems.length > 0 && (
          <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-black font-serif tracking-tight flex items-center gap-2" style={{ color: primaryColor }}>
                  <span>Chef's Selected Mix</span>
                  <span
                    className="text-[11px] sm:text-xs font-sans font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      color: secondaryColor,
                      backgroundColor: `${accentColor}25`,
                      borderColor: `${accentColor}50`,
                    }}
                  >
                    {mixedAllItems.length} of {allItems.length} Dishes
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#72776F] mt-0.5">
                  A variety of parathas, thalis, snacks, shakes & specials handpicked across categories.
                </p>
              </div>
            </div>

            {/* 12 Mixed Menu Cards - 2 Columns on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3.5 lg:gap-4">
              {mixedAllItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onSelect={(dish) => setSelectedDish(dish)}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  accentColor={accentColor}
                  bgColor={bgColor}
                />
              ))}
            </div>

            {/* Explore More Card */}
            <div className="pt-2 pb-6 lg:pt-4">
              <div
                className="border border-stone-200 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 text-center shadow-app-card space-y-3.5"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-xs"
                  style={{ backgroundColor: primaryColor, color: accentColor }}
                >
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-sm sm:text-base lg:text-lg" style={{ color: primaryColor }}>
                    Craving More? Explore Full Menu
                  </h4>
                  <p className="text-xs sm:text-sm text-[#72776F] mt-1 max-w-lg mx-auto leading-relaxed">
                    Showing {mixedAllItems.length} curated highlights. Discover all {allItems.length} authentic dishes across all {categories.length} categories.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
                  <button
                    onClick={() => {
                      setIsAllMenuExpanded(true);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 hover:brightness-110"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Explore All {allItems.length} Dishes</span>
                    <ChevronDown className="w-4 h-4" style={{ color: accentColor }} />
                  </button>

                  <button
                    onClick={() => setIsMenuSheetOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 shadow-2xs"
                    style={{ color: primaryColor }}
                  >
                    <span>Browse by Category ({categories.length})</span>
                  </button>
                </div>

                {/* Quick Category Jump Badges */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[11px] text-[#72776F] font-semibold w-full block">
                    Jump directly to:
                  </span>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCategory(c.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-200 transition-all active:scale-95 hover:border-stone-400"
                      style={{ backgroundColor: bgColor, color: primaryColor }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Structured Category Sections (When not in curated 12-item mix) */}
        {!isLoading && !error && !isShowingCuratedMix && displayedCategories.length > 0 && (
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* If user clicked Explore All on All Menu, show indicator with collapse button */}
            {activeCategoryId === 'all' && isAllMenuExpanded && (
              <div className="flex items-center justify-between pb-2 mb-1 px-1 border-b border-stone-200">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4" style={{ color: secondaryColor }} />
                  <span className="text-xs sm:text-sm font-bold" style={{ color: primaryColor }}>
                    All {allItems.length} Dishes Across {displayedCategories.length} Categories
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsAllMenuExpanded(false);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                  style={{ color: secondaryColor }}
                >
                  <span>Show 12 Curated Picks</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {displayedCategories.map((cat) => (
              <section
                key={cat.id}
                id={`category-section-${cat.id}`}
                className="scroll-mt-24 lg:scroll-mt-28"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-black font-serif tracking-tight flex items-center gap-2" style={{ color: primaryColor }}>
                      <span>{cat.name}</span>
                      <span className="text-[11px] sm:text-xs font-sans font-bold text-[#72776F] bg-white px-2 py-0.5 rounded-full border border-stone-200">
                        {cat.filteredItems.length}
                      </span>
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] sm:text-xs text-[#72776F] mt-0.5 line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items Grid (2-column on desktop, 1-column on mobile) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3.5 lg:gap-4">
                  {cat.filteredItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onSelect={(dish) => setSelectedDish(dish)}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      accentColor={accentColor}
                      bgColor={bgColor}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom App Dock (Mobile only, hidden on desktop) */}
      {!isLoading && categories.length > 0 && (
        <div className="fixed bottom-4 inset-x-0 flex justify-center z-30 pointer-events-none px-4 lg:hidden">
          <div
            className="pointer-events-auto text-white rounded-full shadow-dock border p-1.5 flex items-center gap-2"
            style={{ backgroundColor: primaryColor, borderColor: `${accentColor}50` }}
          >
            {/* Browse Menu Button */}
            <button
              onClick={() => setIsMenuSheetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-all active:scale-95 text-stone-100"
            >
              <Utensils className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>Menu ({categories.length})</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-300" />
            </button>

            {/* Quick Call */}
            {phone && (
              <a
                href={`tel:${cleanPhone}`}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center active:scale-95 transition-all"
                style={{ color: accentColor }}
                title="Call Counter"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Quick WhatsApp */}
            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello ${settings?.restaurant_name || 'Counter'}, I am at the counter and would like to inquire about today's menu.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white active:scale-95 transition-all hover:brightness-110"
                style={{ backgroundColor: secondaryColor }}
                title="WhatsApp Counter"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Dish Detail Bottom Sheet Modal */}
      <DishDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
        settings={settings}
      />

      {/* Floating Category Navigation Sheet */}
      <FloatingMenuSheet
        isOpen={isMenuSheetOpen}
        onClose={() => setIsMenuSheetOpen(false)}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        totalItemCount={allItems.length}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        bgColor={bgColor}
      />

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
};
