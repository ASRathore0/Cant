import React, { useState, useEffect } from 'react';
import { X, Sparkles, Layers, ArrowRight, RotateCcw, Check, Flame, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';

export interface ExplodedLayer {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  elevationPx: number; // Vertical offset when exploded
}

export interface ExplodedItemData {
  id: string;
  name: string;
  tagline: string;
  price: string;
  stickerUrl: string;
  accentColor: string;
  categorySlug: string;
  searchTerm: string;
  layers: ExplodedLayer[];
}

interface ExplodedViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ExplodedItemData | null;
  allItems?: ExplodedItemData[];
  onSelectNext?: () => void;
  onSelectPrev?: () => void;
  onOrderNow?: (searchTerm: string) => void;
}

export const ExplodedViewModal: React.FC<ExplodedViewModalProps> = ({
  isOpen,
  onClose,
  item,
  allItems = [],
  onSelectNext,
  onSelectPrev,
  onOrderNow,
}) => {
  const [isExploded, setIsExploded] = useState(true);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsExploded(true);
      setSelectedLayerIndex(null);
      // Lock background scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, item?.id]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-300">
      
      {/* Background ambient radial lights */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${item.accentColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative w-full max-w-4xl bg-stone-900/90 border border-white/15 rounded-3xl sm:rounded-[36px] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3 bg-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 p-1 shrink-0 overflow-hidden flex items-center justify-center">
              <img src={item.stickerUrl} alt={item.name} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  💥 3D Deconstructed View
                </span>
                <span className="text-xs text-white/50 hidden sm:inline">•</span>
                <span className="text-xs text-stone-300 font-bold hidden sm:inline">{item.price}</span>
              </div>
              <h2 className="font-serif font-black text-base sm:text-xl text-white truncate leading-tight">
                {item.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Explode / Assemble Toggle */}
            <button
              id="btn-toggle-exploded"
              onClick={() => setIsExploded(!isExploded)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isExploded
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 ring-2 ring-amber-400/50'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExploded ? 'Exploded (Active)' : 'Assemble Back'}</span>
            </button>

            {/* Close Button */}
            <button
              id="btn-close-exploded-modal"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
              title="Close Exploded View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Subtitle / Micro instruction */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-300">
            <p className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tap any ingredient layer below to inspect culinary secrets & sourcing.</span>
            </p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-emerald-300 font-bold">
                {item.layers.length} Master Layers
              </span>
            </div>
          </div>

          {/* 3D Exploded Stage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Central Hero Sticker / Render */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center">
                
                {/* Pulsing Aura */}
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse"
                  style={{ backgroundColor: item.accentColor }}
                />

                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black/40 border border-white/15 shadow-2xl flex items-center justify-center">
                  <img
                    src={item.stickerUrl}
                    alt={item.name}
                    className={`w-full h-full object-cover filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-700 select-none ${
                      isExploded ? 'scale-105 rotate-2' : 'scale-95 rotate-0'
                    }`}
                  />
                </div>

                {/* Floating Live Tag */}
                <span className="absolute bottom-1 bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-black px-3 py-1 rounded-full border border-amber-400/40 shadow-lg">
                  {item.tagline}
                </span>
              </div>

              {/* Carousel navigation pills */}
              <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={onSelectPrev}
                  className="flex items-center gap-1 text-xs font-bold text-stone-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {allItems.map((al, idx) => (
                    <span
                      key={al.id}
                      className={`w-2 h-2 rounded-full transition-all ${
                        al.id === item.id ? 'w-5 bg-amber-400' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={onSelectNext}
                  className="flex items-center gap-1 text-xs font-bold text-stone-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Exploded Layers Stack */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">
                  Deconstructed Layer Breakdown
                </h3>
                <span className="text-[11px] text-stone-400">
                  {isExploded ? 'Layers Disassembled' : 'Layers Compacted'}
                </span>
              </div>

              <div className="space-y-2 relative">
                {item.layers.map((layer, index) => {
                  const isSelected = selectedLayerIndex === index;
                  // Dynamic vertical displacement when exploded vs assembled
                  const translateY = isExploded ? 0 : 0;
                  const transitionDelay = `${index * 60}ms`;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerIndex(isSelected ? null : index)}
                      className={`group relative rounded-2xl p-3 sm:p-3.5 border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 border-amber-400 shadow-lg ring-1 ring-amber-400'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
                      }`}
                      style={{
                        transitionDelay,
                        transform: `translateY(${translateY}px)`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Layer Number / Icon */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-md border border-white/20"
                            style={{ backgroundColor: `${layer.color}33` }}
                          >
                            <span>{layer.icon}</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                                Layer #{index + 1} • {layer.role}
                              </span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-white/10 text-amber-300 border border-white/15">
                                {layer.badge}
                              </span>
                            </div>
                            <h4 className="font-serif font-black text-sm sm:text-base text-white truncate leading-tight mt-0.5">
                              {layer.name}
                            </h4>
                          </div>
                        </div>

                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                            isSelected ? 'bg-amber-400 text-stone-950 rotate-90' : 'bg-white/10 text-white/70'
                          }`}
                        >
                          →
                        </span>
                      </div>

                      {/* Expandable Layer Details */}
                      {isSelected && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/10 text-xs text-stone-200 space-y-1 animate-in fade-in duration-200">
                          <p className="leading-relaxed text-stone-200 font-medium">
                            {layer.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-amber-300 pt-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>100% Quality & Hygiene Verified Kitchen Standard</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="px-5 py-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <span className="text-white font-serif font-bold text-base">{item.price}</span>
            <span className="text-white/40">•</span>
            <span>Freshly prepared on counter order</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOrderNow) onOrderNow(item.searchTerm);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95"
            >
              <Utensils className="w-4 h-4 text-stone-950" />
              <span>Find in Menu & Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
