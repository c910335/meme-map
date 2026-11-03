import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MEMES_DATA } from './data/memes';
import { MemeItem, MemeCategory } from './types/meme';
import { Header } from './components/Header/Header';
import { MemeMap } from './components/Map/MemeMap';
import { MemeSidebar } from './components/Sidebar/MemeSidebar';
import { MemeDetailModal } from './components/Modal/MemeDetailModal';
import { AboutModal } from './components/Modal/AboutModal';
import { SubmitMemeModal } from './components/Modal/SubmitMemeModal';
import { calculateDistanceKm, formatDistance, findNearestMeme } from './utils/geo';
import { Radar, AlertCircle, CheckCircle2, X } from 'lucide-react';

const REGION_CITY_MAP: Record<string, string[]> = {
  north: ['台北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣'],
  central: ['台中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣'],
  south: ['高雄市', '台南市', '屏東縣', '嘉義市', '嘉義縣'],
  east: ['花蓮縣', '台東縣'],
};

export const App: React.FC = () => {
  // Load custom memes from LocalStorage if any
  const [allMemes, setAllMemes] = useState<MemeItem[]>(() => {
    try {
      const saved = localStorage.getItem('custom_taiwan_memes');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...MEMES_DATA, ...parsed];
      }
    } catch {
      // fallback
    }
    return MEMES_DATA;
  });

  const [selectedMeme, setSelectedMeme] = useState<MemeItem | null>(null);
  const [modalMeme, setModalMeme] = useState<MemeItem | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MemeCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'nearest'>('oldest');
  const [tileTheme, setTileTheme] = useState<'dark' | 'light' | 'satellite'>('dark');
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  // User Geolocation State for Nearest Meme Radar
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Handle URL deep link on mount (e.g. #meme-jiutian-xuannv)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#meme-')) {
      const memeId = hash.replace('#meme-', '');
      const found = allMemes.find((m) => m.id === memeId);
      if (found) {
        setSelectedMeme(found);
        setModalMeme(found);
      }
    }
  }, [allMemes]);

  // Filtered & Sorted Memes
  const filteredMemes = useMemo(() => {
    return allMemes
      .filter((meme) => {
        // Category filter
        if (selectedCategory !== 'all' && meme.category !== selectedCategory) {
          return false;
        }

        // Region filter
        if (selectedRegion !== 'all') {
          const citiesInRegion = REGION_CITY_MAP[selectedRegion] || [];
          if (!citiesInRegion.includes(meme.city)) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = meme.title.toLowerCase().includes(q);
          const matchSubtitle = meme.subtitle.toLowerCase().includes(q);
          const matchDesc = meme.description.toLowerCase().includes(q);
          const matchLocation = meme.locationName.toLowerCase().includes(q);
          const matchAddress = meme.address.toLowerCase().includes(q);
          const matchCity = meme.city.toLowerCase().includes(q);
          const matchQuotes = meme.quotes.some((quote) => quote.toLowerCase().includes(q));
          const matchTags = meme.tags.some((tag) => tag.toLowerCase().includes(q));

          return (
            matchTitle ||
            matchSubtitle ||
            matchDesc ||
            matchLocation ||
            matchAddress ||
            matchCity ||
            matchQuotes ||
            matchTags
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest' && userLocation) {
          const distA = calculateDistanceKm(userLocation, a.coordinates);
          const distB = calculateDistanceKm(userLocation, b.coordinates);
          return distA - distB;
        }
        if (sortBy === 'oldest') return a.year - b.year;
        return b.year - a.year;
      });
  }, [allMemes, selectedCategory, selectedRegion, searchQuery, sortBy, userLocation]);

  // GPS Nearest Meme Radar Action
  const handleLocateNearest = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationNotice({
        message: '您的瀏覽器不支援 GPS 地理定位功能',
        type: 'error',
      });
      return;
    }

    setIsLocating(true);
    setLocationNotice({
      message: '正在以 GPS 探測您的即時位置...',
      type: 'info',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoord: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(userCoord);
        setIsLocating(false);
        setSortBy('nearest');

        // Find nearest meme among filtered (or all) memes
        const pool = filteredMemes.length > 0 ? filteredMemes : allMemes;
        const nearestResult = findNearestMeme(userCoord, pool);

        if (nearestResult) {
          setSelectedMeme(nearestResult.meme);
          setLocationNotice({
            message: `已鎖定位置！離你最近的迷因是「${nearestResult.meme.title}」（${formatDistance(nearestResult.distanceKm)}）`,
            type: 'success',
          });
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = '無法取得定位資訊，請稍後再試。';
        if (error.code === error.PERMISSION_DENIED) {
          msg = '定位權限已被拒絕。請在瀏覽器設定中允許位置存取權限。';
        } else if (error.code === error.TIMEOUT) {
          msg = '定位逾時，請檢查裝置的 GPS 訊號與網路連線。';
        }
        setLocationNotice({
          message: msg,
          type: 'error',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [filteredMemes, allMemes]);

  // Clear GPS Location
  const handleClearLocation = useCallback(() => {
    setUserLocation(null);
    setSortBy('oldest');
    setLocationNotice(null);
  }, []);

  // Auto-dismiss location notice after 5 seconds
  useEffect(() => {
    if (!locationNotice || locationNotice.type === 'info') return;
    const timer = setTimeout(() => {
      setLocationNotice(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [locationNotice]);

  // Random Teleport Action
  const handleRandomTeleport = useCallback(() => {
    const pool = filteredMemes.length > 0 ? filteredMemes : allMemes;
    if (pool.length === 0) return;

    // Pick a random meme different from the currently selected if possible
    let targetMeme: MemeItem;
    if (pool.length > 1 && selectedMeme) {
      const candidates = pool.filter((m) => m.id !== selectedMeme.id);
      targetMeme = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      targetMeme = pool[Math.floor(Math.random() * pool.length)];
    }

    setSelectedMeme(targetMeme);
    setIsSidebarOpen(false);
  }, [filteredMemes, allMemes, selectedMeme]);

  // Reset to full island view
  const handleResetView = useCallback(() => {
    setSelectedMeme(null);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setResetViewTrigger((c) => c + 1);
  }, []);

  // Submit new meme handler
  const handleSubmitNewMeme = (newMeme: MemeItem) => {
    setAllMemes((prev) => [newMeme, ...prev]);
    setSelectedMeme(newMeme);

    try {
      const existing = localStorage.getItem('custom_taiwan_memes');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('custom_taiwan_memes', JSON.stringify([newMeme, ...list]));
    } catch {
      // ignore
    }
  };

  const handleToggleTileTheme = () => {
    setTileTheme((current) => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'satellite';
      return 'dark';
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#0B0F17] relative">
      {/* Floating GPS Status Toast Notification */}
      {locationNotice && (
        <div
          data-testid="location-notice"
          className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border shadow-2xl text-xs md:text-sm animate-in fade-in slide-in-from-top-3 duration-200 max-w-[90vw] ${
            locationNotice.type === 'error'
              ? 'border-rose-500/50 text-rose-200 shadow-rose-950/30'
              : locationNotice.type === 'success'
              ? 'border-cyan-500/50 text-cyan-200 shadow-cyan-950/30'
              : 'border-slate-700 text-slate-200 shadow-slate-950/30'
          }`}
        >
          {locationNotice.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : locationNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <Radar className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          )}
          <span className="font-medium">{locationNotice.message}</span>
          <button
            onClick={() => setLocationNotice(null)}
            className="ml-1 text-slate-400 hover:text-white p-0.5 cursor-pointer"
            title="關閉提示"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Header
        totalCount={allMemes.length}
        filteredCount={filteredMemes.length}
        onRandomTeleport={handleRandomTeleport}
        onResetView={handleResetView}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        tileTheme={tileTheme}
        onToggleTileTheme={handleToggleTileTheme}
        selectedCategory={selectedCategory}
        userLocation={userLocation}
        isLocating={isLocating}
        onLocateNearest={handleLocateNearest}
        onClearLocation={handleClearLocation}
      />

      {/* Main Workspace (Sidebar + Leaflet Map) */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Filter & Card Drawer */}
        <MemeSidebar
          memes={filteredMemes}
          selectedMeme={selectedMeme}
          onSelectMeme={(meme) => {
            setSelectedMeme(meme);
            setIsSidebarOpen(false);
          }}
          onOpenModal={(meme) => setModalMeme(meme)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRandomTeleport={handleRandomTeleport}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen((prev) => !prev)}
          userLocation={userLocation}
          isLocating={isLocating}
          onLocateNearest={handleLocateNearest}
          onClearLocation={handleClearLocation}
        />

        {/* Leaflet Map Stage */}
        <main className="flex-1 h-full relative overflow-hidden">
          <MemeMap
            memes={filteredMemes}
            selectedMeme={selectedMeme}
            onSelectMeme={(meme) => setSelectedMeme(meme)}
            onOpenModal={(meme) => setModalMeme(meme)}
            tileTheme={tileTheme}
            resetViewTrigger={resetViewTrigger}
            userLocation={userLocation}
          />
        </main>
      </div>

      {/* Detailed Meme Encyclopedia Modal */}
      <MemeDetailModal
        meme={modalMeme}
        onClose={() => setModalMeme(null)}
        userLocation={userLocation}
      />

      {/* About & Code of Conduct Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* User Submission Modal */}
      <SubmitMemeModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitMeme={handleSubmitNewMeme}
      />
    </div>
  );
};

export default App;
