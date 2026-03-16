
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
import { TyphoonPoint, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MetricsChartProps {
  data: TyphoonPoint[];
  currentIndex: number;
  language: Language;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ data, currentIndex, language }) => {
  const t = (key: string) => TRANSLATIONS[key][language];
  const currentPoint = data[currentIndex];

  const commonChartProps = {
    data: data,
    margin: { top: 5, right: 10, left: 0, bottom: 0 },
    syncId: "typhoonSync"
  };

  const commonXAxisProps = {
    dataKey: "time",
    fontSize: 10,
    tickLine: false,
    axisLine: false,
    interval: 4
  };

  const commonYAxisProps = {
    fontSize: 10,
    tickLine: false,
    axisLine: false,
    width: 40
  };

  const tooltipStyle = {
    contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', padding: '8px' },
    labelStyle: { fontWeight: 'bold', marginBottom: '4px' }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* 图表 1：风速 */}
      <div className="flex flex-col">
        <h4 className="text-[11px] font-semibold text-slate-500 mb-2 pl-1">{t('wind_speed')}</h4>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonYAxisProps} domain={['auto', 'auto']} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine x={currentPoint?.time} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', marginTop: '-5px' }} />
              <Line 
                name={t('traditional_method')} 
                type="monotone" 
                dataKey="intensity_real" 
                stroke="#64748b" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                name={t('idol_model')} 
                type="monotone" 
                dataKey="intensity_pred" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 图表 2：气压 */}
      <div className="flex flex-col border-t border-slate-100 pt-4">
        <h4 className="text-[11px] font-semibold text-slate-500 mb-2 pl-1">{t('pressure')}</h4>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonYAxisProps} domain={['auto', 'auto']} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine x={currentPoint?.time} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', marginTop: '-5px' }} />
              <Line 
                name={t('traditional_method')} 
                type="monotone" 
                dataKey="pressure" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                name={t('idol_model')} 
                type="monotone" 
                dataKey="pressure_pred" 
                stroke="#c4b5fd" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 图表 3：半径 */}
      <div className="flex flex-col border-t border-slate-100 pt-4">
        <h4 className="text-[11px] font-semibold text-slate-500 mb-2 pl-1">{t('wind_radii')}</h4>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis {...commonXAxisProps} />
              <YAxis {...commonYAxisProps} domain={[0, 'auto']} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine x={currentPoint?.time} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', marginTop: '-5px' }} />
              
              {/* 内半径 */}
              <Line 
                name={`${t('traditional_method')} (Inner)`} 
                type="monotone" 
                dataKey="inner_radius_real" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false}
              />
              <Line 
                name={`${t('idol_model')} (Inner)`} 
                type="monotone" 
                dataKey="inner_radius_pred" 
                stroke="#fcd34d" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false}
              />

              {/* 外半径 */}
              <Line 
                name={`${t('traditional_method')} (Outer)`} 
                type="monotone" 
                dataKey="outer_radius_real" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false}
              />
              <Line 
                name={`${t('idol_model')} (Outer)`} 
                type="monotone" 
                dataKey="outer_radius_pred" 
                stroke="#6ee7b7" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
