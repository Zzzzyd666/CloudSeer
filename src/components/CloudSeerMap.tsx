// 实现核心云图渲染组件

import React from 'react';
import { CloudSeerPoint, CloudSeerBand, Language } from '../types';
import { TRANSLATIONS } from '../constants';

// 定义组件需要的参数（Props）
interface CloudSeerMapProps {
  data: CloudSeerPoint[];// 云图数据（12帧）
  currentIndex: number;// 当前显示第几帧云图
  selectedBand: CloudSeerBand;// 当前选中的卫星波段（可见光/红外）
  selectedModelId: string;// 当前选中的模型（真实值/CloudSeer预测）
  language: Language;
  isRightPanelOpen: boolean;
}


// 定义组件（标准 React 函数组件）
export const CloudSeerMap: React.FC<CloudSeerMapProps> = ({ 
  data, 
  currentIndex, 
  selectedBand, 
  selectedModelId,
  language,
  isRightPanelOpen
}) => {// 组件内部工具函数
  const t = (key: string) => TRANSLATIONS[key][language];// 一键切换中英文（和之前的翻译字典配套）
  const currentPoint = data[currentIndex];// 获取当前要显示的那一帧云图
  const bandIndex = parseInt(selectedBand.id.split('.')[0]) % 8; // 简单映射到0-7
  
  // 核心：生成云图Canvas
  const renderCloudCanvas = () => {
    const canvas = document.createElement('canvas');
    const width = 512;
    const height = 512;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return canvas.toDataURL();
    
    const cloudData = currentPoint.cloudData[bandIndex % currentPoint.cloudData.length];
    const imageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dataY = Math.floor((y / height) * cloudData.length);
        const dataX = Math.floor((x / width) * cloudData[0].length);
        const value = cloudData[dataY]?.[dataX] || 0;
        
        // 根据波段类型选择颜色映射
        let r, g, b;
        if (selectedBand.id === '0.64' || selectedBand.id === '1.6') {
          // 可见光/近红外：灰度图
          const gray = Math.floor(value * 255);
          r = g = b = gray;
        } else {
          // 红外：伪彩色（黑-蓝-青-白）
          if (value < 0.3) {
            r = 0; g = 0; b = Math.floor(value * 850);
          } else if (value < 0.6) {
            r = 0; g = Math.floor((value - 0.3) * 850); b = 255;
          } else {
            r = g = b = Math.floor((value - 0.6) * 850);
          }
        }
        
        const idx = (y * width + x) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  //  页面渲染（JSX）
  return (
    <div className="w-full h-full relative bg-[#0a0b0f]">
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} />
      </div>
      
      {/* 云图渲染 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <img 
            src={renderCloudCanvas()} 
            alt="Cloud Nowcast"
            className="max-w-[80vh] max-h-[80vh] rounded-lg shadow-2xl"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* 叠加信息 */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
              {selectedBand.wavelength} {selectedBand.unit} - {language === 'en' ? selectedBand.nameEn : selectedBand.nameZh}
            </p>
            <p className="text-sm font-mono mt-1">
              {currentPoint.time}
            </p>
          </div>
          
          {/* 模型标签 */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {selectedModelId === 'gt' ? t('gt_cloud') : 
               selectedModelId.includes('cloudseer') ? t('cloudseer_pred') : 
               selectedModelId}
            </p>
          </div>
        </div>
      </div>
      
      {/* 扫描线动画 */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-20 animate-scanLine" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanLine {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scanLine {
          animation: scanLine 4s linear infinite;
        }
      `}} />
    </div>
  );
};