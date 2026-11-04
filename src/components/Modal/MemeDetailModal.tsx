import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Calendar, 
  Quote, 
  Sparkles, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle2
} from 'lucide-react';
import { MemeItem } from '../../types/meme';
import { CATEGORIES, getGoogleMapsPlaceUrl, getGoogleMapsDirUrl } from '../../data/memes';
import { calculateDistanceKm, formatDistance } from '../../utils/geo';
import { copyToClipboard } from '../../utils/clipboard';

interface MemeDetailModalProps {
  meme: MemeItem | null;
  onClose: () => void;
  userLocation?: [number, number] | null;
}

export const MemeDetailModal: React.FC<MemeDetailModalProps> = ({ meme, onClose, userLocation }) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!meme) return null;

  const category = CATEGORIES[meme.category] || CATEGORIES.urban;
  const googleMapsPlaceUrl = getGoogleMapsPlaceUrl(meme);
  const googleMapsDirUrl = getGoogleMapsDirUrl(meme);

  const handleCopyCoords = async () => {
    const success = await copyToClipboard(`${meme.coordinates[0]}, ${meme.coordinates[1]}`);
    if (success) {
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#meme-${meme.id}`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${meme.title} - 台灣迷因地圖`,
          text: `【台灣迷因地圖】${meme.title}：「${meme.quotes[0]}」朝聖指南`,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10">
        
        {/* Top Header Bar */}
        <div className="relative p-5 pb-4 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: category.bgColor,
                  color: category.color,
                  border: `1px solid ${category.borderColor}`,
                }}
              >
                {category.label}
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                <Calendar className="w-3 h-3 text-slate-400" />
                {meme.year} 年
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {meme.title}
            </h2>
            <p className="text-sm text-cyan-300 font-medium mt-1">
              {meme.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 hover:text-cyan-100 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              title="分享此迷因"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              <span>{copiedLink ? '已複製' : '分享'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="關閉"
              aria-label="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Classic Quotes Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-amber-950/10 border border-amber-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Quote className="w-4 h-4 text-amber-400" />
              <span>經典台詞 / 金句</span>
            </div>
            <div className="space-y-1.5">
              {meme.quotes.map((q, idx) => (
                <p 
                  key={idx} 
                  className="text-base sm:text-lg font-bold text-amber-200 tracking-wide pl-3 border-l-2 border-amber-400"
                >
                  「{q}」
                </p>
              ))}
            </div>
          </div>

          {/* Location & Navigation Card */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                  朝聖實體地址
                </span>
                <p className="text-sm font-bold text-slate-100">
                  {meme.locationName}
                </p>
                <p className="text-xs text-slate-300">
                  {meme.address}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    經緯度：{meme.coordinates[0].toFixed(5)}, {meme.coordinates[1].toFixed(5)}
                  </span>
                  <button
                    onClick={handleCopyCoords}
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {copiedCoords ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCoords ? '已複製' : '複製座標'}</span>
                  </button>
                </div>

                {userLocation && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-cyan-300 font-medium bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1 rounded-lg w-fit">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>距離您目前位置約 <strong className="text-white font-mono">{formatDistance(calculateDistanceKm(userLocation, meme.coordinates))}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={googleMapsPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm"
                title="在 Google Maps 開啟地標位置與查看街景"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>開啟地標</span>
              </a>
              <a
                href={googleMapsDirUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
                title="一鍵以 Google 地圖路線導航"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>路線導航</span>
              </a>
            </div>
          </div>

          {/* Origin Story */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>事件始末與起源故事</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              {meme.originStory}
            </p>
          </div>

          {/* Cultural Impact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>社會現象與網路迴響</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              {meme.culturalImpact}
            </p>
          </div>

          {/* Pilgrimage Guide & Safety Warning */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>現場朝聖守則與安全提醒</span>
            </div>
            <p className="text-xs text-emerald-300/90 leading-relaxed">
              {meme.pilgrimageTips}
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs text-slate-400 mr-1">標籤：</span>
            {meme.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="min-w-0 flex-1">
            {meme.sourceUrl ? (
              <a
                href={meme.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium hover:underline max-w-full group"
                title={meme.sourceLabel || '出處原始影片/新聞'}
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="truncate">{meme.sourceLabel || '出處原始影片/新聞'}</span>
              </a>
            ) : (
              <span className="text-slate-500">來源：社群公開資訊查證</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-sky-600/20 hover:from-cyan-600/35 hover:to-sky-600/35 border border-cyan-500/40 text-cyan-200 hover:text-white font-medium whitespace-nowrap active:scale-95 transition-all shadow-sm"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              <span>{copiedLink ? '已複製連結' : '分享此迷因'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium whitespace-nowrap active:scale-95 transition-all"
            >
              關閉
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
