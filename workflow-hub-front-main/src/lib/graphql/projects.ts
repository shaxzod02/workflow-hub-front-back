import { gql } from '@apollo/client';

// Type definitions
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  title: string; // This will map to name in the store
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  dueDate: string;
  team?: TeamMember[]; // Optional for now
  createdAt: string;
  updatedAt: string;
}

// GraphQL Queries
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
      status
      progress
      team {
        name
        avatar
      }
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      description
      status
      progress
      dueDate
      createdAt
      updatedAt
    }
  }
`;

// GraphQL Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      status
      progress
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      description
      status
      progress
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

// Input types for mutations
export interface ProjectInput {
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress?: number;
  dueDate: string;
  team?: string[];
}

export interface ProjectUpdateInput {
  title?: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'on-hold';
  progress?: number;
  dueDate?: string;
  team?: string[];
}
