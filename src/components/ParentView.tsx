import React, { useState } from 'react';
import { Certificate } from '../types';

interface ParentViewProps {
  certificates: Certificate[];
  onDownloadCertificate: (title: string, certId: string, qrImage: string) => void;
}

export default function ParentView({
  certificates,
  onDownloadCertificate
}: ParentViewProps) {
  const [selectedChild, setSelectedChild] = useState<'Alex' | 'Maya'>('Alex');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const childData = {
    Alex: {
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT_mrklY2oJ4byQC55H7KLel35sQ8Q8msDOLUvs4kKLrr8KnbL1JtxaBYjjws90HzpfCUDWP3qDCwLnIxeHn_iJRs4II1kK5AK2uPAD8Ub1JniZ3KtjlsFJY9_BCNLSQb8Vr5hOn4Lu6GdB6RThbdYh_hACj5d60M5ayrwP13wjvUWR5_XLBReUyUiJSk-pWLrElvx2gO05HcNzatt7lsUCmt0svmMIf5qrteUZQRnfVl_ygr0R1Pv4J443Wu8ZUAzPLTt3Dnyl9Q',
      points: 1240,
      pointsToNext: 260,
      level: 'Level 4 Active',
      certCount: '08',
      stars: 3,
      competitions: 12,
      ongoing: 2,
      completed: '10/12',
      milestone: 'Alex acaba de quedar en el top 3 de la "Olimpiada Matemática Regional".',
      skills: {
        Logic: '85%',
        STEM: '92%',
        Ethics: '60%',
        Collab: '78%',
        History: '45%',
        Lang: '88%'
      },
      heights: {
        Logic: 'h-[85%]',
        STEM: 'h-[92%]',
        Ethics: 'h-[60%]',
        Collab: 'h-[78%]',
        History: 'h-[45%]',
        Lang: 'h-[88%]'
      }
    },
    Maya: {
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqNt3XevTAbMzzX6dspMjXclT6ndHyMXj8gLiTvibxy1feD6Jl0p2-htC1_FqZg-7temgkDDlapa26tcNoS2GnSMdmD7_cz9WDKcNO8-RVUhVO4tHH4jgXsitqzSdxfaHOkstzuimavUstfaSiEhgHOfb2kaKe2caQwkfwZkaW6AQqiq0QXqbiN_uCSEezkCNXWpImlCWnjpk8cVdYi1jThZfPWkjDpFbShc83ehV6NdaFAMmTzeThcW9P04v4p1RRis6SePQyMYE',
      points: 1510,
      pointsToNext: 90,
      level: 'Level 5 Active',
      certCount: '11',
      stars: 4,
      competitions: 15,
      ongoing: 3,
      completed: '12/15',
      milestone: 'Maya obtuvo la puntuación máxima histórica en el examen de "Algoritmos Complejos".',
      skills: {
        Logic: '95%',
        STEM: '88%',
        Ethics: '82%',
        Collab: '90%',
        History: '75%',
        Lang: '92%'
      },
      heights: {
        Logic: 'h-[95%]',
        STEM: 'h-[88%]',
        Ethics: 'h-[82%]',
        Collab: 'h-[90%]',
        History: 'h-[75%]',
        Lang: 'h-[92%]'
      }
    }
  };

  const current = childData[selectedChild];

  return (
    <div className="space-y-10 animate-fade-in">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a365d] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-[#86a0cd]/30 animate-bounce">
          <span className="material-symbols-outlined text-secondary-container">verified</span>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Child Switcher & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#002045]">Parental Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitoring academic progress for your linked students.</p>
        </div>

        {/* Child Switcher Component */}
        <div className="flex items-center gap-4 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex -space-x-2.5 pl-2">
            <img 
              onClick={() => setSelectedChild('Alex')}
              className={`w-11 h-11 rounded-full border-2 border-white cursor-pointer ring-2 transition-all ${
                selectedChild === 'Alex' ? 'ring-[#002045] scale-110 z-10' : 'ring-transparent opacity-60 grayscale'
              }`} 
              src={childData.Alex.avatar} 
              alt="Alex Avatar"
              title="Switch to Alex"
            />
            <img 
              onClick={() => setSelectedChild('Maya')}
              className={`w-11 h-11 rounded-full border-2 border-white cursor-pointer ring-2 transition-all ${
                selectedChild === 'Maya' ? 'ring-[#002045] scale-110 z-10' : 'ring-transparent opacity-60 grayscale'
              }`} 
              src={childData.Maya.avatar} 
              alt="Maya Avatar"
              title="Switch to Maya"
            />
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="pr-3">
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Viewing Student</label>
            <select 
              value={selectedChild} 
              onChange={(e) => setSelectedChild(e.target.value as any)}
              className="bg-transparent border-none p-0 font-extrabold text-sm text-[#002045] focus:ring-0 cursor-pointer focus:outline-none"
            >
              <option value="Alex">Alex Johnson</option>
              <option value="Maya">Maya Johnson</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Summary Card (Large) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-8 relative overflow-hidden shadow-sm border border-gray-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a365d]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#002045]">Academic Progress Summary</h2>
              <span className="bg-[#fed65b] text-[#745c00] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {current.level}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total Points</p>
                <p className="text-4xl font-black text-[#002045]">{current.points}</p>
                <div className="mt-4 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#002045] h-full w-[75%] transition-all duration-500"></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">{current.pointsToNext} pts to next level</p>
              </div>

              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Certificates</p>
                <p className="text-4xl font-black text-[#002045]">{current.certCount}</p>
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <span 
                      key={idx}
                      className={`material-symbols-outlined text-lg ${
                        idx < current.stars ? 'text-amber-500' : 'text-gray-200'
                      }`} 
                      style={{ fontVariationSettings: idx < current.stars ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      stars
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Top 5% of cohort</p>
              </div>

              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Competitions</p>
                <p className="text-4xl font-black text-[#002045]">{current.competitions}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-gray-600 font-semibold">{current.ongoing} Ongoing</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">Completed {current.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Action (Small/Gold) */}
        <div className="lg:col-span-4 bg-[#1a365d] text-white rounded-2xl p-8 flex flex-col justify-between border border-[#1a365d] relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-4">
            <span className="material-symbols-outlined text-[48px] text-[#fed65b]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            <h3 className="text-xl font-bold">New Milestone!</h3>
            <p className="text-xs text-[#86a0cd] leading-relaxed">
              {selectedChild === 'Alex' 
                ? 'Alex just placed in the top 3 for "Quantum Mathematics Challenge"!'
                : 'Maya achieved 100% record score on "Advanced Calculus finals"!'}
            </p>
          </div>
          <button 
            onClick={() => {
              if (selectedChild === 'Alex') {
                onDownloadCertificate("Quantum Math Excellence", "ID: #UEB-9921", "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_9pOqyCbCFW-6xTob2nYKcwFEwAtOQ1UR4HQ4_7C3mLFOMw2gnkIFsTIHkEsDSbwgU6z8shD1AZKMh6XqfomEoEiEoDhPkuixjZbJQMeqPN9FhKMz0mQhNXzwlVE1cD5yxyYwT6ojXfgwrx2k-k3JW1lOmLGXP9RKPL8hD8A6MNBvst-jLBBcnCwUB2aoiRaPxhIy1Pl0sV9D9M65saU2izSLGL63911tTwhMB6UZYDqVAWdjJayeq4E8uwnh7adf2FsMP6ZH2g");
              } else {
                onDownloadCertificate("Ethics in AI Certificate", "ID: #UEB-8452", "https://lh3.googleusercontent.com/aida-public/AB6AXuA5-1Puj3sEB-PL8eXk-ot7ZB2Dbv8aRk1tqZOGeqNTRbqmWnq2Pjy7SsAcvQJj6RyVxg0uBxOHrLnZb9K_4AE2pQv-sF3Y2orFXvVUctunsaWUThQsF8U0OD7WcIIML76l_GjBt20A7rX-KUfown6Um1qFs2W7qOBjcDW3l5mZnnNHVYbAc8j4acaOrh4k-ax0C8MAYl94ZE_lTbgb_rZjL4s7OIXf-q5AepyxXamfL7FqkshZsgp4GT4LHUNlCW9O1HFpE8F3OAs");
              }
            }}
            className="bg-[#fed65b] hover:bg-[#ffe088] text-[#241a00] px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all text-xs shadow-md mt-6"
          >
            View Certificate 
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Timeline of Events */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-[#002045] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500">event_note</span>
            Upcoming Challenges &amp; Deadlines
          </h2>
          
          <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            {/* Timeline Item 1 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-[#002045] z-10 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">In 2 Days • Oct 24</p>
                  <h4 className="font-bold text-sm text-[#002045] mt-0.5">Robotics Engineering Semi-Finals</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Live competition at Central Campus Lab.</p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">REQUIRED</span>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-gray-300 z-10 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Oct 28</p>
                  <h4 className="font-bold text-sm text-[#002045] mt-0.5">Advanced Calculus Assignment</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Digital submission via UEB Portal.</p>
                </div>
                <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-2 py-0.5 rounded uppercase">DEADLINE</span>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-gray-300 z-10 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nov 02</p>
                  <h4 className="font-bold text-sm text-[#002045] mt-0.5">History of Sciences Quiz</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Practice module open for review.</p>
                </div>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold px-2 py-0.5 rounded uppercase">OPTIONAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Certificates (QR Integration) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-[#002045] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500">qr_code_2</span>
            Verified Certificates
          </h2>
          
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group">
                <div 
                  onClick={() => onDownloadCertificate(cert.title, cert.certificateId, cert.qrImage)}
                  className="w-14 h-14 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 cursor-pointer shrink-0"
                >
                  <img className="w-full h-full grayscale group-hover:grayscale-0 transition-all object-contain" src={cert.qrImage} alt="QR Code" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#002045] truncate">{cert.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{cert.issuedDate} • {cert.certificateId}</p>
                </div>
                <button 
                  onClick={() => onDownloadCertificate(cert.title, cert.certificateId, cert.qrImage)}
                  className="p-2 text-[#002045] hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  title="Descargar Certificado"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            ))}

            <button 
              onClick={() => showToast(`Buscando todos los certificados de ${selectedChild}... Tienes un total de ${current.certCount} documentos.`)}
              className="w-full py-2.5 text-xs font-bold text-[#002045] border border-gray-200 hover:border-[#002045] rounded-xl hover:bg-gray-50 transition-colors"
            >
              Browse All {current.certCount} Certificates
            </button>
          </div>
        </div>

        {/* Student Competency Chart (Observational) */}
        <div className="col-span-12 glass-card rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#002045]">Skill Distribution</h2>
              <p className="text-xs text-gray-500">Observational mapping of {selectedChild}'s performance across disciplines.</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#002045]"></span> CURRENT
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span> TARGET
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-end h-44 pt-4 px-2">
            {Object.entries(current.skills).map(([skill, val]) => (
              <div key={skill} className="flex flex-col items-center gap-3 h-full justify-end group cursor-pointer">
                <div className="w-full max-w-[40px] bg-gray-100 rounded-t-xl h-full flex items-end relative">
                  <div 
                    className={`w-full bg-[#002045] rounded-t-xl transition-all duration-700 ease-out flex items-center justify-center relative group-hover:bg-blue-850`} 
                    style={{ height: val }}
                  >
                    <span className="absolute -top-7 bg-[#002045] text-white font-mono text-[9px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow">
                      {val}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 text-center">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
