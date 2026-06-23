import React, { useState } from 'react';
import { Competition, StudentRequest, StudentProfile, ActiveGroup } from '../types';

interface TutorViewProps {
  competitions: Competition[];
  requests: StudentRequest[];
  setRequests: React.Dispatch<React.SetStateAction<StudentRequest[]>>;
  students: StudentProfile[];
  setStudents: React.Dispatch<React.SetStateAction<StudentProfile[]>>;
  groups: ActiveGroup[];
  onDownloadCertificate: (title: string, certId: string, qrImage: string) => void;
  onOpenNewCompetition: () => void;
  onApproveRequest?: (studentName: string, competitionTitle: string) => void;
}

export default function TutorView({
  competitions,
  requests,
  setRequests,
  students,
  setStudents,
  groups,
  onDownloadCertificate,
  onOpenNewCompetition,
  onApproveRequest
}: TutorViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Física Newtoniana 101');
  const [newStudentScore, setNewStudentScore] = useState(850);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveRequest = (reqId: string, name: string, competition: string) => {
    // 1. Mark request as approved
    setRequests(prev => prev.filter(r => r.id !== reqId));
    
    // 2. Add approved student to the "Mis Alumnos" table
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newStudent: StudentProfile = {
      id: `stud-${Date.now()}`,
      name,
      initials,
      course: competition,
      score: 820,
      status: 'Inscrito'
    };
    
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Inscripción de ${name} para "${competition}" aprobada con éxito.`);

    if (onApproveRequest) {
      onApproveRequest(name, competition);
    }
  };

  const handleRejectRequest = (reqId: string, name: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
    showToast(`Solicitud de ${name} ha sido rechazada.`);
  };

  const handleSaveStudentScore = () => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      showToast(`Puntaje de ${editingStudent.name} actualizado a ${editingStudent.score}.`);
      setEditingStudent(null);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const initials = newStudentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newStud: StudentProfile = {
      id: `stud-${Date.now()}`,
      name: newStudentName,
      initials,
      course: newStudentCourse,
      score: Number(newStudentScore),
      status: 'Inscrito'
    };

    setStudents(prev => [newStud, ...prev]);
    showToast(`Alumno ${newStudentName} añadido correctamente.`);
    setNewStudentName('');
    setIsAddingStudent(false);
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast("Sincronización completa con el servidor central de la UEB.");
    }, 1500);
  };

  const handleExportData = () => {
    showToast("Generando archivo CSV... Descarga iniciada.");
  };

  // Computations
  const totalEnrolled = students.length + 1240; // baseline of 1240 plus active list
  const averageScore = Math.round(students.reduce((acc, curr) => acc + curr.score, 0) / students.length) || 842;
  const pendingCount = requests.length;

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 animate-fade-in">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a365d] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-[#86a0cd]/30 animate-bounce">
          <span className="material-symbols-outlined text-secondary-container">verified</span>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-widest block">RESUMEN INSTITUCIONAL</span>
          <h1 className="text-3xl font-black text-primary mt-1">Dashboard del Tutor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestionando el éxito de <span className="font-bold text-[#1a365d]">Colegio San Ignacio de Loyola</span>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleExportData}
            className="flex items-center gap-2 bg-white border border-[#c4c6cf] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">download</span> Exportar
          </button>
          
          <button 
            onClick={handleSyncData}
            className="flex items-center gap-2 bg-[#002045] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-950 transition-colors shadow-sm active:scale-95"
          >
            <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>sync</span> 
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>
      </div>

      {/* School Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Alumnos Inscritos */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-[#d6e3ff] flex items-center justify-center text-[#001b3c]">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>groups</span>
            </div>
            <span className="text-green-600 font-bold text-[11px] bg-green-50 px-2 py-0.5 rounded-full">+12% este mes</span>
          </div>
          <div className="mt-6">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Alumnos Inscritos</p>
            <h3 className="text-3xl font-black text-[#002045] mt-1">{totalEnrolled.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-1">Colegio San Ignacio de Loyola</p>
          </div>
        </div>

        {/* Metric 2: Promedio Puntaje */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-l-4 border-l-[#735c00] shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-[#ffe088] flex items-center justify-center text-[#735c00]">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>star</span>
            </div>
            <div className="flex items-center gap-1 text-[#735c00] font-bold text-xs bg-[#ffe088]/40 px-2.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>Top 5%</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Promedio de Puntaje</p>
            <h3 className="text-3xl font-black text-[#002045] mt-1">
              {averageScore} <span className="text-base font-normal text-gray-400">/ 1000</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Comparativa Regional: +45 pts</p>
          </div>
        </div>

        {/* Metric 3: Certificados */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-[#ffddba] flex items-center justify-center text-[#4f2e00]">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>verified</span>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded-full">Meta Anual: 75%</span>
          </div>
          <div className="mt-6">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Certificados Obtenidos</p>
            <h3 className="text-3xl font-black text-[#002045] mt-1">312</h3>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#002045] h-full w-[75%] transition-all duration-500"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">75% de la meta anual alcanzada</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Management Section (Left/Main Column) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Registration Management */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/40">
              <div>
                <h2 className="text-lg font-bold text-[#002045]">Gestión de Inscripciones</h2>
                <p className="text-xs text-gray-400">Solicitudes pendientes de aprobación por el tutor</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                pendingCount > 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-500'
              }`}>
                {pendingCount} Pendientes
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm space-y-2">
                  <span className="material-symbols-outlined text-4xl block text-gray-300">task_alt</span>
                  <p>No tienes solicitudes pendientes de aprobación.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#d6e3ff] flex items-center justify-center font-bold text-[#001b3c] shrink-0 text-sm">
                        {req.initials}
                      </div>
                      <div>
                        <p className="font-bold text-[#002045] text-sm">{req.name}</p>
                        <p className="text-xs text-gray-500">{req.competition}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <button 
                        onClick={() => handleRejectRequest(req.id, req.name)}
                        className="px-4 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xs transition-all active:scale-95"
                      >
                        Rechazar
                      </button>
                      <button 
                        onClick={() => handleApproveRequest(req.id, req.name, req.competition)}
                        className="px-4 py-1.5 rounded-lg bg-[#002045] hover:bg-blue-950 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
                      >
                        Aprobar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <button 
                onClick={() => showToast("Ya estás viendo todas las solicitudes cargadas en el panel.")}
                className="text-[#002045] hover:text-blue-950 font-bold text-xs uppercase tracking-wider"
              >
                Ver todas las solicitudes
              </button>
            </div>
          </div>

          {/* Section: My Students List */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#002045]">Mis Alumnos</h2>
                <p className="text-xs text-gray-400">Listado y gestión de alumnos vinculados a tus tutorías</p>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none w-36 sm:w-48"
                  />
                </div>
                
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#002045]"
                >
                  <option value="All">Todos</option>
                  <option value="Inscrito">Inscrito</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Draft">Draft</option>
                </select>

                <button 
                  onClick={() => setIsAddingStudent(true)}
                  className="bg-[#002045] text-white p-2 rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-950 active:scale-95 transition-colors"
                  title="Añadir Alumno Nuevo"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                </button>
              </div>
            </div>

            {isAddingStudent && (
              <form onSubmit={handleCreateStudent} className="p-5 bg-blue-50/40 border-b border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-fade-in">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 block">Nombre del Estudiante</label>
                  <input 
                    type="text" 
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Ej: Sofía Altamirano"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 block">Curso / Competencia</label>
                  <select 
                    value={newStudentCourse}
                    onChange={(e) => setNewStudentCourse(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#002045] focus:outline-none font-semibold"
                  >
                    <option value="Física Newtoniana 101">Física Newtoniana 101</option>
                    <option value="Robótica Aplicada II">Robótica Aplicada II</option>
                    <option value="Calculo Diferencial">Calculo Diferencial</option>
                    <option value="Olimpiada Matemática 2024">Olimpiada Matemática 2024</option>
                    <option value="Certificación Python Avanzado">Certificación Python Avanzado</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingStudent(false)}
                    className="flex-1 py-1.5 border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 font-bold rounded-lg text-xs"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-1.5 bg-[#002045] text-white hover:bg-blue-950 font-bold rounded-lg text-xs"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-[10px] font-bold tracking-wider text-gray-400 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Estudiante</th>
                    <th className="px-6 py-4">Competición / Curso</th>
                    <th className="px-6 py-4">Puntaje</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                        No se encontraron alumnos con los criterios de búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#d6e3ff] text-[10px] flex items-center justify-center font-bold text-[#001b3c]">
                              {student.initials}
                            </div>
                            <span className="font-bold text-[#002045] text-xs">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{student.course}</td>
                        <td className="px-6 py-4 font-mono text-xs text-primary font-bold">{student.score}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            student.status === 'Inscrito' ? 'bg-green-50 text-green-700 border-green-200' :
                            student.status === 'Ongoing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setEditingStudent(student)}
                            className="text-gray-400 hover:text-blue-700 p-1.5 hover:bg-gray-100 rounded-lg transition-all"
                            title="Editar Puntaje"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Group Performance & Insights (Right Column) */}
        <div className="space-y-8">
          {/* Performance Chart Mockup */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#002045] mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#735c00]">query_stats</span>
              Tendencia de Rendimiento
            </h3>
            
            <div className="relative h-44 w-full bg-gray-50/30 rounded-xl p-2 border border-gray-100 flex flex-col justify-between">
              {/* Simple SVG Chart representing realistic progress */}
              <div className="relative flex-1">
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="37" x2="400" y2="37" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="112" x2="400" y2="112" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                  
                  <path 
                    d="M 10,120 Q 100,100 200,60 T 390,25" 
                    fill="none" 
                    stroke="#1a365d" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M 10,120 Q 100,100 200,60 T 390,25 L 390,150 L 10,150 Z" 
                    fill="url(#tutor-chart-grad)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="tutor-chart-grad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#1a365d', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#1a365d', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Data Node Highlights */}
                  <circle cx="200" cy="60" fill="#1a365d" r="6" className="animate-pulse" />
                  <circle cx="390" cy="25" fill="#735c00" r="5" />
                </svg>
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 font-mono tracking-wider">
                <span>ENE</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>ABR</span>
                <span>MAY</span>
              </div>
            </div>
            
            <p className="text-[11px] text-gray-500 mt-3 text-center leading-relaxed">
              El promedio general ha incrementado un <strong className="text-green-600">+8.4%</strong> en el último trimestre.
            </p>
          </div>

          {/* Achievement Action Card */}
          <div className="bg-[#1a365d] text-white rounded-2xl p-6 relative overflow-hidden group shadow-lg">
            <h3 className="text-base font-bold mb-1 relative z-10">Meta del Trimestre</h3>
            <p className="text-xs text-[#86a0cd] leading-relaxed mb-6 relative z-10">
              Faltan <strong className="text-white">24 alumnos certificados</strong> para obtener el bono institucional "Excelencia Académica".
            </p>
            <button 
              onClick={() => showToast("Bono reclamado con éxito. Procesando rembolso institucional en finanzas.")}
              className="w-full bg-[#fed65b] hover:bg-[#ffe088] text-[#241a00] font-bold py-3 rounded-xl relative z-10 flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs shadow-md"
            >
              <span className="material-symbols-outlined text-sm">emoji_events</span>
              Claim Award
            </button>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[128px]">workspace_premium</span>
            </div>
          </div>

          {/* Groups List */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#002045] mb-4">Grupos Activos</h3>
            <div className="space-y-3">
              {groups.map(group => (
                <div 
                  key={group.id} 
                  onClick={() => showToast(`Viendo listado detallado del grupo: ${group.name}`)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${group.color}`}></div>
                    <div>
                      <p className="font-bold text-gray-800 text-xs">{group.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{group.studentCount} Alumnos asignados</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-[#002045] transition-colors">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Score Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-[#002045]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#002045] text-base">Modificar Calificación</h3>
              <button onClick={() => setEditingStudent(null)} className="material-symbols-outlined text-gray-400 hover:text-gray-600">close</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-xs font-bold text-blue-700 flex items-center justify-center">
                  {editingStudent.initials}
                </div>
                <div>
                  <p className="font-bold text-[#002045] text-xs">{editingStudent.name}</p>
                  <p className="text-[10px] text-gray-400">{editingStudent.course}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Puntaje Obtenido (0-1000)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="1000"
                  value={editingStudent.score}
                  onChange={(e) => setEditingStudent({ ...editingStudent, score: Math.min(1000, Math.max(0, Number(e.target.value))) })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#002045] focus:outline-none focus:ring-1 focus:ring-[#002045]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Estado actual</label>
                <select 
                  value={editingStudent.status}
                  onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none"
                >
                  <option value="Inscrito">Inscrito</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setEditingStudent(null)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveStudentScore}
                className="flex-1 py-2 bg-[#002045] hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
