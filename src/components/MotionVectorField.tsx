import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MotionVectorFieldProps {
  data: number[][][];
  language: Language;
}

export const MotionVectorField: React.FC<MotionVectorFieldProps> = ({ data, language }) => {
  const t = (key: string) => TRANSLATIONS[key][language];
  
  // 渲染矢量场Canvas
  const renderVectorCanvas = () => {
    const canvas = document.createElement('canvas');
    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return canvas.toDataURL();
    
    // 清空背景
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制网格
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * width / 10, 0);
      ctx.lineTo(i * width / 10, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * height / 10);
      ctx.lineTo(width, i * height / 10);
      ctx.stroke();
    }
    
    // 绘制箭头
    const step = 20;
    ctx.strokeStyle = '#60a5fa';
    ctx.fillStyle = '#60a5fa';
    
    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const dataY = Math.floor((y / height) * data.length);
        const dataX = Math.floor((x / width) * data[0].length);
        const [dx, dy] = data[dataY]?.[dataX] || [0, 0];
        
        // 缩放箭头长度
        const scale = 5;
        const arrowLength = Math.sqrt(dx * dx + dy * dy) * scale;
        const angle = Math.atan2(dy, dx);
        
        if (arrowLength > 0.5) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * arrowLength, y + Math.sin(angle) * arrowLength);
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // 箭头头部
          const headLength = 4;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(angle) * arrowLength, y + Math.sin(angle) * arrowLength);
          ctx.lineTo(
            x + Math.cos(angle) * arrowLength - Math.cos(angle - Math.PI / 6) * headLength,
            y + Math.sin(angle) * arrowLength - Math.sin(angle - Math.PI / 6) * headLength
          );
          ctx.lineTo(
            x + Math.cos(angle) * arrowLength - Math.cos(angle + Math.PI / 6) * headLength,
            y + Math.sin(angle) * arrowLength - Math.sin(angle + Math.PI / 6) * headLength
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    }
    
    return canvas.toDataURL();
  };

  return (
    <div className="space-y-4">
      {/* 矢量场可视化 */}
      <div className="relative h-[280px] w-full rounded-xl overflow-hidden bg-[#0f172a] border border-slate-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={renderVectorCanvas()} 
            alt="Motion Vector Field"
            className="h-full w-full object-contain"
          />
        </div>
        
        {/* 图例 */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
          <p className="text-[9px] font-bold text-blue-300 uppercase tracking-wider">
            {t('adcmp_branch')}
          </p>
          <p className="text-[8px] text-slate-300 mt-1">
            {t('motion_texture_decouple')}
          </p>
        </div>
      </div>
      
      {/* 物理约束说明 */}
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{t('advection')}</span>
          </div>
          <p className="text-[9px] text-blue-600 leading-relaxed">
            Large-scale coherent advection patterns
          </p>
        </div>
        
        <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">{t('shear_stretch')}</span>
          </div>
          <p className="text-[9px] text-indigo-600 leading-relaxed">
            Realistic mesoscale deformation patterns
          </p>
        </div>
        
        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{t('vorticity')}</span>
          </div>
          <p className="text-[9px] text-emerald-600 leading-relaxed">
            Physically plausible circulation patterns
          </p>
        </div>
      </div>
    </div>
  );
};