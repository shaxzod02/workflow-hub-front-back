import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import {
    useProjectsGraphQL,
    useDeleteProjectGraphQL,
    deleteProjectGraphQL
} from '@/hooks/useProjectsGraphQL';
import { Project } from '@/lib/graphql/projects';
import { graphQLToStoreProject } from '@/lib/adapters/project-adapter';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, Edit, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import { CreateProjectModalGraphQL } from '@/components/modals/CreateProjectModalGraphQL';
import { EditProjectModal } from '@/components/modals/EditProjectModalNew';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-success/10 text-success';
        case 'planning':
            return 'bg-warning/10 text-warning';
        case 'completed':
            return 'bg-primary/10 text-primary';
        case 'on-hold':
            return 'bg-destructive/10 text-destructive';
        default:
            return 'bg-muted text-muted-foreground';
    }
};

export const ProjectsGraphQL = () => {
    const { data, loading, error } = useProjectsGraphQL();
    const projects = data?.projects || [];

    console.log('ProjectsGraphQL data:', projects);
    const { setCurrentProject, tasks } = useAppStore();
    const [deleteProject, { loading: deleteLoading }] = useDeleteProjectGraphQL();
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleProjectClick = (projectId: string) => {
        setCurrentProject(projectId);
        navigate('/project-management');
    };

    const handleEditProject = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProject(project);
        setIsEditProjectModalOpen(true);
    };

    const handleDeleteProject = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setProjectToDelete(project);
        setShowDeleteDialog(true);
    };

    const confirmDeleteProject = async () => {
        if (!projectToDelete) return;

        // Check if project has tasks
        const projectTasks = tasks.filter(
            task => task.projectId === projectToDelete.id
        );
        if (projectTasks.length > 0) {
            toast({
                title: 'Cannot delete project',
                description: `This project has ${projectTasks.length} tasks. Please delete or move all tasks before deleting the project.`,
                variant: 'destructive',
            });
            setShowDeleteDialog(false);
            return;
        }

        try {
            await deleteProject(deleteProjectGraphQL(projectToDelete.id));
            setShowDeleteDialog(false);
            setProjectToDelete(null);
        } catch (error) {
            // Error handling is done in the GraphQL hook
            console.error('Delete project error:', error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects (GraphQL)</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and track your project portfolio with GraphQL
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        className="bg-gradient-primary hover:opacity-90"
                        onClick={() => setIsCreateProjectModalOpen(true)}
                    >
                        New Project
                    </Button>
                    <Link to="/project-management">
                        <Button variant="outline">
                            <Kanban className="w-4 h-4 mr-2" />
                            Kanban Board
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive">Failed to load projects: {error.message}</p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* Projects Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects && projects.map((project: Project) => (
                        <Card
                            key={project.id}
                            className="shadow-soft hover:shadow-elevated transition-all duration-200 cursor-pointer group"
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(project.status)}>
                                            {project.status}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={e => handleEditProject(project, e)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Project
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={e => handleDeleteProject(project, e)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Team</p>
                                        <div className="flex -space-x-2">
                                            {project.team?.slice(0, 3).map(member => (
                                                <img
                                                    key={member.id}
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-8 h-8 rounded-full border-2 border-background object-cover"
                                                    title={member.name}
                                                />
                                            )) || (
                                                    <div className="text-xs text-muted-foreground">No team assigned</div>
                                                )}
                                            {project?.team && project.team.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                                                    +{project.team.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Due: {new Date(Number(project.dueDate)).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit"
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && projects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No projects found</p>
                    <Button
                        className="mt-4"
                        onClick={() => setIsCreateProjectModalOpen(true)}
                    >
                        Create Your First Project
                    </Button>
                </div>
            )}

            {/* Modals */}
            <CreateProjectModalGraphQL
                open={isCreateProjectModalOpen}
                onOpenChange={setIsCreateProjectModalOpen}
            />
            <EditProjectModal
                open={isEditProjectModalOpen}
                onOpenChange={setIsEditProjectModalOpen}
                project={selectedProject ? graphQLToStoreProject(selectedProject) : null}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            project "{projectToDelete?.title}" and all associated data.
                            {projectToDelete &&
                                tasks.filter(task => task.projectId === projectToDelete.id)
                                    .length > 0 && (
                                    <span className="block mt-2 text-red-600 font-medium">
                                        Warning: This project has{' '}
                                        {
                                            tasks.filter(
                                                task => task.projectId === projectToDelete.id
                                            ).length
                                        }{' '}
                                        tasks. Please delete or move all tasks before deleting the
                                        project.
                                    </span>
                                )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteProject}
                            disabled={
                                deleteLoading ||
                                (projectToDelete &&
                                    tasks.filter(task => task.projectId === projectToDelete.id)
                                        .length > 0)
                            }
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete Project'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
