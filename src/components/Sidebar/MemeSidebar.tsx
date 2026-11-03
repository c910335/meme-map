import React, { useState } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  Dice5, 
  MapPin, 
  Radio,
  Film,
  Landmark,
  Compass,
  Flame,
  ChevronRight,
  Menu,
  Navigation,
  Radar,
  Loader2
} from 'lucide-react';
import { MemeItem, MemeCategory } from '../../types/meme';
import { CATEGORIES } from '../../data/memes';
import { calculateDistanceKm, formatDistance } from '../../utils/geo';

interface MemeSidebarProps {
  memes: MemeItem[];
  selectedMeme: MemeItem | null;
  onSelectMeme: (meme: MemeItem) => void;
  onOpenModal: (meme: MemeItem) => void;
  selectedCategory: MemeCategory | 'all';
  onSelectCategory: (category: MemeCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  sortBy: 'newest' | 'oldest' | 'nearest';
  onSortChange: (sort: 'newest' | 'oldest' | 'nearest') => void;
  onRandomTeleport: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  userLocation: [number, number] | null;
  isLocating: boolean;
  onLocateNearest: () => void;
  onClearLocation: () => void;
}

const REGIONS: { id: string; label: string; cities: string[] }[] = [
  { id: 'all', label: '全台灣', cities: [] },
  { id: 'north', label: '北部', cities: ['台北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣'] },
  { id: 'central', label: '中部', cities: ['台中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣'] },
  { id: 'south', label: '南部', cities: ['高雄市', '台南市', '屏東縣', '嘉義市', '嘉義縣'] },
  { id: 'east', label: '東部', cities: ['花蓮縣', '台東縣'] },
];

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'streamer': return <Radio className="w-3.5 h-3.5" />;
    case 'media': return <Film className="w-3.5 h-3.5" />;
    case 'politics': return <Landmark className="w-3.5 h-3.5" />;
    case 'urban': return <Compass className="w-3.5 h-3.5" />;
    case 'society': return <Flame className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
};

export const MemeSidebar: React.FC<MemeSidebarProps> = ({
  memes,
  selectedMeme,
  onSelectMeme,
  onOpenModal,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedRegion,
  onSelectRegion,
  sortBy,
  onSortChange,
  onRandomTeleport,
  isOpen,
  onToggleOpen,
  userLocation,
  isLocating,
  onLocateNearest,
  onClearLocation,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggleOpen}
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Toggle Floating Pill Button */}
      <button
        onClick={onToggleOpen}
        className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-xl shadow-cyan-600/30 font-medium text-sm active:scale-95 transition-all"
      >
        <Menu className="w-4 h-4" />
        <span>迷因清單 ({memes.length})</span>
      </button>

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 z-40 w-full max-w-[380px] lg:max-w-[420px] h-full flex flex-col bg-[#0b0f17]/95 backdrop-blur-xl border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜尋地標、台詞金句、人名、城市..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              全部
            </button>
            {Object.values(CATEGORIES).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    isSelected
                      ? 'shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                  style={{
                    backgroundColor: isSelected ? cat.bgColor : undefined,
                    color: isSelected ? cat.color : undefined,
                    borderColor: isSelected ? cat.borderColor : undefined,
                    borderWidth: isSelected ? 1 : undefined,
                  }}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Region & Sort & Random Button */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                showFilters || selectedRegion !== 'all' || sortBy !== 'oldest'
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>進階篩選 {selectedRegion !== 'all' ? `(${REGIONS.find(r => r.id === selectedRegion)?.label})` : ''}</span>
            </button>

            <button
              onClick={onRandomTeleport}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-amber-400 hover:text-amber-300 font-medium active:scale-95 transition-all"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>隨機帶我去</span>
            </button>
          </div>

          {/* Collapsible Advanced Filters (Region & Sort) */}
          {showFilters && (
            <div className="pt-2 border-t border-slate-800/60 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Region Selector */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  台灣區域篩選
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {REGIONS.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => onSelectRegion(region.id)}
                      className={`px-2 py-1 rounded-md text-xs transition-all ${
                        selectedRegion === region.id
                          ? 'bg-slate-700 text-white font-medium border border-slate-600'
                          : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  排序方式
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => onSortChange('oldest')}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                      sortBy === 'oldest'
                        ? 'bg-slate-700 text-white font-medium border border-slate-600'
                        : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    ⏳ 年份舊到新
                  </button>
                  <button
                    onClick={() => onSortChange('newest')}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                      sortBy === 'newest'
                        ? 'bg-slate-700 text-white font-medium border border-slate-600'
                        : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    ✨ 年份新到舊
                  </button>
                  <button
                    onClick={() => {
                      if (!userLocation) {
                        onLocateNearest();
                      } else {
                        onSortChange('nearest');
                      }
                    }}
                    disabled={isLocating}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all ${
                      sortBy === 'nearest'
                        ? 'bg-cyan-600/30 text-cyan-300 font-medium border border-cyan-500/60 shadow-sm'
                        : 'bg-slate-800/40 text-slate-400 hover:text-cyan-300 border border-slate-800'
                    }`}
                    title={userLocation ? '依離你目前位置由近到遠排序' : '啟用 GPS 定位並依距離排序'}
                  >
                    {isLocating ? (
                      <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                    ) : (
                      <Radar className="w-3 h-3 text-cyan-400" />
                    )}
                    <span>🛰️ 離我最近{userLocation ? '' : ' (需定位)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active GPS Banner if userLocation is available */}
        {userLocation && (
          <div className="mx-3 mt-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900/80 border border-cyan-800/60 flex items-center justify-between text-xs text-cyan-300 shadow-md shrink-0 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 truncate">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="truncate font-medium">GPS 雷達已鎖定 · 距離由近到遠</span>
            </div>
            <button
              onClick={onClearLocation}
              className="text-[11px] text-slate-400 hover:text-cyan-200 underline shrink-0 ml-2 cursor-pointer transition-colors"
            >
              解除定位
            </button>
          </div>
        )}

        {/* Meme List Header */}
        <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/40 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>共找到 {memes.length} 處地標</span>
          <span className="text-[11px] text-slate-500">點擊卡片定位鏡頭</span>
        </div>

        {/* Scrollable Meme Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {memes.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium">查無相關迷因地標</p>
              <p className="text-xs text-slate-500 mt-1">試著清除搜尋條件或切換分類</p>
              <button
                onClick={() => {
                  onSearchChange('');
                  onSelectCategory('all');
                  onSelectRegion('all');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs transition-all"
              >
                重設所有條件
              </button>
            </div>
          ) : (
            memes.map((meme) => {
              const category = CATEGORIES[meme.category] || CATEGORIES.urban;
              const isSelected = selectedMeme?.id === meme.id;

              return (
                <div
                  key={meme.id}
                  onClick={() => onSelectMeme(meme)}
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-950/40 translate-x-1'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Category Pill & Year & Distance */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: category.bgColor,
                          color: category.color,
                          border: `1px solid ${category.borderColor}`,
                        }}
                      >
                        {getCategoryIcon(meme.category)}
                        {category.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {meme.year} 年
                      </span>
                    </div>

                    {userLocation && (
                      <span 
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm shrink-0"
                        title={`距離您約 ${formatDistance(calculateDistanceKm(userLocation, meme.coordinates))}`}
                      >
                        <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{formatDistance(calculateDistanceKm(userLocation, meme.coordinates))}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-1">
                    {meme.title}
                  </h3>

                  {/* Quote preview */}
                  <div className="text-xs text-amber-300/90 font-medium italic mb-2 line-clamp-1 border-l-2 border-amber-400/60 pl-2 bg-amber-500/5 py-0.5 rounded-r">
                    「{meme.quotes[0]}」
                  </div>

                  {/* Subtitle / Description excerpt */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                    {meme.subtitle}
                  </p>

                  {/* Location & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px] truncate max-w-[210px]">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{meme.city}{meme.district} · {meme.locationName}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(meme);
                      }}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline shrink-0"
                    >
                      <span>百科詳情</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 text-center text-[11px] text-slate-500 shrink-0">
          <span>迷因朝聖請遵守現場規範與社會秩序 尊重居民與安全第一</span>
        </div>
      </aside>
    </>
  );
};
