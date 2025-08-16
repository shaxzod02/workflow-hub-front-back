import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { projectsApi, ApiError } from '@/lib/api';
import { Project } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
};

// Projects Hooks
export const useProjects = (
  options?: Omit<
    UseQueryOptions<Project[], ApiError, Project[]>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => projectsApi.getProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useProject = (
  id: string,
  options?: Omit<
    UseQueryOptions<Project, ApiError, Project>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useCreateProject = (
  options?: UseMutationOptions<Project, ApiError, Omit<Project, 'id'>>
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (projectData: Omit<Project, 'id'>) =>
      projectsApi.createProject(projectData),
    onSuccess: newProject => {
      // Update projects cache
      queryClient.setQueryData(queryKeys.projects, (old: Project[] = []) => [
        ...old,
        newProject,
      ]);

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive',
      });
    },
    ...options,
  });
};

export const useUpdateProject = (
  options?: UseMutationOptions<
    Project,
    ApiError,
    { id: string; data: Partial<Project> }
  >
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.updateProject(id, data),
    onSuccess: updatedProject => {
      // Update projects cache
      queryClient.setQueryData(queryKeys.projects, (old: Project[] = []) =>
        old.map(project =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );

      // Update individual project cache
      queryClient.setQueryData(
        queryKeys.project(updatedProject.id),
        updatedProject
      );

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update project',
        variant: 'destructive',
      });
    },
    ...options,
  });
};

export const useDeleteProject = (
  options?: UseMutationOptions<void, ApiError, string>
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: (_, deletedId) => {
      // Remove from projects cache
      queryClient.setQueryData(queryKeys.projects, (old: Project[] = []) =>
        old.filter(project => project.id !== deletedId)
      );

      // Remove individual project cache
      queryClient.removeQueries({ queryKey: queryKeys.project(deletedId) });

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive',
      });
    },
    ...options,
  });
};
