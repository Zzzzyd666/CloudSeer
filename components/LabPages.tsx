
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Cpu, 
  Zap,
  Mail,
  GraduationCap,
  Wind,
  CloudRain,
  Bot,
  Activity
} from 'lucide-react';
import { Language } from '../types';

// --- Shared Layout Component ---
const PageLayout: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({ children, title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="h-full w-full overflow-y-auto bg-slate-50 p-8 md:p-12"
  >
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="border-b border-slate-200 pb-8 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 relative z-10">{title}</h1>
        <p className="text-xl text-slate-500 max-w-3xl leading-relaxed relative z-10">{subtitle}</p>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -z-0 opacity-60" />
      </div>
      {children}
    </div>
  </motion.div>
);

// --- Sub-Component: Animated Stat Card ---
const StatCard: React.FC<{ icon: any; label: string; val: string; sub: string; delay: number }> = ({ icon: Icon, label, val, sub, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, delay, ease: "easeOut" }
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        borderColor: "rgba(59, 130, 246, 0.4)",
        boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.15)",
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4 relative overflow-hidden group cursor-default"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:bg-blue-50/80" />
      
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl relative z-10 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200">
        <Icon size={24} />
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight transition-colors duration-200 group-hover:text-blue-600">{val}</h3>
        <p className="font-bold text-slate-700 text-sm">{label}</p>
        <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide group-hover:text-slate-500 transition-colors duration-200">{sub}</p>
      </div>
    </motion.div>
  );
};

// --- Sub-Component: MeteoCore Abstract Art ---
const MeteoCore = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl group"
    >
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-black" />
       
       <div className="relative w-80 h-80 flex items-center justify-center">
          <motion.div 
            className="absolute w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-[50px]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute inset-0">
             <motion.div 
                className="absolute inset-[-20px] border border-dashed border-slate-700/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
             />
             <motion.div 
                className="absolute inset-0 border border-blue-500/20 rounded-full"
                style={{ borderRadius: "45%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
             </motion.div>

             <motion.div 
                className="absolute inset-12 border border-indigo-500/30 rounded-full"
                style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 rounded-full" />
                <div className="relative p-5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-blue-500/30 shadow-2xl">
                    <Cpu className="text-blue-400" size={40} />
                </div>
             </div>
             
             <div className="flex flex-col items-center">
                 <div className="flex gap-1 mb-1">
                     {[1,2,3].map(i => (
                         <motion.div 
                            key={i}
                            className="w-1 h-4 bg-blue-500/50 rounded-full"
                            animate={{ height: [8, 16, 8], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                         />
                     ))}
                 </div>
                 <span className="text-[10px] font-mono text-blue-300/70 tracking-[0.2em] uppercase">Processing</span>
             </div>
          </div>
       </div>

       <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
    </motion.div>
  );
};

// --- 1. Lab Overview Page ---
export const LabOverview: React.FC<{ language: Language }> = ({ language }) => {
  return (
    <PageLayout 
      title={language === 'zh' ? "实验室概况" : "Laboratory Overview"}
      subtitle={language === 'zh' 
        ? "深耕计算机视觉与智慧气象交叉领域，致力于推动人工智能在气象分析与灾害预警中的前沿应用。" 
        : "Specializing in the intersection of Computer Vision and Smart Meteorology, dedicated to advancing frontier AI applications in meteorological analysis and disaster warning."}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: language === 'zh' ? "科研人员" : "Researchers", val: "~", sub: "PhDs & Masters" },
          { icon: BookOpen, label: language === 'zh' ? "发表论文" : "Publications", val: "~", sub: "Top Conferences" },
          { icon: Award, label: language === 'zh' ? "所获奖项" : "Awards", val: "~", sub: "National & Provincial" },
          { icon: Target, label: language === 'zh' ? "主要项目" : "Projects", val: "~", sub: "Ongoing Grants" },
        ].map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3 relative z-10">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"/>
                    {language === 'zh' ? "团队介绍" : "Team Introduction"}
                </h3>
                <p className="text-slate-600 leading-8 text-lg text-justify relative z-10">
                    {language === 'zh' 
                        ? "浙江工业大学计算机学院计算机视觉团队，聚焦计算机视觉、智慧气象与人工智能的交叉研究领域，科研积累深厚，平台设施完善。团队当前承担国家自然科学基金联合重点、面上及省杰出青年科学基金延续资助项目等，研究方向前沿且科研经费充足，为博士后开展研究提供坚实支撑。" 
                        : "The Computer Vision Team at the College of Computer Science, Zhejiang University of Technology, focuses on the interdisciplinary research of computer vision, smart meteorology, and artificial intelligence. We boast deep scientific accumulation and comprehensive platform facilities. Currently, the team undertakes Key Joint Projects of the National Natural Science Foundation of China, General Programs, and continued funding projects of the Provincial Distinguished Youth Science Foundation."}
                </p>
            </motion.div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-full">
            <MeteoCore />
        </div>
      </div>
    </PageLayout>
  );
};

// --- 2. Lab Team Page ---
export const LabTeam: React.FC<{ language: Language }> = ({ language }) => {
    const LEADER = {
        name: language === 'zh' ? "白琮" : "Cong Bai",
        role: language === 'zh' ? "教授、博士生导师" : "Professor, Doctoral Supervisor",
        desc: language === 'zh' 
            ? "浙江省杰出青年基金及延续资助项目获得者。主要研究方向为计算机视觉、科学人工智能在气象领域的应用等，主持国家级、省部级科研项目十多项，在相关领域发表高水平学术论文多篇，具备丰富的研究生培养与科研指导经验。"
            : "Recipient of the Zhejiang Provincial Distinguished Youth Fund and its continued funding project. His main research interests include Computer Vision and AI for Science (Meteorology). He has presided over more than 10 national and provincial-level research projects, published numerous high-level academic papers, and possesses extensive experience in graduate supervision.",
    };

    const MEMBERS = [
        { name: language === 'zh' ? "朱鹏飞" : "Pengfei Zhu", role: language === 'zh' ? "硕士研究生" : "Master Student", type: "Student" },
        { name: "Student A", role: language === 'zh' ? "硕士研究生" : "Master Student", type: "Student" },
        { name: "Student B", role: language === 'zh' ? "硕士研究生" : "Master Student", type: "Student" },
        { name: "Student C", role: language === 'zh' ? "本科生" : "Undergraduate", type: "Intern" },
    ];

  return (
    <PageLayout 
      title={language === 'zh' ? "科研团队" : "Research Team"}
      subtitle={language === 'zh' ? "汇聚计算机科学与大气物理跨学科人才。" : "Gathering interdisciplinary talents in Computer Science and Atmospheric Physics."}
    >
      <div className="mb-16">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-10 items-start relative overflow-hidden group hover:shadow-md transition-all duration-300">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50 pointer-events-none" />
             <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-100 flex items-center justify-center text-5xl font-bold text-slate-300 border-4 border-white shadow-xl">
                   {language === 'zh' ? "白" : "CB"}
                </div>
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-lg">
                    <GraduationCap size={20} />
                </div>
             </div>
             <div className="flex-1 space-y-5 relative z-10">
                <div>
                   <div className="flex flex-wrap items-center gap-3 mb-2">
                       <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{LEADER.name}</h2>
                       <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-blue-200 shadow-lg">
                          {language === 'zh' ? "团队负责人" : "Principal Investigator"}
                       </span>
                   </div>
                   <p className="text-xl font-medium text-slate-600 font-serif italic">{LEADER.role}</p>
                </div>
                <p className="text-slate-600 leading-8 text-lg text-justify">
                   {LEADER.desc}
                </p>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg h-full min-h-[220px]">
            <div>
                <h3 className="text-2xl font-bold mb-4">{language === 'zh' ? "加入我们" : "Join Us"}</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                    {language === 'zh' ? "我们长期招收对 AI for Science 感兴趣的博士、硕士研究生及本科实习生。" : "We are looking for PhD, Master students and interns interested in AI for Science."}
                </p>
            </div>
            <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors w-max">
                <Mail size={18} />
                {language === 'zh' ? "联系我们" : "Contact Us"}
            </button>
        </div>

        {MEMBERS.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {member.name.substring(0, 1)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-50 text-slate-500`}>
                            {member.type}
                        </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                    <p className="text-slate-500 font-medium">{member.role}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                    <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                        <Cpu size={20} />
                    </span>
                </div>
            </div>
        ))}
      </div>
    </PageLayout>
  );
};

// --- 3. Lab Research Page ---
export const LabResearch: React.FC<{ language: Language }> = ({ language }) => {
    const AREAS = [
        {
          title: language === 'zh' ? "台风智能监测与预报" : "Typhoon Intelligent Monitoring and Forecasting",
          icon: Wind,
          color: "text-blue-500",
          bg: "bg-blue-50",
          desc: language === 'zh' 
            ? "基于多源数据与人工智能算法，实现台风路径、强度及降雨的精准监测及短期预报。" 
            : "Precise monitoring and short-term forecasting of typhoon paths, intensity, and rainfall based on multi-source data and AI algorithms."
        },
        {
          title: language === 'zh' ? "降雨智能反演与预测" : "Rainfall Intelligent Retrieval and Prediction",
          icon: CloudRain,
          color: "text-indigo-500",
          bg: "bg-indigo-50",
          desc: language === 'zh' 
            ? "结合多源观测数据构建降雨反演模型或实现精细化降雨预测。" 
            : "Constructing rainfall inversion models or achieving refined rainfall prediction by combining multi-source observational data."
        },
        {
          title: language === 'zh' ? "能源气象服务" : "Energy Meteorology Services",
          icon: Zap,
          color: "text-amber-500",
          bg: "bg-amber-50",
          desc: language === 'zh' 
            ? "研究气象条件对新能源（风电、光伏）发电效率的影响，构建能源气象服务模型。" 
            : "Researching the impact of meteorological conditions on renewable energy (wind, solar) generation efficiency and service models."
        },
        {
          title: language === 'zh' ? "气象智能体" : "Meteorological AI Agents",
          icon: Bot,
          color: "text-teal-500",
          bg: "bg-teal-50",
          desc: language === 'zh' 
            ? "开发具备自主决策能力的气象服务智能体，实现气象数据自动分析、灾害天气预报和预警信息智能推送。" 
            : "Developing autonomous meteorological service agents for automated data analysis, disaster forecasting, and intelligent warning dissemination."
        }
    ];

  return (
    <PageLayout 
      title={language === 'zh' ? "研究方向" : "Research Areas"}
      subtitle={language === 'zh' ? "探索人工智能与大气科学的深度融合路径。" : "Exploring the deep integration of Artificial Intelligence and Atmospheric Science."}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {AREAS.map((area, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                <div className={`w-14 h-14 ${area.bg} ${area.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <area.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{area.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6 text-lg text-justify">
                    {area.desc}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span>{language === 'zh' ? "了解更多" : "Read More"}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        ))}
      </div>
    </PageLayout>
  );
};

// --- 4. Lab Publications Page ---
export const LabPublications: React.FC<{ language: Language }> = ({ language }) => {
    const PAPERS = [
        { 
            year: "2025", 
            conf: "NeurIPS", 
            title: "IDOL: Meeting Diverse Distribution Shifts with Prior Physics for Tropical Cyclone Multi-Task Estimation", 
            authors: "Hanting Yan, et al.", 
            tag: "Physics-AI" 
        },
        { 
            year: "2024", 
            conf: "CVPR", 
            title: "DeepTyphoon: A Large-Scale Benchmark Dataset for Tropical Cyclone Estimation", 
            authors: "Research Team", 
            tag: "Dataset" 
        },
        { 
            year: "2024", 
            conf: "TGRS", 
            title: "Spatio-Temporal Fusion Networks for Weather Forecasting", 
            authors: "Lab Members", 
            tag: "Remote Sensing" 
        }
    ];

  return (
    <PageLayout 
      title={language === 'zh' ? "学术成果" : "Publications"}
      subtitle={language === 'zh' ? "近期发表的顶级会议与期刊论文。" : "Recent papers published in top-tier conferences and journals."}
    >
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {PAPERS.map((paper, i) => (
              <div key={i} className="p-8 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-shrink-0 w-24">
                    <span className="block text-2xl font-bold text-slate-200">{paper.year}</span>
                    <span className="block text-sm font-bold text-blue-600 uppercase tracking-wider">{paper.conf}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer leading-tight">
                        {paper.title}
                      </h4>
                      <p className="text-slate-500 font-medium text-sm">{paper.authors}</p>
                  </div>
                  <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide border border-slate-200">
                        {paper.tag}
                      </span>
                  </div>
                  <div className="flex-shrink-0">
                      <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                        <ArrowRight size={18} />
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </PageLayout>
  );
};

// End of LabPages.tsx
