# Workflow Hub

## Project info

A modern project management application with Kanban board functionality built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- ⚡️ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🧪 Jest for testing
- 🔍 ESLint for linting
- 📦 Bun as package manager
- 🤖 GitHub Actions for CI/CD

## 🧪 Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run tests for CI
bun run test:ci
```

## 🔍 Linting

```bash
# Run ESLint
bun run lint

# Fix ESLint issues automatically
bun run lint:fix

# Check for linting errors (CI mode)
bun run lint:check

# Run TypeScript check
bun run type-check
```

## 🤖 CI/CD Pipeline

The project includes comprehensive GitHub Actions workflows:

### CI Pipeline (`.github/workflows/ci.yml`)

- **Lint Job**: Runs ESLint and TypeScript checks
- **Test Job**: Executes Jest tests with coverage reporting
- **Build Job**: Creates production build
- **Security Job**: Runs security audit

### Deployment Pipeline (`.github/workflows/deploy.yml`)

- Deploys to production on main branch
- Includes build verification
- Ready for Netlify/Vercel deployment

## 📊 Code Quality Standards

- **ESLint**: Strict linting with TypeScript rules
- **TypeScript**: Strong typing with strict mode
- **Jest**: Comprehensive testing with 70% coverage threshold
- **Testing Library**: React component testing best practices

## 🚦 Quality Gates

The CI pipeline enforces:

- Zero linting errors (`--max-warnings 0`)
- All tests must pass
- Minimum 70% code coverage
- Successful TypeScript compilation
- Security audit passes

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- @dnd-kit (for drag and drop functionality)
- Zustand (for state management)

## How can I deploy this project?

You can deploy this project to any static hosting service like:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Simply run `npm run build` to create the production build in the `dist` folder.

## Features

- 📊 **Dashboard**: Overview of projects and tasks
- 📋 **Project Management**: Create and manage projects
- 🔄 **Kanban Board**: Drag and drop task management with To Do, In Progress, and Done columns
- 👥 **Team Management**: Manage team members and assignments
- 📈 **Analytics**: Project progress and team performance insights
- ⚙️ **Settings**: Customize your workspace

## Can I connect a custom domain to my project?

Yes! When deploying to services like Netlify or Vercel, you can easily connect a custom domain through their dashboard settings.

# workflow-hub
