# API Integration Guide

This guide shows how your frontend app is now integrated with your backend APIs using React Query.

## 🚀 What's Been Set Up

### 1. **React Query** - The Best Choice

- **Automatic caching** - API responses are cached intelligently
- **Background refetching** - Data stays fresh automatically
- **Loading/error states** - Built-in state management
- **Optimistic updates** - Instant UI feedback
- **DevTools** - Amazing debugging experience

### 2. **Project Structure**

```
src/
├── lib/
│   └── api.ts              # API client functions
├── hooks/
│   └── useProjects.ts      # React Query hooks
└── pages/
    └── Projects.tsx        # Updated to use API hooks
```

### 3. **API Configuration**

- **Base URL**: `http://localhost:3030/api/v1` (configurable via `.env`)
- **Endpoints**:
  - `GET /projects` - Get all projects
  - `POST /project` - Create project
  - `GET /projects/:id` - Get single project
  - `PUT /projects/:id` - Update project
  - `DELETE /projects/:id` - Delete project

## 📝 API Client Usage

### Available Hooks

```typescript
// Get all projects
const { data: projects, isLoading, error } = useProjects();

// Get single project
const { data: project } = useProject(projectId);

// Create project
const createProject = useCreateProject();
createProject.mutate(projectData);

// Update project
const updateProject = useUpdateProject();
updateProject.mutate({ id: projectId, data: updatedData });

// Delete project
const deleteProject = useDeleteProject();
deleteProject.mutate(projectId);
```

### Example Usage in Components

```typescript
import { useProjects, useCreateProject } from '@/hooks/useProjects';

function ProjectsList() {
  const { data: projects = [], isLoading, error } = useProjects();
  const createProjectMutation = useCreateProject();

  const handleCreateProject = () => {
    createProjectMutation.mutate({
      name: 'New Project',
      description: 'Project description',
      status: 'planning',
      progress: 0,
      dueDate: '2024-12-31',
      teamMembers: [],
      tasks: [],
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
      <button onClick={handleCreateProject}>
        {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
}
```

## 🔧 Features

### ✅ Automatic Features

- **Caching**: API responses cached for 5 minutes
- **Error Handling**: Automatic toast notifications
- **Loading States**: `isPending`, `isLoading` flags
- **Optimistic Updates**: Instant UI feedback
- **Background Refetching**: Data stays fresh
- **Retry Logic**: Smart retry for network errors

### ✅ Manual Cache Updates

- **Create**: Automatically adds new items to cache
- **Update**: Updates both list and individual item caches
- **Delete**: Removes items from all related caches

### ✅ Developer Experience

- **React Query DevTools**: Press F12 and look for "React Query" tab
- **TypeScript Support**: Full type safety
- **Error Boundaries**: Graceful error handling

## 🌐 Environment Configuration

### `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3030/api/v1
NODE_ENV=development
```

### Different environments:

```env
# Development
VITE_API_BASE_URL=http://localhost:3030/api/v1

# Staging
VITE_API_BASE_URL=https://api-staging.yourapp.com/api/v1

# Production
VITE_API_BASE_URL=https://api.yourapp.com/api/v1
```

## 🚨 Error Handling

### API Errors

```typescript
// Automatic toast notifications for all mutations
// Custom error handling:
const { error } = useProjects();
if (error) {
  console.error('API Error:', error.message);
}
```

### Network Errors

- Automatic retry for network failures (up to 3 attempts)
- No retry for 4xx errors (client errors)
- Smart cache invalidation on errors

## 🔄 Data Flow

1. **Component renders** → `useProjects()` called
2. **Check cache** → Return cached data if fresh
3. **Background fetch** → Update cache with fresh data
4. **Component re-renders** → With updated data

### Mutations (Create/Update/Delete):

1. **User action** → `mutation.mutate()` called
2. **Optimistic update** → UI updates immediately
3. **API call** → Send request to backend
4. **Success** → Cache updated, toast shown
5. **Error** → Rollback, error toast shown

## 🎯 Best Practices

### 1. Use Optimistic Updates

```typescript
const updateProject = useUpdateProject({
  onMutate: async variables => {
    // Cancel refetches
    await queryClient.cancelQueries(['projects']);

    // Snapshot previous value
    const previousProjects = queryClient.getQueryData(['projects']);

    // Optimistically update
    queryClient.setQueryData(['projects'], old =>
      old.map(p => (p.id === variables.id ? { ...p, ...variables.data } : p))
    );

    return { previousProjects };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['projects'], context.previousProjects);
  },
});
```

### 2. Handle Loading States

```typescript
if (isLoading) return <Skeleton />;
if (error) return <ErrorBoundary />;
return <Content data={data} />;
```

### 3. Prefetch Related Data

```typescript
const queryClient = useQueryClient();

// Prefetch project details when hovering
const handleMouseEnter = projectId => {
  queryClient.prefetchQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectsApi.getProject(projectId),
  });
};
```

## 🔍 Debugging

### React Query DevTools

- Install browser extension or use built-in devtools
- View cache contents, query states, mutations
- Inspect network requests and responses

### Console Debugging

```typescript
// Check cache contents
console.log(queryClient.getQueryData(['projects']));

// Check query state
console.log(queryClient.getQueryState(['projects']));
```

## 🚀 Next Steps

1. **Add Tasks API** - Similar pattern for tasks endpoints
2. **Add Authentication** - Include auth tokens in headers
3. **Add Pagination** - Use `useInfiniteQuery` for large datasets
4. **Add Real-time** - Integrate WebSocket updates
5. **Add Offline Support** - Use React Query's offline capabilities

## 📦 Dependencies Added

- `@tanstack/react-query` - Main library
- `@tanstack/react-query-devtools` - Development tools

Your app now has a robust, production-ready API integration! 🎉
