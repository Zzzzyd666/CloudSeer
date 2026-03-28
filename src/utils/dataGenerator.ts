
import { TyphoonPoint, TyphoonCase } from '../types';

export const generateTyphoonData = (caseName: string): TyphoonPoint[] => {
  const points: TyphoonPoint[] = [];
  const hours = 24;
  
  // 不同台风场次的起始位置
  // 漂移因子现在是应用曲率前的基础速度
  const startPos: Record<string, { lat: number; lng: number; drift: number }> = {
    'In-Fa': { lat: 21.5, lng: 128.0, drift: 0.12 },
    'Muifa': { lat: 19.0, lng: 130.0, drift: 0.18 },
  };

  const { lat: baseLat, lng: baseLng, drift } = startPos[caseName] || startPos['In-Fa'];

  for (let i = 0; i <= hours; i++) {
    const time = `${String(i).padStart(2, '0')}:00`;
    
    // 1. 模拟移动（真实路径）- 逼真的曲线路径
    let lat, lng;
    const t = i / hours; // 归一化时间 0.0 -> 1.0

    if (caseName === 'In-Fa') {
        // “烟花”风格：较慢、蜿蜒的“S”形曲线（蛇形）
        // 向西北移动，但有明显摆动
        lat = baseLat + (i * drift * 1.1) + (Math.sin(i * 0.3) * 0.4); 
        lng = baseLng - (i * drift * 1.4) + (Math.cos(i * 0.3) * 0.4);
    } else {
        // “梅花”风格：快速转向（抛物线转向）
        // 开始向西北移动，然后转向北，再转向东北偏北（模拟转向）
        // 纬度：向北加速
        lat = baseLat + (i * drift * 0.8) + (i * i * 0.008);
        // 经度：最初向西移动，但速度急剧下降（转向点）
        lng = baseLng - (i * drift * 1.5) + (i * i * 0.02);
    }
    
    // 2. 模拟 IDOL 预测移动（与新的曲线路径略有偏差）
    // 预测通常在转弯时略有滞后或超调
    const latError = (Math.sin(i * 0.8) * 0.08) + (Math.random() * 0.03 - 0.015); 
    const lngError = (Math.cos(i * 0.8) * 0.08) + (Math.random() * 0.03 - 0.015);
    const lat_pred = lat + latError;
    const lng_pred = lng + lngError;

    // 3. 强度（风速）
    // 强度在模拟中间达到峰值
    const baseIntensity = 35 + Math.sin(i / 8) * 20; 
    const intensity_real = Math.round(baseIntensity + Math.random() * 3);
    // 预测有自己的曲线和噪声
    const intensity_pred = Math.round(baseIntensity + (Math.sin(i / 5) * 3) + Math.random() * 4 - 2);
    
    // 4. 气压
    // 与强度成反比
    const pressure = 1000 - (intensity_real * 1.8);
    const pressure_pred = 1000 - (intensity_pred * 1.8) + (Math.random() * 4 - 2);
    
    // 5. 半径（真实与预测）
    // 真实结构会“呼吸”（扩张/收缩）
    const inner_radius_real = Math.round(30 + Math.sin(i / 6) * 8);
    const outer_radius_real = Math.round(200 + Math.cos(i / 10) * 40);
    
    // 预测结构（带误差）
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









import { CloudSeerCase, CloudSeerPoint, CloudSeerBand, CloudSeerModel } from '../types';

// CloudSeer 8个波段定义
export const CLOUDSEER_BANDS: CloudSeerBand[] = [
  { id: '0.64', wavelength: '0.64', nameEn: 'Visible', nameZh: '可见光', unit: 'μm' },
  { id: '1.6', wavelength: '1.6', nameEn: 'Near IR', nameZh: '近红外', unit: 'μm' },
  { id: '3.9', wavelength: '3.9', nameEn: 'Shortwave IR', nameZh: '短波红外', unit: 'μm' },
  { id: '8.6', wavelength: '8.6', nameEn: 'IR Window', nameZh: '红外窗区', unit: 'μm' },
  { id: '10.4', wavelength: '10.4', nameEn: 'IR Window', nameZh: '红外窗区', unit: 'μm' },
  { id: '11.2', wavelength: '11.2', nameEn: 'IR Window', nameZh: '红外窗区', unit: 'μm' },
  { id: '12.3', wavelength: '12.3', nameEn: 'IR Window', nameZh: '红外窗区', unit: 'μm' },
  { id: '13.3', wavelength: '13.3', nameEn: 'IR Window', nameZh: '红外窗区', unit: 'μm' },
];

// CloudSeer 对比模型
export const CLOUDSEER_MODELS: CloudSeerModel[] = [
  { id: 'gt', nameEn: 'Ground Truth', nameZh: '真实值' },
  { id: 'opticalflow', nameEn: 'Optical Flow', nameZh: '光流法' },
  { id: 'convlstm', nameEn: 'ConvLSTM', nameZh: 'ConvLSTM' },
  { id: 'simvp', nameEn: 'SimVP', nameZh: 'SimVP' },
  { id: 'phydnet', nameEn: 'PhyDNet', nameZh: 'PhyDNet' },
  { id: 'cloudseer-t', nameEn: 'CloudSeer-T', nameZh: 'CloudSeer-T', isOurs: true },
  { id: 'cloudseer-b', nameEn: 'CloudSeer-B', nameZh: 'CloudSeer-B', isOurs: true },
];

// 生成 CloudSeer 模拟数据
export const generateCloudSeerData = (caseType: 'typhoon' | 'convection' | 'front'): CloudSeerPoint[] => {
  const points: CloudSeerPoint[] = [];
  const height = 256;
  const width = 256;
  const bands = 8;
  
  // 总共12帧：过去6帧(输入) + 未来6帧(预报)
  for (let i = 0; i < 12; i++) {
    const time = i < 6 ? `T-${(6-i)*30}min` : `T+${(i-5)*30}min`;
    
    // 生成模拟云图数据
    const cloudData: number[][][] = [];
    for (let b = 0; b < bands; b++) {
      const bandData: number[][] = [];
      for (let h = 0; h < height; h++) {
        const row: number[] = [];
        for (let w = 0; w < width; w++) {
          // 生成模拟云结构
          const baseNoise = Math.sin(h * 0.05 + i * 0.1) * Math.cos(w * 0.05 + i * 0.08) * 0.3 + 0.5;
          const spiralNoise = caseType === 'typhoon' 
            ? Math.sin(Math.sqrt(Math.pow(h - height/2, 2) + Math.pow(w - width/2, 2)) * 0.03 + i * 0.15) * 0.2
            : 0;
          const value = Math.max(0, Math.min(1, baseNoise + spiralNoise + (Math.random() - 0.5) * 0.1));
          row.push(value);
        }
        bandData.push(row);
      }
      cloudData.push(bandData);
    }
    
    // 生成模拟位移场
    const displacementField: number[][][] = [];
    for (let h = 0; h < height; h++) {
      const row: number[][] = [];
      for (let w = 0; w < width; w++) {
        const dx = Math.sin(h * 0.02 + i * 0.05) * 2 + (caseType === 'typhoon' ? (w - width/2) * 0.001 : 0);
        const dy = Math.cos(w * 0.02 + i * 0.05) * 2 + (caseType === 'typhoon' ? (h - height/2) * 0.001 : 0);
        row.push([dx, dy]);
      }
      displacementField.push(row);
    }
    
    // 生成模拟指标
    const baseError = i < 6 ? 0 : (i - 5) * 0.08;
    const metrics = {
      mse: 45.69 + baseError * 50 + (Math.random() - 0.5) * 5,
      mae: 3.635 + baseError * 3 + (Math.random() - 0.5) * 0.3,
      psnr: 24.41 - baseError * 10 + (Math.random() - 0.5) * 0.5,
      ssim: 0.680 - baseError * 0.15 + (Math.random() - 0.5) * 0.02,
    };
    
    points.push({
      time,
      cloudData,
      displacementField,
      metrics,
    });
  }
  
  return points;
};

// CloudSeer 测试案例
export const CLOUDSEER_CASES: CloudSeerCase[] = [
  { 
    id: 'cs1', 
    nameEn: 'Typhoon Case', 
    nameZh: '台风案例', 
    type: 'typhoon',
    data: generateCloudSeerData('typhoon') 
  },
  { 
    id: 'cs2', 
    nameEn: 'Severe Convection', 
    nameZh: '强对流案例', 
    type: 'convection',
    data: generateCloudSeerData('convection') 
  },
];