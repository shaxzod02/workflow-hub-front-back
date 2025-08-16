import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/appStore';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

interface ViewReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewReportsModal = ({
  open,
  onOpenChange,
}: ViewReportsModalProps) => {
  const { projects, tasks, teamMembers } = useAppStore();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate statistics
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'done';
  });

  const completionRate =
    totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  // Team productivity
  const teamProductivity = teamMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assignee === member.id);
    const completedMemberTasks = memberTasks.filter(t => t.status === 'done');
    const productivityRate =
      memberTasks.length > 0
        ? (completedMemberTasks.length / memberTasks.length) * 100
        : 0;

    return {
      ...member,
      totalTasks: memberTasks.length,
      completedTasks: completedMemberTasks.length,
      productivity: productivityRate,
    };
  });

  // Project status breakdown
  const projectStatusData = [
    { status: 'Active', count: activeProjects.length, color: 'bg-blue-500' },
    {
      status: 'Completed',
      count: completedProjects.length,
      color: 'bg-green-500',
    },
    {
      status: 'Planning',
      count: projects.filter(p => p.status === 'planning').length,
      color: 'bg-yellow-500',
    },
    {
      status: 'On Hold',
      count: projects.filter(p => p.status === 'on-hold').length,
      color: 'bg-red-500',
    },
  ];

  const taskPriorityData = [
    {
      priority: 'High',
      count: tasks.filter(t => t.priority === 'high').length,
      color: 'bg-red-500',
    },
    {
      priority: 'Medium',
      count: tasks.filter(t => t.priority === 'medium').length,
      color: 'bg-yellow-500',
    },
    {
      priority: 'Low',
      count: tasks.filter(t => t.priority === 'low').length,
      color: 'bg-green-500',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reports & Analytics
          </DialogTitle>
          <DialogDescription>
            View comprehensive reports and analytics for your workspace.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Projects
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeProjects.length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tasks
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedTasks.length} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completion Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(completionRate)}%
                  </div>
                  <Progress value={completionRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {teamMembers.filter(m => m.status === 'active').length}{' '}
                    active
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">To Do</span>
                    <Badge variant="secondary">
                      {tasks.filter(t => t.status === 'todo').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <Badge variant="default">{inProgressTasks.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <Badge variant="outline">{completedTasks.length}</Badge>
                  </div>
                  {overdueTasks.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-600">Overdue</span>
                      <Badge variant="destructive">{overdueTasks.length}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Priority</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {taskPriorityData.map(item => (
                    <div
                      key={item.priority}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.priority}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {projectStatusData.map(item => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Productivity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamProductivity.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {member.completedTasks}/{member.totalTasks} tasks
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(member.productivity)}% completion rate
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
