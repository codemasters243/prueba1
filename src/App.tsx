import React, { useState } from 'react';
import { Role, Competition, Challenge, LeaderboardUser, StudentRequest, StudentProfile, Certificate, ActiveGroup, ActivityLog } from './types';
import { 
  INITIAL_COMPETITIONS, 
  INITIAL_CHALLENGES, 
  INITIAL_LEADERBOARD, 
  INITIAL_REQUESTS, 
  INITIAL_STUDENTS, 
  INITIAL_CERTIFICATES, 
  ACTIVE_GROUPS, 
  RECENT_ACTIVITIES 
} from './data';

import StudentView from './components/StudentView';
import TutorView from './components/TutorView';
import ParentView from './components/ParentView';
import FacultyView from './components/FacultyView';

export default function App() {
  // Global States
  const [activeRole, setActiveRole] = useState<Role>('Student');
  const [studentName, setStudentName] = useState('Alejandro');
  const [totalPoints, setTotalPoints] = useState(12450);
  
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [requests, setRequests] = useState<StudentRequest[]>(INITIAL_REQUESTS);
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);

  // New Interactive Student States
  const [isRegistered, setIsRegistered] = useState(false);
  const [enrolledCompIds, setEnrolledCompIds] = useState<string[]>(['comp-01', 'comp-02']);
  const [studentSchool, setStudentSchool] = useState('');
  const [studentCourse, setStudentCourse] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Modals & Popovers States
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isNewCompModalOpen, setIsNewCompModalOpen] = useState(false);
  const [activeCertPreview, setActiveCertPreview] = useState<{title: string, certId: string, qrImage: string} | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New Competition Form States
  const [newCompTitle, setNewCompTitle] = useState('');
  const [newCompCategory, setNewCompCategory] = useState<'Science' | 'Humanities' | 'Tech'>('Science');
  const [newCompProgress, setNewCompProgress] = useState(0);
  const [newCompEndsIn, setNewCompEndsIn] = useState('Ends in 7 days');

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{sender: 'user' | 'bot', text: string}>>([
    { sender: 'bot', text: '¡Hola! Soy el Asistente Virtual de la Plataforma UEB. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [userMsgInput, setUserMsgInput] = useState('');

  // General App notification count
  const notificationCount = 3;

  // Form submission for new competition
  const handleCreateCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompTitle.trim()) return;

    const newComp: Competition = {
      id: `custom-${Date.now()}`,
      title: newCompTitle,
      category: newCompCategory,
      status: newCompProgress === 0 ? 'Starting soon' : 'Ongoing',
      progress: Number(newCompProgress),
      endsIn: newCompEndsIn,
      image: newCompCategory === 'Science' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSixPCXq1wLI0lebePv5uLjUnfOOp0-kkS1Ul5NfUDBXFIGiFin4LriFob2zvmiSgR-4wYu74KFsZntGHSMXlN3WdGbdiiNup2DsVFEmt5FqJqj_HmpfLeMBvPmKaaMfSIKce_bqOk2kM82yRZWxHrq8XuaowTsWjETprA7XCgQoiozofXh8rDkBzM6gx7LgapV76pyw3rjNO8P-gpnrg9RUW32x9g8aA65E64sZwu1LJy6TlEW1G0mAjvzlvxLrc4t5RMxwCzPvg'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiJyxwUq5XZAkvrnS32I46DvycaG4hoPl3B5g9udMWD3D96diQGSip74PYxBUOrDl54f4YhrlZcmm0UCKG4BZujsW2x_CXLPtNuFCc6_2ee17EoE3v4nalYG7KJbC7B4MTZS_GQiJ9yOuQNH1DaRd1c_OUWz6oFvy3je8Deykp-NVBwhimJi7jurKgNQBd29o4yhcjs-ODYe2fP5iZtBSYjXE4fupY84l6Swf08bFh72-aPk9zSFRaCtbrKbw8rTQZpXYdw6yWL8',
      registeredCount: 1
    };

    setCompetitions(prev => [newComp, ...prev]);
    
    // Clear and close
    setNewCompTitle('');
    setNewCompProgress(0);
    setIsNewCompModalOpen(false);

    // Dynamic feedback
    alert(`Competencia "${newCompTitle}" creada con éxito.`);
  };

  // Handler when tutor approves a student enrollment request
  const handleApproveRequestFromTutor = (studentNameParam: string, competitionTitle: string) => {
    // If the approved student is our current student, add the competition ID to their enrolled list!
    const comp = competitions.find(c => c.title === competitionTitle);
    if (comp) {
      setEnrolledCompIds(prev => {
        if (!prev.includes(comp.id)) {
          return [...prev, comp.id];
        }
        return prev;
      });
      // Increment registered count and reset progress to 0
      setCompetitions(prev => prev.map(c => {
        if (c.id === comp.id) {
          return { ...c, progress: 0, status: 'Ongoing' };
        }
        return c;
      }));
    }
  };

  // Chat triggers
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim()) return;

    const userMsg = userMsgInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setUserMsgInput('');

    // Answer logic
    setTimeout(() => {
      let botResponse = "Interesante pregunta. El portal académico de la UEB te permite dar seguimiento a tus competencias, descargar certificados oficiales e interactuar con tutores.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('certificado') || lower.includes('descargar')) {
        botResponse = "Para descargar un certificado, ve a la sección de 'Certificados' en la barra lateral y haz clic en el icono de descarga. Podrás guardarlo directamente como un archivo oficial verificado.";
      } else if (lower.includes('tutor') || lower.includes('aprobar')) {
        botResponse = "Como Tutor, puedes revisar solicitudes pendientes en 'Gestión de Inscripciones'. Haz clic en 'Aprobar' para admitir al estudiante, lo cual lo agregará automáticamente a tu lista de alumnos.";
      } else if (lower.includes('punto') || lower.includes('ganar')) {
        botResponse = "Los estudiantes pueden acumular puntos resolviendo desafíos rápidos daily, completando competencias activas, o logrando hitos académicos significativos.";
      } else if (lower.includes('rol') || lower.includes('switcher') || lower.includes('cambiar')) {
        botResponse = "Puedes cambiar de rol utilizando el botón azul 'Role Switcher' en la cabecera superior. Esto te permite explorar las vistas de Estudiante, Tutor, Padre de familia, y Administrador.";
      } else if (lower.includes('gratis') || lower.includes('pago')) {
        botResponse = "¡Esta versión es 100% gratuita y de demostración libre para exploración de la Universidad de Excelencia Académica (UEB) Academic Platform!";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  // Trigger certificate display
  const triggerDownloadCertificate = (title: string, certId: string, qrImage: string) => {
    setActiveCertPreview({ title, certId, qrImage });
  };

  // Helper values for active sidebar items
  const menuItems = {
    Student: [
      { name: 'Dashboard', icon: 'dashboard', active: true },
      { name: 'Competencies', icon: 'trophy', active: false },
      { name: 'Registrations', icon: 'person_add', active: false },
      { name: 'Performance', icon: 'leaderboard', active: false },
      { name: 'Certificates', icon: 'verified', active: false },
      { name: 'Reports', icon: 'assessment', active: false }
    ],
    Tutor: [
      { name: 'Dashboard', icon: 'dashboard', active: true },
      { name: 'Mis Alumnos', icon: 'person', active: false },
      { name: 'Inscripciones', icon: 'person_add', active: false },
      { name: 'Rendimiento', icon: 'leaderboard', active: false },
      { name: 'Informes', icon: 'assessment', active: false }
    ],
    Parent: [
      { name: 'Dashboard', icon: 'dashboard', active: true },
      { name: 'Competencies', icon: 'trophy', active: false },
      { name: 'Registrations', icon: 'person_add', active: false },
      { name: 'Performance', icon: 'leaderboard', active: false },
      { name: 'Certificates', icon: 'verified', active: false },
      { name: 'Reports', icon: 'assessment', active: false }
    ],
    Faculty: [
      { name: 'Dashboard', icon: 'dashboard', active: true },
      { name: 'Competencies', icon: 'trophy', active: false },
      { name: 'Schools', icon: 'school', active: false },
      { name: 'Users', icon: 'group', active: false },
      { name: 'Reports', icon: 'assessment', active: false },
      { name: 'Settings', icon: 'settings', active: false }
    ]
  };

  // Profile image matching current role
  const profilePics = {
    Student: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGRw3qnSZ2lPwOvUkq_DUTPCjslcrMxQC4GO9UayxKFEdmizf2kttLrGSJyjWa_RbmzWi1cqD1antNUKNKqv8NjJiZQO9DNazNrN0vgFqivnfmWwhrIFEhwcPhd5zfmduEI6elk-JligfgG_qa0DdTwu4HcHlI1-Y5_WFSVYMHCgwt_WaksmofMz-5rDCj99WbjFRUhSB8EkYKiiIrFi66oA7VZNhS5w6neDBmsWSDdMBoPN-r45-mfWiPgBvmQ9pe6gWD_NIsiM8',
    Tutor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Xm0xqJHdVxGhL_LehW5R23LYM3GuWdvh_CpQLd10OPwJBoEeZWiO9d3KHGhNVLaprXdOThy_E0Ai-KenYeocHxJSTk_-NdjrXi0B3pwq16-TinriuzYxxeRumzhKnEzDS2aimKqlKx_NReQpsT1dDtYftnS6D2kNsv5jFmljf3P3_vwHr6Hkjs69CWtFouMP5IVXNLxElg3pMvSnWWOVeGn-JV7A9G_BUNbrHmPBaa0OiWHDj5bsoUIbaxOnGoVlihuq1TqnZHE',
    Parent: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-GMre1Ewx6FQvBnhIFmO_MqNNOxV0KVKz5-kJud40gEuy-5zqsaM78U1V3uw8vhOx7gwFDipms7GF4cdGfx3MxRTv-Trqx5snvrkpIyQcWlsVbIwrKG1VS89DoD6U-I1BHQJlQcmjyOJQV3y4U-npJUIBuSz19qhYPycHJQFtosXwcKGYp96u2Pnd01lGZ9a8GpCt2WMHVZTNO_04e1c2-1cpVN_D6PnS4Hrjz23jOmQVwa062m3lmlLy1-SX8Lj7Zf-p14mEK8E',
    Faculty: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqG-F-nga2ZMjmoURm7jxiLz0l84CYw8gCbmr0hvmrBxPS8D13U-14l9BRYrHCfGWl5lUnVo6E1vOgWEGnOhFqclDF82X_d8rnKE61yjc7bxby7uZKgYFb_hbaQaqRQdYFT61fh39WLeb1fOfpuRb7RaRr2fi6IPqDzMa_upNxDfMgu9jRTRx3FGY2gWOm5dvZkrUepfCebdn3pRCcRoCnDsp2XnfSi2hqelJVKLGkJdG-T2tnbxoK5QhNIr3QYQTkoOy9dx49ONc'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-1 text-[#002045] hover:bg-gray-100 rounded-lg"
            title="Toggle Sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002045] font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            <span className="text-lg font-black text-[#002045] tracking-tight hidden sm:inline">UEB Academic Platform</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 h-full ml-10">
            <a className="h-full flex items-center text-[#002045] font-extrabold border-b-2 border-[#002045] text-xs uppercase tracking-wider" href="#">Dashboard</a>
            <a className="h-full flex items-center text-gray-500 hover:text-[#002045] transition-colors text-xs font-bold uppercase tracking-wider" href="#" onClick={() => alert("Marketplace: Próximamente disponible.")}>Marketplace</a>
            <a className="h-full flex items-center text-gray-500 hover:text-[#002045] transition-colors text-xs font-bold uppercase tracking-wider" href="#" onClick={() => alert("Comunidad UEB: Sala de chat libre próximamente.")}>Comunidad</a>
          </nav>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Panel */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-gray-500 hover:text-[#002045] hover:bg-gray-50 rounded-full transition-colors relative"
              title="Notificaciones"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-2xl p-4 w-72 shadow-2xl z-50 space-y-3 animate-scale-up">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-sm text-[#002045]">Notificaciones</span>
                  <span className="text-[10px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{notificationCount} Nuevas</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-2 hover:bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800">¡Reto diario desbloqueado!</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Suma +100 puntos extras en tu leaderboard.</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800">Solicitud de Inscripción</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Mateo Arriaga solicita ingresar a la Olimpiada.</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800">Nuevo certificado verificado</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Se emitió "Advanced CAD 2023" correctamente.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings Panel */}
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-gray-500 hover:text-[#002045] hover:bg-gray-50 rounded-full transition-colors"
              title="Ajustes de Cuenta"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-2xl p-4 w-60 shadow-2xl z-50 space-y-3">
                <span className="font-bold text-sm text-[#002045] block border-b border-gray-100 pb-1">Preferencias</span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-1 hover:bg-gray-50 rounded cursor-pointer">
                    <span>Modo Oscuro (Beta)</span>
                    <input type="checkbox" className="rounded text-[#002045]" onChange={() => alert("Modo Oscuro: Próximamente.")} />
                  </label>
                  <label className="flex items-center justify-between p-1 hover:bg-gray-50 rounded cursor-pointer">
                    <span>Alertas por Email</span>
                    <input type="checkbox" className="rounded text-[#002045]" defaultChecked />
                  </label>
                  <button 
                    onClick={() => alert("Idioma cambiado a Español.")}
                    className="w-full text-left p-1 text-xs hover:bg-gray-50 rounded font-semibold text-gray-700"
                  >
                    Idioma: Español (ES)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* Core Role Switcher Button */}
          <div className="relative">
            <button 
              onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
              className="bg-[#002045] text-white px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-950 transition-all active:scale-[0.98] flex items-center gap-1.5 shadow"
            >
              <span>Role: {activeRole}</span>
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
            </button>

            {isRoleSwitcherOpen && (
              <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-2xl p-3 w-56 shadow-2xl z-50 space-y-1.5 animate-scale-up">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2.5 pb-1">Seleccionar Vista</p>
                
                <button 
                  onClick={() => { setActiveRole('Student'); setIsRoleSwitcherOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeRole === 'Student' ? 'bg-[#d6e3ff] text-[#001b3c]' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Estudiante (Alejandro)</span>
                  <span className="material-symbols-outlined text-sm">person</span>
                </button>
                
                <button 
                  onClick={() => { setActiveRole('Tutor'); setIsRoleSwitcherOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeRole === 'Tutor' ? 'bg-[#fed65b] text-[#241a00]' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Tutor / Profesor</span>
                  <span className="material-symbols-outlined text-sm">school</span>
                </button>
                
                <button 
                  onClick={() => { setActiveRole('Parent'); setIsRoleSwitcherOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeRole === 'Parent' ? 'bg-[#ffddba] text-[#2b1700]' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Padre de Familia</span>
                  <span className="material-symbols-outlined text-sm">family_restroom</span>
                </button>
                
                <button 
                  onClick={() => { setActiveRole('Faculty'); setIsRoleSwitcherOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeRole === 'Faculty' ? 'bg-[#efedf1] text-[#002045]' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Administración Facultad</span>
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                </button>
              </div>
            )}
          </div>

          {/* User profile with dropdown info */}
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
            <img className="w-full h-full object-cover" src={profilePics[activeRole]} alt="Profile headshot" />
          </div>
        </div>
      </header>

      {/* Main Structure: Sidebar + Main Canvas */}
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar Navigation */}
        <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 w-64 pt-6 pb-8 flex flex-col z-30 transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Institutional Portal Header Card */}
          <div className="px-5 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-[#1a365d] rounded-lg flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <div>
                <p className="font-extrabold text-[#002045] text-sm leading-tight">UEB Portal</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Excellence</p>
              </div>
            </div>
          </div>

          {/* Navigation Links based on active role */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems[activeRole].map((item, index) => (
              <a 
                key={index} 
                href="#"
                onClick={() => {
                  if (item.name === 'Certificates' || item.name === 'Certificados') {
                    triggerDownloadCertificate("Quantum Math Excellence", "ID: #UEB-9921", "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_9pOqyCbCFW-6xTob2nYKcwFEwAtOQ1UR4HQ4_7C3mLFOMw2gnkIFsTIHkEsDSbwgU6z8shD1AZKMh6XqfomEoEiEoDhPkuixjZbJQMeqPN9FhKMz0mQhNXzwlVE1cD5yxyYwT6ojXfgwrx2k-k3JW1lOmLGXP9RKPL8hD8A6MNBvst-jLBBcnCwUB2aoiRaPxhIy1Pl0sV9D9M65saU2izSLGL63911tTwhMB6UZYDqVAWdjJayeq4E8uwnh7adf2FsMP6ZH2g");
                  } else {
                    alert(`Navegando a la sección ${item.name} de la plataforma académica...`);
                  }
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  item.active 
                    ? 'bg-[#1a365d] text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#002045]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}

            {/* Quick action button for applicable dashboards */}
            {(activeRole === 'Student' || activeRole === 'Tutor' || activeRole === 'Faculty') && (
              <div className="pt-6 pb-4">
                <button 
                  onClick={() => setIsNewCompModalOpen(true)}
                  className="w-full bg-[#fed65b] hover:bg-[#ffe088] text-[#241a00] font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-md transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  New Competition
                </button>
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 mt-auto border-t border-gray-100 pt-4 space-y-1">
            <a 
              href="#" 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-[#002045] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              Help Center
            </a>
            
            <a 
              href="#" 
              onClick={() => {
                const confirmed = window.confirm("¿Seguro que deseas salir de la plataforma?");
                if (confirmed) alert("Sesión cerrada.");
              }}
              className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Cerrar Sesión
            </a>
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="fixed inset-0 bg-[#002045]/30 backdrop-blur-xs z-20 md:hidden"
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 md:p-8 overflow-x-hidden min-h-[calc(100vh-64px)]">
          <div className="max-w-6xl mx-auto pb-12">
            {activeRole === 'Student' && (
              <StudentView 
                competitions={competitions}
                setCompetitions={setCompetitions}
                challenges={INITIAL_CHALLENGES}
                leaderboard={INITIAL_LEADERBOARD}
                onDownloadCertificate={triggerDownloadCertificate}
                studentName={studentName}
                setStudentName={setStudentName}
                totalPoints={totalPoints}
                setTotalPoints={setTotalPoints}
                onOpenNewCompetition={() => setIsNewCompModalOpen(true)}
                isRegistered={isRegistered}
                setIsRegistered={setIsRegistered}
                enrolledCompIds={enrolledCompIds}
                setEnrolledCompIds={setEnrolledCompIds}
                studentSchool={studentSchool}
                setStudentSchool={setStudentSchool}
                studentCourse={studentCourse}
                setStudentCourse={setStudentCourse}
                isRegisterModalOpen={isRegisterModalOpen}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
                requests={requests}
                setRequests={setRequests}
              />
            )}

            {activeRole === 'Tutor' && (
              <TutorView 
                competitions={competitions}
                requests={requests}
                setRequests={setRequests}
                students={students}
                setStudents={setStudents}
                groups={ACTIVE_GROUPS}
                onDownloadCertificate={triggerDownloadCertificate}
                onOpenNewCompetition={() => setIsNewCompModalOpen(true)}
                onApproveRequest={handleApproveRequestFromTutor}
              />
            )}

            {activeRole === 'Parent' && (
              <ParentView 
                certificates={INITIAL_CERTIFICATES}
                onDownloadCertificate={triggerDownloadCertificate}
              />
            )}

            {activeRole === 'Faculty' && (
              <FacultyView 
                competitions={competitions}
                setCompetitions={setCompetitions}
                activities={RECENT_ACTIVITIES}
                onOpenNewCompetition={() => setIsNewCompModalOpen(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Chat Assistant (Help Center) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#002045] hover:bg-blue-950 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group relative"
          title="Ayuda Académica"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">chat_bubble</span>
          {chatMessages.length === 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border border-white animate-pulse"></span>
          )}
        </button>

        {isChatOpen && (
          <div className="absolute right-0 bottom-16 bg-white border border-gray-200 rounded-2xl w-80 sm:w-96 h-[450px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            {/* Chat Header */}
            <div className="bg-[#1a365d] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fed65b]">school</span>
                <div>
                  <h4 className="font-extrabold text-xs">UEB Academic Support</h4>
                  <p className="text-[10px] text-[#86a0cd] leading-none mt-0.5">Online • Demo Asistente</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="material-symbols-outlined text-white hover:text-gray-200">close</button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#1a365d] text-white rounded-br-none' 
                      : 'bg-white text-gray-700 rounded-bl-none border border-gray-200 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick suggested chips */}
            <div className="p-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto whitespace-nowrap shrink-0 custom-scrollbar text-[10px] font-bold">
              <button 
                onClick={() => { setUserMsgInput("¿Cómo descargo certificados?"); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full shrink-0"
              >
                Descargar Certificados
              </button>
              <button 
                onClick={() => { setUserMsgInput("¿Cómo apruebo inscripciones?"); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full shrink-0"
              >
                Aprobar Alumnos
              </button>
              <button 
                onClick={() => { setUserMsgInput("¿Cómo cambio de rol?"); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full shrink-0"
              >
                Cambiar de Rol
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2 shrink-0">
              <input 
                type="text" 
                value={userMsgInput}
                onChange={(e) => setUserMsgInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#002045]"
              />
              <button 
                type="submit" 
                className="bg-[#002045] hover:bg-blue-950 text-white px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* New Competition Modal */}
      {isNewCompModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002045]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateCompetition}
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-2xl space-y-4 animate-scale-up"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-[#ffe088] text-[#735c00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Crear Competencia</span>
                <h3 className="font-bold text-lg text-[#002045] mt-1">Registrar Nueva Competencia</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsNewCompModalOpen(false)}
                className="material-symbols-outlined p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                close
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">Título de la Competencia</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Olimpiada Regional de Puentes Metálicos"
                  value={newCompTitle}
                  onChange={(e) => setNewCompTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 block">Categoría Académica</label>
                  <select 
                    value={newCompCategory}
                    onChange={(e) => setNewCompCategory(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-bold text-gray-700"
                  >
                    <option value="Science">Ciencia (Science)</option>
                    <option value="Humanities">Humanidades (Humanities)</option>
                    <option value="Tech">Tecnología (Tech)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 block">Fecha límite / Plazo</label>
                  <input 
                    type="text" 
                    value={newCompEndsIn}
                    onChange={(e) => setNewCompEndsIn(e.target.value)}
                    placeholder="Ej: Finaliza en 5 días"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Progreso Inicial</span>
                  <span>{newCompProgress}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={newCompProgress}
                  onChange={(e) => setNewCompProgress(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#002045]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsNewCompModalOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2.5 bg-[#002045] hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Publicar Competencia
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Verified Academic Certificate Modal */}
      {activeCertPreview && (
        <div className="fixed inset-0 z-50 bg-[#002045]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border-8 border-double border-amber-500 shadow-2xl relative space-y-6 animate-scale-up">
            <button 
              onClick={() => setActiveCertPreview(null)}
              className="absolute top-4 right-4 material-symbols-outlined p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
              title="Close Preview"
            >
              close
            </button>

            {/* Inner certificate border decoration */}
            <div className="border border-amber-500/20 p-6 sm:p-10 space-y-6 text-center relative">
              {/* Top Watermark Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full border-2 border-amber-500 flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-amber-500 text-3xl">verified</span>
              </div>

              <div className="space-y-1">
                <p className="font-extrabold text-xs tracking-widest text-[#1a365d] uppercase">Universidad de Excelencia Académica</p>
                <p className="text-[9px] text-amber-600 font-bold tracking-widest uppercase">UEB Academic Platform</p>
              </div>

              <div className="py-2">
                <h2 className="font-serif italic text-3xl text-gray-800 font-semibold">Certificado de Excelencia</h2>
                <div className="w-16 h-px bg-amber-500 mx-auto mt-2"></div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500 font-medium">Por cuanto se hace constar que el alumno de alto rendimiento:</p>
                <p className="text-2xl font-black text-[#1a365d] font-sans underline decoration-amber-500/50 decoration-wavy underline-offset-8">
                  {studentName} (Alejandro)
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Ha culminado con éxito y superado los estándares requeridos en la competencia certificada de:
                </p>
                <p className="text-base font-extrabold text-gray-800 tracking-tight">
                  "{activeCertPreview.title}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 items-end pt-8">
                {/* QR Code section */}
                <div className="flex flex-col items-center gap-1">
                  <img className="w-16 h-16 border border-gray-100 rounded p-1 object-contain bg-white" src={activeCertPreview.qrImage} alt="Validation QR" />
                  <span className="text-[9px] font-mono text-gray-400">Verificar Credencial</span>
                </div>

                {/* Validation signatures */}
                <div className="space-y-1.5 text-center flex flex-col items-center">
                  <div className="w-28 h-6 bg-slate-100 rounded-sm italic text-gray-400 text-[10px] flex items-center justify-center border-b border-gray-400">
                    Sello Digital UEB
                  </div>
                  <p className="text-[10px] font-bold text-gray-800">Dra. Clara Martínez</p>
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest font-semibold leading-none">Secretaria Académica UEB</p>
                </div>
              </div>

              {/* Bottom metadata details */}
              <div className="pt-6 text-[9px] font-mono text-gray-400 border-t border-gray-100 flex justify-between items-center px-4">
                <span>Expedido: {new Date().toLocaleDateString()}</span>
                <span>ID: {activeCertPreview.certId}</span>
              </div>
            </div>

            {/* Print/Download button */}
            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setActiveCertPreview(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
              >
                Cerrar
              </button>
              
              <button 
                onClick={() => {
                  window.print();
                }}
                className="bg-[#002045] hover:bg-blue-950 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
