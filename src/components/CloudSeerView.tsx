import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Activity,
  Wind,
  Zap,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftOpen,
  Target,
  ChevronDown
} from 'lucide-react';
import { Language, ViewType, CloudSeerCase, CloudSeerBand, CloudSeerModel } from '../types';
import { TRANSLATIONS } from '../constants';
import { CLOUDSEER_CASES, CLOUDSEER_BANDS, CLOUDSEER_MODELS } from '../utils/dataGenerator';
import { CloudSeerMap } from './CloudSeerMap';
import { CloudSeerMetrics } from './CloudSeerMetrics';
import { MotionVectorField } from './MotionVectorField';
import { ModelPrinciplePanel } from './ModelPrinciplePanel';

// 可折叠面板组件（复用自 App.tsx，保证样式统一）
const CollapsiblePanel: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  extraHeader?: React.ReactNode;
}> = ({ title, isOpen, onToggle, children, extraHeader }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0 transition-all duration-300">
    <button 
      onClick={onToggle} 
      className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100 transition-colors border-b border-transparent data-[open=true]:border-slate-100"
      data-open={isOpen}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">{title}</span>
        {extraHeader}
      </div>
      <ChevronDown 
        size={16} 
        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <div 
      className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <div className="p-4 pt-4">
        {children}
      </div>
    </div>
  </div>
);

// 案例选择下拉组件
const CaseSelectorDropdown: React.FC<{
  options: CloudSeerCase[];
  value: string;
  onChange: (id: string) => void;
  language: Language;
}> = ({ options, value, onChange, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-100/50 text-sm font-semibold text-slate-700 outline-none border-none py-1.5 px-3 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-colors"
      >
        {selectedOption ? (language === 'en' ? selectedOption.nameEn : selectedOption.nameZh) : ''}
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-48 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 ${
                  value === option.id ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                {language === 'en' ? option.nameEn : option.nameZh}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 波段选择器
const BandSelector: React.FC<{
  bands: CloudSeerBand[];
  value: string;
  onChange: (id: string) => void;
  language: Language;
}> = ({ bands, value, onChange, language }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {bands.map((band) => (
        <button
          key={band.id}
          onClick={() => onChange(band.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            value === band.id
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {band.wavelength} {band.unit}
        </button>
      ))}
    </div>
  );
};

// 模型选择器
const ModelSelector: React.FC<{
  models: CloudSeerModel[];
  value: string;
  onChange: (id: string) => void;
  language: Language;
}> = ({ models, value, onChange, language }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onChange(model.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            value === model.id
              ? model.isOurs
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {language === 'en' ? model.nameEn : model.nameZh}
        </button>
      ))}
    </div>
  );
};

interface CloudSeerViewProps {
  language: Language;
  onNavigate: (view: ViewType) => void;
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
}

export const CloudSeerView: React.FC<CloudSeerViewProps> = ({ 
  language, 
  onNavigate,
  isLeftPanelOpen,
  onToggleLeftPanel
}) => {
  const t = (key: string) => TRANSLATIONS[key][language];
  
  // 状态管理
  const [selectedCaseId, setSelectedCaseId] = useState(CLOUDSEER_CASES[0].id);
  const [selectedBandId, setSelectedBandId] = useState(CLOUDSEER_BANDS[0].id);
  const [selectedModelId, setSelectedModelId] = useState('cloudseer-b');
  const [currentIndex, setCurrentIndex] = useState(5); // 默认从第6帧（T+0）开始
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 布局状态
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  
  // 面板内部状态
  const [panels, setPanels] = useState({
    metrics: true,
    motion: true,
    principle: true
  });

  const togglePanel = (key: keyof typeof panels) => {
    setPanels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCase = CLOUDSEER_CASES.find(c => c.id === selectedCaseId) || CLOUDSEER_CASES[0];
  const selectedBand = CLOUDSEER_BANDS.find(b => b.id === selectedBandId) || CLOUDSEER_BANDS[0];
  const currentPoint = selectedCase.data[currentIndex];

  // 播放控制
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= selectedCase.data.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedCase.data.length]);

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(parseInt(e.target.value));
    setIsPlaying(false);
  };

  const resetSimulation = () => {
    setCurrentIndex(5); // 重置到 T+0
    setIsPlaying(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* 主内容区域 */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-100">
        {/* 地图视图 */}
        <div className="absolute inset-0 z-0">
          <CloudSeerMap 
            data={selectedCase.data}
            currentIndex={currentIndex}
            selectedBand={selectedBand}
            selectedModelId={selectedModelId}
            language={language}
            isRightPanelOpen={isRightPanelOpen}
          />
        </div>

        {/* 悬浮展开按钮 - 左侧 */}
        {!isLeftPanelOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onToggleLeftPanel}
            className="absolute top-6 left-6 z-[1002] bg-white p-2 rounded-lg shadow-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={20} />
          </motion.button>
        )}

        {/* 悬浮展开按钮 - 右侧 */}
        {!isRightPanelOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsRightPanelOpen(true)}
            className="absolute top-6 right-6 z-[1002] bg-white p-2 rounded-lg shadow-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="Expand Dashboard"
          >
            <PanelRightOpen size={20} />
          </motion.button>
        )}

        {/* 顶部悬浮控制（场景选择器 + 波段选择器） */}
        <div 
          className={`absolute top-6 z-[1001] transition-all duration-300 ease-in-out pointer-events-none flex flex-col gap-3 ${
              !isLeftPanelOpen ? 'left-[4.5rem]' : 'left-6'
          }`}
        >
          {/* 场景选择 */}
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-2">
               <Target size={14} className="text-blue-500" />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('cloudseer_scene')}</span>
            </div>
            <CaseSelectorDropdown
              options={CLOUDSEER_CASES}
              value={selectedCaseId}
              language={language}
              onChange={(id) => {
                setSelectedCaseId(id);
                setCurrentIndex(5);
                setIsPlaying(false);
              }}
            />
          </div>
          
          {/* 波段选择 */}
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-2">
               <Layers size={14} className="text-indigo-500" />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('band_selection')}</span>
            </div>
            <BandSelector
              bands={CLOUDSEER_BANDS}
              value={selectedBandId}
              language={language}
              onChange={setSelectedBandId}
            />
          </div>
          
          {/* 模型选择 */}
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-2">
               <Activity size={14} className="text-emerald-500" />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('model_comparison_cloud')}</span>
            </div>
            <ModelSelector
              models={CLOUDSEER_MODELS}
              value={selectedModelId}
              language={language}
              onChange={setSelectedModelId}
            />
          </div>
        </div>

        {/* 底部时间轴控制 */}
        <div className="absolute bottom-0 left-0 right-0 z-[1001] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md p-6 pb-6 border-t border-slate-200 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] flex flex-col gap-4 pointer-events-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isPlaying ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    }`}
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                  </button>
                  <button 
                    onClick={resetSimulation}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-slate-800">{t('cloud_timeline')}</h4>
                   <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                     <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> {t('past_input')}
                     <span className="mx-2">|</span>
                     <span className="inline-block w-2 h-2 rounded-full bg-blue-500" /> {t('future_pred')}
                   </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                 <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{language === 'en' ? 'Nowcasting Time' : '预报时间'}</p>
                    <p className="text-sm font-bold text-blue-600">{currentPoint.time}</p>
                 </div>
                 <div className="h-8 w-px bg-slate-200" />
                 <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                      className="p-1 hover:bg-slate-200 rounded text-slate-400"
                    >
                      <ChevronLeft size={16}/>
                    </button>
                    <button 
                      onClick={() => setCurrentIndex(Math.min(selectedCase.data.length - 1, currentIndex + 1))}
                      className="p-1 hover:bg-slate-200 rounded text-slate-400"
                    >
                      <ChevronRight size={16}/>
                    </button>
                 </div>
              </div>
            </div>

            <div className="relative h-6 flex items-center">
              <input 
                type="range" 
                min="0" 
                max={selectedCase.data.length - 1} 
                value={currentIndex}
                onChange={handleTimelineChange}
                className="relative z-10 w-full h-1.5 bg-slate-200/50 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-lg pointer-events-none z-0" 
                style={{ width: `${(currentIndex / (selectedCase.data.length - 1)) * 100}%` }} 
              />
              {/* 输入/预报分割线 */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-500 z-20"
                style={{ left: `${(5 / (selectedCase.data.length - 1)) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between px-1">
                {['T-3h', 'T-2h', 'T-1h', 'T+0', 'T+1h', 'T+2h', 'T+3h'].map((label, i) => (
                    <span 
                      key={i} 
                      className={`text-[10px] font-bold ${i < 3 ? 'text-slate-400' : 'text-blue-600'}`}
                    >
                      {label}
                    </span>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- 右侧仪表盘面板 --- */}
      <AnimatePresence>
        <motion.aside 
            initial={{ width: 420, opacity: 1 }}
            animate={{ width: isRightPanelOpen ? 420 : 0, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full border-l border-slate-200 bg-white z-10 relative flex-shrink-0 overflow-hidden shadow-xl"
        >
            {/* 内部容器固定宽度 */}
            <div className="w-[420px] h-full flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Activity size={18} className="text-blue-500" />
                        <span>{t('analysis_dashboard')}</span>
                    </div>
                    <button 
                    onClick={() => setIsRightPanelOpen(false)}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                    >
                        <PanelRightClose size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 gap-4 flex flex-col">
                    {/* 预报指标面板 */}
                    <CollapsiblePanel 
                    title={t('cloudseer_metrics')} 
                    isOpen={panels.metrics} 
                    onToggle={() => togglePanel('metrics')}
                    >
                    <CloudSeerMetrics 
                        data={selectedCase.data} 
                        currentIndex={currentIndex} 
                        language={language} 
                    />
                    </CollapsiblePanel>
                    
                    {/* 大气运动矢量场面板 */}
                    <CollapsiblePanel 
                    title={t('motion_vector_field')} 
                    isOpen={panels.motion} 
                    onToggle={() => togglePanel('motion')}
                    extraHeader={<Wind size={14} className="text-blue-500" />}
                    >
                    <MotionVectorField 
                        data={currentPoint.displacementField}
                        language={language}
                    />
                    </CollapsiblePanel>

                    {/* 模型原理面板 */}
                    <CollapsiblePanel 
                    title={t('cloudseer_arch')} 
                    isOpen={panels.principle} 
                    onToggle={() => togglePanel('principle')}
                    extraHeader={<Zap size={14} className="text-emerald-500 fill-emerald-500" />}
                    >
                    <ModelPrinciplePanel language={language} />
                    </CollapsiblePanel>
                </div>
            </div>
        </motion.aside>
      </AnimatePresence>
    </div>
  );
};