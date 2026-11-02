import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MEMES_DATA } from './data/memes';
import { MemeItem, MemeCategory } from './types/meme';
import { Header } from './components/Header/Header';
import { MemeMap } from './components/Map/MemeMap';
import { MemeSidebar } from './components/Sidebar/MemeSidebar';
import { MemeDetailModal } from './components/Modal/MemeDetailModal';
import { AboutModal } from './components/Modal/AboutModal';
import { SubmitMemeModal } from './components/Modal/SubmitMemeModal';

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
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('oldest');
  const [tileTheme, setTileTheme] = useState<'dark' | 'light' | 'satellite'>('dark');
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

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
        if (sortBy === 'oldest') return a.year - b.year;
        return b.year - a.year;
      });
  }, [allMemes, selectedCategory, selectedRegion, searchQuery, sortBy]);

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
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#0B0F17]">
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
          />
        </main>
      </div>

      {/* Detailed Meme Encyclopedia Modal */}
      <MemeDetailModal
        meme={modalMeme}
        onClose={() => setModalMeme(null)}
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
