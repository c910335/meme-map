import React from 'react';
import { Sparkles, Dice5, PlusCircle, Info, Layers } from 'lucide-react';
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
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-4 py-3 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg text-slate-100 select-none">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div 
          onClick={onResetView}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
          title="點擊重置台灣全島視角"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 
              onClick={onResetView}
              className="text-lg md:text-xl font-black tracking-tight cursor-pointer bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent hover:opacity-90"
            >
              台灣迷因地圖
            </h1>
            <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              Meme Map
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            收錄全台已查證實體發生地 · 共 {totalCount} 處經典梗圖巡禮
            {filteredCount !== totalCount && (
              <span className="ml-1 text-cyan-400 font-medium">（已篩選 {filteredCount} 處）</span>
            )}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Random Teleport Button */}
        <button
          onClick={onRandomTeleport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs md:text-sm font-medium shadow-sm transition-all active:scale-95 group"
          title="隨機瞬移帶你去朝聖一個台灣迷因"
        >
          <Dice5 className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">隨機傳送門</span>
          <span className="sm:hidden">隨機</span>
        </button>

        {/* Map Tile Layer Toggle */}
        <button
          onClick={onToggleTileTheme}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
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
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          title="提供新的迷因地標"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">提供地標</span>
        </button>

        {/* About Info */}
        <button
          onClick={onOpenAbout}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-white transition-all"
          title="關於本站與朝聖守則"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
