import { Project } from '@/store/appStore';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030/api/v1';

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 0, error);
  }
}

// Projects API
export const projectsApi = {
  // Get all projects
  getProjects: (): Promise<Project[]> => apiRequest('/projects'),

  // Get single project
  getProject: (id: string): Promise<Project> => apiRequest(`/projects/${id}`),

  // Create project
  createProject: (project: Omit<Project, 'id'>): Promise<Project> =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),

  // Update project
  updateProject: (id: string, project: Partial<Project>): Promise<Project> =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }),

  // Delete project
  deleteProject: (id: string): Promise<void> =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),
};
