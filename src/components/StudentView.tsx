import React, { useState } from 'react';
import { Competition, Challenge, LeaderboardUser, StudentRequest } from '../types';

interface StudentViewProps {
  competitions: Competition[];
  setCompetitions: React.Dispatch<React.SetStateAction<Competition[]>>;
  challenges: Challenge[];
  leaderboard: LeaderboardUser[];
  onDownloadCertificate: (title: string, certId: string, qrImage: string) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  totalPoints: number;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
  onOpenNewCompetition: () => void;
  isRegistered: boolean;
  setIsRegistered: (reg: boolean) => void;
  enrolledCompIds: string[];
  setEnrolledCompIds: React.Dispatch<React.SetStateAction<string[]>>;
  studentSchool: string;
  setStudentSchool: (sch: string) => void;
  studentCourse: string;
  setStudentCourse: (crs: string) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  requests: StudentRequest[];
  setRequests: React.Dispatch<React.SetStateAction<StudentRequest[]>>;
}

const AVATAR_PRESETS = [
  { label: 'Ingeniero', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr8X4hxc-Md2MmnQTxzH9LefY51trP1SVXZgdUo8WvfL2HeWW6FFruMMWfu_-wAF1iyNYH31KlONrWon7vIzra-mR2vziSofgrWilyyNR8ndOgAVum3PZEO3eZeN9Ri0-kj3zaWokRO59YreEp4Ql2wxnzYw7386tWUXFxZIoh7iKDaw1uNY7IlelLLIiS4wHbcCvtHKJgeW8CfaV70-g8DFJToiI06DBJOzyyW5AQ5j0k8gAIWymRwsx4C52w8oaGQQb5MChEm1o' },
  { label: 'Científica', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGRw3qnSZ2lPwOvUkq_DUTPCjslcrMxQC4GO9UayxKFEdmizf2kttLrGSJyjWa_RbmzWi1cqD1antNUKNKqv8NjJiZQO9DNazNrN0vgFqivnfmWwhrIFEhwcPhd5zfmduEI6elk-JligfgG_qa0DdTwu4HcHlI1-Y5_WFSVYMHCgwt_WaksmofMz-5rDCj99WbjFRUhSB8EkYKiiIrFi66oA7VZNhS5w6neDBmsWSDdMBoPN-r45-mfWiPgBvmQ9pe6gWD_NIsiM8' },
  { label: 'Matemático', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqG-F-nga2ZMjmoURm7jxiLz0l84CYw8gCbmr0hvmrBxPS8D13U-14l9BRYrHCfGWl5lUnVo6E1vOgWEGnOhFqclDF82X_d8rnKE61yjc7bxby7uZKgYFb_hbaQaqRQdYFT61fh39WLeb1fOfpuRb7RaRr2fi6IPqDzMa_upNxDfMgu9jRTRx3FGY2gWOm5dvZkrUepfCebdn3pRCcRoCnDsp2XnfSi2hqelJVKLGkJdG-T2tnbxoK5QhNIr3QYQTkoOy9dx49ONc' },
  { label: 'Creativo', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-GMre1Ewx6FQvBnhIFmO_MqNNOxV0KVKz5-kJud40gEuy-5zqsaM78U1V3uw8vhOx7gwFDipms7GF4cdGfx3MxRTv-Trqx5snvrkpIyQcWlsVbIwrKG1VS89DoD6U-I1BHQJlQcmjyOJQV3y4U-npJUIBuSz19qhYPycHJQFtosXwcKGYp96u2Pnd01lGZ9a8GpCt2WMHVZTNO_04e1c2-1cpVN_D6PnS4Hrjz23jOmQVwa062m3lmlLy1-SX8Lj7Zf-p14mEK8E' }
];

export default function StudentView({
  competitions,
  setCompetitions,
  challenges,
  leaderboard,
  onDownloadCertificate,
  studentName,
  setStudentName,
  totalPoints,
  setTotalPoints,
  onOpenNewCompetition,
  isRegistered,
  setIsRegistered,
  enrolledCompIds,
  setEnrolledCompIds,
  studentSchool,
  setStudentSchool,
  studentCourse,
  setStudentCourse,
  isRegisterModalOpen,
  setIsRegisterModalOpen,
  requests,
  setRequests
}: StudentViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New interactive states
  const [activeTab, setActiveTab] = useState<'mine' | 'browse'>('mine');
  const [selectedCompToEnroll, setSelectedCompToEnroll] = useState<Competition | null>(null);
  
  // Registration form temp states
  const [tempName, setTempName] = useState(studentName);
  const [tempSchool, setTempSchool] = useState(studentSchool);
  const [tempCourse, setTempCourse] = useState(studentCourse);
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleContinueCompetition = (id: string, title: string) => {
    setCompetitions(prev => prev.map(comp => {
      if (comp.id === id) {
        const nextProgress = Math.min(comp.progress + 15, 100);
        if (nextProgress === 100 && comp.progress < 100) {
          setTotalPoints(p => p + 300);
          showToast(`¡Felicidades! Completaste la competencia "${title}" y ganaste 300 puntos.`);
        } else {
          setTotalPoints(p => p + 25);
          showToast(`Progreso guardado en "${title}". +25 puntos.`);
        }
        return { ...comp, progress: nextProgress };
      }
      return comp;
    }));
  };

  const handleSolveChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
  };

  const submitChallengeSolution = () => {
    if (activeChallenge) {
      setTotalPoints(p => p + activeChallenge.points);
      showToast(`Reto "${activeChallenge.title}" completado. ¡Ganaste ${activeChallenge.points} puntos!`);
      setActiveChallenge(null);
    }
  };

  // Confirm registration
  const handleConfirmRegistration = () => {
    if (!tempName.trim()) {
      showToast("Por favor, ingresa tu nombre completo.");
      return;
    }
    setStudentName(tempName);
    setStudentSchool(tempSchool || 'Universidad de Excelencia Académica');
    setStudentCourse(tempCourse || 'Especialidad General');
    setIsRegistered(true);
    setTotalPoints(p => p + 500);
    setIsRegisterModalOpen(false);
    showToast(`¡Registro oficial exitoso, ${tempName}! Ganaste un bono de +500 puntos.`);
  };

  // Click on open competition enrollment button
  const handleEnrollClick = (comp: Competition) => {
    if (!isRegistered) {
      showToast("⚠️ Debes registrarte formalmente en la plataforma antes de inscribirte en una competencia.");
      setIsRegisterModalOpen(true);
    } else {
      setSelectedCompToEnroll(comp);
    }
  };

  // Submit enrollment modal confirmation
  const handleEnrollSubmit = (comp: Competition, mode: 'direct' | 'request') => {
    if (mode === 'direct') {
      // Direct
      setEnrolledCompIds(prev => [...prev, comp.id]);
      setCompetitions(prev => prev.map(c => {
        if (c.id === comp.id) {
          return { 
            ...c, 
            progress: 0, 
            status: 'Ongoing',
            registeredCount: (c.registeredCount || 0) + 1 
          };
        }
        return c;
      }));
      setTotalPoints(p => p + 100);
      showToast(`¡Inscripción exitosa en "${comp.title}"! +100 puntos.`);
    } else {
      // Request to Tutor
      const initials = studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'YA';
      const newRequest: StudentRequest = {
        id: `req-${Date.now()}`,
        name: studentName,
        initials,
        competition: comp.title,
        status: 'pending'
      };
      setRequests(prev => [newRequest, ...prev]);
      showToast(`✉️ Solicitud enviada al Tutor. ¡Cambia tu rol a "Tutor" para ver y aprobar tu propia solicitud!`);
    }
    setSelectedCompToEnroll(null);
  };

  // Competitions queries
  const studentCompetitions = competitions.filter(c => enrolledCompIds.includes(c.id) || c.id.startsWith('custom-'));
  const discoverCompetitions = competitions.filter(c => !enrolledCompIds.includes(c.id) && !c.id.startsWith('custom-'));

  const filteredCompetitions = studentCompetitions.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscoverCompetitions = discoverCompetitions.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a365d] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-[#86a0cd]/30 animate-bounce">
          <span className="material-symbols-outlined text-secondary-container">verified</span>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {!isRegistered && (
        <div className="bg-gradient-to-r from-amber-500 to-[#e08900] rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-3xl">how_to_reg</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base">⚠️ Registro de Estudiante Pendiente</h3>
              <p className="text-white/90 text-xs mt-0.5 max-w-xl">
                ¡Regístrate formalmente en el portal académico de la UEB para desbloquear tu posición oficial en el Leaderboard global, inscribirte en todas las competencias académicas abiertas y ganar un bono inicial de +500 puntos!
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-white text-[#e08900] hover:bg-amber-50 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all active:scale-95 shrink-0"
          >
            Registrarme Ahora
          </button>
        </div>
      )}

      {/* Welcome Header & Quick Stats (Bento Style) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#1a365d] rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#86a0cd]/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Panel del Estudiante</span>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1 px-2 text-xs">
                <span className="material-symbols-outlined text-xs">edit</span>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  className="bg-transparent border-none text-white focus:ring-0 font-bold w-24 p-0"
                  placeholder="Tu Nombre"
                  title="Editar Nombre"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {studentName}!</h1>
            <p className="text-[#86a0cd] text-sm max-w-md leading-relaxed">
              You're currently in the top 5% of the Global Engineering Leaderboard. Keep up the momentum by solving engineering puzzles!
            </p>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => {
                const pending = challenges.find(c => c.status === 'REQUIRED');
                if (pending) {
                  handleSolveChallenge(pending);
                } else {
                  showToast("No hay retos pendientes para resumir.");
                }
              }}
              className="bg-[#fed65b] text-[#241a00] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#ffe088] transition-colors shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Resume Last Challenge
            </button>
            
            <button 
              onClick={() => {
                setTotalPoints(p => p + 50);
                showToast("Realizaste un repaso diario diario. +50 puntos.");
              }}
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              Practice Drill (+50 pts)
            </button>
          </div>
          {/* Background Decoration */}
          <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[256px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
        </div>

        {/* Personal Stats Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#c4c6cf]/50 p-6 flex flex-col justify-between achievement-card shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#002045] bg-[#d6e3ff] p-2.5 rounded-xl">public</span>
              <span className="text-[11px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">+12 pts</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Mi Posición Global</p>
              <p className="text-3xl font-bold text-[#002045] mt-1">#142</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#c4c6cf]/50 p-6 flex flex-col justify-between achievement-card shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#735c00] bg-[#ffe088] p-2.5 rounded-xl">military_tech</span>
              <span className="text-[11px] font-bold bg-[#ffe088]/30 text-[#735c00] px-2 py-0.5 rounded-full">Top 5%</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Puntos Totales</p>
              <p className="text-3xl font-bold text-[#002045] mt-1">{totalPoints.toLocaleString()}</p>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl border border-[#c4c6cf]/50 p-6 flex items-center justify-between achievement-card shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-[#002045] border-t-transparent flex items-center justify-center font-black text-[#002045] relative">
                <span className="text-sm">24</span>
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#002045]/20 -m-[4px]"></div>
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Retos Completados</p>
                <p className="font-semibold text-[#002045] text-lg">Level 8 Senior Student</p>
              </div>
            </div>
            <button 
              onClick={() => showToast("Subiste a la liga oro. Próxima recompensa a los 13,000 pts.")} 
              className="material-symbols-outlined text-gray-400 hover:text-[#002045] p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Ver Detalles de Nivel"
            >
              chevron_right
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: My Competitions & Upcoming Challenges */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="space-y-6">
            {/* Header with Tab switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('mine')}
                  className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'mine' 
                      ? 'bg-[#002045] text-white shadow' 
                      : 'text-gray-500 hover:text-[#002045]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">bookmark_added</span>
                  Mis Competencias ({studentCompetitions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'browse' 
                      ? 'bg-[#002045] text-white shadow' 
                      : 'text-gray-500 hover:text-[#002045]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  Explorar Abiertas ({discoverCompetitions.length})
                </button>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar competencia..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-[#c4c6cf] rounded-lg text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none w-36 md:w-48 font-medium"
                  />
                </div>
                <button 
                  type="button"
                  onClick={onOpenNewCompetition} 
                  className="text-xs font-bold text-[#002045] hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span> Crear
                </button>
              </div>
            </div>

            {/* List based on Active Tab */}
            {activeTab === 'mine' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCompetitions.length === 0 ? (
                  <div className="col-span-2 bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
                    <p className="text-sm font-medium">No estás inscrito en ninguna competencia que coincida con la búsqueda.</p>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('browse')}
                      className="mt-3 text-xs font-bold text-[#002045] underline flex items-center gap-1 mx-auto"
                    >
                      <span className="material-symbols-outlined text-sm">explore</span> Explorar Competencias Abiertas
                    </button>
                  </div>
                ) : (
                  filteredCompetitions.map(comp => (
                    <div key={comp.id} className="bg-white rounded-2xl border border-[#c4c6cf]/50 overflow-hidden achievement-card shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="h-36 relative">
                          <img className="w-full h-full object-cover" src={comp.image} alt={comp.title} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#002045]/90 to-transparent"></div>
                          <div className="absolute bottom-3 left-4">
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#fed65b] text-[#745c00]">
                              Inscrito
                            </span>
                          </div>
                        </div>
                        <div className="p-5 space-y-4">
                          <h3 className="font-bold text-[#002045] text-base leading-snug line-clamp-2">{comp.title}</h3>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Mi Progreso</span>
                              <span className="text-[#002045] font-bold">{comp.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#002045] rounded-full transition-all duration-500" style={{ width: `${comp.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-1 text-red-600">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span className="text-[11px] font-bold">{comp.endsIn || comp.startDate || 'Próximamente'}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleContinueCompetition(comp.id, comp.title)}
                          className="text-[#002045] hover:text-blue-700 font-bold text-[11px] uppercase tracking-wider flex items-center gap-0.5 active:scale-95"
                        >
                          {comp.progress === 100 ? 'Repasar' : 'Continuar'} 
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDiscoverCompetitions.length === 0 ? (
                  <div className="col-span-2 bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                    <p className="text-sm font-medium">No se encontraron competencias abiertas para "{searchQuery}".</p>
                  </div>
                ) : (
                  filteredDiscoverCompetitions.map(comp => (
                    <div key={comp.id} className="bg-white rounded-2xl border border-[#c4c6cf]/50 overflow-hidden achievement-card shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="h-36 relative">
                          <img className="w-full h-full object-cover" src={comp.image} alt={comp.title} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#002045]/90 to-transparent"></div>
                          <div className="absolute bottom-3 left-4">
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              Abierta
                            </span>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{comp.category}</span>
                          <h3 className="font-bold text-[#002045] text-base leading-snug line-clamp-2">{comp.title}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="material-symbols-outlined text-sm">groups</span>
                            <span>{comp.registeredCount || 120} estudiantes registrados</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-1 text-[#002045]/60">
                          <span className="material-symbols-outlined text-[16px]">event</span>
                          <span className="text-[11px] font-bold">{comp.startDate || 'Registro Abierto'}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleEnrollClick(comp)}
                          className="bg-[#002045] hover:bg-blue-950 text-white font-bold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          Inscribirme
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Upcoming Challenges List */}
          <div className="bg-white rounded-2xl border border-[#c4c6cf]/50 p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="font-bold text-[#002045] text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500">assignment</span>
                Upcoming Challenges
              </h2>
              <span className="text-xs text-gray-400">Resolve to earn points</span>
            </div>
            <div className="space-y-4">
              {challenges.slice(0, 3).map(chal => (
                <div key={chal.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50/50 transition-all group relative">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-[#002045] shrink-0 border border-gray-200">
                    <span className="text-[9px] font-bold tracking-widest">{chal.month}</span>
                    <span className="text-base font-black leading-none mt-0.5">{chal.day}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#002045] text-sm group-hover:text-blue-800 transition-colors">{chal.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{chal.type}</p>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        chal.status === 'REQUIRED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Weight: {chal.weight}
                      </span>
                      <span className="text-xs font-mono text-gray-500 font-bold">{chal.points} Points</span>
                    </div>
                    <button 
                      onClick={() => handleSolveChallenge(chal)}
                      className="bg-[#002045] text-white hover:bg-blue-950 p-2 rounded-lg flex items-center justify-center transition-colors shadow-sm active:scale-95"
                      title="Solve Challenge"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Leaderboard Preview */}
          <div className="bg-white rounded-2xl border border-[#c4c6cf]/50 p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="font-bold text-[#002045] text-base flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500">leaderboard</span>
                Leaderboard
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Global Rank</span>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div 
                  key={user.rank} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    user.isCurrentUser 
                      ? 'bg-[#002045] text-white shadow-md border-transparent ring-2 ring-[#1a365d] scale-[1.01]' 
                      : 'bg-gray-50/50 hover:bg-gray-50 border-gray-100'
                  }`}
                >
                  <span className={`font-mono font-black text-sm w-7 text-center ${
                    user.isCurrentUser ? 'text-[#fed65b]' : 'text-gray-400'
                  }`}>
                    {user.rank < 10 ? `0${user.rank}` : user.rank}
                  </span>
                  {user.avatar ? (
                    <img className="w-8 h-8 rounded-full object-cover border border-white/20" src={user.avatar} alt={user.name} />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      user.isCurrentUser ? 'bg-white/20 text-white' : 'bg-[#d6e3ff] text-[#001b3c]'
                    }`}>
                      {user.initials}
                    </div>
                  )}
                  <span className="flex-1 text-xs font-semibold truncate">{user.isCurrentUser ? 'You (Alejandro)' : user.name}</span>
                  <span className={`font-mono text-xs font-bold ${user.isCurrentUser ? 'text-[#fed65b]' : 'text-gray-600'}`}>{user.points}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => showToast("Cargando posiciones completas... Actualmente estás en el puesto #142 de 24,500 estudiantes.")}
              className="w-full py-2.5 border border-gray-200 hover:border-[#002045] text-[#002045] hover:bg-[#002045]/5 rounded-xl text-xs font-bold transition-all active:scale-98"
            >
              Full Standings
            </button>
          </div>

          {/* Certificados Shortcut */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-[#c4c6cf]/50 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#735c00]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <h2 className="font-bold text-[#002045] text-base">Certificados</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">You have new certificates ready for instant verification and download.</p>
            
            <div className="space-y-2">
              <div 
                onClick={() => onDownloadCertificate(
                  "Advanced CAD 2023", 
                  "ID: #UEB-9921", 
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_9pOqyCbCFW-6xTob2nYKcwFEwAtOQ1UR4HQ4_7C3mLFOMw2gnkIFsTIHkEsDSbwgU6z8shD1AZKMh6XqfomEoEiEoDhPkuixjZbJQMeqPN9FhKMz0mQhNXzwlVE1cD5yxyYwT6ojXfgwrx2k-k3JW1lOmLGXP9RKPL8hD8A6MNBvst-jLBBcnCwUB2aoiRaPxhIy1Pl0sV9D9M65saU2izSLGL63911tTwhMB6UZYDqVAWdjJayeq4E8uwnh7adf2FsMP6ZH2g"
                )}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-1.5 rounded-lg text-lg">description</span>
                  <span className="text-xs font-bold text-gray-700">Advanced CAD 2023</span>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-[#002045] transition-colors">download</span>
              </div>
            </div>
            
            <button 
              onClick={() => showToast("Abriendo gestor de documentos... Tienes 4 archivos disponibles.")}
              className="text-xs font-bold text-[#002045] hover:underline flex items-center gap-0.5"
            >
              Manage all documents
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          {/* Career Path Progress (Extra visual element) */}
          <div className="bg-white rounded-2xl border border-[#c4c6cf]/50 p-6 space-y-4 relative overflow-hidden shadow-sm">
            <h2 className="font-bold text-[#002045] text-base flex items-center gap-1.5">
              <span className="material-symbols-outlined text-gray-500">insights</span>
              Career Path
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">Structural Engineer I</p>
                  <p className="text-[10px] text-emerald-600 font-bold">COMPLETED</p>
                </div>
              </div>
              <div className="w-px h-5 bg-gray-200 ml-1.5"></div>
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fed65b] ring-4 ring-yellow-100"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">Senior Designer II</p>
                  <p className="text-[10px] text-blue-700 font-bold uppercase">IN PROGRESS (84%)</p>
                </div>
              </div>
              <div className="w-px h-5 bg-gray-200 ml-1.5"></div>
              <div className="flex items-center gap-4 opacity-40">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-600">Chief Engineer</p>
                  <p className="text-[10px] text-gray-500 font-bold">LOCKED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solve Challenge Modal */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 bg-[#002045]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Reto Activo</span>
                <h3 className="font-bold text-lg text-[#002045] mt-1">{activeChallenge.title}</h3>
                <p className="text-xs text-gray-500">{activeChallenge.type}</p>
              </div>
              <button 
                onClick={() => setActiveChallenge(null)}
                className="material-symbols-outlined p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                close
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-3">
              <p className="font-medium text-gray-700">Pregunta de Ingeniería:</p>
              <p className="text-gray-600 leading-relaxed italic">
                "Dadas las especificaciones de carga estática en un pórtico tridimensional de hormigón armado, ¿cuál es el factor de distribución de momento si aumentamos el espesor de la losa en un 20%?"
              </p>
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
                  <input type="radio" name="solution" className="text-[#002045]" />
                  <span>Aumenta un 8.4% debido a la rigidez flexional</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
                  <input type="radio" name="solution" className="text-[#002045]" defaultChecked />
                  <span>Disminuye un 12.5% debido a la redistribución de cargas</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
                  <input type="radio" name="solution" className="text-[#002045]" />
                  <span>Se mantiene constante bajo cargas simétricas continuas</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setActiveChallenge(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={submitChallengeSolution}
                className="flex-1 py-2.5 bg-[#002045] hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Enviar Respuesta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Student Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002045]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-gray-100 shadow-2xl space-y-6 animate-scale-up relative">
            <button 
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 material-symbols-outlined p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              close
            </button>

            <div>
              <span className="bg-amber-100 text-[#735c00] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Portal UEB • Admisión
              </span>
              <h3 className="font-black text-xl text-[#002045] mt-1.5 font-sans">Registro Oficial de Estudiante</h3>
              <p className="text-xs text-gray-500 mt-1">Completa tu perfil académico para registrarte gratis en la plataforma.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">Nombre Completo</label>
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-semibold text-gray-800"
                  placeholder="Ej: Alejandro Silva"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 block">Institución / Colegio / Universidad</label>
                  <input 
                    type="text" 
                    value={tempSchool} 
                    onChange={(e) => setTempSchool(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-semibold text-gray-800"
                    placeholder="Ej: Colegio San Ignacio de Loyola"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 block">Curso / Especialidad</label>
                  <input 
                    type="text" 
                    value={tempCourse} 
                    onChange={(e) => setTempCourse(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-semibold text-gray-800"
                    placeholder="Ej: Ingeniería Civil, 5to año"
                  />
                </div>
              </div>

              {/* Select Avatar character preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">Selecciona tu Personaje Académico (Avatar)</label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatarIdx(idx)}
                      className={`p-1.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1 bg-gray-50/50 ${
                        selectedAvatarIdx === idx ? 'border-[#002045] bg-[#d6e3ff]/30 scale-[1.03]' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-10 h-10 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                      <span className="text-[9px] font-bold text-gray-600 tracking-tight text-center leading-none mt-1">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleConfirmRegistration}
                className="flex-1 py-3 bg-[#002045] hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                Confirmar y Activar Perfil (+500 pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Competition Enrollment Modal */}
      {selectedCompToEnroll && (
        <div className="fixed inset-0 z-50 bg-[#002045]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Solicitud de Admisión
                </span>
                <h3 className="font-bold text-lg text-[#002045] mt-1.5 font-sans">{selectedCompToEnroll.title}</h3>
                <p className="text-xs text-gray-500">Categoría: {selectedCompToEnroll.category}</p>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedCompToEnroll(null)}
                className="material-symbols-outlined p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                close
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500 text-2xl">workspace_premium</span>
                <div>
                  <p className="font-bold text-[#002045]">Bono de Inscripción: +100 puntos</p>
                  <p className="text-gray-500 text-[10px]">Por unirte a la competencia activa y subir el nivel.</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-600">Elige la Modalidad de Inscripción:</p>
                <div className="space-y-2 pt-1.5">
                  <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
                    <input type="radio" name="enroll-type" defaultChecked value="direct" className="mt-0.5 text-[#002045]" />
                    <div>
                      <p className="font-bold text-[#002045] text-xs">Inscripción Directa (Auto-Aprobación)</p>
                      <p className="text-[10px] text-gray-400">Ingreso inmediato a la competencia para empezar a resolver retos.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-[#fed65b] hover:border-yellow-500 cursor-pointer">
                    <input type="radio" name="enroll-type" value="request" className="mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-bold text-amber-800 text-xs flex items-center gap-1">
                        Solicitud Formal al Tutor (Recomendado)
                        <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">SINCRO</span>
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Envía una solicitud al Tutor. Podrás cambiar tu rol a "Tutor" para ver y aprobar tu propia solicitud en tiempo real.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setSelectedCompToEnroll(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={() => {
                  const checkedInput = document.querySelector('input[name="enroll-type"]:checked') as HTMLInputElement;
                  const mode = checkedInput?.value || 'direct';
                  handleEnrollSubmit(selectedCompToEnroll, mode as 'direct' | 'request');
                }}
                className="flex-1 py-2.5 bg-[#002045] hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Confirmar Inscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
