
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TyphoonPoint, Language } from '../types';
import { TRANSLATIONS } from '../constants';

// 修复默认标记图标
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface TyphoonMapProps {
  data: TyphoonPoint[];
  currentIndex: number;
  language: Language;
  isRightPanelOpen: boolean; // 添加 prop 以根据侧边栏状态控制布局
}

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    // 持续时间略小于 1000ms 间隔，以获得更平滑的视觉连续性
    map.panTo(center, { animate: true, duration: 0.8 });
  }, [center, map]);
  return null;
};

// 内风圈保持恒定颜色，防止模拟过程中颜色偏移
const INNER_RING_COLOR = '#3b82f6'; 

export const TyphoonMap: React.FC<TyphoonMapProps> = ({ data, currentIndex, language, isRightPanelOpen }) => {
  const t = (key: string) => TRANSLATIONS[key][language];
  const currentPoint = data[currentIndex];
  
  const path = useMemo(() => data.map(p => [p.lat, p.lng] as [number, number]), [data]);
  const currentPos = useMemo(() => [currentPoint.lat, currentPoint.lng] as [number, number], [currentPoint]);

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={currentPos} 
        zoom={5} 
        scrollWheelZoom={true} 
        className="z-0"
        zoomControl={false}
      >
        {/* 切换到高德地图以支持中文标签和地缘政治合规性 */}
        <TileLayer
          attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
          url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
          subdomains={['1', '2', '3', '4']}
        />
        
        <Polyline 
          positions={path} 
          color="#94a3b8" 
          weight={2} 
          dashArray="5, 10" 
          opacity={0.6}
        />
        
        <Polyline 
          positions={path.slice(0, currentIndex + 1)} 
          color="#3b82f6" 
          weight={3} 
          opacity={1}
        />

        {/* 外风圈 - 可视化 IDOL 预测结构 */}
        <Circle
          center={currentPos}
          radius={currentPoint.outer_radius_pred * 1000}
          pathOptions={{ 
            color: '#3b82f6', 
            weight: 1, 
            fillOpacity: 0.05, 
            fillColor: '#3b82f6',
            className: 'outer-wind-ring'
          }}
        />

        {/* 内风圈 - 可视化 IDOL 预测结构 */}
        <Circle
          center={currentPos}
          radius={currentPoint.inner_radius_pred * 1000}
          pathOptions={{ 
            fillColor: INNER_RING_COLOR, 
            fillOpacity: 0.4, 
            color: '#fff', 
            weight: 2,
            className: 'inner-wind-ring'
          }}
        />

        {/* 当前位置脉冲标记 */}
        <Marker position={currentPos} icon={new L.DivIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white"></span>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })}>
          <Popup className="meteo-popup">
            <div className="p-1">
              <p className="text-[10px] text-slate-500 font-bold">{currentPoint.time}</p>
              <hr className="my-1 border-slate-100" />
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium uppercase">{t('lat')}</span>
                  <span className="text-[10px] text-slate-700 font-bold">{currentPoint.lat.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium uppercase">{t('lng')}</span>
                  <span className="text-[10px] text-slate-700 font-bold">{currentPoint.lng.toFixed(2)}°</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>

        <MapController center={currentPos} />
      </MapContainer>

      {/* 内核呼吸动画样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes innerBreathing {
          0% { fill-opacity: 0.35; stroke-width: 1.5; }
          50% { fill-opacity: 0.55; stroke-width: 2.5; }
          100% { fill-opacity: 0.35; stroke-width: 1.5; }
        }
        .inner-wind-ring {
          animation: innerBreathing 2.5s ease-in-out infinite;
        }
      `}} />

      {/* 悬浮指示器 - 8 参数对比仪表盘 */}
      <div 
        className={`absolute right-6 z-[1000] bg-white/95 backdrop-blur-md p-5 rounded-[20px] border border-white shadow-2xl flex flex-col gap-4 min-w-[320px] transition-all duration-300 ease-in-out ${
          isRightPanelOpen ? 'top-6' : 'top-24'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
          <span>{t('model_comparison')}</span>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 lowercase">active</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </div>
        
        {/* 对比网格 */}
        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-3">
            {/* 表头 */}
            <div className="h-4"></div> {/* 空白角 */}
            <div className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter bg-slate-50 rounded py-0.5">
               {t('traditional_method')}
            </div>
            <div className="text-[10px] font-bold text-blue-500 text-center uppercase tracking-tighter bg-blue-50 rounded py-0.5">
               {t('idol_model')}
            </div>

            {/* 第 1 行：内半径 */}
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                {t('r_inner')}
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_0_1px_rgba(59,130,246,0.3)]" />
            </div>
            <div className="text-right font-mono text-sm font-bold text-slate-600">
               {currentPoint.inner_radius_real}<span className="text-[8px] text-slate-400 ml-0.5 font-normal">km</span>
            </div>
            <div className="text-right font-mono text-sm font-bold text-blue-600">
               {currentPoint.inner_radius_pred}<span className="text-[8px] text-blue-400 ml-0.5 font-normal">km</span>
            </div>

            {/* 第 2 行：外半径 */}
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                {t('r_outer')}
                <div className="w-2.5 h-2.5 rounded-full border border-blue-500 bg-blue-50" />
            </div>
            <div className="text-right font-mono text-sm font-bold text-slate-600">
               {currentPoint.outer_radius_real}<span className="text-[8px] text-slate-400 ml-0.5 font-normal">km</span>
            </div>
            <div className="text-right font-mono text-sm font-bold text-blue-600">
               {currentPoint.outer_radius_pred}<span className="text-[8px] text-blue-400 ml-0.5 font-normal">km</span>
            </div>

            {/* 第 3 行：风速 */}
            <div className="text-[10px] font-bold text-slate-400 flex items-center">
               {t('wind_label_short')} <span className="ml-1 text-[8px] opacity-60">m/s</span>
            </div>
            <div className="text-right font-mono text-sm font-bold text-slate-600">
               {currentPoint.intensity_real}
            </div>
            <div className="text-right font-mono text-sm font-bold text-blue-600">
               {currentPoint.intensity_pred}
            </div>

            {/* 第 4 行：气压 */}
            <div className="text-[10px] font-bold text-slate-400 flex items-center">
               {t('pressure_label_short')} <span className="ml-1 text-[8px] opacity-60">hPa</span>
            </div>
            <div className="text-right font-mono text-sm font-bold text-slate-600">
               {currentPoint.pressure.toFixed(0)}
            </div>
            <div className="text-right font-mono text-sm font-bold text-blue-600">
               {currentPoint.pressure_pred.toFixed(0)}
            </div>
        </div>
      </div>
    </div>
  );
};
