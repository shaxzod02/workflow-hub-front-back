import { gql } from '@apollo/client';

// Simple test query to check what fields are available
export const TEST_PROJECTS_QUERY = gql`
  query TestProjects {
    projects {
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

// Introspection query to understand the schema
export const INTROSPECT_PROJECT = gql`
  query IntrospectProject {
    __type(name: "Project") {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

export const INTROSPECT_TEAM_MEMBER = gql`
  query IntrospectTeamMember {
    __type(name: "TeamMember") {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;
