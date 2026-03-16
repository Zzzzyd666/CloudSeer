
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface SatelliteViewProps {
  language: Language;
}

export const SatelliteView: React.FC<SatelliteViewProps> = ({ language }) => {
  const t = (key: string) => TRANSLATIONS[key][language];

  return (
    <div className="relative h-[280px] w-full rounded-xl overflow-hidden bg-[#0a0b0f] border border-slate-200 group shadow-inner">
      {/* 灰度卫星红外视图 */}
      <div className="absolute inset-0 flex items-center justify-center grayscale">
          {/* 模拟高分辨率云结构 */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen"
            style={{ 
              background: 'radial-gradient(circle at 45% 45%, #ffffff 0%, #a1a1a1 20%, #404040 50%, transparent 80%)',
              filter: 'blur(30px)',
              animation: 'cloudDrift 20s infinite linear'
            }} 
          />
          <div className="absolute inset-0 opacity-25 mix-blend-screen"
            style={{ 
              background: 'radial-gradient(circle at 55% 55%, #f0f0f0 0%, #737373 30%, #262626 60%, transparent 85%)',
              filter: 'blur(45px)',
              animation: 'cloudDrift 15s infinite linear reverse'
            }} 
          />
          
          {/* 用于云噪声的细粒度/纹理模拟 */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-15 pointer-events-none" />
          
          {/* 扫描线动画 */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20 animate-scanLine" />

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-1 h-1 bg-white/20 rounded-full absolute top-0" />
            </div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-4">
              {t('satellite_ir')}
            </p>
          </div>
      </div>

      {/* 科学网格线 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cloudDrift {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(1%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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
