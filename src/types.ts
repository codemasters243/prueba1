export type Role = 'Student' | 'Tutor' | 'Parent' | 'Faculty';

export interface Competition {
  id: string;
  title: string;
  category: 'Science' | 'Humanities' | 'Tech';
  status: 'Ongoing' | 'Starting soon' | 'Abierta' | 'En Curso' | 'Closed';
  progress: number;
  endsIn?: string;
  startDate?: string;
  image: string;
  registeredCount?: number;
}

export interface Challenge {
  id: string;
  title: string;
  type: string;
  date: string;
  month: string;
  day: string;
  weight: string;
  points: number;
  status: 'REQUIRED' | 'DEADLINE' | 'OPTIONAL';
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  initials: string;
  points: string;
  isCurrentUser?: boolean;
  avatar?: string;
}

export interface StudentRequest {
  id: string;
  name: string;
  initials: string;
  competition: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StudentProfile {
  id: string;
  name: string;
  initials: string;
  course: string;
  score: number;
  status: 'Inscrito' | 'Ongoing' | 'Draft';
}

export interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  certificateId: string;
  qrImage: string;
}

export interface ActiveGroup {
  id: string;
  name: string;
  studentCount: number;
  color: string;
}

export interface ActivityLog {
  id: string;
  type: 'school' | 'recalculation' | 'login';
  title: string;
  description: string;
  time: string;
}
