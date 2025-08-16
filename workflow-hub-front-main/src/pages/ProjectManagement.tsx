import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { KanbanBoard } from '@/components/kanban';
import { useAppStore } from '@/store/appStore';
import { Plus, Filter, Search, X } from 'lucide-react';
import { CreateTaskModal } from '@/components/modals';

export const ProjectManagement = () => {
  const { projects, currentProject, setCurrentProject, tasks, teamMembers } =
    useAppStore();
  const [selectedProject, setSelectedProject] = useState<string | null>(
    currentProject
  );
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
  });

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowSearch(true);
      }
      // Escape to close search
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const handleProjectSelect = (projectId: string) => {
    const project = projectId === 'all' ? null : projectId;
    setSelectedProject(project);
    setCurrentProject(project);
  };

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignee: [],
    });
    setSearchQuery('');
  };

  const applyQuickFilter = (
    type: 'my-tasks' | 'high-priority' | 'overdue' | 'completed'
  ) => {
    clearFilters();
    switch (type) {
      case 'my-tasks':
        // Assuming current user ID is '1' - in real app, get from auth
        setFilters(prev => ({ ...prev, assignee: ['1'] }));
        break;
      case 'high-priority':
        setFilters(prev => ({ ...prev, priority: ['high'] }));
        break;
      case 'completed':
        setFilters(prev => ({ ...prev, status: ['done'] }));
        break;
    }
  };

  const selectedProjectData = selectedProject
    ? projects.find(p => p.id === selectedProject)
    : null;

  // Apply all filters
  const filteredTasks = React.useMemo(() => {
    let result = selectedProject
      ? tasks.filter(task => task.projectId === selectedProject)
      : tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(task => filters.status.includes(task.status));
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      result = result.filter(task => filters.priority.includes(task.priority));
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      result = result.filter(
        task => task.assignee && filters.assignee.includes(task.assignee)
      );
    }

    return result;
  }, [selectedProject, tasks, searchQuery, filters]);

  const hasActiveFilters =
    searchQuery.trim() ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0;

  const taskStats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === 'todo').length,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
    done: filteredTasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage tasks with Kanban board
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!showSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="relative"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
              <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={hasActiveFilters ? 'border-primary' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {filters.status.length +
                      filters.priority.length +
                      filters.assignee.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'todo', label: 'To Do', color: 'bg-slate-100' },
                      {
                        value: 'in-progress',
                        label: 'In Progress',
                        color: 'bg-blue-100',
                      },
                      { value: 'done', label: 'Done', color: 'bg-green-100' },
                    ].map(status => (
                      <div
                        key={status.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={filters.status.includes(status.value)}
                          onCheckedChange={() =>
                            handleFilterChange('status', status.value)
                          }
                        />
                        <Label
                          htmlFor={`status-${status.value}`}
                          className="text-sm flex items-center gap-2"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${status.color}`}
                          />
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="space-y-2">
                    {[
                      {
                        value: 'high',
                        label: 'High',
                        color: 'bg-red-100 text-red-800',
                      },
                      {
                        value: 'medium',
                        label: 'Medium',
                        color: 'bg-yellow-100 text-yellow-800',
                      },
                      {
                        value: 'low',
                        label: 'Low',
                        color: 'bg-gray-100 text-gray-800',
                      },
                    ].map(priority => (
                      <div
                        key={priority.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`priority-${priority.value}`}
                          checked={filters.priority.includes(priority.value)}
                          onCheckedChange={() =>
                            handleFilterChange('priority', priority.value)
                          }
                        />
                        <Label
                          htmlFor={`priority-${priority.value}`}
                          className="text-sm flex items-center gap-2"
                        >
                          <Badge
                            className={`h-4 px-1.5 text-xs ${priority.color}`}
                          >
                            {priority.label}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignee Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Assignee</Label>
                  <div className="space-y-2">
                    {teamMembers.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`assignee-${member.id}`}
                          checked={filters.assignee.includes(member.id)}
                          onCheckedChange={() =>
                            handleFilterChange('assignee', member.id)
                          }
                        />
                        <Label
                          htmlFor={`assignee-${member.id}`}
                          className="text-sm"
                        >
                          {member.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setIsCreateTaskModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
            autoFocus
          />
          {searchQuery && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredTasks.length} result
              {filteredTasks.length !== 1 ? 's' : ''}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Project Selector and Stats */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Project:</span>
          <Select
            value={selectedProject || 'all'}
            onValueChange={handleProjectSelect}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select project" />
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

        {selectedProjectData && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{selectedProjectData.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedProjectData.progress}% complete
            </span>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">
              {filteredTasks.length} of{' '}
              {selectedProject
                ? tasks.filter(t => t.projectId === selectedProject).length
                : tasks.length}{' '}
              tasks
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 w-6 p-0 hover:bg-primary/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyQuickFilter('my-tasks')}
            className="text-xs"
          >
            My Tasks
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyQuickFilter('high-priority')}
            className="text-xs"
          >
            High Priority
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyQuickFilter('completed')}
            className="text-xs"
          >
            Completed
          </Button>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <Badge variant="outline">{taskStats.total}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">To Do:</span>
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {taskStats.todo}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">In Progress:</span>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {taskStats.inProgress}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Done:</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {taskStats.done}
            </Badge>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        {filteredTasks.length === 0 && hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              No tasks match your current search and filter criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        ) : (
          <KanbanBoard
            projectId={selectedProject || undefined}
            tasks={filteredTasks}
          />
        )}
      </div>

      {/* Create Task Modal */}

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
      />
    </div>
  );
};
