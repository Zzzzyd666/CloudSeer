
export interface TyphoonPoint {
  time: string;
  // Real / Traditional (Ground Truth)
  lat: number;
  lng: number;
  intensity_real: number;
  pressure: number;
  inner_radius_real: number; // in km
  outer_radius_real: number; // in km
  
  // IDOL Model Estimates
  lat_pred: number;
  lng_pred: number;
  intensity_pred: number;
  pressure_pred: number;
  inner_radius_pred: number; // in km
  outer_radius_pred: number; // in km
}

export interface TyphoonCase {
  id: string;
  nameEn: string;
  nameZh: string;
  data: TyphoonPoint[];
}

export type Language = 'en' | 'zh';

// New Type for managing the main view state
export type ViewType = 'map' | 'lab_overview' | 'lab_team' | 'lab_research' | 'lab_publications';

export interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}
