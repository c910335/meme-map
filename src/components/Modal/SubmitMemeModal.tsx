import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Github, 
  AtSign, 
  AlertCircle, 
  FileText
} from 'lucide-react';
import { MemeItem } from '../../types/meme';

interface SubmitMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitMeme?: (newMeme: MemeItem) => void;
}

const SUBMISSION_TEMPLATE = `【推薦迷因地標】
- 迷因名稱：
- 實體門牌或地點：
- Google Maps 連結（必填）：
- 原始出處連結（必填，如 YouTube / 新聞 / 貼文）：
- 經典名句／台詞：
- 發生年份：
- 事件始末簡述：`;

export const SubmitMemeModal: React.FC<SubmitMemeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const handleCopyTemplate = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SUBMISSION_TEMPLATE).catch(() => {});
    }
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">推薦新的迷因地標</h2>
              <p className="text-xs text-slate-400">發現了尚未收錄的經典梗圖現場？歡迎投稿！</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          {/* Requirement Alert Box */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>投稿審核必備資訊提醒</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              為了確保地圖標記的真實性與精確定位，提交新地標時請<strong className="text-amber-200">務必至少提供以下兩項關鍵連結</strong>：
            </p>
            <ul className="text-xs text-slate-200 space-y-1 list-disc pl-4 font-medium">
              <li><strong className="text-white">原始出處連結：</strong>YouTube 原片、新聞影音、社群貼文或影片連結</li>
              <li><strong className="text-white">Google Maps 連結：</strong>精確的實體門牌、店家或路口 Google 地圖連結</li>
            </ul>
          </div>

          {/* Submission Channels */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              請選擇投稿管道（二擇一）：
            </span>

            {/* Option 1: GitHub Issues */}
            <a
              href="https://github.com/c910335/meme-map/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white group-hover:bg-cyan-500 transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                    GitHub Issues 開案投稿
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 pl-9 leading-snug">
                至 <span className="font-mono text-cyan-400">c910335/meme-map</span> 提出 Issue，適合公開討論、協同考證與追蹤收錄狀態。
              </p>
            </a>

            {/* Option 2: Threads Direct Message */}
            <a
              href="https://www.threads.com/@c910335"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-pink-500/50 transition-all shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 transition-colors">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white group-hover:text-pink-300 transition-colors text-sm">
                    Threads 私訊投稿
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 pl-9 leading-snug">
                至 Threads 私訊 <span className="font-semibold text-pink-400">@c910335</span>，可直接傳送影音連結或短片截圖。
              </p>
            </a>
          </div>

          {/* Copyable Submission Template Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                投稿內容格式範本（點擊一鍵複製）
              </span>
              <button
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 transition-all border border-slate-700"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已複製範本！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製範本</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-400 bg-black/40 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap select-all border border-slate-800/80">
              {SUBMISSION_TEMPLATE}
            </pre>
          </div>

          {/* Note / Disclaimer */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            * 本站資料由 Antigravity &amp; Gemini 3.8 Flash High 彙整。如有地點需更正或配合下架，亦請透過上方 GitHub 或 Threads 聯絡。
          </p>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all"
          >
            關閉視窗
          </button>
        </div>

      </div>
    </div>
  );
};
