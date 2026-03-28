// 实现预报指标图表组件

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Legend
} from 'recharts';
import { CloudSeerPoint, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CloudSeerMetricsProps {
  data: CloudSeerPoint[];
  currentIndex: number;
  language: Language;
}

export const CloudSeerMetrics: React.FC<CloudSeerMetricsProps> = ({ data, currentIndex, language }) => {
  const t = (key: string) => TRANSLATIONS[key][language];
  const currentPoint = data[currentIndex];

  const chartData = data.map((point, index) => ({
    time: point.time,
    mse: point.metrics.mse,
    mae: point.metrics.mae,
    psnr: point.metrics.psnr,
    ssim: point.metrics.ssim,
    isInput: index < 6
  }));

  const commonChartProps = {
    data: chartData,
    margin: { top: 5, right: 10, left: 0, bottom: 0 }
  };

  const commonXAxisProps = {
    dataKey: "time",
    fontSize: 9,
    tickLine: false,
    axisLine: false,
    interval: 2
  };

  const commonYAxisProps = {
    fontSize: 9,
    tickLine: false,
    axisLine: false,
    width: 35
  };

  const tooltipStyle = {
    contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', padding: '6px' },
    labelStyle: { fontWeight: 'bold', marginBottom: '4px' }
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* MSE & MAE */}
      <div className="flex flex-col">
        <h4 className="text-[10px] font-semibold text-slate-500 mb-2 pl-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          {t('mse')} & {t('mae')}
        </h4>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonYAxisProps} yAxisId="left" domain={['auto', 'auto']} />
              <YAxis {...commonYAxisProps} yAxisId="right" orientation="right" domain={['auto', 'auto']} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine x={chartData[5]?.time} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" />
              <ReferenceLine x={currentPoint?.time} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: '9px', marginTop: '-5px' }} />
              <Line 
                yAxisId="left"
                name={t('mse')} 
                type="monotone" 
                dataKey="mse" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                yAxisId="right"
                name={t('mae')} 
                type="monotone" 
                dataKey="mae" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PSNR & SSIM */}
      <div className="flex flex-col border-t border-slate-100 pt-3">
        <h4 className="text-[10px] font-semibold text-slate-500 mb-2 pl-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {t('psnr')} & {t('ssim')}
        </h4>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonYAxisProps} yAxisId="left" domain={['auto', 'auto']} />
              <YAxis {...commonYAxisProps} yAxisId="right" orientation="right" domain={[0, 1]} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine x={chartData[5]?.time} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" />
              <ReferenceLine x={currentPoint?.time} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: '9px', marginTop: '-5px' }} />
              <Line 
                yAxisId="left"
                name={t('psnr')} 
                type="monotone" 
                dataKey="psnr" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                yAxisId="right"
                name={t('ssim')} 
                type="monotone" 
                dataKey="ssim" 
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 当前指标数值 */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('mse')}</p>
          <p className="text-lg font-mono font-bold text-red-600">{currentPoint.metrics.mse.toFixed(2)}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('mae')}</p>
          <p className="text-lg font-mono font-bold text-amber-600">{currentPoint.metrics.mae.toFixed(3)}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('psnr')}</p>
          <p className="text-lg font-mono font-bold text-emerald-600">{currentPoint.metrics.psnr.toFixed(2)} dB</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('ssim')}</p>
          <p className="text-lg font-mono font-bold text-indigo-600">{currentPoint.metrics.ssim.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
};