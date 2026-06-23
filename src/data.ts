import { Competition, Challenge, LeaderboardUser, StudentRequest, StudentProfile, Certificate, ActiveGroup, ActivityLog } from './types';

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-01',
    title: 'Inter-University Structural Design',
    category: 'Science',
    status: 'Ongoing',
    progress: 65,
    endsIn: 'Ends in 2 days',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSixPCXq1wLI0lebePv5uLjUnfOOp0-kkS1Ul5NfUDBXFIGiFin4LriFob2zvmiSgR-4wYu74KFsZntGHSMXlN3WdGbdiiNup2DsVFEmt5FqJqj_HmpfLeMBvPmKaaMfSIKce_bqOk2kM82yRZWxHrq8XuaowTsWjETprA7XCgQoiozofXh8rDkBzM6gx7LgapV76pyw3rjNO8P-gpnrg9RUW32x9g8aA65E64sZwu1LJy6TlEW1G0mAjvzlvxLrc4t5RMxwCzPvg'
  },
  {
    id: 'comp-02',
    title: 'AI Ethics Hackathon 2024',
    category: 'Science',
    status: 'Starting soon',
    progress: 0,
    startDate: 'Oct 12, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiJyxwUq5XZAkvrnS32I46DvycaG4hoPl3B5g9udMWD3D96diQGSip74PYxBUOrDl54f4YhrlZcmm0UCKG4BZujsW2x_CXLPtNuFCc6_2ee17EoE3v4nalYG7KJbC7B4MTZS_GQiJ9yOuQNH1DaRd1c_OUWz6oFvy3je8Deykp-NVBwhimJi7jurKgNQBd29o4yhcjs-ODYe2fP5iZtBSYjXE4fupY84l6Swf08bFh72-aPk9zSFRaCtbrKbw8rTQZpXYdw6yWL8'
  },
  {
    id: 'comp-03',
    title: 'Regional Math Olympiad',
    category: 'Science',
    status: 'Abierta',
    progress: 100,
    registeredCount: 1240,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSixPCXq1wLI0lebePv5uLjUnfOOp0-kkS1Ul5NfUDBXFIGiFin4LriFob2zvmiSgR-4wYu74KFsZntGHSMXlN3WdGbdiiNup2DsVFEmt5FqJqj_HmpfLeMBvPmKaaMfSIKce_bqOk2kM82yRZWxHrq8XuaowTsWjETprA7XCgQoiozofXh8rDkBzM6gx7LgapV76pyw3rjNO8P-gpnrg9RUW32x9g8aA65E64sZwu1LJy6TlEW1G0mAjvzlvxLrc4t5RMxwCzPvg'
  },
  {
    id: 'comp-04',
    title: 'Creative Writing Finals',
    category: 'Humanities',
    status: 'En Curso',
    progress: 40,
    registeredCount: 842,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiJyxwUq5XZAkvrnS32I46DvycaG4hoPl3B5g9udMWD3D96diQGSip74PYxBUOrDl54f4YhrlZcmm0UCKG4BZujsW2x_CXLPtNuFCc6_2ee17EoE3v4nalYG7KJbC7B4MTZS_GQiJ9yOuQNH1DaRd1c_OUWz6oFvy3je8Deykp-NVBwhimJi7jurKgNQBd29o4yhcjs-ODYe2fP5iZtBSYjXE4fupY84l6Swf08bFh72-aPk9zSFRaCtbrKbw8rTQZpXYdw6yWL8'
  },
  {
    id: 'comp-05',
    title: 'Physics Lab Challenge',
    category: 'Science',
    status: 'Abierta',
    progress: 100,
    registeredCount: 312,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSixPCXq1wLI0lebePv5uLjUnfOOp0-kkS1Ul5NfUDBXFIGiFin4LriFob2zvmiSgR-4wYu74KFsZntGHSMXlN3WdGbdiiNup2DsVFEmt5FqJqj_HmpfLeMBvPmKaaMfSIKce_bqOk2kM82yRZWxHrq8XuaowTsWjETprA7XCgQoiozofXh8rDkBzM6gx7LgapV76pyw3rjNO8P-gpnrg9RUW32x9g8aA65E64sZwu1LJy6TlEW1G0mAjvzlvxLrc4t5RMxwCzPvg'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal-01',
    title: 'Foundation Strength Analysis',
    type: 'Structural Engineering Competition',
    date: 'SEP 28',
    month: 'SEP',
    day: '28',
    weight: '25%',
    points: 250,
    status: 'REQUIRED'
  },
  {
    id: 'chal-02',
    title: 'Sustainability Material Audit',
    type: 'Green Building Challenge',
    date: 'OCT 02',
    month: 'OCT',
    day: '02',
    weight: '15%',
    points: 150,
    status: 'OPTIONAL'
  },
  {
    id: 'chal-03',
    title: 'Robotics Engineering Semi-Finals',
    type: 'Live competition at Central Campus Lab.',
    date: 'OCT 24',
    month: 'OCT',
    day: '24',
    weight: '30%',
    points: 300,
    status: 'REQUIRED'
  },
  {
    id: 'chal-04',
    title: 'Advanced Calculus Assignment',
    type: 'Digital submission via UEB Portal.',
    date: 'OCT 28',
    month: 'OCT',
    day: '28',
    weight: '20%',
    points: 200,
    status: 'DEADLINE'
  },
  {
    id: 'chal-05',
    title: 'History of Sciences Quiz',
    type: 'Practice module open for review.',
    date: 'NOV 02',
    month: 'NOV',
    day: '02',
    weight: '10%',
    points: 100,
    status: 'OPTIONAL'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'M. Kuznetsova', initials: 'MK', points: '15.2k' },
  { rank: 2, name: 'James L.', initials: 'JL', points: '14.8k' },
  { rank: 142, name: 'You (Alejandro)', initials: 'YA', points: '12.4k', isCurrentUser: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr8X4hxc-Md2MmnQTxzH9LefY51trP1SVXZgdUo8WvfL2HeWW6FFruMMWfu_-wAF1iyNYH31KlONrWon7vIzra-mR2vziSofgrWilyyNR8ndOgAVum3PZEO3eZeN9Ri0-kj3zaWokRO59YreEp4Ql2wxnzYw7386tWUXFxZIoh7iKDaw1uNY7IlelLLIiS4wHbcCvtHKJgeW8CfaV70-g8DFJToiI06DBJOzyyW5AQ5j0k8gAIWymRwsx4C52w8oaGQQb5MChEm1o' },
  { rank: 143, name: 'Dani R.', initials: 'DR', points: '12.3k' }
];

export const INITIAL_REQUESTS: StudentRequest[] = [
  { id: 'req-01', name: 'Mateo Arriaga', initials: 'MA', competition: 'Olimpiada Matemática 2024', status: 'pending' },
  { id: 'req-02', name: 'Lucía Galán', initials: 'LG', competition: 'Certificación Python Avanzado', status: 'pending' },
  { id: 'req-03', name: 'Facundo Pérez', initials: 'FP', competition: 'Física cuántica experimental', status: 'pending' },
  { id: 'req-04', name: 'Sofía Rossi', initials: 'SR', competition: 'Modelado 3D Mecánico', status: 'pending' },
  { id: 'req-05', name: 'Mateo González', initials: 'MG', competition: 'Estrategias de Diseño Urbano', status: 'pending' }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  { id: 'stud-01', name: 'Santiago Castro', initials: 'SC', course: 'Física Newtoniana 101', score: 920, status: 'Inscrito' },
  { id: 'stud-02', name: 'Mariana Vegas', initials: 'MV', course: 'Robótica Aplicada II', score: 815, status: 'Ongoing' },
  { id: 'stud-03', name: 'Diego Pardo', initials: 'DP', course: 'Calculo Diferencial', score: 780, status: 'Draft' },
  { id: 'stud-04', name: 'Camila Torres', initials: 'CT', course: 'Algoritmos Complejos', score: 945, status: 'Inscrito' },
  { id: 'stud-05', name: 'Juan Manuel Solari', initials: 'JS', course: 'Química Orgánica II', score: 860, status: 'Ongoing' }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-01',
    title: 'Quantum Math Excellence',
    issuedDate: 'Issued Oct 15, 2023',
    certificateId: '#UEB-9921',
    qrImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_9pOqyCbCFW-6xTob2nYKcwFEwAtOQ1UR4HQ4_7C3mLFOMw2gnkIFsTIHkEsDSbwgU6z8shD1AZKMh6XqfomEoEiEoDhPkuixjZbJQMeqPN9FhKMz0mQhNXzwlVE1cD5yxyYwT6ojXfgwrx2k-k3JW1lOmLGXP9RKPL8hD8A6MNBvst-jLBBcnCwUB2aoiRaPxhIy1Pl0sV9D9M65saU2izSLGL63911tTwhMB6UZYDqVAWdjJayeq4E8uwnh7adf2FsMP6ZH2g'
  },
  {
    id: 'cert-02',
    title: 'Ethics in AI Certificate',
    issuedDate: 'Issued Sep 22, 2023',
    certificateId: '#UEB-8452',
    qrImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5-1Puj3sEB-PL8eXk-ot7ZB2Dbv8aRk1tqZOGeqNTRbqmWnq2Pjy7SsAcvQJj6RyVxg0uBxOHrLnZb9K_4AE2pQv-sF3Y2orFXvVUctunsaWUThQsF8U0OD7WcIIML76l_GjBt20A7rX-KUfown6Um1qFs2W7qOBjcDW3l5mZnnNHVYbAc8j4acaOrh4k-ax0C8MAYl94ZE_lTbgb_rZjL4s7OIXf-q5AepyxXamfL7FqkshZsgp4GT4LHUNlCW9O1HFpE8F3OAs'
  }
];

export const ACTIVE_GROUPS: ActiveGroup[] = [
  { id: 'group-01', name: 'Matemáticas Avanzadas', studentCount: 28, color: 'bg-primary' },
  { id: 'group-02', name: 'Club de Robótica', studentCount: 15, color: 'bg-secondary' },
  { id: 'group-03', name: 'Ciencias Sociales', studentCount: 42, color: 'bg-tertiary-container' }
];

export const RECENT_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-01',
    type: 'school',
    title: 'New school registered',
    description: 'St. Andrews Academy joined the platform.',
    time: '2 mins ago'
  },
  {
    id: 'act-02',
    type: 'recalculation',
    title: 'Ranking recalculated',
    description: 'Global standings updated for Math Olympiad.',
    time: '45 mins ago'
  },
  {
    id: 'act-03',
    type: 'login',
    title: 'Unusual login detected',
    description: 'System flagged an admin login from London, UK.',
    time: '2 hours ago'
  }
];
