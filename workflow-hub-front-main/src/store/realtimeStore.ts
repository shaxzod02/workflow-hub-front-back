import { create } from 'zustand';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: Date;
  currentPage?: string;
}

interface LiveUpdate {
  id: string;
  type: 'task_updated' | 'project_created' | 'user_joined' | 'comment_added';
  message: string;
  user: string;
  timestamp: Date;
}

interface RealtimeState {
  onlineUsers: OnlineUser[];
  liveUpdates: LiveUpdate[];
  isConnected: boolean;

  // Actions
  setOnlineUsers: (users: OnlineUser[]) => void;
  addLiveUpdate: (update: Omit<LiveUpdate, 'id' | 'timestamp'>) => void;
  setConnected: (connected: boolean) => void;
  updateUserStatus: (userId: string, status: OnlineUser['status']) => void;
  updateUserPage: (userId: string, page: string) => void;
}

// Mock online users
const mockOnlineUsers: OnlineUser[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: new Date(),
    currentPage: '/dashboard',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: new Date(),
    currentPage: '/projects',
  },
  {
    id: '3',
    name: 'Mike Chen',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'away',
    lastSeen: new Date(Date.now() - 300000),
  },
  {
    id: '4',
    name: 'Emily Davis',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'busy',
    lastSeen: new Date(),
    currentPage: '/analytics',
  },
];

export const useRealtimeStore = create<RealtimeState>(set => ({
  onlineUsers: mockOnlineUsers,
  liveUpdates: [],
  isConnected: true,

  setOnlineUsers: users => set({ onlineUsers: users }),

  addLiveUpdate: update => {
    const newUpdate: LiveUpdate = {
      ...update,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set(state => ({
      liveUpdates: [newUpdate, ...state.liveUpdates].slice(0, 20),
    }));
  },

  setConnected: connected => set({ isConnected: connected }),

  updateUserStatus: (userId, status) => {
    set(state => ({
      onlineUsers: state.onlineUsers.map(user =>
        user.id === userId ? { ...user, status, lastSeen: new Date() } : user
      ),
    }));
  },

  updateUserPage: (userId, page) => {
    set(state => ({
      onlineUsers: state.onlineUsers.map(user =>
        user.id === userId ? { ...user, currentPage: page } : user
      ),
    }));
  },
}));

// Simulate WebSocket events
if (typeof window !== 'undefined') {
  setInterval(() => {
    const store = useRealtimeStore.getState();

    // Simulate random live updates
    const updates = [
      {
        type: 'task_updated' as const,
        message: 'marked task as completed',
        user: 'Sarah Johnson',
      },
      {
        type: 'project_created' as const,
        message: 'created new project "Mobile App V2"',
        user: 'Mike Chen',
      },
      {
        type: 'comment_added' as const,
        message: 'commented on Homepage Design',
        user: 'Emily Davis',
      },
      {
        type: 'user_joined' as const,
        message: 'joined the workspace',
        user: 'Alex Rodriguez',
      },
    ];

    if (Math.random() > 0.7) {
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      store.addLiveUpdate(randomUpdate);
    }
  }, 5000);
}
