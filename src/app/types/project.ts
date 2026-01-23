export type ProjectStatus = 'draft' | 'ongoing' | 'review' | 'completed'

export interface InternshipProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  tags: string[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  completedTasks: number;
  hoursInvested: number;
  efficiency: number;
}
