import React from 'react';
import { Sparkles, Dice5, PlusCircle, Info, Layers, Radar, Loader2 } from 'lucide-react';
import { MemeCategory } from '../../types/meme';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  onRandomTeleport: () => void;
  onResetView: () => void;
  onOpenAbout: () => void;
  onOpenSubmit: () => void;
  tileTheme: 'dark' | 'light' | 'satellite';
  onToggleTileTheme: () => void;
  selectedCategory: MemeCategory | 'all';
  userLocation: [number, number] | null;
  isLocating: boolean;
  onLocateNearest: () => void;
  onClearLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  filteredCount,
  onRandomTeleport,
  onResetView,
  onOpenAbout,
  onOpenSubmit,
  tileTheme,
  onToggleTileTheme,
  userLocation,
  isLocating,
  onLocateNearest,
  onClearLocation,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg text-slate-100 select-none">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div 
          onClick={onResetView}
          className="cursor-pointer flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all shrink-0"
          title="點擊重置台灣全島視角"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 
              onClick={onResetView}
              className="text-base sm:text-lg md:text-xl font-black tracking-tight cursor-pointer bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent hover:opacity-90 whitespace-nowrap"
            >
              台灣迷因地圖
            </h1>
            <span className="hidden md:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              Meme Map
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden lg:block">
            收錄全台已查證實體發生地 · 共 {totalCount} 處經典梗圖巡禮
            {filteredCount !== totalCount && (
              <span className="ml-1 text-cyan-400 font-medium">（已篩選 {filteredCount} 處）</span>
            )}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Nearest Meme GPS Radar Button */}
        <button
          onClick={userLocation ? onClearLocation : onLocateNearest}
          disabled={isLocating}
          className={`flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto px-0 sm:px-3 sm:py-1.5 rounded-lg text-xs md:text-sm font-medium shadow-sm transition-all active:scale-95 group border shrink-0 ${
            userLocation
              ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
              : isLocating
              ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-wait'
              : 'bg-gradient-to-r from-cyan-600/20 to-sky-600/20 hover:from-cyan-600/30 hover:to-sky-600/30 border-cyan-500/40 text-cyan-300 hover:text-cyan-200'
          }`}
          title={
            userLocation
              ? '目前已啟用 GPS 定位（點擊重設）'
              : '以 GPS 探測離你目前位置最近的迷因地標'
          }
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          ) : (
            <Radar className={`w-4 h-4 text-cyan-400 ${userLocation ? 'animate-pulse' : 'group-hover:rotate-45'} transition-transform`} />
          )}
          <span className="hidden sm:inline">
            {isLocating ? '探測中...' : userLocation ? '離我最近 (已定位)' : '離我最近'}
          </span>
        </button>

        {/* Random Teleport Button */}
        <button
          onClick={onRandomTeleport}
          className="flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto px-0 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs md:text-sm font-medium shadow-sm transition-all active:scale-95 group shrink-0"
          title="隨機瞬移帶你去朝聖一個台灣迷因"
        >
          <Dice5 className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">隨機傳送門</span>
        </button>

        {/* Map Tile Layer Toggle */}
        <button
          onClick={onToggleTileTheme}
          className="flex items-center justify-center w-8 h-8 sm:w-auto px-0 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all shrink-0"
          title={`目前地圖：${tileTheme === 'dark' ? '極簡暗色' : tileTheme === 'light' ? '標準明亮' : '衛星空照'}（點擊切換）`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">
            {tileTheme === 'dark' ? '暗色' : tileTheme === 'light' ? '明亮' : '衛星'}
          </span>
        </button>

        {/* Submit Meme Proposal */}
        <button
          onClick={onOpenSubmit}
          className="flex items-center justify-center w-8 h-8 sm:w-auto px-0 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all shrink-0"
          title="提供新的迷因地標"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">提供地標</span>
        </button>

        {/* About Info */}
        <button
          onClick={onOpenAbout}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-white transition-all shrink-0"
          title="關於本站與朝聖守則"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
