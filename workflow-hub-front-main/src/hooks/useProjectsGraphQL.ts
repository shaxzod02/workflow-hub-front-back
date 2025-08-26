import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  GET_PROJECTS,
  GET_PROJECT,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  Project,
  ProjectInput,
  ProjectUpdateInput,
} from '@/lib/graphql/projects';
import { useToast } from '@/hooks/use-toast';

// Query hooks
export const useProjectsGraphQL = () => {
  return useQuery(GET_PROJECTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });
};

export const useProjectGraphQL = (id: string) => {
  return useQuery(GET_PROJECT, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });
};

// Mutation hooks
export const useCreateProjectGraphQL = () => {
  const { toast } = useToast();
  const client = useApolloClient();

  return useMutation(CREATE_PROJECT, {
    onCompleted: data => {
      // Update the cache manually
      const existingProjects = client.readQuery({ query: GET_PROJECTS }) as {
        projects: Project[];
      } | null;
      if (existingProjects) {
        client.writeQuery({
          query: GET_PROJECTS,
          data: {
            projects: [...existingProjects.projects, data.createProject],
          },
        });
      }

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
  });
};

export const useUpdateProjectGraphQL = () => {
  const { toast } = useToast();

  return useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
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
    // Automatically update cache
    update: (cache, { data }) => {
      if (data?.updateProject) {
        const updatedProject = data.updateProject;

        // Update individual project cache
        cache.writeQuery({
          query: GET_PROJECT,
          variables: { id: updatedProject.id },
          data: { project: updatedProject },
        });

        // Update projects list cache
        const existingProjects = cache.readQuery({ query: GET_PROJECTS }) as {
          projects: Project[];
        } | null;
        if (existingProjects) {
          cache.writeQuery({
            query: GET_PROJECTS,
            data: {
              projects: existingProjects.projects.map((project: Project) =>
                project.id === updatedProject.id ? updatedProject : project
              ),
            },
          });
        }
      }
    },
  });
};

export const useDeleteProjectGraphQL = () => {
  const { toast } = useToast();

  return useMutation(DELETE_PROJECT, {
    onCompleted: () => {
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
    // Automatically remove from cache
    update: (cache, { data }) => {
      if (data?.deleteProject) {
        const deletedProjectId = data.deleteProject.id;

        // Remove from projects list cache
        const existingProjects = cache.readQuery({ query: GET_PROJECTS }) as {
          projects: Project[];
        } | null;
        if (existingProjects) {
          cache.writeQuery({
            query: GET_PROJECTS,
            data: {
              projects: existingProjects.projects.filter(
                (project: Project) => project.id !== deletedProjectId
              ),
            },
          });
        }

        // Remove individual project cache
        cache.evict({
          id: cache.identify({ __typename: 'Project', id: deletedProjectId }),
        });
      }
    },
  });
};

// Helper function to create project with GraphQL
export const createProjectGraphQL = (input: ProjectInput) => ({
  variables: { input },
});

// Helper function to update project with GraphQL
export const updateProjectGraphQL = (
  id: string,
  input: ProjectUpdateInput
) => ({
  variables: { id, input },
});

// Helper function to delete project with GraphQL
export const deleteProjectGraphQL = (id: string) => ({
  variables: { id },
});
