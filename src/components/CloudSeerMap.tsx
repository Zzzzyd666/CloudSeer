// 实现核心云图渲染组件（一次加载，永不重复）
import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CloudSeerPoint, CloudSeerBand, Language } from '../types';
import { TRANSLATIONS } from '../constants';

// 修复 Leaflet 默认标记图标
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface CloudSeerMapProps {
  data: CloudSeerPoint[];
  currentIndex: number;
  selectedBand: CloudSeerBand;
  selectedModelId: string;
  language: Language;
  isRightPanelOpen: boolean;
  onAllImagesLoaded?: () => void;
  showBaseMap: boolean;
  opacity?: number;
}

// ===================== 核心配置 =====================
const DEFAULT_CASE_FOLDER = 'test_epoch_0_data_96';
const BAND_TO_FOLDER: Record<string, string> = {
  '0.64': 'albedo_03',
  '1.6': 'albedo_05',
  '3.9': 'tbb_07',
  '8.6': 'tbb_11',
  '10.4': 'tbb_13',
  '11.2': 'tbb_14',
  '12.3': 'tbb_15',
  '13.3': 'tbb_16',
};
const TOTAL_FRAMES = 12;
const CONTEXT_FRAME_COUNT = 6;
const ALL_BAND_IDS = Object.keys(BAND_TO_FOLDER);

// 数据集地理边界（原始经纬度，不可更改）
const CLOUD_MAP_BOUNDS: L.LatLngBoundsExpression = [[23.90, 114.05], [36.65, 126.80]];
const MAP_CENTER: [number, number] = [30.275, 120.425];
const MAP_ZOOM = 7;
// ====================================================

/**
 * 计算云图宽度覆盖容器所需的最小缩放级别
 * 保证左右方向云图宽度 ≥ 容器宽度（左右无空白）
 */
const getMinZoomForLateralCoverage = (
  map: L.Map,
  bounds: L.LatLngBoundsExpression
): number => {
  const latLngBounds = L.latLngBounds(bounds);
  const mapSize = map.getSize();
  if (mapSize.x === 0 || mapSize.y === 0) {
    return MAP_ZOOM;
  }
  const northWest = map.project(latLngBounds.getNorthWest(), 0);
  const southEast = map.project(latLngBounds.getSouthEast(), 0);
  const imgWidth = Math.abs(southEast.x - northWest.x);

  const scale = mapSize.x / imgWidth;
  const minZoom = Math.log2(scale);
  return Math.ceil(minZoom * 100) / 100;
};

/**
 * 地图固定控制器
 * - 设置 maxBounds：经度和纬度都严格等于云图原始边界 → 完全禁止移出云图范围
 * - 动态设置 minZoom：确保左右方向云图宽度始终 ≥ 容器宽度
 */
const MapFixedController: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // 直接使用云图原始边界作为 maxBounds，不进行任何扩展
    // 这样用户平移、缩放均无法看到云图经度范围以外的部分
    const cloudBounds = L.latLngBounds(CLOUD_MAP_BOUNDS);
    
    map.setMaxBounds(cloudBounds);
    map.setMinZoom(MAP_ZOOM - 1);
    map.setMaxZoom(MAP_ZOOM + 2);

    const updateMinZoom = () => {
      if (map.getSize().x === 0) return;
      const minZ = getMinZoomForLateralCoverage(map, CLOUD_MAP_BOUNDS);
      const currentZoom = map.getZoom();
      if (currentZoom < minZ) {
        map.setZoom(minZ);
      }
      // 动态限制最小缩放，防止缩小露出云图边界以外的区域
      map.setMinZoom(Math.max(MAP_ZOOM - 1, minZ));
    };

    map.whenReady(() => {
      updateMinZoom();
    });

    map.on('resize', updateMinZoom);

    return () => {
      map.off('resize', updateMinZoom);
    };
  }, [map]);

  return null;
};

export const CloudSeerMap: React.FC<CloudSeerMapProps> = ({ 
  data, 
  currentIndex, 
  selectedBand, 
  selectedModelId,
  language,
  isRightPanelOpen,
  onAllImagesLoaded,
  showBaseMap,
  opacity = 0.6
}) => {
  const t = (key: string) => TRANSLATIONS[key][language];
  const hasAllImagesLoadedRef = useRef(false);

  const allCloudUrls = useMemo<Record<string, string[]>>(() => {
    const urlMap: Record<string, string[]> = {};
    ALL_BAND_IDS.forEach(bandId => {
      const bandUrls: string[] = [];
      const bandFolderName = BAND_TO_FOLDER[bandId];
      const basePath = `/examples/${DEFAULT_CASE_FOLDER}/${bandFolderName}`;
      for (let i = 0; i < CONTEXT_FRAME_COUNT; i++) {
        bandUrls.push(`${basePath}/context/time_step_${i}.png`);
      }
      for (let i = 0; i < TOTAL_FRAMES - CONTEXT_FRAME_COUNT; i++) {
        bandUrls.push(`${basePath}/pred/time_step_${i}.png`);
      }
      urlMap[bandId] = bandUrls;
    });
    return urlMap;
  }, []);

  useEffect(() => {
    if (hasAllImagesLoadedRef.current) {
      onAllImagesLoaded?.();
      return;
    }

    const loadAllImages = async () => {
      const allUrlsToLoad: string[] = Object.values(allCloudUrls).flat() as string[];
      console.log(`🚀 开始加载所有云图，总数: ${allUrlsToLoad.length}`);
      
      const loadPromises = allUrlsToLoad.map(url => new Promise<void>(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => { console.error('❌ 加载失败:', url); resolve(); };
        img.src = url;
      }));
      
      await Promise.all(loadPromises);
      console.log('🎉 所有云图加载完成');
      hasAllImagesLoadedRef.current = true;
      onAllImagesLoaded?.();
    };

    loadAllImages();
  }, [allCloudUrls, onAllImagesLoaded]);

  const currentBandUrls = allCloudUrls[selectedBand.id] || [];
  const currentImageUrl = currentBandUrls[currentIndex] || '';

  if (!showBaseMap) {
    return (
      <div className="w-full h-full relative bg-white">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} />
        </div>
        <MapContainer 
          center={MAP_CENTER} 
          zoom={MAP_ZOOM} 
          scrollWheelZoom={true} 
          className="w-full h-full z-0"
          zoomControl={false}
          attributionControl={false}
          style={{ background: 'white' }}
        >
          {currentImageUrl && (
            <ImageOverlay
              url={currentImageUrl}
              bounds={CLOUD_MAP_BOUNDS}
              opacity={opacity}
              zIndex={10}
            />
          )}
          <MapFixedController />
        </MapContainer>
        <style>{`.leaflet-container { background: #f5f5f5 !important; }`}</style>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-[#0a0b0f]">
      <MapContainer 
        center={MAP_CENTER} 
        zoom={MAP_ZOOM} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
          url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
          subdomains={['1', '2', '3', '4']}
        />
        {currentImageUrl && (
          <ImageOverlay
            url={currentImageUrl}
            bounds={CLOUD_MAP_BOUNDS}
            opacity={opacity}
            zIndex={10}
          />
        )}
        <MapFixedController />
      </MapContainer>
    </div>
  );
};