import React, { useState } from 'react';
import { Competition, ActivityLog } from '../types';

interface FacultyViewProps {
  competitions: Competition[];
  setCompetitions: React.Dispatch<React.SetStateAction<Competition[]>>;
  activities: ActivityLog[];
  onOpenNewCompetition: () => void;
}

export default function FacultyView({
  competitions,
  setCompetitions,
  activities,
  onOpenNewCompetition
}: FacultyViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast("Global Report generado satisfactoriamente. Descargando PDF ejecutivo...");
    }, 1500);
  };

  const handleDownloadAnnualBrief = () => {
    showToast("Descargando Annual Brief del Rendimiento Académico de la UEB.");
  };

  const activeCompetitions = competitions.filter(c => c.id.startsWith('comp-') || c.id.startsWith('custom-'));

  return (
    <div className="space-y-10 animate-fade-in">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a365d] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-[#86a0cd]/30 animate-bounce">
          <span className="material-symbols-outlined text-secondary-container">verified</span>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-bold text-xs text-[#002045] uppercase tracking-widest">Faculty Administration</p>
          <h1 className="text-3xl font-black text-[#002045] mt-1">Dashboard Overview</h1>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleGenerateReport}
            className="flex items-center gap-2 border border-[#002045] text-[#002045] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            {isGenerating ? 'Generando...' : 'Generate Global Report'}
          </button>
          
          <button 
            onClick={onOpenNewCompetition}
            className="flex items-center gap-2 bg-[#002045] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-950 transition-all shadow-md active:scale-95 animate-pulse"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create New Competency
          </button>
        </div>
      </div>

      {/* Global Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-5 hover:border-blue-800 transition-colors shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#002045] shrink-0">
            <span className="material-symbols-outlined text-3xl">emoji_events</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Total Active Competitions</p>
            <h3 className="text-2xl font-black text-[#002045] mt-1">{activeCompetitions.length}</h3>
            <p className="text-emerald-600 text-[10px] font-black flex items-center gap-1 mt-0.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">trending_up</span> +12% from last month
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-5 hover:border-blue-800 transition-colors shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Total Students Registered</p>
            <h3 className="text-2xl font-black text-[#002045] mt-1">12,482</h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Across 142 Schools</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-5 hover:border-blue-800 transition-colors shadow-sm">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
            <span className="material-symbols-outlined text-3xl">query_stats</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Global Participation Rate</p>
            <h3 className="text-2xl font-black text-[#002045] mt-1">87.4%</h3>
            <div className="w-36 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '87.4%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Table and Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Competitions Table (Left 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#002045] text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-500">table_chart</span> 
              Active Competitions
            </h4>
            <span className="text-xs text-gray-400 font-bold">{activeCompetitions.length} Competencies active</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Registration</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {activeCompetitions.map(comp => (
                    <tr key={comp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#002045]">{comp.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">ID: {comp.id.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600">
                          {comp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          comp.status === 'Ongoing' || comp.status === 'En Curso'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-green-50 text-green-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            comp.status === 'Ongoing' || comp.status === 'En Curso' ? 'bg-blue-600 animate-pulse' : 'bg-green-600'
                          }`}></span> 
                          {comp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-600">
                            {comp.registeredCount || Math.floor(comp.progress * 12.4) || 240}
                          </span>
                          <div className="flex -space-x-1.5">
                            <div className="w-5 h-5 rounded-full border border-white bg-slate-200"></div>
                            <div className="w-5 h-5 rounded-full border border-white bg-slate-300"></div>
                            <div className="w-5 h-5 rounded-full border border-white bg-[#002045] text-[7px] flex items-center justify-center text-white font-bold">+</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => showToast(`Configuración de competencia para "${comp.title}" abierta.`)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-[#002045]"
                        >
                          <span className="material-symbols-outlined text-base">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (Right 1/3) */}
        <div className="space-y-6">
          <h4 className="font-bold text-[#002045] text-base flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gray-500">notifications_active</span> 
            Recent Activity
          </h4>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
            <div className="space-y-5">
              {activities.map(act => (
                <div key={act.id} className="flex gap-4">
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      act.type === 'school' ? 'bg-amber-50 text-amber-600' :
                      act.type === 'recalculation' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-600'
                    }`}>
                      <span className="material-symbols-outlined text-base">
                        {act.type === 'school' ? 'school' :
                         act.type === 'recalculation' ? 'update' : 'report'}
                      </span>
                    </div>
                    {act.type === 'school' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#002045]">{act.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">{act.description}</p>
                    <span className="text-[10px] text-gray-400 font-mono block mt-1">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => showToast("Cargando registro completo de actividades del sistema de administración.")}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-[#002045] font-bold text-xs rounded-xl transition-colors active:scale-98"
            >
              View All Activity
            </button>
          </div>

          {/* Platform Performance Card */}
          <div className="bg-[#002045] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h5 className="font-bold text-sm mb-1">Platform Performance</h5>
              <p className="text-xs text-[#86a0cd] opacity-90 leading-relaxed mb-5">
                Registration rates have exceeded the annual target by 14%.
              </p>
              <button 
                onClick={handleDownloadAnnualBrief}
                className="bg-[#fed65b] hover:bg-[#ffe088] text-[#241a00] px-4 py-2 rounded-xl text-[11px] font-bold transition-transform active:scale-95 shadow"
              >
                Download Annual Brief
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Asset Section */}
      <section className="mt-8">
        <div className="w-full h-44 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-200">
          <img 
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtZxbOMoFBpeD-fS2hfQO0AWxtSP-gawN6ytpja-7R7OC_xmA13C05fpAVnT9MJBNhsmZJWj0BYWwH0Nl1Wjum8uh11TJKt_gDMmhofFOJioJnG0Q-uiyWD_s1cMkg6HWQMh1EclRedS091Q1pytrhncU8GTv5_x3hWbpe1-R2zfuIhufuqIj8gm6aXUtUQv5o82SH9DqFfo6CH1bKbSNWnjjbYq3NPoz7y8bxATuHD3gEBsueQQK9bzqntcawBsG_dtrMs9fT3cA" 
            alt="Institutional Analytics" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002045]/90 to-transparent flex items-center px-8 md:px-12">
            <div className="max-w-md space-y-2">
              <h4 className="text-xl font-bold text-white">Institutional Analytics</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Visualizing progress and academic excellence across the region with live data streams and structural load diagnostics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
