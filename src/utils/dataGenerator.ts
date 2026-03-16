
import { TyphoonPoint, TyphoonCase } from '../types';

export const generateTyphoonData = (caseName: string): TyphoonPoint[] => {
  const points: TyphoonPoint[] = [];
  const hours = 24;
  
  // Starting positions for different cases
  // drift factors are now base velocities before curvature is applied
  const startPos: Record<string, { lat: number; lng: number; drift: number }> = {
    'In-Fa': { lat: 21.5, lng: 128.0, drift: 0.12 },
    'Muifa': { lat: 19.0, lng: 130.0, drift: 0.18 },
  };

  const { lat: baseLat, lng: baseLng, drift } = startPos[caseName] || startPos['In-Fa'];

  for (let i = 0; i <= hours; i++) {
    const time = `${String(i).padStart(2, '0')}:00`;
    
    // 1. Simulate movement (Ground Truth) - REALISTIC CURVED PATHS
    let lat, lng;
    const t = i / hours; // Normalized time 0.0 -> 1.0

    if (caseName === 'In-Fa') {
        // "In-Fa" Style: Slower, meandering "S" curve (Snake-like)
        // Moves NW, but wobbles significantly
        lat = baseLat + (i * drift * 1.1) + (Math.sin(i * 0.3) * 0.4); 
        lng = baseLng - (i * drift * 1.4) + (Math.cos(i * 0.3) * 0.4);
    } else {
        // "Muifa" Style: Fast Recurvature (Parabolic turn)
        // Starts moving NW, then turns North, then NNE (simulating recurvature)
        // Lat: Accelerates Northward
        lat = baseLat + (i * drift * 0.8) + (i * i * 0.008);
        // Lng: Moves West initially, but slows down drastically (turning point)
        lng = baseLng - (i * drift * 1.5) + (i * i * 0.02);
    }
    
    // 2. Simulate IDOL Prediction Movement (Slight deviation from the new curved path)
    // Predictions usually lag slightly or overshot on turns
    const latError = (Math.sin(i * 0.8) * 0.08) + (Math.random() * 0.03 - 0.015); 
    const lngError = (Math.cos(i * 0.8) * 0.08) + (Math.random() * 0.03 - 0.015);
    const lat_pred = lat + latError;
    const lng_pred = lng + lngError;

    // 3. Intensity (Wind Speed)
    // Intensity peaks in the middle of the simulation
    const baseIntensity = 35 + Math.sin(i / 8) * 20; 
    const intensity_real = Math.round(baseIntensity + Math.random() * 3);
    // Prediction has its own curve + noise
    const intensity_pred = Math.round(baseIntensity + (Math.sin(i / 5) * 3) + Math.random() * 4 - 2);
    
    // 4. Pressure
    // Inverse to intensity
    const pressure = 1000 - (intensity_real * 1.8);
    const pressure_pred = 1000 - (intensity_pred * 1.8) + (Math.random() * 4 - 2);
    
    // 5. Radii (Real vs Predicted)
    // Real structure 'breathes' (expands/contracts)
    const inner_radius_real = Math.round(30 + Math.sin(i / 6) * 8);
    const outer_radius_real = Math.round(200 + Math.cos(i / 10) * 40);
    
    // Predicted structure (with error)
    const inner_radius_pred = Math.round(inner_radius_real + (Math.random() * 10 - 5));
    const outer_radius_pred = Math.round(outer_radius_real + (Math.random() * 20 - 10));

    points.push({
      time,
      lat,
      lng,
      intensity_real,
      intensity_pred,
      pressure,
      lat_pred,
      lng_pred,
      pressure_pred,
      inner_radius_real,
      outer_radius_real,
      inner_radius_pred,
      outer_radius_pred
    });
  }
  return points;
};

export const MOCK_CASES: TyphoonCase[] = [
  { id: '1', nameEn: 'Typhoon In-Fa', nameZh: '台风“烟花”', data: generateTyphoonData('In-Fa') },
  { id: '2', nameEn: 'Typhoon Muifa', nameZh: '台风“梅花”', data: generateTyphoonData('Muifa') }
];
