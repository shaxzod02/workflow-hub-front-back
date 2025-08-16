# 🛠️ Development Workflow Guide

This guide explains how to set up your development environment with automated testing and linting.

## 🚀 Quick Start for New Team Members

### 1. Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd workflow-hub-front

# Install dependencies
npm install

# Set up Git hooks (runs automatically after npm install)
npm run prepare
```

### 2. Start Development with Auto-Checks

```bash
# Start development server with live testing and linting
npm run dev:all

# This runs:
# - Vite dev server (localhost:5173)
# - Jest in watch mode (tests run when files change)
# - ESLint in watch mode (linting runs when files change)
```

### 3. Alternative: Run Components Separately

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests in watch mode
npm run test:watch

# Terminal 3: Run TypeScript checking in watch mode
npm run type-check:watch

# Terminal 4: Run linting in watch mode
npm run lint:watch
```

## 🔄 Automated Checks During Development

### While Coding:

- ✅ **Tests**: Auto-run when you save test files or source files
- ✅ **Linting**: Auto-run when you save TypeScript/JavaScript files
- ✅ **TypeScript**: Auto-check types when you save files
- ✅ **Hot Reload**: Browser updates automatically

### Before Each Commit:

- ✅ **Pre-commit Hook**: Runs `lint-staged`
  - Auto-fixes ESLint issues
  - Formats code with Prettier
  - Only on staged files (fast!)

### Before Each Push:

- ✅ **Pre-push Hook**: Runs `validate:quick`
  - ESLint check (strict mode)
  - Test suite
  - Fails push if issues found

## 🧪 Manual Quality Checks

```bash
# Quick validation (what pre-push runs)
npm run validate:quick

# Full validation (what CI runs)
npm run validate

# Individual checks
npm run lint:check      # ESLint strict mode
npm run lint:fix        # Auto-fix ESLint issues
npm run test           # Run tests once
npm run test:coverage  # Run tests with coverage
npm run type-check     # TypeScript compilation check
npm run build          # Test production build
```

## 🚫 Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit hook (NOT recommended)
git commit --no-verify -m "emergency fix"

# Skip pre-push hook (NOT recommended)
git push --no-verify
```

## 📊 Coverage Requirements

- **Minimum Coverage**: 70% (statements, branches, functions, lines)
- **New Code**: Should have tests
- **Critical Paths**: Must have 100% coverage

## 🔧 Troubleshooting

### Common Issues:

1. **"Tests failing in watch mode"**

   ```bash
   # Press 'a' to run all tests
   # Press 'f' to run only failed tests
   # Press 'q' to quit watch mode
   ```

2. **"Linting errors prevent commit"**

   ```bash
   # Try auto-fix first
   npm run lint:fix

   # If still failing, check specific errors
   npm run lint:check
   ```

3. **"TypeScript errors"**

   ```bash
   # Check specific errors
   npm run type-check

   # Watch mode for continuous feedback
   npm run type-check:watch
   ```

4. **"Pre-push hook fails"**

   ```bash
   # Run the same validation locally
   npm run validate:quick

   # Fix issues then try push again
   ```

## 🎯 Best Practices

1. **Start with `npm run dev:all`** - Gets everything running
2. **Write tests as you code** - Don't wait until the end
3. **Fix linting issues immediately** - Don't accumulate technical debt
4. **Run `npm run validate:quick`** before creating PR
5. **Use meaningful commit messages** - They'll be checked by hooks

## 📝 Editor Setup

### VS Code Extensions (Recommended):

- ESLint
- Prettier
- Jest
- TypeScript Importer

### VS Code Settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

This setup ensures code quality from the moment you start typing! 🎉
