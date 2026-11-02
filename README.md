# 🗺️ 台灣迷因地圖 Taiwan Meme Map

> **全台實體迷因聖地巡禮與數位百科**  
> 收錄全台灣各大社群經典迷因的現實實體發生地、歷史淵源、名言金句、朝聖指引與 Google Maps 精準導航。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg?logo=leaflet)](https://leafletjs.com/)
[![Playwright Tests](https://img.shields.io/badge/Playwright-Tested-2EAD33.svg?logo=playwright)](https://playwright.dev/)
[![GitHub Pages Deployment](https://github.com/c910335/meme-map/actions/workflows/deploy.yml/badge.svg)](https://github.com/c910335/meme-map/actions/workflows/deploy.yml)

🌐 **線上成果展示**：[https://tatsujin.moe/meme-map/](https://tatsujin.moe/meme-map/)

---

## ✨ 核心特色 (Features)

* 📍 **全台實證迷因地標**：嚴選涵蓋政壇名場面、社會爆紅短影音、街頭傳奇、校園事件與次文化發源地。
* 🧭 **Google Maps 雙模組整合**：
  * **開啟地標**：結合專屬消歧義檢索詞（`gmapQuery`），一鍵直達 Google 地圖官方 POI 或特定門牌號碼，避免多點搜尋困擾。
  * **導航路線**：自動帶入起點與目的地座標，無縫呼叫行動裝置 Google Maps 規劃行車或大眾運輸路徑。
* 🎲 **隨機傳送門**：點擊一鍵隨機漫遊全台，發掘意想不到的台灣荒謬與歡樂瞬間。
* 🌓 **三種地圖底圖自由切換**：
  * **深色霓虹 (Dark Mode)**：CartoDB 高對比夜間科技風。
  * **標準街圖 (Light Mode)**：清楚顯示街廓道路與建物輪廓。
  * **衛星空拍 (Satellite Mode)**：Esri 高解析度空照圖，身歷其境俯瞰現場。
* 🔍 **多維度分類與即時搜尋**：支援按分類（生活趣事、政治時事、社會事件、網路文化、ACG 次文化）、年代年份新舊排序與關鍵字即時檢索。
* 📖 **迷因百科全書 Modal**：深度收錄事發經過、經典對白金句錄、文化衍生影響、聖地巡禮避坑須知與原始影音出處連結。
* 📬 **社群共筆與回報系統**：提供一鍵複製格式範本，無縫串接 GitHub Issues 與 Threads 管道。

---

## 🗺️ 收錄迷因精選列表

| 編號 | 迷因名稱 | 所屬縣市 | 地標地點與考證 |
| :--- | :--- | :--- | :--- |
| 1 | **九天玄女降肉** | 台北市中正區 | 中華路二段55號（廖麗芳指定唯一姐妹九天玄女降肉地） |
| 2 | **白飯之亂** | 台北市中山區 | 市民大道三段35號（大道創意料理快炒原址，近光華/北科大） |
| 3 | **開山里** | 台南市中西區 | 大埔街52號（六合境大埔福德祠，開山里正中心信仰樞紐） |
| 4 | **一生監督你一人** | 台南市安平區 | 永華路二段2號（臺南市議會永華議事廳，謝龍介質詢賴清德） |
| 5 | **台中一中旗木卡卡西** | 台中市北區 | 台中一中慎思湖（學生化身卡卡西躍起結印落水點） |
| 6 | **我ㄉ豆花 30塊！** | 苗栗縣苗栗市 | 民族路與府前路交叉口（建臺中學女學生過馬路慘摔現場） |
| 7 | **山道猴子的一生** | 新北市三峽區 | 台七乙線 8K 處（追焦熱點與莫忘初衷過彎壓車聖地） |
| 8 | **傑哥不要** | 基隆市中正區 | 山海觀社區（超大社區穿廊與網咖相遇經典教育片） |
| 9 | **大埔張藥房** | 苗栗縣竹南鎮 | 公義路與仁愛路交叉口（「今天拆大埔，明天拆政府」原址重建議題地標） |
| 10 | **百齡橋水上樂園** | 台北市士林區 | 百齡橋堤外停車場（颱風暴雨泡水車名場面） |

*(更多地標完整收錄於專案資料庫 [`src/data/memes.ts`](src/data/memes.ts))*

---

## 🛠️ 技術棧 (Tech Stack)

* **核心框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **建置工具**：[Vite 6](https://vitejs.dev/)
* **樣式設計**：[Tailwind CSS 3](https://tailwindcss.com/) + 毛玻璃質感 Glassmorphism UI
* **地圖渲染**：[Leaflet 1.9](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + 自訂 HTML/SVG Marker
* **圖標組件**：[Lucide React](https://lucide.dev/)
* **自動化測試**：[Playwright](https://playwright.dev/)（包含地圖載入、圖層切換、Modal 交互、座標連動與響應式排版驗證）
* **CI/CD 自動部署**：[GitHub Actions](https://github.com/features/actions) 部署至 GitHub Pages

---

## 🚀 本地開發與建置 (Getting Started)

### 系統需求
* Node.js `>= 20.0.0`
* npm `>= 10.0.0`

### 1. 複製專案
```bash
git clone https://github.com/c910335/meme-map.git
cd meme-map
```

### 2. 安裝相依套件
```bash
npm install
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
啟動後於瀏覽器開啟 `http://localhost:5173`。

### 4. 執行生產建置
```bash
npm run build
```
產出靜態網頁檔案將位於 `dist/` 目錄。

### 5. 執行 Playwright 端對端測試
```bash
node test_meme_map.mjs
```

---

## 🚢 自動部署至 GitHub Pages

本專案配置有完整 GitHub Actions 自動部署工作流程（位於 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）。

### 啟用步驟：
1. 將專案 Push 至 GitHub 儲存庫 `main` 分支。
2. 進入 GitHub 儲存庫的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下的 **Source** 選擇 **GitHub Actions**。
4. 每當推動程式碼更新至 `main` 分支，GitHub Actions 將自動執行 TypeScript 型別檢查、Vite 生產建置與 Pages 部署發布。

---

## 🤝 參與貢獻與地標回報 (Contributing)

如果你有發現有趣的台灣在地實體迷因尚未被收錄，或是現存地標有更精準的門牌、路口與歷史典故，歡迎向我們提供！

1. **GitHub Issues 提案**：前往 [GitHub Issues](https://github.com/c910335/meme-map/issues) 開立 Issue。
2. **Threads 聯繫**：直接私訊 [@c910335](https://www.threads.com/@c910335)。

**建議提供之資訊範本：**
```markdown
【迷因地標名稱】：
【真實發生地點】：（縣市區、路名/門牌或交叉路口）
【精確座標或 Google Maps 連結】：
【發生年份】：
【名言金句】：
【事發經過與背景】：
【原始影音或資料來源】：
```

---

## ⚖️ 免責聲明與下架政策 (Disclaimer)

* 本專案為社群文化記錄與研究性質之開源網頁應用。
* 初步資料由 **Antigravity** 與 **Gemini 3.8 Flash High** 協助彙整、考證與消歧義。
* 標註之地點資訊皆本於網路公開影音、新聞報導與公開社群討論記錄。
* **資料勘誤與隱私下架**：若收錄之地點資訊有誤、涉及私人產權維護，或相關當事人與地主因隱私考量不願列入者，請隨時透過 [GitHub Issues](https://github.com/c910335/meme-map/issues) 或 [Threads (@c910335)](https://www.threads.com/@c910335) 聯繫，我們將第一時間配合修正或移除。

---

## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 開源授權。  
Copyright (c) 2026 Tatsujin Chin <c910335@gmail.com>
