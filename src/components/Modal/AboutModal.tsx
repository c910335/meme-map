import React from 'react';
import { 
  X, 
  Sparkles, 
  Heart, 
  MapPin, 
  Code2, 
  Github, 
  AtSign, 
  ExternalLink,
  Bot,
  AlertTriangle,
  Trash2,
  ShieldCheck
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">關於「台灣迷因地圖」</h2>
              <p className="text-xs text-slate-400">Taiwan Meme Map Project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          {/* Mission */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              打造台灣專屬的數位民俗地理圖誌
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              台灣網路文化蓬勃奔放，無數在論壇、實況與新聞爆紅的金句與名場面，都根植於台灣真實的街道、店家、大樓與山道。
              本站致力於考證並收錄這些具有真實物理經緯度的迷因聖地，記錄台灣當代多元而幽默的集體記憶。
            </p>
          </div>

          {/* Social Links & GitHub */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              專案連結與聯絡管道
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* GitHub Repo */}
              <a
                href="https://github.com/c910335/meme-map"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-white group-hover:text-cyan-400 transition-colors shrink-0" />
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      GitHub Repo
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">c910335/meme-map</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
              </a>

              {/* Threads Profile */}
              <a
                href="https://www.threads.com/@c910335"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-pink-500/50 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-white group-hover:text-pink-400 transition-colors shrink-0" />
                  <div>
                    <div className="font-bold text-white group-hover:text-pink-300 transition-colors">
                      Threads
                    </div>
                    <div className="text-[11px] text-slate-400">@c910335</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-400 transition-colors shrink-0" />
              </a>
            </div>
          </div>

          {/* AI Source & Correction & Takedown Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              資料來源、免責與地點下架聲明
            </h4>
            
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Bot className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <p>
                  <strong className="text-white">AI 輔助資料蒐集：</strong>
                  本站資料與文案全部由 <span className="font-semibold text-cyan-300">Antigravity & Gemini 3.8 Flash High</span> 協助蒐集、考證與生成。儘管已盡力結合公開地理圖資比對，AI 產出內容仍可能存在疏漏、歷史變遷或定位誤差。
                </p>
              </div>

              <div className="flex items-start gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <p>
                  <strong className="text-white">資料勘誤回報：</strong>
                  如有任何地點標定不準、說明錯誤或連結失效，非常歡迎前往 <a href="https://github.com/c910335/meme-map/issues" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">GitHub Issues</a> 開立回報，或透過 <a href="https://www.threads.com/@c910335" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline hover:text-pink-300">Threads @c910335</a> 私訊聯繫更正。
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Trash2 className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <p>
                  <strong className="text-white">配合地點下架政策：</strong>
                  若相關當事人、住戶、店家或業主，因個人隱私、生活安寧、商業營業或權益考量<strong className="text-rose-300">需申請下架特定地點標記</strong>，請同樣透過 GitHub Issues 或 Threads 私訊聯絡，團隊將在確認後第一時間配合移除或隱蔽相關地標。
                </p>
              </div>
            </div>
          </div>

          {/* Pilgrimage Etiquette */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              朝聖守則與安全須知
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-white">尊重在地安寧：</strong> 部分地標位於住宅區或營業店家，前往打卡時請勿喧嘩、大聲播放影音或擅闖非公共空間。
              </li>
              <li>
                <strong className="text-white">行車與行人安全：</strong> 山道（如台七乙線）與主要幹道路口車流量大，切勿違規壓車或站在馬路中央取景，自身安全第一。
              </li>
              <li>
                <strong className="text-white">非商業文化保存：</strong> 本專案純屬非營利性網路文化記錄與地理研究，無任何商業營利用途。
              </li>
            </ul>
          </div>

          {/* Tech Spec */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>開源地圖：Leaflet & OpenStreetMap（繁中圖資）</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">v1.2.0</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Taiwan
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            瞭解並返回
          </button>
        </div>

      </div>
    </div>
  );
};
