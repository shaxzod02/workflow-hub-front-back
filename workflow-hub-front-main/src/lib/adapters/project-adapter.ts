import { Project as GraphQLProject } from '@/lib/graphql/projects';
import { Project as StoreProject } from '@/store/appStore';

// Adapter to convert between GraphQL and Store Project types
export const graphQLToStoreProject = (
  graphQLProject: GraphQLProject
): StoreProject => ({
  id: graphQLProject.id,
  name: graphQLProject.title,
  description: graphQLProject.description,
  status: graphQLProject.status,
  progress: graphQLProject.progress,
  dueDate: graphQLProject.dueDate,
  teamMembers: graphQLProject.team?.map(member => member.id) || [],
  tasks: [], // Tasks are managed separately
});

export const storeToGraphQLProject = (
  storeProject: StoreProject
): Partial<GraphQLProject> => ({
  id: storeProject.id,
  title: storeProject.name,
  description: storeProject.description,
  status: storeProject.status,
  progress: storeProject.progress,
  dueDate: storeProject.dueDate,
  // team mapping would need team member lookup
});
