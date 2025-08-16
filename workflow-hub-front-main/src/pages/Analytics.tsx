import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

// Enhanced chart component
const Chart = ({
  data,
  type = 'bar',
  title,
}: {
  data: number[];
  type?: 'bar' | 'line' | 'area';
  title?: string;
}) => {
  const max = Math.max(...data);

  if (title) {
    // Title is provided, can be used for chart header
  }

  if (type === 'area') {
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / max) * 70 - 10;
        return `${x},${y}`;
      })
      .join(' ');

    const areaPoints = `0,90 ${points} 100,90`;

    return (
      <div className="h-48 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#areaGradient)" />
          <polyline
            points={points}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 70 - 10;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="hsl(var(--primary))"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (type === 'line') {
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / max) * 80 - 10;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="h-48 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polyline
            points={points}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 80 - 10;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="hsl(var(--primary))"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="h-48 flex items-end justify-center gap-2 px-4">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-primary rounded-t-sm flex-1 min-w-0 transition-all duration-300 hover:opacity-80 relative group"
          style={{ height: `${(value / max) * 100}%`, minHeight: '8px' }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};

export const Analytics = () => {
  const { projects, tasks } = useAppStore();

  // Sample analytics data
  const weeklyProgress = [45, 52, 61, 58, 67, 73, 68];
  const monthlyTasks = [24, 31, 28, 35, 42, 38, 45, 52, 48, 55, 61, 58];
  const teamPerformance = [85, 92, 78, 88, 95, 82];
  const projectCompletion = [100, 65, 25, 80, 90, 45];

  // Calculate key metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const overallProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Insights and performance metrics for your projects
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Data</Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalProjects} total
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'done').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Team Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Average productivity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>
              Project completion trends over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={weeklyProgress} type="area" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Monthly Task Distribution</CardTitle>
            <CardDescription>
              Task completion throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={monthlyTasks} type="bar" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>
              Individual team member productivity scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={teamPerformance} type="line" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Project Completion Rates</CardTitle>
            <CardDescription>
              Progress across different projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={projectCompletion} type="bar" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Comprehensive project analytics and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Project</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Progress</th>
                  <th className="text-left p-3">Tasks</th>
                  <th className="text-left p-3">Team Size</th>
                  <th className="text-left p-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => {
                  const projectTasks = tasks.filter(
                    t => t.projectId === project.id
                  );
                  const completedTasks = projectTasks.filter(
                    t => t.status === 'done'
                  ).length;

                  return (
                    <tr key={project.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{project.name}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'active'
                              ? 'bg-success/10 text-success'
                              : project.status === 'completed'
                                ? 'bg-primary/10 text-primary'
                                : project.status === 'planning'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-gradient-primary rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {completedTasks}/{projectTasks.length}
                      </td>
                      <td className="p-3">{project.teamMembers.length}</td>
                      <td className="p-3">
                        {new Date(project.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
