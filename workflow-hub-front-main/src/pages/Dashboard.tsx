import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import {
  CreateProjectModal,
  CreateTaskModal,
  ViewReportsModal,
} from '@/components/modals';
import { useNavigate } from 'react-router-dom';

// Simple chart component for demonstration
const SimpleChart = ({
  data,
  type = 'bar',
}: {
  data: number[];
  type?: 'bar' | 'line';
}) => {
  const max = Math.max(...data);

  if (type === 'line') {
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / max) * 80;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="h-32 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polyline
            points={points}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="hsl(var(--primary))"
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="h-32 flex items-end justify-center gap-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-primary rounded-t-sm flex-1 min-w-0 transition-all duration-300 hover:opacity-80"
          style={{ height: `${(value / max) * 100}%`, minHeight: '8px' }}
        />
      ))}
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <Card className="shadow-soft hover:shadow-elevated transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {trend && (
        <div
          className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up'
              ? 'bg-success/10 text-success'
              : trend === 'down'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: 'task' | 'project' | 'team';
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'task':
        return 'bg-primary/10 text-primary';
      case 'project':
        return 'bg-success/10 text-success';
      case 'team':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor()}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const { projects, tasks, teamMembers } = useAppStore();
  const navigate = useNavigate();

  // Modal states
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState(false);

  // Calculate metrics
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Sample data for charts
  const progressData = [65, 78, 82, 74, 85, 91, 88];
  const statusData = [
    { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
    {
      label: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
    },
    { label: 'Done', value: completedTasks },
  ];

  // Recent activities
  const recentActivities = [
    {
      title: 'Task completed',
      description: 'Homepage mockup design finished',
      time: '2 hours ago',
      type: 'task' as const,
    },
    {
      title: 'New team member',
      description: 'Alex Rodriguez joined the team',
      time: '4 hours ago',
      type: 'team' as const,
    },
    {
      title: 'Project milestone',
      description: 'Website redesign reached 65% completion',
      time: '1 day ago',
      type: 'project' as const,
    },
    {
      title: 'Task assigned',
      description: 'API integration task assigned to Emily',
      time: '2 days ago',
      type: 'task' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            New Project
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsViewReportsModalOpen(true)}
          >
            View Reports
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          description="Currently in progress"
          trend="up"
        />
        <MetricCard
          title="Total Tasks"
          value={totalTasks}
          description="Across all projects"
          trend="up"
        />
        <MetricCard
          title="Team Members"
          value={teamMembers.length}
          description="Active team members"
          trend="neutral"
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Tasks completed this month"
          trend="up"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Weekly progress overview</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleChart data={progressData} type="line" />
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Current task distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusData.map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-300"
                      style={{ width: `${(item.value / totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => setIsCreateTaskModalOpen(true)}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Create New Task
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              View All Projects
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/team')}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Manage Team
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onOpenChange={setIsCreateProjectModalOpen}
      />

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
      />

      <ViewReportsModal
        open={isViewReportsModalOpen}
        onOpenChange={setIsViewReportsModalOpen}
      />
    </div>
  );
};
