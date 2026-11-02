import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MemeItem } from '../../types/meme';
import { CATEGORIES, getGoogleMapsPlaceUrl, getGoogleMapsDirUrl } from '../../data/memes';

interface MemeMapProps {
  memes: MemeItem[];
  selectedMeme: MemeItem | null;
  onSelectMeme: (meme: MemeItem) => void;
  onOpenModal: (meme: MemeItem) => void;
  tileTheme: 'dark' | 'light' | 'satellite';
  resetViewTrigger?: number;
}

const TILE_CONFIGS: Record<'dark' | 'light' | 'satellite', {
  url: string;
  attribution: string;
  subdomains: string;
  maxZoom: number;
  className: string;
}> = {
  dark: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> 繁中開放圖資',
    subdomains: 'abc',
    maxZoom: 19,
    className: 'tiles-dark'
  },
  light: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> 繁中開放圖資',
    subdomains: 'abc',
    maxZoom: 19,
    className: 'tiles-light'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> World Imagery 衛星圖資',
    subdomains: 'abc',
    maxZoom: 18,
    className: 'tiles-satellite'
  }
};

const getCategoryIconSvg = (cat: string) => {
  switch (cat) {
    case 'streamer':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19.1"/></svg>`;
    case 'media':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>`;
    case 'politics':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="22" y2="22"/><line x1="6" x2="6" y1="11" y2="18"/><line x1="10" x2="10" y1="11" y2="18"/><line x1="14" x2="14" y1="11" y2="18"/><line x1="18" x2="18" y1="11" y2="18"/><polygon points="12 2 20 7 4 7"/></svg>`;
    case 'society':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
    case 'urban':
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
  }
};

export const MemeMap: React.FC<MemeMapProps> = ({
  memes,
  selectedMeme,
  onSelectMeme,
  onOpenModal,
  tileTheme,
  resetViewTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const popupTimeoutRef = useRef<number | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Guard against React StrictMode duplicate init on the same DOM element
    const container = mapContainerRef.current as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    // Taiwan Center: ~23.8, 120.95
    const map = L.map(container, {
      center: [23.85, 120.95],
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer
    const config = TILE_CONFIGS[tileTheme];
    const tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains || 'abc',
      maxZoom: config.maxZoom,
      className: config.className,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer when tileTheme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = TILE_CONFIGS[tileTheme];
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains || 'abc',
      maxZoom: config.maxZoom,
      className: config.className,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [tileTheme]);

  // Sync Markers with `memes`
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for filtered memes
    memes.forEach((meme) => {
      const category = CATEGORIES[meme.category] || CATEGORIES.urban;
      const isSelected = selectedMeme?.id === meme.id;

      // Custom HTML Marker Icon
      const iconHtml = `
        <div class="meme-marker ${isSelected ? 'active marker-pulse' : ''}" style="width: 36px; height: 36px;">
          <div style="
            background: ${category.color};
            box-shadow: 0 0 16px ${category.color}88, inset 0 0 8px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="transform: rotate(45deg); color: #0f172a; display: flex; align-items: center; justify-content: center;">
              ${getCategoryIconSvg(meme.category)}
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-meme-icon',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker(meme.coordinates, { icon: customIcon });
      const placeUrl = getGoogleMapsPlaceUrl(meme);
      const dirUrl = getGoogleMapsDirUrl(meme);

      // Popup Content HTML
      const popupHtml = `
        <div class="p-3.5 max-w-[285px] text-slate-100 font-sans">
          <div class="flex items-center gap-2 mb-2 pr-7">
            <span class="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full" 
                  style="background: ${category.bgColor}; color: ${category.color}; border: 1px solid ${category.borderColor};">
              ${category.label}
            </span>
            <span class="text-[11px] font-mono text-slate-400 font-medium">${meme.year} 年</span>
          </div>

          <h3 class="text-sm font-bold text-white leading-tight mb-1 pr-6">
            ${meme.title}
          </h3>

          <p class="text-[11px] text-amber-300 font-medium italic mb-2 line-clamp-1 border-l-2 border-amber-400/60 pl-1.5 bg-amber-500/10 py-0.5 rounded-r">
            「${meme.quotes[0]}」
          </p>

          <p class="text-xs text-slate-300 leading-snug line-clamp-2 mb-2.5">
            ${meme.description}
          </p>

          <div class="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
            <svg class="w-3 h-3 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="truncate">${meme.city}${meme.district} · ${meme.locationName}</span>
          </div>

          <div class="flex items-center gap-1.5 pt-2 border-t border-slate-700/60">
            <button 
              id="popup-btn-detail-${meme.id}" 
              class="flex-1 text-center py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-all"
            >
              迷因百科
            </button>
            <a 
              href="${placeUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1"
              title="在 Google Maps 查看地標位置與街景"
            >
              地標
            </a>
            <a 
              href="${dirUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1"
              title="一鍵以 Google 地圖導航前往"
            >
              導航
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: true,
        autoPanPadding: [50, 50],
      });

      marker.on('click', () => {
        onSelectMeme(meme);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-detail-${meme.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onOpenModal(meme);
          };
        }
      });

      marker.addTo(map);
      markersRef.current.set(meme.id, marker);
    });
  }, [memes]);

  // Handle selectedMeme pan & popup
  useEffect(() => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }

    if (!selectedMeme || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const marker = markersRef.current.get(selectedMeme.id);

    map.flyTo(selectedMeme.coordinates, 15, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    if (marker) {
      popupTimeoutRef.current = window.setTimeout(() => {
        marker.openPopup();
      }, 600);
    }
  }, [selectedMeme]);

  // Handle Reset View (Full Taiwan Island overview)
  useEffect(() => {
    if (!resetViewTrigger || !mapInstanceRef.current) return;
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
    const map = mapInstanceRef.current;
    map.closePopup();
    markersRef.current.forEach((m) => m.closePopup());
    map.flyTo([23.85, 120.95], 8, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [resetViewTrigger]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none" data-map-theme={tileTheme}>
      <div ref={mapContainerRef} data-map-theme={tileTheme} className="w-full h-full z-10" />

      {/* Floating Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 shadow-2xl text-xs text-slate-300 pointer-events-auto">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
          迷因地標分類
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.values(CATEGORIES).map((cat) => (
            <div key={cat.id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-[11px] text-slate-300">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
