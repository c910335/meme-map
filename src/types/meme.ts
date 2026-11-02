export type MemeCategory = 
  | 'streamer'    // 實況網紅
  | 'media'       // 經典影視/廣告
  | 'politics'    // 政壇名場面
  | 'urban'       // 地方都市傳說
  | 'society';     // 社會時事

export interface MemeItem {
  id: string;
  title: string;
  subtitle: string;
  category: MemeCategory;
  year: number;
  locationName: string;
  city: string;
  district: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  quotes: string[];
  description: string;
  originStory: string;
  culturalImpact: string;
  pilgrimageTips: string;
  tags: string[];
  sourceUrl?: string;
  sourceLabel?: string;
  iconName?: string;
  popularityScore?: number; // 1-100 (可選)
  imagePlaceholder?: string;
  gmapQuery?: string; // 專屬 Google Map 搜尋地標名稱或無括號純淨門牌地址
}

export interface CategoryMeta {
  id: MemeCategory;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}
