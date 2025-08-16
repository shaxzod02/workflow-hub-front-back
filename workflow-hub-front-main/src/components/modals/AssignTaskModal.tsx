import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, User, Calendar, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
}

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
}

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'done':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
  const { tasks, projects, updateTask } = useAppStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter tasks that are not assigned to the current member or unassigned
  const availableTasks = useMemo(() => {
    if (!member) return [];

    return tasks.filter(task => {
      // Exclude tasks already assigned to this member
      if (task.assignee === member.id) return false;

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
          !task.title.toLowerCase().includes(query) &&
          !task.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Apply project filter
      if (selectedProject !== 'all' && task.projectId !== selectedProject) {
        return false;
      }

      // Apply status filter
      if (selectedStatus !== 'all' && task.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [tasks, member, searchQuery, selectedProject, selectedStatus]);

  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === availableTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(availableTasks.map(task => task.id));
    }
  };

  const handleAssignTasks = async () => {
    if (!member || selectedTasks.length === 0) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update each selected task
      selectedTasks.forEach(taskId => {
        updateTask(taskId, { assignee: member.id });
      });

      toast({
        title: 'Success',
        description: `${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} assigned to ${member.name}`,
      });

      // Reset and close modal
      setSelectedTasks([]);
      setSearchQuery('');
      setSelectedProject('all');
      setSelectedStatus('all');
      onOpenChange(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to assign tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProject('all');
    setSelectedStatus('all');
    setSelectedTasks([]);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Tasks to {member.name}</DialogTitle>
          <DialogDescription>
            Select existing tasks from different projects to assign to{' '}
            {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filter by Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {availableTasks.length} available task
                {availableTasks.length !== 1 ? 's' : ''}
              </span>
              {selectedTasks.length > 0 && (
                <Badge variant="secondary">
                  {selectedTasks.length} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {availableTasks.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedTasks.length === availableTasks.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {availableTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tasks available
                </h3>
                <p className="text-muted-foreground max-w-md">
                  No tasks match your current filters, or all tasks are already
                  assigned to {member.name}.
                </p>
              </div>
            ) : (
              availableTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const isSelected = selectedTasks.includes(task.id);

                return (
                  <Card
                    key={task.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleTaskSelection(task.id, !isSelected)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={checked =>
                            handleTaskSelection(task.id, checked as boolean)
                          }
                          onClick={e => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium leading-tight">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status === 'in-progress'
                                  ? 'In Progress'
                                  : task.status === 'todo'
                                    ? 'To Do'
                                    : 'Done'}
                              </Badge>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              {project && (
                                <span className="flex items-center gap-1">
                                  <span>Project:</span>
                                  <span className="font-medium">
                                    {project.name}
                                  </span>
                                </span>
                              )}
                              {task.assignee ? (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>Assigned</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>Unassigned</span>
                                </span>
                              )}
                            </div>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignTasks}
            disabled={selectedTasks.length === 0 || isLoading}
          >
            {isLoading
              ? 'Assigning...'
              : `Assign ${selectedTasks.length} Task${selectedTasks.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
