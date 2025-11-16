# CLAUDE.md - AI Assistant Guide for exp-react-ts

This document provides comprehensive guidance for AI assistants working with the exp-react-ts codebase. It outlines the project structure, conventions, and workflows to ensure effective collaboration.

## Project Overview

**exp-react-ts** is a modern full-stack TypeScript application combining Express.js backend with a React frontend. The project has been fully modernized with cutting-edge tooling:

- **Backend**: Express.js server (TypeScript 5.7 + ES Modules)
- **Frontend**: React 18.3 with TypeScript 5.7
- **Build System**: Vite 6 (10-100x faster than Webpack)
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint 9 (flat config) + Prettier 3
- **Development**: tsx for backend, Vite dev server for frontend
- **Containerization**: Docker with Node 20 LTS

**Status**: Work in progress - Modernized December 2024

## Architecture

### Monorepo Structure

The project uses a monorepo approach with separate build configurations for frontend and backend:

```
exp-react-ts/
├── src/
│   ├── exp-react-app-ts/       # React frontend application
│   └── exp-react-svc-ts/        # Express backend service
├── public/                      # Static assets (favicon, icons, manifest)
├── dist/                        # Vite build output (gitignored)
├── exp-react-svc/              # Compiled backend code (gitignored)
├── index.html                   # Vite entry point (root)
└── [config files]
```

### Directory Details

#### Frontend (`src/exp-react-app-ts/`)
- **App.tsx**: Main React component
- **index.tsx**: Application entry point with React 18 root API
- **App.css / index.css**: Component styles
- **reportWebVitals.ts**: Web Vitals performance monitoring (v4 API)
- **setupTests.ts**: Vitest/Testing Library configuration
- **App.test.tsx**: Component tests with Vitest
- **vite-env.d.ts**: TypeScript definitions for Vite and asset imports

#### Backend (`src/exp-react-svc-ts/`)
- **index.ts**: Application entry point with ESM, Express setup, routing
- **server.ts**: Server class for starting the Express application

**Key Backend Features**:
- ES Modules with top-level await support
- Serves static files from `dist/` directory
- API endpoint at `/api` (health check returns `{health: 'OK'}`)
- Serves React app on all routes via SPA fallback
- Port: 3002 (configurable via `PORT` env variable)
- Proper path resolution for ESM (`__dirname` emulation)

#### Public Assets (`public/`)
- **favicon.ico**: Site favicon
- **logo192.png / logo512.png**: PWA icons
- **manifest.json**: Web app manifest
- **robots.txt**: Search engine directives

#### Root Files
- **index.html**: Vite entry point (references `/src/exp-react-app-ts/index.tsx`)
- **vite.config.ts**: Vite configuration with React plugin
- **vitest.config.ts**: Vitest test configuration
- **eslint.config.js**: ESLint 9 flat config
- **.prettierrc**: Prettier formatting rules
- **tsconfig.json**: Frontend TypeScript config (bundler mode)
- **tsconfig.server.json**: Backend TypeScript config (Node ESM)

## Technology Stack

### Core Dependencies

**Frontend**:
- React 18.3.1 with React DOM
- TypeScript 5.7.2
- web-vitals 4.2.4 (Core Web Vitals monitoring)

**Backend**:
- Express 4.21.2
- TypeScript 5.7.2
- dotenv 16.4.7 (environment variables)

**Shared**:
- Node.js 20 LTS (Docker) / 22 (development)

### Build Tools

**Vite Configuration** (`vite.config.ts`):
- **Plugin**: `@vitejs/plugin-react` for Fast Refresh
- **Entry**: `/index.html` → `/src/exp-react-app-ts/index.tsx`
- **Output**: `dist/` directory
- **Dev Server**: Port 3000, proxy `/api` to `http://localhost:3002`
- **Source Maps**: Enabled
- **Path Aliases**: `@/*` → `./src/exp-react-app-ts/*`

**Key Vite Advantages**:
- Lightning-fast HMR (Hot Module Replacement)
- Instant server start (no bundling in dev)
- Optimized production builds with Rollup
- Native ES modules in development
- Built-in TypeScript support

### Development Tools

**ESLint 9** (Modern Flat Config):
- File: `eslint.config.js` (replaces `.eslintrc.json`)
- TypeScript ESLint with recommended rules
- React Hooks plugin
- React Refresh plugin for Vite
- Custom rules for unused variables

**Prettier 3**:
- Configuration: `.prettierrc`
- Settings: Single quotes, 2 spaces, trailing commas (ES5), 100 char width
- Ignore file: `.prettierignore`

**tsx** (Backend Development):
- Ultra-fast TypeScript execution for Node.js
- Replaces `ts-node` and `nodemon`
- Watch mode with instant restarts

**Vitest** (Testing):
- Drop-in Jest replacement, 10x faster
- Native ESM and TypeScript support
- Same API as Jest, minimal migration
- UI mode available (`npm run test:ui`)
- Configuration: `vitest.config.ts`

## TypeScript Configuration

### Frontend Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/exp-react-app-ts/*"]
    }
  }
}
```

**Key Settings**:
- **Bundler mode**: Optimized for Vite
- **Strict mode**: All type checks enabled
- **No unused code**: Enforces clean code
- **Path aliases**: `@/*` for cleaner imports
- **React JSX transform**: No need to import React

### Backend Config (`tsconfig.server.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./exp-react-svc",
    "strict": true,
    "sourceMap": true
  }
}
```

**Key Settings**:
- **ES2022 target**: Modern Node.js features
- **ESNext modules**: For ES module output
- **Node resolution**: Standard Node.js module resolution
- **Strict mode**: All safety checks enabled

## Development Workflows

### Available NPM Scripts

```bash
# Development (Recommended)
npm run dev                 # Run both frontend + backend concurrently
npm run dev:frontend        # Frontend dev server only (Vite on :3000)
npm run dev:backend         # Backend dev server only (tsx watch on :3002)

# Production
npm run build               # Build both frontend (Vite) and backend
npm run build:backend       # Build backend only
npm run start               # Build all + start production server
npm run start:backend       # Start compiled backend
npm run preview             # Preview production build locally

# Testing
npm test                    # Run tests in watch mode (Vitest)
npm run test:ui             # Open Vitest UI in browser

# Code Quality
npm run lint                # Lint code with ESLint
npm run lint:fix            # Auto-fix linting issues
npm run format              # Format code with Prettier
npm run format:check        # Check formatting without changing files
npm run type-check          # TypeScript check for frontend
npm run type-check:backend  # TypeScript check for backend
```

### Development Mode

**Start full development environment**:
```bash
npm run dev
```

This concurrently runs:
1. **Vite Dev Server** (port 3000): Frontend with instant HMR
2. **tsx watch** (port 3002): Backend with auto-restart on changes

**Development URLs**:
- Frontend: `http://localhost:3000` (Vite dev server)
- Backend API: `http://localhost:3002/api` (Express server)
- API calls from frontend are proxied automatically

**Key Development Features**:
- **Instant HMR**: Changes reflect in <50ms
- **Fast backend restart**: tsx restarts in ~100ms
- **Type safety**: Both frontends and backends type-checked
- **Auto-reload**: Browser and server update automatically

### Production Build

```bash
npm run build               # Build frontend + backend
npm run start              # Run production server
```

**Build Process**:
1. TypeScript check for frontend
2. Vite builds optimized production bundle to `dist/`
3. TypeScript compiles backend to `exp-react-svc/`
4. Production server serves static files + API

**Production URLs**:
- All routes: `http://localhost:3002` (Express serves React SPA)
- API: `http://localhost:3002/api`

### Testing

**Run tests**:
```bash
npm test                    # Watch mode
npm run test:ui             # Interactive UI
```

**Testing Stack**:
- **Vitest**: Test runner (Jest-compatible API)
- **React Testing Library**: Component testing
- **jsdom**: DOM environment for tests
- **@testing-library/jest-dom**: Custom matchers

**Test File Conventions**:
- `*.test.tsx` or `*.test.ts`
- Located alongside source files
- Uses Vitest globals (`describe`, `it`, `expect`)

### API Development

**Current API Endpoints**:
- `GET /api`: Health check, returns `{health: 'OK'}`

**Adding New Endpoints**:

1. Open `src/exp-react-svc-ts/index.ts`
2. Add route before the catch-all SPA route:
   ```typescript
   app.get('/api/users', (_req: Request, res: Response) => {
     res.status(200).json({ users: [] });
   });
   ```
3. Server auto-restarts in dev mode (`npm run dev:backend`)
4. Test at `http://localhost:3002/api/users`

**Important**: API routes must be defined before the `app.get('*', ...)` catch-all route.

## Docker Deployment

### Dockerfile

**Modern Multi-Stage Build** (Node 20 LTS):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build && npm run build:backend
EXPOSE 3002
HEALTHCHECK CMD node -e "require('http').get('http://localhost:3002/api', ...)"
CMD ["node", "exp-react-svc/index.js"]
```

**Key Features**:
- Node 20 LTS Alpine (minimal size)
- Production dependencies only
- Health check on `/api` endpoint
- Correct port exposure (3002)

**Build and Run**:
```bash
docker build -t expreactapp .
docker run -p 3002:3002 expreactapp
```

Access at `http://localhost:3002`

## Code Conventions

### File Naming

- **TypeScript/TSX**: PascalCase for components (`App.tsx`), camelCase for utilities
- **CSS**: Match component name (`App.css`)
- **Tests**: `ComponentName.test.tsx`
- **Type Definitions**: `vite-env.d.ts` for ambient types

### Code Style

**Enforced by Prettier**:
- Single quotes
- 2-space indentation
- Trailing commas (ES5 style)
- 100 character line width
- LF line endings

**Enforced by ESLint**:
- No unused variables (prefix with `_` if intentionally unused)
- React Hooks rules (exhaustive deps, etc.)
- React Refresh compatibility (component exports)
- TypeScript recommended rules

### React Patterns

- **Functional Components**: Use function declarations (`function App() {}`)
- **React 18**: Uses new `createRoot` API
- **Strict Mode**: Enabled in development
- **No React Import**: JSX transform handles it automatically
- **Hooks**: Follow Rules of Hooks (enforced by ESLint)

### Backend Patterns

- **ES Modules**: Use `import`/`export`, not `require`
- **File Extensions**: Import with `.js` extension for compiled output (e.g., `'./server.js'`)
- **Class-Based**: Server logic in ES6 classes
- **Environment Variables**: Load via `import 'dotenv/config'`
- **Path Resolution**: Use `fileURLToPath` and `path` for `__dirname` in ESM
- **Type Safety**: Explicit Request/Response types from Express

### TypeScript Best Practices

- **Strict Mode**: Always enabled, no `any` types
- **Unused Code**: Caught by compiler options
- **Path Aliases**: Use `@/*` for frontend imports (cleaner than `../../`)
- **Type Imports**: Use `type` keyword for type-only imports when possible

## Git Workflow

### Branching

- **Feature Branches**: Use `claude/` prefix for AI-generated work
- **Current Branch**: `claude/claude-md-mi18bpwfwa5c6pib-018DnzCWhWLxeCrdcKZ57viN`

### Ignored Files (`.gitignore`)

Key ignored paths:
- `dist/` - Vite build output
- `exp-react-svc/` - Compiled backend
- `node_modules/` - Dependencies
- `.env*` - Environment variables
- `coverage/`, `.vitest` - Test artifacts
- IDE files (`.vscode`, `.idea`)
- OS files (`.DS_Store`)

## Common Tasks for AI Assistants

### Adding a New React Component

1. Create `src/exp-react-app-ts/NewComponent.tsx`:
   ```typescript
   import './NewComponent.css';

   function NewComponent() {
     return <div>Hello from NewComponent</div>;
   }

   export default NewComponent;
   ```
2. Create `src/exp-react-app-ts/NewComponent.css`
3. Create `src/exp-react-app-ts/NewComponent.test.tsx`:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { describe, it, expect } from 'vitest';
   import NewComponent from './NewComponent';

   describe('NewComponent', () => {
     it('renders correctly', () => {
       render(<NewComponent />);
       expect(screen.getByText(/hello from newcomponent/i)).toBeInTheDocument();
     });
   });
   ```
4. Import and use in `App.tsx`

### Adding a New API Endpoint

1. Open `src/exp-react-svc-ts/index.ts`
2. Add route **before** the catch-all route (line ~30):
   ```typescript
   app.get('/api/data', (_req: Request, res: Response) => {
     res.status(200).json({ message: 'Data endpoint' });
   });
   ```
3. tsx auto-restarts the server
4. Test: `curl http://localhost:3002/api/data`

### Using Path Aliases

Instead of:
```typescript
import Component from '../../../exp-react-app-ts/Component';
```

Use:
```typescript
import Component from '@/Component';
```

Configured in both `tsconfig.json` and `vite.config.ts`.

### Running Linting and Formatting

```bash
npm run lint:fix      # Fix ESLint issues
npm run format        # Format all code
npm run type-check && npm run type-check:backend  # Check types
```

**Pre-commit workflow** (recommended):
```bash
npm run format && npm run lint:fix && npm run type-check && npm test
```

### Modifying Build Configuration

**Vite** (`vite.config.ts`):
- Add plugins in `plugins` array
- Modify dev server settings in `server` object
- Add build options in `build` object

**TypeScript**:
- Frontend: Edit `tsconfig.json`
- Backend: Edit `tsconfig.server.json`

### Updating Dependencies

```bash
npm install <package>              # Add to dependencies
npm install --save-dev <package>   # Add to devDependencies
npm update                         # Update all packages
npm outdated                       # Check for outdated packages
```

**After updating**: Test builds and type checks.

## Environment Variables

- **Backend**: Uses dotenv, loads `.env` file automatically
- **Config File**: `.env` in root (gitignored)
- **Access**: `process.env.VARIABLE_NAME`

**Example** `.env`:
```
PORT=3002
NODE_ENV=development
```

**Frontend Access** (Vite):
- Prefix with `VITE_`: `VITE_API_URL=http://api.example.com`
- Access via `import.meta.env.VITE_API_URL`

## Performance Monitoring

Web Vitals tracking via `reportWebVitals.ts`:
- **Metrics**: CLS, INP (replaces FID), FCP, LCP, TTFB
- **API**: Web Vitals v4 (modern API with `onXXX` functions)
- **Usage**: Pass callback to `reportWebVitals()` in `index.tsx`

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Change frontend port in `vite.config.ts` (`server.port`)
   - Change backend port via `PORT` environment variable
   - Update Dockerfile EXPOSE directive

2. **TypeScript Errors**:
   - Check correct tsconfig: `tsconfig.json` (frontend) or `tsconfig.server.json` (backend)
   - Run `npm run type-check` and `npm run type-check:backend` separately
   - Check for missing type definitions

3. **Module Not Found**:
   - Ensure Vite is handling the file type
   - Check `vite-env.d.ts` for type declarations
   - Verify import paths (use `@/*` aliases)
   - For backend, ensure `.js` extension in imports

4. **ESM Import Issues (Backend)**:
   - Use `.js` extension when importing TS files: `import { Server } from './server.js'`
   - Ensure `package.json` has `"type": "module"`
   - Use `import 'dotenv/config'` not `dotenv.config()`

5. **Tests Failing**:
   - Check `vitest.config.ts` setup
   - Ensure `setupTests.ts` is configured correctly
   - Use Vitest globals (`describe`, `it`, `expect` from 'vitest')

6. **Vite Build Errors**:
   - Clear cache: `rm -rf node_modules/.vite`
   - Check `index.html` references correct entry point
   - Verify all imports resolve correctly

## Key Files Reference

| File | Purpose | When to Modify |
|------|---------|---------------|
| `package.json` | Dependencies, scripts, ESM config | Adding packages, scripts |
| `vite.config.ts` | Vite build configuration | Build settings, plugins, aliases |
| `vitest.config.ts` | Test configuration | Test setup, coverage |
| `eslint.config.js` | Linting rules (flat config) | Code style rules |
| `.prettierrc` | Code formatting | Format preferences |
| `tsconfig.json` | Frontend TS config | TypeScript settings for React |
| `tsconfig.server.json` | Backend TS config | TypeScript settings for Node |
| `Dockerfile` | Container configuration | Deployment changes |
| `src/exp-react-svc-ts/index.ts` | Backend entry | API routes, middleware |
| `src/exp-react-app-ts/App.tsx` | React root component | UI structure |
| `index.html` | Vite entry HTML | Meta tags, initial HTML |

## Migration from Webpack to Vite

**Key Changes**:
- ✅ Replaced Webpack with Vite (10-100x faster)
- ✅ Removed Babel (Vite handles transpilation)
- ✅ Moved `index.html` to root
- ✅ Updated `index.html` to reference TS entry directly
- ✅ Replaced Jest with Vitest
- ✅ Updated ESLint to v9 flat config
- ✅ Added Prettier for formatting
- ✅ Replaced nodemon with tsx
- ✅ Updated to TypeScript 5.7
- ✅ Updated all dependencies to latest versions
- ✅ Modernized backend to use ES modules

**Removed**:
- `webpack.config.js`, `nodemon.json`, `.eslintrc.json`
- Webpack plugins and loaders
- Babel configuration
- `react-scripts`

## Best Practices

1. **Use the Modern Tooling**:
   - Run `npm run dev` for development (both frontend + backend)
   - Use `npm run format` before committing
   - Run tests with `npm test` in watch mode

2. **Type Safety**:
   - Never use `any` types
   - Run type checks before committing
   - Use path aliases for cleaner imports

3. **Code Quality**:
   - Follow ESLint and Prettier rules
   - Write tests for new components/endpoints
   - Use descriptive variable names

4. **Performance**:
   - Leverage Vite's HMR for instant feedback
   - Use React DevTools for component profiling
   - Monitor Web Vitals in production

5. **Git**:
   - Keep commits focused and atomic
   - Write descriptive commit messages
   - Test builds before pushing

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Documentation](https://react.dev)
- [TypeScript 5.7 Release](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Prettier](https://prettier.io/docs/en/index.html)
- [Web Vitals](https://web.dev/vitals/)

---

**Last Updated**: 2024-12-16
**Document Version**: 2.0.0 (Modernized)
**Node Version**: 20 LTS (Docker) / 22+ (Development)
**Major Tools**: Vite 6, TypeScript 5.7, React 18.3, Vitest 2, ESLint 9
