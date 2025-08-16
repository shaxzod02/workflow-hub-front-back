import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  dueDate: string;
  teamMembers: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  projectId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
}

interface AppState {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  sidebarCollapsed: boolean;
  currentProject: string | null;

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentProject: (projectId: string | null) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    progress: 65,
    dueDate: '2024-02-15',
    teamMembers: ['1', '2', '3'],
    tasks: [],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer portal',
    status: 'planning',
    progress: 25,
    dueDate: '2024-04-30',
    teamMembers: ['2', '4', '5'],
    tasks: [],
  },
  {
    id: '3',
    name: 'Data Migration',
    description: 'Migrate legacy data to new cloud infrastructure',
    status: 'completed',
    progress: 100,
    dueDate: '2024-01-20',
    teamMembers: ['1', '6'],
    tasks: [],
  },
  {
    id: '4',
    name: 'Marketing Campaign',
    description: 'Q2 digital marketing initiative',
    status: 'active',
    progress: 40,
    dueDate: '2024-06-30',
    teamMembers: ['2', '3', '4'],
    tasks: [],
  },
  {
    id: '5',
    name: 'Infrastructure Upgrade',
    description: 'Server hardware and software updates',
    status: 'on-hold',
    progress: 15,
    dueDate: '2024-08-15',
    teamMembers: ['1', '6'],
    tasks: [],
  },
  {
    id: '6',
    name: 'Customer Portal',
    description: 'Self-service customer dashboard',
    status: 'planning',
    progress: 5,
    dueDate: '2024-09-30',
    teamMembers: ['4', '5', '6'],
    tasks: [],
  },
];

const mockTasks: Task[] = [
  // Website Redesign tasks
  {
    id: '1',
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and visual design',
    status: 'done',
    priority: 'high',
    assignee: '2',
    projectId: '1',
  },
  {
    id: '2',
    title: 'Implement Header Component',
    description: 'Build responsive navigation header',
    status: 'in-progress',
    priority: 'high',
    assignee: '1',
    projectId: '1',
  },
  {
    id: '3',
    title: 'Content Management Setup',
    description: 'Configure CMS for easy content updates',
    status: 'todo',
    priority: 'medium',
    assignee: '3',
    projectId: '1',
  },

  // Mobile App tasks
  {
    id: '4',
    title: 'User Authentication Flow',
    description: 'Implement login and registration',
    status: 'todo',
    priority: 'high',
    assignee: '4',
    projectId: '2',
  },
  {
    id: '5',
    title: 'API Integration',
    description: 'Connect app to backend services',
    status: 'todo',
    priority: 'medium',
    assignee: '5',
    projectId: '2',
  },

  // Data Migration tasks
  {
    id: '6',
    title: 'Database Schema Design',
    description: 'Plan new database structure',
    status: 'done',
    priority: 'high',
    assignee: '1',
    projectId: '3',
  },
  {
    id: '7',
    title: 'Data Validation',
    description: 'Verify migrated data integrity',
    status: 'done',
    priority: 'medium',
    assignee: '6',
    projectId: '3',
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@workflowhub.com',
    role: 'Lead Developer',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@workflowhub.com',
    role: 'UI/UX Designer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@workflowhub.com',
    role: 'Frontend Developer',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'away',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@workflowhub.com',
    role: 'Mobile Developer',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'active',
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex@workflowhub.com',
    role: 'Backend Developer',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
  },
  {
    id: '6',
    name: 'Lisa Wong',
    email: 'lisa@workflowhub.com',
    role: 'DevOps Engineer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    status: 'active',
  },
];

export const useAppStore = create<AppState>(set => ({
  projects: mockProjects,
  tasks: mockTasks,
  teamMembers: mockTeamMembers,
  sidebarCollapsed: false,
  currentProject: null,

  setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

  setCurrentProject: projectId => set({ currentProject: projectId }),

  addProject: projectData => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      tasks: [],
    };
    set(state => ({ projects: [...state.projects, newProject] }));
  },

  updateProject: (id, data) => {
    set(state => ({
      projects: state.projects.map(p => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  deleteProject: id => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      tasks: state.tasks.filter(t => t.projectId !== id),
    }));
  },

  addTask: taskData => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    set(state => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (id, data) => {
    set(state => ({
      tasks: state.tasks.map(t => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  deleteTask: id => {
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id),
    }));
  },

  moveTask: (taskId, newStatus) => {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }));
  },
}));
