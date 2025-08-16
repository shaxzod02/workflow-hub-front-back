import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
}

interface TeamMemberProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'away':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'offline':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

export const TeamMemberProfileModal: React.FC<TeamMemberProfileModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
  const { tasks, projects } = useAppStore();

  if (!member) return null;

  const memberTasks = tasks.filter(task => task.assignee === member.id);
  const completedTasks = memberTasks.filter(task => task.status === 'done');
  const inProgressTasks = memberTasks.filter(
    task => task.status === 'in-progress'
  );
  const todoTasks = memberTasks.filter(task => task.status === 'todo');

  const completionRate =
    memberTasks.length > 0
      ? (completedTasks.length / memberTasks.length) * 100
      : 0;

  // Get projects the member is working on
  const memberProjects = projects.filter(project =>
    project.teamMembers.includes(member.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Member Profile</DialogTitle>
          <DialogDescription>
            View {member.name}'s profile details and task assignments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-lg">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {member.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-background ${getStatusIndicator(member.status)}`}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-lg text-muted-foreground">{member.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {member.email}
                </span>
              </div>
              <Badge className={`mt-2 ${getStatusColor(member.status)}`}>
                {member.status}
              </Badge>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {completedTasks.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {inProgressTasks.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  To Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {todoTasks.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completion Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Task Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedTasks.length} of {memberTasks.length} tasks
                  completed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {memberProjects.length > 0 ? (
                <div className="space-y-3">
                  {memberProjects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${
                            project.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : project.status === 'planning'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                : project.status === 'on-hold'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                          }`}
                        >
                          {project.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {project.progress}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active projects
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {memberTasks.length > 0 ? (
                <div className="space-y-3">
                  {memberTasks.slice(0, 5).map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge
                          className={`${
                            task.status === 'done'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : task.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                          }`}
                        >
                          {task.status === 'in-progress'
                            ? 'In Progress'
                            : task.status === 'todo'
                              ? 'To Do'
                              : 'Done'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {memberTasks.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      And {memberTasks.length - 5} more tasks...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tasks assigned
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Profile</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
